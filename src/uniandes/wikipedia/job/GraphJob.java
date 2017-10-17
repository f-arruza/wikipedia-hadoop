package uniandes.wikipedia.job;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.FileInputFormat;
import org.apache.hadoop.mapred.FileOutputFormat;
import org.apache.hadoop.mapred.JobClient;
import org.apache.hadoop.mapred.JobConf;
import org.apache.hadoop.mapred.TextInputFormat;
import org.apache.hadoop.mapred.TextOutputFormat;
import uniandes.wikipedia.mapreduce.WikipediaGraphMapper;
import uniandes.wikipedia.mapreduce.WikipediaGraphReducer;
import uniandes.wikipedia.model.Execution;


public class GraphJob {
    
    public static void main(String[] args)  {
        if(args.length < 4){
            System.out.println("Se necesitan TODOS los parámetros de entrada.");
            System.exit(-1);
        }
        String input = args[0];     // Carpeta o archivo de entrada
        String output = args[1];    // Carpeta de salida
        String startDate = args[2]; // Fecha de inicio para filtro de hechos históricos
        String endDate = args[3];   // Fecha de fin para filtro de hechos históricos

        try {
            executeJob(input, output, startDate, endDate);
        } 
        catch (IOException | ClassNotFoundException | InterruptedException e) {}		
    }

    public static void executeJob(String input, String output, String startDate, String endDate) throws IOException,ClassNotFoundException, InterruptedException {

        JobClient client = new JobClient();
        JobConf conf = new JobConf(GraphJob.class);
        conf.set("textinputformat.record.delimiter", "</page>");
//            conf.set("key.value.separator.in.input.line", " ");
//            conf.set("xmlinput.start", "<page>");
//            conf.set("xmlinput.end", "</page>");
        conf.setOutputKeyClass(Text.class);
        conf.setOutputValueClass(Text.class);
        conf.setBoolean("exact.match.only", false);

        conf.set("wikipedia.categories", "war");
        conf.set("wikipedia.start_date", startDate);
        conf.set("wikipedia.end_date", endDate);

        Calendar code = Calendar.getInstance();
        String codeMillis = String.valueOf(code.getTimeInMillis());
        conf.set("wikipedia.code_job", codeMillis);

        // Database config
        Properties properties = new Properties();
        try (InputStream fi = GraphJob.class.getResourceAsStream("/mongodb.properties")) {
            properties.load(fi);
            conf.set("mongodb.database_server", properties.getProperty("database_server"));
            conf.set("mongodb.database_port", properties.getProperty("database_port"));
            conf.set("mongodb.database_name", properties.getProperty("database_name"));
        } catch (IOException ex) {
            Logger.getLogger(GraphJob.class.getName()).log(Level.SEVERE, null, ex);
        }

        FileInputFormat.setInputPaths(conf, new Path(input));
        Path outPath = new Path(output);
        FileOutputFormat.setOutputPath(conf, outPath);

        conf.setMapperClass(WikipediaGraphMapper.class);
//            conf.setNumMapTasks(100);
//            conf.setInputFormat(XmlInputFormat.class);
        conf.setInputFormat(TextInputFormat.class);

        conf.setReducerClass(WikipediaGraphReducer.class);
        conf.setOutputFormat(TextOutputFormat.class);

        FileSystem dfs = FileSystem.get(outPath.toUri(), conf);
        if (dfs.exists(outPath)) {
            dfs.delete(outPath, true);
        }
        client.setConf(conf);
        JobClient.runJob(conf);

        // Registrar ejecución
        MongoClient mongo = new MongoClient(conf.get("mongodb.database_server"), 
                Integer.parseInt(conf.get("mongodb.database_port")));
        try {
            DB db = mongo.getDB(conf.get("mongodb.database_name"));

            DBCollection col = db.getCollection("execution");
            Execution dto = new Execution(codeMillis, startDate, endDate);
            col.insert(dto.createDBObject());
        }
        finally {
            //close resources
            mongo.close();
        }
    }
}
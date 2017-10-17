/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uniandes.wikipedia.mapreduce;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import java.io.IOException;
import java.util.Iterator;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.JobConf;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reducer;
import org.apache.hadoop.mapred.Reporter;
import uniandes.wikipedia.model.HistoricalFact;
import uniandes.wikipedia.model.PersonDetail;

/**
 *
 * @author Asistente
 */
public class WikipediaGraphReducer extends MapReduceBase implements
    Reducer<Text,Text,Text,Text> {
    
    private String codeJob = null;
    private String start_date = null;
    private String end_date = null;
    
    private String database_server = null;
    private int    database_port = 0;
    private String database_name = null;

    @Override
    public void reduce(Text key,
                     Iterator<Text> values,
                     OutputCollector<Text,Text> output,
                     Reporter reporter) throws IOException {
        
        // Connect to MongoDBs
        MongoClient mongo = new MongoClient(this.database_server, this.database_port);
        try {
            DB db = mongo.getDB(this.database_name);

            while (values.hasNext()) {
                Text msj = values.next();
                if(key.toString().equals("HISTORICAL_FACT")) {
                    DBCollection colHF = db.getCollection("historical_fact");
                    HistoricalFact dto = new HistoricalFact(this.codeJob, msj.toString());            
                    colHF.insert(dto.createDBObject());
                }
                if(key.toString().equals("PERSON")) {
                    DBCollection colPers = db.getCollection("person");
                    PersonDetail dto = new PersonDetail(this.codeJob, msj.toString());            
                    colPers.insert(dto.createDBObject());
                }
                output.collect(key, msj);
            }
        }
        finally {
            //close resources
            mongo.close();
        }
    }    
    
    @Override
    public void configure(JobConf job) {
        if (this.codeJob == null) {
            this.codeJob = job.get("wikipedia.code_job", "201710");
        }
        if (this.start_date == null) {
            this.start_date = job.get("wikipedia.start_date", "201710");
        }
        if (this.end_date == null) {
            this.end_date = job.get("wikipedia.end_date", "201710");
        }
        if (this.database_server == null) {
            this.database_server = job.get("mongodb.database_server", "localhost");
        }
        if (this.database_port == 0) {
            this.database_port = Integer.parseInt(job.get("mongodb.database_port", "0"));
        }
        if (this.database_name == null) {
            this.database_name = job.get("mongodb.database_name", "wiki");
        }
    }
}

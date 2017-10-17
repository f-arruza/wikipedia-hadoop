package uniandes.wikipedia.job;

import java.io.IOException;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.JobConf;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import uniandes.wikipedia.mapreduce.TestMapper;
import uniandes.wikipedia.mapreduce.TestReduce;


public class TestJob {
	public static void main(String[] args)  {
		if(args.length<2){
			System.out.println("Se necesitan las carpetas de entrada y salida");
			System.exit(-1);
		}
		String entrada = args[0];   //carpeta de entrada
		String salida = args[1];    //La carpeta de salida no puede existir
		
		try {
			ejecutarJob(entrada, salida);
		} catch (IOException | ClassNotFoundException | InterruptedException e) {} 
		
	}
	public static void ejecutarJob(String entrada, String salida) throws IOException,ClassNotFoundException, InterruptedException
	{
            JobConf conf = new JobConf(TestJob.class);
            conf.set("textinputformat.record.delimiter", "</page>");
            
            Job job = Job.getInstance(conf, "XML Processing Processing");
            job.setJarByClass(TestJob.class);            

            // Mapper            
            job.setMapperClass(TestMapper.class);
            job.setMapOutputKeyClass(Text.class);
            job.setMapOutputValueClass(IntWritable.class);
            
            // Reducer
            job.setReducerClass(TestReduce.class);
            job.setOutputKeyClass(Text.class);
            job.setOutputValueClass(IntWritable.class);
            
            // Input
            TextInputFormat.addInputPath(job, new Path(entrada));
            job.setInputFormatClass(TextInputFormat.class);            
 
            // Output
            TextOutputFormat.setOutputPath(job, new Path(salida));
            job.setOutputFormatClass(TextOutputFormat.class);
            
            job.waitForCompletion(true);
            System.out.println(job.toString());
	}
}

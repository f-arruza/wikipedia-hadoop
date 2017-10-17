package uniandes.reuters.job;

import java.io.IOException;


import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import uniandes.reuters.mapreduce.CReducer;
import uniandes.reuters.mapreduce.NewsPlaceCMapper;


public class NewsPlaceCounter {
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
		/**
		 * Objeto de configuración, dependiendo de la versión de Hadoop 
		 * uno u otro es requerido. 
		 * */
		Configuration conf = new Configuration();		
		Job wcJob=Job.getInstance(conf, "NewsCounter Job");
		wcJob.setJarByClass(NewsPlaceCounter.class);
		//////////////////////
		//Mapper
		//////////////////////
		
		wcJob.setMapperClass(NewsPlaceCMapper.class);
		
		wcJob.setMapOutputKeyClass(Text.class);
		wcJob.setMapOutputValueClass(IntWritable.class);
		///////////////////////////
		//Reducer
		///////////////////////////
		wcJob.setReducerClass(CReducer.class);
		wcJob.setOutputKeyClass(Text.class);
		wcJob.setOutputValueClass(IntWritable.class);
		
		///////////////////////////
		//Input Format
		///////////////////////////
		//Advertencia: Hay dos clases con el mismo nombre, 
		//pero no son equivalentes. 
		//Se usa, en este caso, org.apache.hadoop.mapreduce.lib.input.TextInputFormat
		TextInputFormat.setInputPaths(wcJob, new Path(entrada));
		wcJob.setInputFormatClass(TextInputFormat.class); 
		
		////////////////////
		///Output Format
		//////////////////////
		TextOutputFormat.setOutputPath(wcJob, new Path(salida));
		wcJob.setOutputFormatClass(TextOutputFormat.class);
		wcJob.waitForCompletion(true);
		System.out.println(wcJob.toString());
	}
}

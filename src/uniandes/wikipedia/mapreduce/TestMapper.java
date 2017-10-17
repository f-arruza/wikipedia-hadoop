package uniandes.wikipedia.mapreduce;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class TestMapper extends Mapper<LongWritable, Text, Text, IntWritable> {
	
    @Override
    protected void map(LongWritable key, Text value,
                    Context context)
                    throws IOException, InterruptedException {

        Pattern p = Pattern.compile("(<title>)((\\w| |,|-)+)(<\\/title>)");        
        Matcher m = p.matcher(value.toString());
        if(m.find()) {
            context.write(new Text("TITULOS"), new IntWritable(1));
        }            		
    }
}

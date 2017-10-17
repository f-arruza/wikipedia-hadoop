package uniandes.reuters.mapreduce;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class NewsTitleCMapper extends Mapper<LongWritable, Text, Text, IntWritable> {
	
    @Override
    protected void map(LongWritable key, Text value,
                    Context context)
                    throws IOException, InterruptedException {
        
        Pattern p = Pattern.compile("(<TITLE>)");
        Matcher m = p.matcher(value.toString());

        if(m.find()) {            
            String title = value.toString();
            if(!title.isEmpty()) {
                title = title.substring(7, (!title.contains("</TITLE>"))? title.length() : title.indexOf("</TITLE>"));
                String[] words = title.split("([().,!?:;'\"-]|\\s)+");
                if(words.length > 5) {
                    context.write(new Text(title), new IntWritable(words.length));
                }
            }
        }
    }
}

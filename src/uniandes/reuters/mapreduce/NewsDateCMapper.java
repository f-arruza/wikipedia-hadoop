package uniandes.reuters.mapreduce;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;


import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class NewsDateCMapper extends Mapper<LongWritable, Text, Text, IntWritable> {
	
    @Override
    protected void map(LongWritable key, Text value,
                    Context context)
                    throws IOException, InterruptedException {
        
        try { 
            InputStream is = new ByteArrayInputStream(value.toString().getBytes());
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(is);
            
            // Palabra buscada
            String keyWord = "nakasone";
            // Formato de Fecha
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss");        
            // Rango de Fechas
            Calendar timeInit = Calendar.getInstance();
            timeInit.set(1987, 7, 1);
            Calendar timeEnd = Calendar.getInstance();
            timeEnd.set(1987, 10, 31);
 
            doc.getDocumentElement().normalize();            
            NodeList nList = doc.getElementsByTagName("REUTERS");
 
            for (int temp = 0; temp < nList.getLength(); temp++) { 
                try {
                    Node nNode = nList.item(temp);

                    if (nNode.getNodeType() == Node.ELEMENT_NODE) { 
                        Element eElement = (Element) nNode; 
                        String timeStr = eElement.getElementsByTagName("DATE").item(0).getTextContent();
                        Calendar timeNews = Calendar.getInstance();
                        timeNews.setTime(sdf.parse(timeStr));
                        
                        // Fecha de la noticia en el rango solicitado
                        if(timeNews.after(timeInit) && timeNews.before(timeEnd)) {
                            int count = 0;
                            String body = eElement.getElementsByTagName("BODY").item(0).getTextContent();                    
                            // Contar cantidad ocurrencias de la palabra "nakasone"
                            String[] words = body.split("([().,!?:;'\"-]|\\s)+");
                            for(String word : words){
                                String lw = word.toLowerCase().trim();
                                // Continua a la siguientes iteraci�n
                                // si obtiene una palabra vac�a o diferente
                                // a "nakasone"
                                if(lw.isEmpty() || !word.equals(keyWord)){continue;} 
                                count++;
                            }
                            context.write(new Text(keyWord), new IntWritable(count));
                        }
                    }
                }
                catch(ParseException pex) {
                }
            }
        } catch (ParserConfigurationException | SAXException | IOException | DOMException | InterruptedException e) {
            System.out.println(e.getCause());
        }
    }
}

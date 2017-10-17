/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uniandes.reuters.job;

import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.WriteResult;
import java.io.IOException;
import java.io.InputStream;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.Properties;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang.WordUtils;
import uniandes.wikipedia.model.HistoricalFact;
import uniandes.wikipedia.model.Person;
import uniandes.wikipedia.model.PersonDetail;
import uniandes.wikipedia.model.Place;

/**
 *
 * @author Asistente
 */
public class Tester {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
//        try {
//            MongoCredential journaldevAuth = MongoCredential.createPlainCredential("wiki", "wiki", "wikipedia".toCharArray());
//            MongoCredential testAuth = MongoCredential.createPlainCredential("wiki", "wiki", "wikipedia".toCharArray());
//            List<MongoCredential> auths = new ArrayList<>();
//            auths.add(journaldevAuth);
//            auths.add(testAuth);
//            
//            ServerAddress serverAddress = new ServerAddress("localhost", 8089);
//            String stream = "Eureka Rebellion-185501-185501-ballarat-j. w. thomas|charles pasley-peter lalor|henry ross";
//            String[] data = stream.split("\\-");
//            
//            HistoricalFact hf = new HistoricalFact();
//            hf.setName(data[0]);
//            hf.setStartDate(data[1]);
//            hf.setEndDate(data[2]);
//
//            String[] placesA = data[3].split("\\|");
//            for(String place : placesA) {
//                Place pl = new Place(place);
//                hf.addPlace(pl);
//            }
//
//            String[] personsA = data[4].split("\\|");
//            for(String person : personsA) {
//                Person ps = new Person(person);
//                hf.addPerson(ps);
//            }
//
//            personsA = data[5].split("\\|");
//            for(String person : personsA) {
//                Person ps = new Person(person);
//                hf.addPerson(ps);
//            }
//            
//            MongoClient mongo = new MongoClient("172.24.100.95", 8089);
//            List<String> dbs = mongo.getDatabaseNames();
//            System.out.println(dbs);
//            
//            DB db = mongo.getDB("wiki");
//            DBCollection col = db.getCollection("historial_fact");
//            System.out.println(col);
//            
//            WriteResult result = col.insert(hf.createDBObject());
            
            //String c = "John A. Macdonald-181501-Glasgow-189106-Ottawa-Isabella Clark|Agnes Bernard-hugh john macdonald-upper canada rebellion";
            // Database config
            Properties properties = new Properties();
            InputStream fi = Tester.class.getResourceAsStream("/mongodb.properties");
            try {
                properties.load(fi);
                System.out.println("database_server = " + properties.getProperty("database_server"));
                System.out.println("database_port = " + properties.getProperty("database_port"));
                System.out.println("database_name = " + properties.getProperty("database_name"));
            } catch (IOException ex) {
                Logger.getLogger(Tester.class.getName()).log(Level.SEVERE, null, ex);
            }
//        } catch (UnknownHostException ex) {
//            Logger.getLogger(Tester.class.getName()).log(Level.SEVERE, null, ex);
//        }
    }    
}

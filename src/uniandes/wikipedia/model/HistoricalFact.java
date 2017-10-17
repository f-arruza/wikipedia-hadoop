/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uniandes.wikipedia.model;

import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBObject;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang.WordUtils;

/**
 *
 * @author Asistente
 */
public class HistoricalFact {
    
    // Fields
    private String          code = null;
    private String          name = null;
    private String          startDate = null;
    private String          endDate = null;
    private List<Place>     places = null;
    private List<Person>    persons = null;

    // Constructors
    public HistoricalFact() {
        this.places = new ArrayList<>();
        this.persons = new ArrayList<>();
    }
    
    public HistoricalFact(String code, String stream) {
        this.code = code;
        this.places = new ArrayList<>();
        this.persons = new ArrayList<>();
        
        String[] data = stream.split("\\-");
        this.name = data[0];
        this.startDate = data[1];
        this.endDate = data[2];
        
        if(data.length > 3) {
            String[] placesA = data[3].split("\\|");
            for(String place : placesA) {
                Place pl = new Place(WordUtils.capitalizeFully(place));
                this.places.add(pl);
            }
        }
        
        if(data.length > 4) {
            String[] personsA = data[4].split("\\|");
            for(String person : personsA) {
                Person ps = new Person(WordUtils.capitalizeFully(person));
                this.persons.add(ps);
            }
        }
        
        if(data.length > 5) {
            String[] personsA = data[5].split("\\|");
            for(String person : personsA) {
                Person ps = new Person(WordUtils.capitalizeFully(person));
                this.persons.add(ps);
            }
        }
    }

    // Methods
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public List<Place> getPlaces() {
        return places;
    }

    public void setPlaces(List<Place> places) {
        this.places = places;
    }

    public List<Person> getPersons() {
        return persons;
    }

    public void setPersons(List<Person> persons) {
        this.persons = persons;
    }
    
    public void addPlace(Place place) {
        this.places.add(place);
    }
    
    public void addPerson(Person person) {
        this.persons.add(person);
    }
    
    public DBObject createDBObject() {
        BasicDBObjectBuilder docBuilder = BasicDBObjectBuilder.start();
        docBuilder.append("code", this.getCode());
        docBuilder.append("name", this.getName());
        docBuilder.append("start_date", this.getStartDate());
        docBuilder.append("end_date", this.getEndDate());
        docBuilder.append("places", this.createListPlace());
        docBuilder.append("participants", this.createListPerson());
        return docBuilder.get();
    }
    
    private List<DBObject> createListPlace() {
        List<DBObject> list = new ArrayList<>();
        this.getPlaces().stream().map((dto) -> {
            BasicDBObjectBuilder docBuilder = BasicDBObjectBuilder.start();
            docBuilder.append("name", dto.getName());
            return docBuilder;
        }).forEach((docBuilder) -> {
            list.add(docBuilder.get());
        });
        return list;
    }
    
    private List<DBObject> createListPerson() {
        List<DBObject> list = new ArrayList<>();
        this.getPersons().stream().map((dto) -> {
            BasicDBObjectBuilder docBuilder = BasicDBObjectBuilder.start();
            docBuilder.append("name", dto.getName());
            return docBuilder;
        }).forEach((docBuilder) -> {
            list.add(docBuilder.get());
        });
        return list;
    }
}

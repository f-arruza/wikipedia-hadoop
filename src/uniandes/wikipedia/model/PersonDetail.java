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

/**
 *
 * @author Asistente
 */
public class PersonDetail {
    
    // Fieds
    private String          code = null;
    private String          name = null;
    private String          birthDate = null;
    private String          birthPlace = null;
    private String          deathDate = null;
    private String          deathPlace = null;
    private List<Fact>      facts = null;
    private List<Person>    parents = null;

    // Constructors
    public PersonDetail() {
        this.facts = new ArrayList<>();
        this.parents = new ArrayList<>();
    }
    
    public PersonDetail(String code, String stream) {
        this.code = code;
        this.facts = new ArrayList<>();
        this.parents = new ArrayList<>();
        
        String[] data = stream.split("\\-");
        this.name = data[0];
        this.birthDate = data[1];
        this.birthPlace = (data.length > 2)? data[2] : "";
        this.deathDate = (data.length > 3)? data[3] : "";
        this.deathPlace = (data.length > 4)? data[4] : "";
        
        if(data.length > 5) {
            if(!data[5].isEmpty()) {
                String[] spouses = data[5].split("\\|");
                for(String nameSp : spouses) {
                    Person pl = new Person("Spouse", nameSp);
                    this.parents.add(pl);
                }
            }
        }
        if(data.length > 6) {
            if(!data[6].isEmpty()) {
                String[] children = data[6].split("\\|");
                for(String nameCh : children) {
                    Person pl = new Person("Child", nameCh);
                    this.parents.add(pl);
                }
            }
        }
        if(data.length > 7) {
            if(!data[7].isEmpty()) {
                String[] factsL = data[7].split("\\|");
                for(String nameFt : factsL) {
                    Fact ft = new Fact(nameFt);
                    this.facts.add(ft);
                }
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

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getBirthPlace() {
        return birthPlace;
    }

    public void setBirthPlace(String birthPlace) {
        this.birthPlace = birthPlace;
    }

    public String getDeathDate() {
        return deathDate;
    }

    public void setDeathDate(String deathDate) {
        this.deathDate = deathDate;
    }

    public String getDeathPlace() {
        return deathPlace;
    }

    public void setDeathPlace(String deathPlace) {
        this.deathPlace = deathPlace;
    }

    public List<Fact> getFacts() {
        return facts;
    }

    public void setFacts(List<Fact> facts) {
        this.facts = facts;
    }

    public List<Person> getParents() {
        return parents;
    }

    public void setParents(List<Person> parents) {
        this.parents = parents;
    }
    
    public void addFact(Fact fact) {
        this.facts.add(fact);
    }
    
    public void addParent(Person person) {
        this.parents.add(person);
    }
    
    public DBObject createDBObject() {
        BasicDBObjectBuilder docBuilder = BasicDBObjectBuilder.start();
        docBuilder.append("code", this.getCode());
        docBuilder.append("name", this.getName());
        docBuilder.append("birth_date", this.getBirthDate());
        docBuilder.append("birth_place", this.getBirthPlace());
        docBuilder.append("death_date", this.getDeathDate());
        docBuilder.append("death_place", this.getDeathPlace());
        docBuilder.append("parents", this.createListParent());
        docBuilder.append("facts", this.createListFact());
        return docBuilder.get();
    }
    
    private List<DBObject> createListParent() {
        List<DBObject> list = new ArrayList<>();
        this.getParents().stream().map((dto) -> {
            BasicDBObjectBuilder docBuilder = BasicDBObjectBuilder.start();
            docBuilder.append("type", dto.getType());
            docBuilder.append("name", dto.getName());
            return docBuilder;
        }).forEach((docBuilder) -> {
            list.add(docBuilder.get());
        });
        return list;
    }
    
    private List<DBObject> createListFact() {
        List<DBObject> list = new ArrayList<>();
        this.getFacts().stream().map((dto) -> {
            BasicDBObjectBuilder docBuilder = BasicDBObjectBuilder.start();
            docBuilder.append("name", dto.getName());
            return docBuilder;
        }).forEach((docBuilder) -> {
            list.add(docBuilder.get());
        });
        return list;
    }
}

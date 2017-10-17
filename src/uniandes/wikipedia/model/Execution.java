/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uniandes.wikipedia.model;

import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DBObject;

/**
 *
 * @author Asistente
 */
public class Execution {
    
    // Fields
    private String code = null;
    private String start_date = null;
    private String end_date = null;
    
    // Constructors
    public Execution() {
    }
    
    public Execution(String code, String start_date, String end_date) {
        this.code = code;
        this.start_date = start_date;
        this.end_date = end_date;
    }
    
    // Methods
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStart_date() {
        return start_date;
    }

    public void setStart_date(String start_date) {
        this.start_date = start_date;
    }

    public String getEnd_date() {
        return end_date;
    }

    public void setEnd_date(String end_date) {
        this.end_date = end_date;
    }
    
    public DBObject createDBObject() {
        BasicDBObjectBuilder docBuilder = BasicDBObjectBuilder.start();
        docBuilder.append("code", this.getCode());
        docBuilder.append("start_date", this.getStart_date());
        docBuilder.append("end_date", this.getEnd_date());
        return docBuilder.get();
    }
}

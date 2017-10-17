/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package uniandes.wikipedia.mapreduce;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.WordUtils;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.JobConf;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.Mapper;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reporter;

/**
 *
 * @author Asistente
 */
public class WikipediaGraphMapper extends MapReduceBase implements
    Mapper<LongWritable,Text,Text,Text> {
    
    private static final Pattern OPEN_TEXT_TAG_PATTERN = Pattern.compile("<text xml:space=\"preserve\">");
    private static final Pattern CLOSE_TEXT_TAG_PATTERN = Pattern.compile("</text>");
    
    private Set<String> inputCategories = null;
    private boolean     exactMatchOnly = false;
    private Calendar    start_date = null;
    private Calendar    end_date = null;
    private int         index = -1;

    /**
     *
     * @param key
     * @param value
     * @param output
     * @param reporter
     * @throws IOException
     */
    @Override
    public void map(LongWritable key, Text value,
                  OutputCollector<Text,Text> output,
                  Reporter reporter) throws IOException {
        
        StringBuilder contents = new StringBuilder();
        String document = value.toString();        

        int open_tag_title = document.indexOf("<title>");    
        int close_tag_title = document.indexOf("</title>");

        if(open_tag_title != -1 && close_tag_title != -1) {
            // Title
            String title = document.substring(open_tag_title + 7, close_tag_title);
            // Text Body
            document = StringEscapeUtils.unescapeHtml(CLOSE_TEXT_TAG_PATTERN.matcher(OPEN_TEXT_TAG_PATTERN.matcher(document).replaceFirst("")).replaceAll("")).toLowerCase();
            
            this.index = document.indexOf("{{infobox military conflict", close_tag_title);
            if(this.index != -1) {
                this.index += 9;                
                // Date
                String dateContent = this.extractDateFact(document);
                // Place
                String placeContent = this.extractPlaces(document);
                // Person 1
                String personContent1 = this.extractPersons(document);
                // Person 2
                String personContent2 = this.extractPersons(document);
                
                // Validar categoría
//                String catMatch = this.findMatchingCategory(document);
                
                if(!dateContent.isEmpty()) {
                    contents.append(title).append("-").append(dateContent).append("-").append(placeContent);
                    contents.append("-").append(personContent1).append("-").append(personContent2);
                    output.collect(new Text("HISTORICAL_FACT"), new Text(contents.toString()));
                }               
            }else {
                this.index = document.indexOf("{{infobox officeholder", close_tag_title);
                if(this.index == -1) {
                    this.index = document.indexOf("{{infobox royalty|monarch", close_tag_title);
                }
                if(this.index == -1) {
                    this.index = document.indexOf("{{infobox president", close_tag_title);
                }
                if(this.index == -1) {
                    this.index = document.indexOf("{{infobox military person", close_tag_title);
                }
                if(this.index != -1) {
                    this.index += 19;
                    // Birth Date
                    String dateContent = this.extractBirthDatePerson(document);
                    // Birth Place
                    String placeBirthContent = this.extractBirthPlacePerson(document);
                    // Death Date
                    String dateDeathContent = this.extractDeathDatePerson(document);
                    // Death Place
                    String placeDeathContent = this.extracDeathPlacePerson(document);
                    // Spouse
                    String spouseContent = this.extractSpouse(document);
                    // Children
                    String childrenContent = this.extractChildren(document);
                    // Battles and War
                    String factContent = this.extractFacts(document);
                    
                    if(!dateContent.isEmpty()) {
                        contents.append(title).append("-").append(dateContent);
                        contents.append("-").append(placeBirthContent);
                        contents.append("-").append(dateDeathContent);
                        contents.append("-").append(placeDeathContent);
                        contents.append("-").append(spouseContent);
                        contents.append("-").append(childrenContent);
                        contents.append("-").append(factContent);
                        output.collect(new Text("PERSON"), new Text(contents.toString()));
                    }
                }
            }
        }            
    }   
    
    private int selectIndex(int index1, int index2) {
        int indexS;
        if(index1 != -1 && index2 != -1) {
            indexS = (index2 > index1)? index1 : index2; 
        }
        else if(index1 != -1) {
            indexS = index1;
        } else {
            indexS = index2;
        }
        return indexS;
    }
    
    private String extractDateFact(String content) {
        String dateContent = "";
        
        int dateIndex1 = content.indexOf("| date", this.index);
        int dateIndex2 = content.indexOf("|date", this.index);
        int dateIndex = this.selectIndex(dateIndex1, dateIndex2);
        
        if(dateIndex != -1) {
            dateIndex += 5;
            int dateContentIndex = content.indexOf("=", dateIndex);
            if(dateContentIndex != -1) {
                dateContentIndex++;
                int dateContentEndIndex1 = content.indexOf("| place", dateContentIndex);
                int dateContentEndIndex2 = content.indexOf("|place", dateContentIndex);
                int dateContentEndIndex = this.selectIndex(dateContentEndIndex1, dateContentEndIndex2);
                
                if(dateContentEndIndex != -1) {
                    dateContent = content.substring(dateContentIndex, dateContentEndIndex).trim();
                    this.index = dateContentEndIndex;
                    
                    // Extraer Fecha
                    String startMonth = "";
                    String startYear = "";
                    String endMonth = "";
                    String endYear = "";
                    // -- Formato #1: 3 january 1854
                    String regex = "((3[01]|[12][0-9]|[1-9]) ((jan|febr)uary|"
                            + "march|april|may|june|july|august|october|(sept|"
                            + "nov|dec)ember) (\\((.+)\\) )?(\\d{4}))";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher matcher = pattern.matcher(dateContent);
                    
                    while(matcher.find()) {
                        if(startMonth.isEmpty()) {
                            startMonth = matcher.group(3);
                            startYear = matcher.group(8);
                        } else if(endMonth.isEmpty()) {
                            endMonth = matcher.group(3);
                            endYear = matcher.group(8);
                        } else break;
                    }
                    if(startMonth.isEmpty()) {
                        // -- Formato #2: 15 september - 27 november 1944
                        regex = "((3[01]|[12][0-9]|[1-9]) ((jan|febr)uary|"
                                + "march|april|may|june|july|august|october|"
                                + "(sept|nov|dec)ember) (-|-) (3[01]|[12][0-9]|"
                                + "[1-9]) ((jan|febr)uary|march|april|may|june|"
                                + "july|august|october|(sept|nov|dec)ember) "
                                + "(\\d{4}))";
                        pattern = Pattern.compile(regex);
                        matcher = pattern.matcher(dateContent);
                        if(matcher.find()) {
                            startMonth = matcher.group(3);
                            startYear = matcher.group(11);
                            endMonth = matcher.group(8);
                            endYear = matcher.group(11);
                        }
                        else {
                            // -- Formato #3: november 7, 1917
                            regex = "(((jan|febr)uary|march|april|may|june|july|"
                                    + "august|october|(sept|nov|dec)ember) "
                                    + "(3[01]|[12][0-9]|[1-9]), (\\d{4}))";
                            pattern = Pattern.compile(regex);
                            matcher = pattern.matcher(dateContent);
                            while(matcher.find()) {
                                if(startMonth.isEmpty()) {
                                    startMonth = matcher.group(2);
                                    startYear = matcher.group(6);
                                } else if(endMonth.isEmpty()) {
                                    endMonth = matcher.group(2);
                                    endYear = matcher.group(6);
                                } else break;
                            }
                            if(startMonth.isEmpty()) {
                                // -- Formato #4: november 1928-october 1929
                                regex = "(((jan|febr)uary|march|april|may|june|july|august|"
                                        + "october|(sept|nov|dec)ember) (\\d{4})-((jan|"
                                        + "febr)uary|march|april|may|june|july|august|"
                                        + "october|(sept|nov|dec)ember) (\\d{4}))";
                                pattern = Pattern.compile(regex);
                                matcher = pattern.matcher(dateContent);
                                if(matcher.find()) {
                                    startMonth = matcher.group(2);
                                    startYear = matcher.group(9);
                                    endMonth = matcher.group(6);
                                    endYear = matcher.group(9);
                                }
                                else {
                                    // -- Formato #5: october 16-28, 1962
                                    regex = "(((jan|febr)uary|march|april|may|"
                                            + "june|july|august|october|(sept|"
                                            + "nov|dec)ember) (3[01]|[12][0-9]|"
                                            + "[1-9])(-|-)(3[01]|[12][0-9]|[1-9]), (\\d{4}))";
                                    pattern = Pattern.compile(regex);
                                    matcher = pattern.matcher(dateContent);
                                    if(matcher.find()) {
                                        startMonth = matcher.group(2);
                                        startYear = matcher.group(8);
                                        endMonth = matcher.group(2);
                                        endYear = matcher.group(8);
                                    }
                                    else {
                                        dateContent = "";
                                    }                                        
                                }
                            }                            
                        }
                    }
                    
                    if(!startMonth.isEmpty() && endMonth.isEmpty()) {
                        endMonth = startMonth;
                        endYear = startYear;
                    }
                    if(!startMonth.isEmpty()) {
                        // Convertir mes de texto a número
                        SimpleDateFormat inputFormat = new SimpleDateFormat("MMMM", Locale.ENGLISH);
                        Calendar startCal = Calendar.getInstance();
                        Calendar endCal = Calendar.getInstance();
                        try {
                            startCal.setTime(inputFormat.parse(startMonth));
                            endCal.setTime(inputFormat.parse(endMonth));
                            SimpleDateFormat outputFormat = new SimpleDateFormat("MM"); // 01-12
                            
                            String iStartMonth = outputFormat.format(startCal.getTime());
                            String iEndMonth = outputFormat.format(endCal.getTime());
                            
                            startCal.set(Integer.valueOf(startYear), Integer.valueOf(iStartMonth)-1, 1);
                            startCal.set(Calendar.HOUR_OF_DAY, 22);
                            endCal.set(Integer.valueOf(endYear), Integer.valueOf(iEndMonth)-1, 28);
                            endCal.set(Calendar.HOUR_OF_DAY, 1);
                            
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");
                            if(startCal.after(this.start_date) && endCal.before(this.end_date)) {
                                dateContent = String.format("%s-%s", sdf.format(startCal.getTime()), sdf.format(endCal.getTime()));//, sdf.format(this.start_date.getTime()), sdf.format(this.end_date.getTime())); 
                            } 
                            else dateContent = "";                            
                        }
                        catch(ParseException pex) {
                            dateContent = "";
                        }
                    }
                }
            }
        }
        return dateContent;
    }
    
    private String extractPlaces(String content) {
        String placeContent = "";
        
        this.index += 6;
        int placeContentIndex = content.indexOf("=", this.index);
        if(placeContentIndex != -1) {
            placeContentIndex++;
            int placeContentEndIndex1 = content.indexOf("| coordinates", placeContentIndex);
            int placeContentEndIndex2 = content.indexOf("|coordinates", placeContentIndex);
            int placeContentEndIndex = this.selectIndex(placeContentEndIndex1, placeContentEndIndex2);
            
            if(placeContentEndIndex == -1) {
                placeContentEndIndex1 = content.indexOf("| result", placeContentIndex);
                placeContentEndIndex2 = content.indexOf("|result", placeContentIndex);
                placeContentEndIndex = this.selectIndex(placeContentEndIndex1, placeContentEndIndex2);
            }
            if(placeContentEndIndex != -1) {
                placeContent = content.substring(placeContentIndex, placeContentEndIndex).trim();
                this.index = placeContentEndIndex;
                
                // Extraer Lugares
                String places = "";
                // -- Formato #1: [[...]]
                String regex = "((\\[\\[)((\\w| |\\|)+)(\\]\\]))";
                Pattern pattern = Pattern.compile(regex);
                Matcher matcher = pattern.matcher(placeContent);

                while(matcher.find()) {
                    places = (places.isEmpty())? matcher.group(3) : places + "|" + matcher.group(3);
                }
                placeContent = places;
            }    
        }
        return placeContent;
    }
    
    private String extractPersons(String content) {
        String personContent = "";
        
        int pers1Index1 = content.indexOf("| commander", this.index);
        int pers1Index2 = content.indexOf("|commander", this.index);
        int pers1Index = this.selectIndex(pers1Index1, pers1Index2);
        
        if(pers1Index != -1) {
            pers1Index += 11;
            
            int personContentIndex = content.indexOf("=", pers1Index);
            if(personContentIndex != -1) {
                personContentIndex++;
                int personContentEndIndex1 = content.indexOf("| commander", personContentIndex);
                int personContentEndIndex2 = content.indexOf("|commander", personContentIndex);
                int personContentEndIndex = this.selectIndex(personContentEndIndex1, personContentEndIndex2);
                
                if(personContentEndIndex == -1) {
                    personContentEndIndex1 = content.indexOf("| casualties", personContentIndex);
                    personContentEndIndex2 = content.indexOf("|casualties", personContentIndex);
                    personContentEndIndex = this.selectIndex(personContentEndIndex1, personContentEndIndex2);
                }
                if(personContentEndIndex == -1) {
                    personContentEndIndex1 = content.indexOf("| strength", personContentIndex);
                    personContentEndIndex2 = content.indexOf("|strength", personContentIndex);
                    personContentEndIndex = this.selectIndex(personContentEndIndex1, personContentEndIndex2);
                }
                if(personContentEndIndex != -1) {
                    personContent = content.substring(personContentIndex, personContentEndIndex).trim();
                    this.index = personContentEndIndex;
                    
                    // Extraer Personas
                    String persons = "";
                    // -- Formato #1: [[...|...]]
                    String regex = "((\\[\\[)((\\w| |\\(|\\)|,|\\.)+)((\\|)+)?((\\w| |,|\\.)+)?(\\]\\]))";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher matcher = pattern.matcher(personContent);

                    while(matcher.find()) {
                        String person = matcher.group(3);
                        if(matcher.group(7) != null)
                            person = matcher.group(7);
                        persons = (persons.isEmpty())? person : persons + "|" + person;
                    }
                    personContent = persons;
                }
            }
        }
        return personContent;
    }
    
    private String extractBirthDatePerson(String content) {
        String dateContent = "";
        
        int dateIndex1 = content.indexOf("| birth_date", this.index);
        int dateIndex2 = content.indexOf("|birth_date", this.index);
        int dateIndex = this.selectIndex(dateIndex1, dateIndex2);
        
        if(dateIndex != -1) {
            dateIndex += 11;
            int dateContentIndex = content.indexOf("=", dateIndex);
            if(dateContentIndex != -1) {
                dateContentIndex++;
                int dateContentEndIndex1 = content.indexOf("| birth_place", dateContentIndex);
                int dateContentEndIndex2 = content.indexOf("|birth_place", dateContentIndex);
                int dateContentEndIndex = this.selectIndex(dateContentEndIndex1, dateContentEndIndex2);
                
                if(dateContentEndIndex != -1) {
                    dateContent = content.substring(dateContentIndex, dateContentEndIndex).trim();
                    this.index = dateContentEndIndex;
                    
                    // Extraer Fecha
                    String month = "";
                    String year = "";
                    // -- Formato #1: {{Birth date|1883|7|29|df=yes}}
                    String regex = "(\\{\\{Birth date\\|)(\\d{4})(\\|)"
                                    + "(\\d{1,2})(\\|\\d{1,2}\\|df\\=\\w{3,5}"
                                    + "\\}\\})";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher matcher = pattern.matcher(dateContent);
                    
                    if(matcher.find()) {
                        month = matcher.group(4);
                        year = matcher.group(2);
                    }
                    if(month.isEmpty()) {
                        // -- Formato #2: {{birth year and age|1954}}
                        regex = "(\\{\\{birth year and age\\|)(\\d{4})(\\}\\})";
                        pattern = Pattern.compile(regex);
                        matcher = pattern.matcher(dateContent);
                        if(matcher.find()) {
                            month = "january";
                            year = matcher.group(2);
                        }
                        else {
                            // -- Formato #3: 3 january 1854
                            regex = "((3[01]|[12][0-9]|[1-9]) ((jan|febr)uary|"
                                + "march|april|may|june|july|august|october|(sept|"
                                + "nov|dec)ember) (\\((.+)\\) )?(\\d{4}))";
                            pattern = Pattern.compile(regex);
                            matcher = pattern.matcher(dateContent);
                            if(matcher.find()) {
                                month = matcher.group(3);
                                year = matcher.group(8);
                            }
                            if(month.isEmpty()) {
                                // -- Formato #4: november 7, 1917
                                regex = "(((jan|febr)uary|march|april|may|june|july|"
                                            + "august|october|(sept|nov|dec)ember) "
                                            + "(3[01]|[12][0-9]|[1-9]), (\\d{4}))";
                                pattern = Pattern.compile(regex);
                                matcher = pattern.matcher(dateContent);
                                if(matcher.find()) {
                                    month = matcher.group(2);
                                    year = matcher.group(6);
                                }
                                else {
                                    dateContent = "";
                                }
                            }                                                        
                        }
                    }
                    
                    if(!month.isEmpty()) {
                        // Convertir mes de texto a número    
                        String month_number = "01";
                        Calendar date = Calendar.getInstance();
                        try {
                            try {
                                int mount_int = Integer.parseInt(month);
                                month_number = String.format("%02d", mount_int);
                            }
                            catch(NumberFormatException nfe) {
                                SimpleDateFormat inputFormat = new SimpleDateFormat("MMMM", Locale.ENGLISH);
                                date.setTime(inputFormat.parse(month));
                                SimpleDateFormat outputFormat = new SimpleDateFormat("MM"); // 01-12                           
                                month_number = outputFormat.format(date.getTime());
                            }
                            date.set(Integer.valueOf(year), Integer.valueOf(month_number)-1, 1);                                                      
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");                            
                            dateContent = String.format("%s", sdf.format(date.getTime()));                                                        
                        }
                        catch(ParseException pex) {
                            dateContent = "";
                        }
                    }
                }
            }
        }
        return dateContent;
    }
    
    private String extractBirthPlacePerson(String content) {
        String placeContent = "";
        
        this.index += 6;
        int placeContentIndex = content.indexOf("=", this.index);
        if(placeContentIndex != -1) {
            placeContentIndex++;
            int placeContentEndIndex1 = content.indexOf("| death_date", placeContentIndex);
            int placeContentEndIndex2 = content.indexOf("|death_date", placeContentIndex);
            int placeContentEndIndex = this.selectIndex(placeContentEndIndex1, placeContentEndIndex2);
            
            if(placeContentEndIndex == -1) {
                placeContentEndIndex1 = content.indexOf("| death_place", placeContentIndex);
                placeContentEndIndex2 = content.indexOf("|death_place", placeContentIndex);
                placeContentEndIndex = this.selectIndex(placeContentEndIndex1, placeContentEndIndex2);
            }
            if(placeContentEndIndex != -1) {
                placeContent = content.substring(placeContentIndex, placeContentEndIndex).trim();
                this.index = placeContentIndex;
                
                // Extraer Lugares
                String place = "";
                // -- Formato #1: [[...]]
                String regex = "((\\[\\[)((\\w| |,|\\|)+)(\\]\\]))";
                Pattern pattern = Pattern.compile(regex);
                Matcher matcher = pattern.matcher(placeContent);

                if(matcher.find()) {
                    place = matcher.group(3);
                    if(place.contains("|")) {
                        String[] place_tmp = place.split("\\|");
                        place = place_tmp[1];
                    }
                    place = WordUtils.capitalizeFully(place);
                }
                placeContent = place;
            }    
        }
        return placeContent;
    }
    
    private String extractDeathDatePerson(String content) {
        String dateContent = "";
        
        int dateIndex1 = content.indexOf("| death_date", this.index);
        int dateIndex2 = content.indexOf("|death_date", this.index);
        int dateIndex = this.selectIndex(dateIndex1, dateIndex2);
        
        if(dateIndex != -1) {
            dateIndex += 11;
            int dateContentIndex = content.indexOf("=", dateIndex);
            if(dateContentIndex != -1) {
                dateContentIndex++;
                int dateContentEndIndex1 = content.indexOf("| death_place", dateContentIndex);
                int dateContentEndIndex2 = content.indexOf("|death_place", dateContentIndex);
                int dateContentEndIndex = this.selectIndex(dateContentEndIndex1, dateContentEndIndex2);
                
                if(dateContentEndIndex != -1) {
                    dateContent = content.substring(dateContentIndex, dateContentEndIndex).trim();
                    this.index = dateContentEndIndex;
                    
                    // Extraer Fecha
                    String month = "";
                    String year = "";
                    // -- Formato #1: {{Birth date|1883|7|29|df=yes}}
                    String regex = "(\\{\\{Death date\\|)(\\d{4})(\\|)"
                                    + "(\\d{1,2})(\\|\\d{1,2}\\|df\\=\\w{3,5}"
                                    + "\\}\\})";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher matcher = pattern.matcher(dateContent);
                    
                    if(matcher.find()) {
                        month = matcher.group(4);
                        year = matcher.group(2);
                    }
                    if(month.isEmpty()) {
                        // -- Formato #2: {{birth year and age|1954}}
                        regex = "(\\{\\{death date and age\\|df=(\\w{1})\\|"
                                + "(\\d{4})\\|(\\d{1,2})\\|(\\d{1,2})\\|"
                                + "(\\d{4})\\|(\\d{1,2})\\|(\\d{1,2})\\}\\})";
                        pattern = Pattern.compile(regex);
                        matcher = pattern.matcher(dateContent);
                        if(matcher.find()) {
                            month = matcher.group(4);
                            year = matcher.group(3);
                        }
                        else {
                            // -- Formato #3: 3 january 1854
                            regex = "((3[01]|[12][0-9]|[1-9]) ((jan|febr)uary|"
                                + "march|april|may|june|july|august|october|(sept|"
                                + "nov|dec)ember) (\\((.+)\\) )?(\\d{4}))";
                            pattern = Pattern.compile(regex);
                            matcher = pattern.matcher(dateContent);
                            if(matcher.find()) {
                                month = matcher.group(3);
                                year = matcher.group(8);
                            }
                            if(month.isEmpty()) {
                                // -- Formato #4: november 7, 1917
                                regex = "(((jan|febr)uary|march|april|may|june|july|"
                                            + "august|october|(sept|nov|dec)ember) "
                                            + "(3[01]|[12][0-9]|[1-9]), (\\d{4}))";
                                pattern = Pattern.compile(regex);
                                matcher = pattern.matcher(dateContent);
                                if(matcher.find()) {
                                    month = matcher.group(2);
                                    year = matcher.group(6);
                                }
                                else {
                                    dateContent = "";
                                }
                            }                                                        
                        }
                    }
                    
                    if(!month.isEmpty()) {
                        // Convertir mes de texto a número    
                        String month_number = "01";
                        Calendar date = Calendar.getInstance();
                        try {
                            try {
                                int mount_int = Integer.parseInt(month);
                                month_number = String.format("%02d", mount_int);
                            }
                            catch(NumberFormatException nfe) {
                                SimpleDateFormat inputFormat = new SimpleDateFormat("MMMM", Locale.ENGLISH);
                                date.setTime(inputFormat.parse(month));
                                SimpleDateFormat outputFormat = new SimpleDateFormat("MM"); // 01-12                           
                                month_number = outputFormat.format(date.getTime());
                            }
                            date.set(Integer.valueOf(year), Integer.valueOf(month_number)-1, 1);                                                      
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMM");                            
                            dateContent = String.format("%s", sdf.format(date.getTime()));                                                        
                        }
                        catch(ParseException pex) {
                            dateContent = "";
                        }
                    }
                }
            }
        }
        return dateContent;
    }
    
    private String extracDeathPlacePerson(String content) {
        String placeContent = "";
        
        this.index += 6;
        int placeContentIndex = content.indexOf("=", this.index);
        if(placeContentIndex != -1) {
            placeContentIndex++;
            int placeContentEndIndex1 = content.indexOf("| spouse", placeContentIndex);
            int placeContentEndIndex2 = content.indexOf("|spouse", placeContentIndex);
            int placeContentEndIndex = this.selectIndex(placeContentEndIndex1, placeContentEndIndex2);
            
            if(placeContentEndIndex == -1) {
                placeContentEndIndex1 = content.indexOf("| nationality", placeContentIndex);
                placeContentEndIndex2 = content.indexOf("|nationality", placeContentIndex);
                placeContentEndIndex = this.selectIndex(placeContentEndIndex1, placeContentEndIndex2);
            }
            if(placeContentEndIndex != -1) {
                placeContent = content.substring(placeContentIndex, placeContentEndIndex).trim();
                this.index = placeContentIndex;
                
                // Extraer Lugares
                String place = "";
                // -- Formato #1: [[...]]
                String regex = "((\\[\\[)((\\w| |,|\\|)+)(\\]\\]))";
                Pattern pattern = Pattern.compile(regex);
                Matcher matcher = pattern.matcher(placeContent);

                if(matcher.find()) {
                    place = matcher.group(3);
                    if(place.contains("|")) {
                        String[] place_tmp = place.split("\\|");
                        place = place_tmp[1];
                    }
                    place = WordUtils.capitalizeFully(place);
                }
                placeContent = place;
            }    
        }
        return placeContent;
    }
    
    private String extractSpouse(String content) {
        String personContent = "";
        
        int pers1Index1 = content.indexOf("| spouse", this.index);
        int pers1Index2 = content.indexOf("|spouse", this.index);
        int pers1Index = this.selectIndex(pers1Index1, pers1Index2);
        
        if(pers1Index != -1) {
            pers1Index += 7;
            
            int personContentIndex = content.indexOf("=", pers1Index);
            if(personContentIndex != -1) {
                personContentIndex++;
                int personContentEndIndex1 = content.indexOf("| children", personContentIndex);
                int personContentEndIndex2 = content.indexOf("|children", personContentIndex);
                int personContentEndIndex = this.selectIndex(personContentEndIndex1, personContentEndIndex2);
                
                if(personContentEndIndex != -1) {
                    personContent = content.substring(personContentIndex, personContentEndIndex).trim();
                    this.index = personContentEndIndex;
                    
                    // Extraer Personas
                    String persons = "";
                    // -- Formato #1: [[...|...]]
                    String regex = "((\\[\\[)((\\w| |\\(|\\)|,|\\.)+)((\\|)+)?((\\w| |,|\\.)+)?(\\]\\]))";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher matcher = pattern.matcher(personContent);

                    while(matcher.find()) {
                        String person = matcher.group(3);
                        if(matcher.group(7) != null)
                            person = matcher.group(7);
                        person = WordUtils.capitalizeFully(person);
                        persons = (persons.isEmpty())? person : persons + "|" + person;
                    }
                    personContent = persons;
                }
            }
        }
        return personContent;
    }
    
    private String extractChildren(String content) {
        String personContent = "";
        
        int pers1Index1 = content.indexOf("| children", this.index);
        int pers1Index2 = content.indexOf("|children", this.index);
        int pers1Index = this.selectIndex(pers1Index1, pers1Index2);
        
        if(pers1Index != -1) {
            pers1Index += 9;
            
            int personContentIndex = content.indexOf("=", pers1Index);
            if(personContentIndex != -1) {
                personContentIndex++;
                int personContentEndIndex1 = content.indexOf("| profession", personContentIndex);
                int personContentEndIndex2 = content.indexOf("|profession", personContentIndex);
                int personContentEndIndex = this.selectIndex(personContentEndIndex1, personContentEndIndex2);
                
                if(personContentEndIndex != -1) {
                    personContent = content.substring(personContentIndex, personContentEndIndex).trim();
                    this.index = personContentEndIndex;
                    
                    // Extraer Personas
                    String persons = "";
                    // -- Formato #1: [[...|...]]
                    String regex = "((\\[\\[)((\\w| |\\(|\\)|,|\\.)+)((\\|)+)?((\\w| |,|\\.)+)?(\\]\\]))";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher matcher = pattern.matcher(personContent);

                    while(matcher.find()) {
                        String person = matcher.group(3);
                        if(matcher.group(7) != null)
                            person = matcher.group(7);
                        person = WordUtils.capitalizeFully(person);
                        persons = (persons.isEmpty())? person : persons + "|" + person;
                    }
                    personContent = persons;
                }
            }
        }
        return personContent;
    }
    
    private String extractFacts(String content) {
        String factsContent = "";
        
        int factIndex1 = content.indexOf("| battles", this.index);
        int factIndex2 = content.indexOf("|battles", this.index);
        int factIndex = this.selectIndex(factIndex1, factIndex2);
        
        if(factIndex != -1) {
            factIndex += 8;
            
            int factContentIndex = content.indexOf("=", factIndex);
            if(factContentIndex != -1) {
                factContentIndex++;
                int personContentEndIndex = content.indexOf("}}", factContentIndex);
                
                if(personContentEndIndex != -1) {
                    factsContent = content.substring(factContentIndex, personContentEndIndex).trim();
                    this.index = personContentEndIndex;
                    
                    // Extraer Hechos
                    String facts = "";
                    // -- Formato #1: [[...|...]]
                    String regex = "((\\[\\[)((\\w| |\\(|\\)|,|\\.)+)((\\|)+)?((\\w| |,|\\.)+)?(\\]\\]))";
                    Pattern pattern = Pattern.compile(regex);
                    Matcher matcher = pattern.matcher(factsContent);

                    while(matcher.find()) {
                        String fact = matcher.group(3);
                        if(matcher.group(7) != null)
                            fact = matcher.group(7);
                        fact = WordUtils.capitalizeFully(fact);
                        facts = (facts.isEmpty())? fact : facts + "|" + fact;
                    }
                    factsContent = facts;
                }
            }
        }
        return factsContent;
    }
    
    private String findMatchingCategory(String document) {
        int startIndex = 0;
        int categoryIndex;
        
        while ((categoryIndex = document.indexOf("[[Category:", startIndex)) != -1) {
          categoryIndex += 11;
          int endIndex = document.indexOf("]]", categoryIndex);
          if (endIndex >= document.length() || endIndex < 0) {
            break;
          }
          String category = document.substring(categoryIndex, endIndex).toLowerCase().trim();

          if (this.exactMatchOnly && this.inputCategories.contains(category)) {
            return category;
          } else if (this.exactMatchOnly == false) {
            for (String inputCategory : this.inputCategories) {
              if (category.contains(inputCategory)) { // we have an inexact match
                return inputCategory;
              }
            }
          }
          startIndex = endIndex;
        }
        return "Unknown";
    }
    
    @Override
    public void configure(JobConf job) {
        if (this.inputCategories == null) {
            this.inputCategories = new HashSet<>();
            
            String categoriesStr = job.get("wikipedia.categories");
            if(!categoriesStr.isEmpty())
                this.inputCategories.add(categoriesStr);
        }
        this.exactMatchOnly = job.getBoolean("exact.match.only", false);
        
        if (this.start_date == null) {
            String pstart_date = job.get("wikipedia.start_date", "201710");
            
            this.start_date = Calendar.getInstance();
            this.start_date.set(Integer.valueOf(pstart_date.substring(0, 4)), Integer.valueOf(pstart_date.substring(4, 6))-1, 1);
            this.start_date.set(Calendar.HOUR_OF_DAY, 0);
        }
        if (this.end_date == null) {
            String pend_date = job.get("wikipedia.end_date", "201710");
            
            this.end_date = Calendar.getInstance();
            this.end_date.set(Integer.valueOf(pend_date.substring(0, 4)), Integer.valueOf(pend_date.substring(4, 6))-1, 28);
            this.end_date.set(Calendar.HOUR_OF_DAY, 22);
        }
    }
}

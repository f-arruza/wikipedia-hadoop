var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const uuidv1 = require('uuid/v1');


router.get('/', async function(req, res) {

  var result = {};

  result.nodeKeyProperty = "id";
  result.nodeDataArray = [];
  result.linkDataArray = [];

  let db = await MongoClient.connect('mongodb://172.24.100.95:8089/wiki');

  var posX = 0;
  var posY = 0;
  var maxX = 1200;

  var code = req.query.code;
  var start_date = req.query.start_date;
  var end_date = req.query.end_date;
  var historical_fact = req.query.historical_fact;
  var place = req.query.place;
  var person = req.query.person;

  let cursor_historical_fact = await db.collection("historical_fact").find({
    code: code,
    start_date: { $gte: start_date},
    start_date: { $lte: end_date},
    name: {'$regex': historical_fact}
  });

  var places_to_show = [];
  var persons_to_show = [];

  while(await cursor_historical_fact.hasNext()) {
    let fact = await cursor_historical_fact.next();

    if(place){
      if(person){

      }
      else{
        var contains = false;

        for(var i=0; i < fact.places.length; i++){
          if(fact.places[i].name.toLowerCase().includes(place.toLowerCase())){
            contains = true;
            i = fact.places.length;
          }
        }

        if(contains){
          var nodo = {}
          nodo.id = fact._id;
          if((posX/100)%2 == 1){
              posY += 50;
              nodo.loc = posX + " " + posY;
              posY -= 50;
          }
          else {
            nodo.loc = posX + " " + posY;
          }
          nodo.text = fact.name;
          result.nodeDataArray.push(nodo);

          if(posX >= maxX){
            posX = 0;
            posY += 100;
          }
          else{
            posX += 100;
          }

          for(var i=0; i < fact.places.length; i++){
            if(fact.places[i].name.toLowerCase().includes(place.toLowerCase())){
              let place_object = await db.collection("place").findOne({
                name: fact.places[i].name
              });

              if(place_object){
                var created = false;
                for(var j=0; j < places_to_show.length; j++){
                  if(String(place_object._id) == String(places_to_show[j].id)){
                    created = true;
                    j = places_to_show.length;
                  }
                }

                if(!created){
                  var new_place = {}
                  new_place.id = place_object._id;
                  if((posX/100)%2 == 1){
                      posY += 50;
                      new_place.loc = posX + " " + posY;
                      posY -= 50;
                  }
                  else {
                    new_place.loc = posX + " " + posY;
                  }
                  if(posX >= maxX){
                    posX = 0;
                    posY += 100;
                  }
                  else{
                    posX += 100;
                  }
                  new_place.text = fact.places[i].name;
                  result.nodeDataArray.push(new_place);
                  places_to_show.push(new_place);
                }

                var new_place_link = {}
                new_place_link.from = fact._id;
                new_place_link.to = place_object._id;
                new_place_link.text = "Ocurrió en";
                result.linkDataArray.push(new_place_link);
              }
              else{
                let place_object = await db.collection("place").insert({
                  name: fact.places[i].name
                });

                var new_place = {}
                new_place.id = place_object._id;
                if((posX/100)%2 == 1){
                    posY += 50;
                    new_place.loc = posX + " " + posY;
                    posY -= 50;
                }
                else {
                  new_place.loc = posX + " " + posY;
                }
                if(posX >= maxX){
                  posX = 0;
                  posY += 100;
                }
                else{
                  posX += 100;
                }
                new_place.text = fact.places[i].name;
                result.nodeDataArray.push(new_place);
                places_to_show.push(new_place);

                var new_place_link = {}
                new_place_link.from = fact._id;
                new_place_link.to = place_object._id;
                new_place_link.text = "Ocurrió en";
                result.linkDataArray.push(new_place_link);
              }
            }
          }
          //cargar personas
          for(var i=0; i < fact.participants.length; i++){
            if(fact.participants[i].name != "" && fact.participants[i].name!=null){
              let person = await db.collection("person").findOne({
                name: fact.participants[i].name,
                code: code
              });

              if(person) {
                var created = false;
                for(var j=0; j < persons_to_show.length; j++){
                  if(String(person.name) == String(persons_to_show[j].text)){
                    created = true;
                    j = persons_to_show.length;
                  }
                }

                if(!created){
                  var new_person = {}
                  new_person.id = person._id;
                  if((posX/100)%2 == 1){
                      posY += 50;
                      new_person.loc = posX + " " + posY;
                      posY -= 50;
                  }
                  else {
                    new_person.loc = posX + " " + posY;
                  }
                  if(posX >= maxX){
                    posX = 0;
                    posY += 100;
                  }
                  else{
                    posX += 100;
                  }
                  new_person.text = person.name +
                    "\nFecha de nacimiento: " + person.birth_date +
                    "\nLugar de nacimiento: " + person.birth_place +
                    "\nFecha de muerte: " + person.death_date +
                    "\nLugar de muerte: " + person.death_place;
                  result.nodeDataArray.push(new_person);
                  persons_to_show.push(new_person);
                }

                var new_person_link = {}
                new_person_link.from = fact._id;
                new_person_link.to = person._id;
                new_person_link.text = "Participó";
                result.linkDataArray.push(new_person_link);

                for(var j=0; j < person.parents.length; j++){
                  var new_parent = {}
                  new_parent.id = uuidv1();
                  if((posX/100)%2 == 1){
                      posY += 50;
                      new_parent.loc = posX + " " + posY;
                      posY -= 50;
                  }
                  else {
                    new_parent.loc = posX + " " + posY;
                  }
                  if(posX >= maxX){
                    posX = 0;
                    posY += 100;
                  }
                  else{
                    posX += 100;
                  }
                  new_parent.text = person.parents[j].name;
                  result.nodeDataArray.push(new_parent);

                  var new_parent_link = {}
                  new_parent_link.from = person._id;
                  new_parent_link.to = new_parent.id;
                  new_parent_link.text = "Familiar de";
                  result.linkDataArray.push(new_parent_link);
                }

                for(var k=0; k < person.facts.length; k++){
                  let person_fact = await db.collection("historical_fact").findOne({
                    name: person.facts[k].name,
                    code: code
                  });
                  if(person_fact) {
                    var new_fact_link = {}
                    new_fact_link.from = person._id;
                    new_fact_link.to = person_fact._id;
                    new_fact_link.text = "Participó en ";
                    result.linkDataArray.push(new_fact_link);
                  }
                }
              }
              else{
                var created = false;
                var pos = 0;
                for(var j=0; j < persons_to_show.length; j++){
                  if(String(fact.participants[i].name) == String(persons_to_show[j].text)){
                    created = true;
                    pos = j;
                    j = persons_to_show.length;
                  }
                }

                var new_participant = {}

                if(!created){
                  new_participant.id = uuidv1();
                  if((posX/100)%2 == 1){
                      posY += 50;
                      new_participant.loc = posX + " " + posY;
                      posY -= 50;
                  }
                  else {
                    new_participant.loc = posX + " " + posY;
                  }
                  if(posX >= maxX){
                    posX = 0;
                    posY += 100;
                  }
                  else{
                    posX += 100;
                  }
                  new_participant.text = fact.participants[i].name;
                  result.nodeDataArray.push(new_participant);
                  persons_to_show.push(new_participant);
                }
                else{
                  new_participant = persons_to_show[pos];
                }

                var new_participant_link = {}
                new_participant_link.from = fact._id;
                new_participant_link.to = new_participant.id;
                new_participant_link.text = "Participó";
                result.linkDataArray.push(new_participant_link);
              }
            }
          }
        }
      }
    }
    else {
      var nodo = {}
      nodo.id = fact._id;
      if((posX/100)%2 == 1){
          posY += 50;
          nodo.loc = posX + " " + posY;
          posY -= 50;
      }
      else {
        nodo.loc = posX + " " + posY;
      }
      nodo.text = fact.name;
      result.nodeDataArray.push(nodo);

      if(posX >= maxX){
        posX = 0;
        posY += 100;
      }
      else{
        posX += 100;
      }

      for(var i=0; i < fact.places.length; i++){

        let place_object = await db.collection("place").findOne({
          name: fact.places[i].name
        });

        if(place_object){
          var created = false;
          for(var j=0; j < places_to_show.length; j++){
            if(String(place_object._id) == String(places_to_show[j].id)){
              created = true;
              j = places_to_show.length;
            }
          }
          if(!created){
            var new_place = {}
            new_place.id = place_object._id;
            if((posX/100)%2 == 1){
                posY += 50;
                new_place.loc = posX + " " + posY;
                posY -= 50;
            }
            else {
              new_place.loc = posX + " " + posY;
            }
            if(posX >= maxX){
              posX = 0;
              posY += 100;
            }
            else{
              posX += 100;
            }
            new_place.text = fact.places[i].name;
            result.nodeDataArray.push(new_place);
            places_to_show.push(new_place);
          }

          var new_place_link = {}
          new_place_link.from = fact._id;
          new_place_link.to = place_object._id;
          new_place_link.text = "Ocurrió en";
          result.linkDataArray.push(new_place_link);
        }
        else{
          let place_object = await db.collection("place").insert({
            name: fact.places[i].name
          });

          var new_place = {}
          new_place.id = place_object._id;
          if((posX/100)%2 == 1){
              posY += 50;
              new_place.loc = posX + " " + posY;
              posY -= 50;
          }
          else {
            new_place.loc = posX + " " + posY;
          }
          if(posX >= maxX){
            posX = 0;
            posY += 100;
          }
          else{
            posX += 100;
          }
          new_place.text = fact.places[i].name;
          result.nodeDataArray.push(new_place);
          places_to_show.push(new_place);

          var new_place_link = {}
          new_place_link.from = fact._id;
          new_place_link.to = place_object._id;
          new_place_link.text = "Ocurrió en";
          result.linkDataArray.push(new_place_link);
        }
      }

      for(var i=0; i < fact.participants.length; i++){
        if(fact.participants[i].name != "" && fact.participants[i].name!=null){
          let person = await db.collection("person").findOne({
            name: fact.participants[i].name,
            code: code
          });

          if(person) {
            var created = false;

            for(var j=0; j < persons_to_show.length; j++){
              if(String(person._id) == String(persons_to_show[j].id)){
                created = true;
                j = persons_to_show.length;
              }
            }

            if(!created){
              var new_person = {}
              new_person.id = person._id;
              if((posX/100)%2 == 1){
                  posY += 50;
                  new_person.loc = posX + " " + posY;
                  posY -= 50;
              }
              else {
                new_person.loc = posX + " " + posY;
              }
              if(posX >= maxX){
                posX = 0;
                posY += 100;
              }
              else{
                posX += 100;
              }
              new_person.text = person.name +
                "\nFecha de nacimiento: " + person.birth_date +
                "\nLugar de nacimiento: " + person.birth_place +
                "\nFecha de muerte: " + person.death_date +
                "\nLugar de muerte: " + person.death_place;
              result.nodeDataArray.push(new_person);
              persons_to_show.push(new_person);
            }

            var new_person_link = {}
            new_person_link.from = fact._id;
            new_person_link.to = person._id;
            new_person_link.text = "Participó";
            result.linkDataArray.push(new_person_link);

            for(var j=0; j < person.parents.length; j++){
              var new_parent = {}
              new_parent.id = uuidv1();
              if((posX/100)%2 == 1){
                  posY += 50;
                  new_parent.loc = posX + " " + posY;
                  posY -= 50;
              }
              else {
                new_parent.loc = posX + " " + posY;
              }
              if(posX >= maxX){
                posX = 0;
                posY += 100;
              }
              else{
                posX += 100;
              }
              new_parent.text = person.parents[j].name;
              result.nodeDataArray.push(new_parent);

              var new_parent_link = {}
              new_parent_link.from = person._id;
              new_parent_link.to = new_parent.id;
              new_parent_link.text = "Familiar de ";
              result.linkDataArray.push(new_parent_link);
            }

            for(var k=0; k < person.facts.length; k++){
              let person_fact = await db.collection("historical_fact").findOne({
                name: person.facts[k].name,
                code: code
              });
              if(person_fact) {
                var new_fact_link = {}
                new_fact_link.from = person._id;
                new_fact_link.to = person_fact._id;
                new_fact_link.text = "Participó en ";
                result.linkDataArray.push(new_fact_link);
              }
            }
          }
          else{
            var created = false;
            var pos = 0;
            for(var j=0; j < persons_to_show.length; j++){
              if(String(fact.participants[i].name) == String(persons_to_show[j].text)){
                created = true;
                pos = j;
                j = persons_to_show.length;
              }
            }
            //No existe en la base de datos pero creamos el nodo
            var new_participant = {}
            if(!created){
              new_participant.id = uuidv1();
              if((posX/100)%2 == 1){
                  posY += 50;
                  new_participant.loc = posX + " " + posY;
                  posY -= 50;
              }
              else {
                new_participant.loc = posX + " " + posY;
              }
              if(posX >= maxX){
                posX = 0;
                posY += 100;
              }
              else{
                posX += 100;
              }
              new_participant.text = fact.participants[i].name;
              result.nodeDataArray.push(new_participant);
              persons_to_show.push(new_participant);
            }
            else{
              new_participant = persons_to_show[pos];
            }

            var new_participant_link = {}
            new_participant_link.from = fact._id;
            new_participant_link.to = new_participant.id;
            new_participant_link.text = "Participó";
            result.linkDataArray.push(new_participant_link);
          }
        }
      }
    }
  }
  res.json(result);
});

module.exports = router;

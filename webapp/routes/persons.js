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
  var historical_fact = req.query.historical_fact;
  var person = req.query.person;

  let cursor_person = await db.collection("person").find({
    code: code,
    name: {'$regex': new RegExp([person].join(""), "i")}
  });

  var facts_to_show = [];

  while(await cursor_person.hasNext()) {
    let person = await cursor_person.next();

    if(historical_fact){
      var contains = false;

      for(var i=0; i < person.facts.length; i++){
        if(person.facts[i].name.toLowerCase().includes(historical_fact.toLowerCase())){
          contains = true;
          i = person.facts.length;
        }
      }

      if(contains){
        var nodo = {}
        nodo.id = person._id;
        if((posX/100)%2 == 1){
            posY += 50;
            nodo.loc = posX + " " + posY;
            posY -= 50;
        }
        else {
          nodo.loc = posX + " " + posY;
        }
        nodo.text = person.name;
        result.nodeDataArray.push(nodo);

        if(posX >= maxX){
          posX = 0;
          posY += 100;
        }
        else{
          posX += 100;
        }

        for(var i=0; i < person.facts.length; i++){
          if(person.facts[i].name.toLowerCase().includes(historical_fact.toLowerCase())){
            let fact_object = await db.collection("historical_fact").findOne({
              name: person.facts[i].name
            });

            if(fact_object){
              var created = false;
              for(var j=0; j < facts_to_show.length; j++){
                if(String(fact_object._id) == String(facts_to_show[j].id)){
                  created = true;
                  j = facts_to_show.length;
                }
              }
              if(!created){
                var new_fact = {}
                new_fact.id = fact_object._id;
                if((posX/100)%2 == 1){
                    posY += 50;
                    new_fact.loc = posX + " " + posY;
                    posY -= 50;
                }
                else {
                  new_fact.loc = posX + " " + posY;
                }
                if(posX >= maxX){
                  posX = 0;
                  posY += 100;
                }
                else{
                  posX += 100;
                }
                new_fact.text = person.facts[i].name;
                result.nodeDataArray.push(new_fact);
                facts_to_show.push(new_fact);
              }

              var new_fact_link = {}
              new_fact_link.from = person._id;
              new_fact_link.to = fact_object._id;
              new_fact_link.text = "Participó en";
              result.linkDataArray.push(new_fact_link);
            }
            else{
              var created = false;
              var pos = 0;
              for(var j=0; j < facts_to_show.length; j++){
                if(String(person.facts[i].name) == String(facts_to_show[j].text)){
                  created = true;
                  pos = j;
                  j = facts_to_show.length;
                }
              }

              var new_fact = {}

              if(!created){
                new_fact.id = uuidv1();
                if((posX/100)%2 == 1){
                    posY += 50;
                    new_fact.loc = posX + " " + posY;
                    posY -= 50;
                }
                else {
                  new_fact.loc = posX + " " + posY;
                }
                if(posX >= maxX){
                  posX = 0;
                  posY += 100;
                }
                else{
                  posX += 100;
                }
                new_fact.text = person.facts[i].name;
                result.nodeDataArray.push(new_fact);
                facts_to_show.push(new_fact);

                var new_fact_link = {}
                new_fact_link.from = person._id;
                new_fact_link.to = new_fact.id;
                new_fact_link.text = "Participó en";
                result.linkDataArray.push(new_fact_link);
              }
            }
          }
        }
      }
    }
    else{
      var nodo = {}
      nodo.id = person._id;
      if((posX/100)%2 == 1){
          posY += 50;
          nodo.loc = posX + " " + posY;
          posY -= 50;
      }
      else {
        nodo.loc = posX + " " + posY;
      }
      nodo.text = person.name +
        "\nFecha de nacimiento: " + person.birth_date +
        "\nLugar de nacimiento: " + person.birth_place +
        "\nFecha de muerte: " + person.death_date +
        "\nLugar de muerte: " + person.death_place;
      result.nodeDataArray.push(nodo);

      if(posX >= maxX){
        posX = 0;
        posY += 100;
      }
      else{
        posX += 100;
      }

      for(var i=0; i < person.facts.length; i++){

        let fact_object = await db.collection("historical_fact").findOne({
          name: person.facts[i].name
        });

        if(fact_object){
          var created = false;
          for(var j=0; j < facts_to_show.length; j++){
            if(String(fact_object._id) == String(facts_to_show[j].id)){
              created = true;
              j = facts_to_show.length;
            }
          }
          if(!created){
            var new_fact = {}
            new_fact.id = fact_object._id;
            if((posX/100)%2 == 1){
                posY += 50;
                new_fact.loc = posX + " " + posY;
                posY -= 50;
            }
            else {
              new_fact.loc = posX + " " + posY;
            }
            if(posX >= maxX){
              posX = 0;
              posY += 100;
            }
            else{
              posX += 100;
            }
            new_fact.text = person.facts[i].name;
            result.nodeDataArray.push(new_fact);
            facts_to_show.push(new_fact);
          }

          var new_fact_link = {}
          new_fact_link.from = person._id;
          new_fact_link.to = fact_object._id;
          new_fact_link.text = "Participó en";
          result.linkDataArray.push(new_fact_link);
        }
        else{
          var created = false;
          var pos = 0;
          for(var j=0; j < facts_to_show.length; j++){
            if(String(person.facts[i].name) == String(facts_to_show[j].text)){
              created = true;
              pos = j;
              j = facts_to_show.length;
            }
          }

          var new_fact = {}

          if(!created){
            new_fact.id = uuidv1();
            if((posX/100)%2 == 1){
                posY += 50;
                new_fact.loc = posX + " " + posY;
                posY -= 50;
            }
            else {
              new_fact.loc = posX + " " + posY;
            }
            if(posX >= maxX){
              posX = 0;
              posY += 100;
            }
            else{
              posX += 100;
            }
            new_fact.text = person.facts[i].name;
            result.nodeDataArray.push(new_fact);
            facts_to_show.push(new_fact);

            var new_fact_link = {}
            new_fact_link.from = person._id;
            new_fact_link.to = new_fact.id;
            new_fact_link.text = "Participó en";
            result.linkDataArray.push(new_fact_link);
          }
        }
      }

      for(var k=0; k < person.parents.length; k++){
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
        new_parent.text = person.parents[k].name;
        result.nodeDataArray.push(new_parent);

        var new_parent_link = {}
        new_parent_link.from = person._id;
        new_parent_link.to = new_parent.id;
        new_parent_link.text = "Familiar";
        result.linkDataArray.push(new_parent_link);
      }
    }
  }

  res.json(result);
});

module.exports = router;

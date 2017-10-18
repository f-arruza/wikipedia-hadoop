var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
/*
 * GET historical_fact list.
 */
router.get('/', async function(req, res) {
  var result = {};
  result.nodeKeyProperty = "id";
  result.nodeDataArray = [];
  result.linkDataArray = [];

  let db = await MongoClient.connect('mongodb://172.24.100.95:8089/wiki');
  let fact_collection = await db.collection('historical_fact');
  let person_collection = await db.collection('person');

  var posX = 0;
  var posY = 0;
  var maxX = 1200;

  let cursor_historical_fact = await db.collection("historical_fact").find({}, {limit: 100});
  while(await cursor_historical_fact.hasNext()) {
    let fact = await cursor_historical_fact.next();

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

    for(var i=0; i<fact.participants.length;i++){
      if(fact.participants[i].name != "" && fact.participants[i].name!=null){
        let cursor_person = await db.collection("person").find({name: fact.participants[i].name}, {limit: 1});
        while(await cursor_person.hasNext()) {
          let person = await cursor_person.next();
          var new_link = {}
          new_link.from = fact._id;
          new_link.to = person._id;
          new_link.text = "Participant";
          result.linkDataArray.push(new_link);
        }
      }
    }
  }

  let cursor_person = await db.collection("person").find({}, {limit: 100});
  while(await cursor_person.hasNext()) {
    let person = await cursor_person.next();
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

    for(var i=0; i<person.facts.length;i++){
      if(person.facts[i].name != "" && person.facts[i].name!=null){
        let cursor_fact = await db.collection("historical_fact").find({name: person.facts[i].name}, {limit: 1});
        while(await cursor_fact.hasNext()) {
          let fact = await cursor_fact.next();
          var new_link = {}
          new_link.from = person._id;
          new_link.to = fact._id;
          new_link.text = "Historical Fact";
          result.linkDataArray.push(new_link);
        }
      }
    }
  }
  res.json(result);
});

module.exports = router;

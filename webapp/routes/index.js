var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', async function(req, res) {
  var db = req.db;
  var collection = db.get('execution');
  collection.find({},{},function(e,docs){
    executions = []
    docs.forEach(function(execution){
      var option = {}
      option.value = execution.code;
      option.name = execution.start_date.substring(0, 4) + "/" + execution.start_date.substring(4, 6) + " al " +
      execution.end_date.substring(0, 4) + "/" + execution.end_date.substring(4, 6);
      executions.push(option);
    });
    res.render('index', { title: 'Taller 3', executions: executions});
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var shell = require('shelljs');

router.get('/', async function(req, res) {
  let db = await MongoClient.connect('mongodb://172.24.100.95:8089/wiki');
  let executions = await db.collection('execution').find({}).sort({_id: -1}).toArray();
  res.json(executions);
});

router.get('/run/:start_date/:end_date', async function(req, res) {
  shell.exec('ssh bigdata01@bigdata-cluster1-01.virtual.uniandes.edu.co /home/bigdata01/fernandolab/script.sh ' +
    req.params.start_date + ' ' + req.params.end_date, {silent:true, async:true});
  res.json({});
});

module.exports = router;

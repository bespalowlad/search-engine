const elasticsearch = require('elasticsearch');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const client = elasticsearch.Client({
  hosts: ['http://localhost:9200/']
});

client.ping({
  requestTimeout: 30000
}, (error) => {
  if(error) {
    console.log(error);
  } else {
    console.log('everything is ok');
  }
});

const app = express();

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3001);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile('template.html', {
    root: path.join(__dirname, 'views')
  });
});

app.get('/search', (req, res) => {
  let body = {
    size: 200,
    from: 0,
    query: {
      // match: {
      //   name: req.query['q']
      // }
      match_all: {}
    }
  };

  client.search({index: 'scotch.io-tutorial', type: 'cities_list', body: body})
    .then(results => {
      res.send(results.hits.hits);
    })
    .catch(error => {
      console.log(error);
      res.send({});
    });
});

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});

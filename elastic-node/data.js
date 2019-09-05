const elasticsearch = require('elasticsearch');
const cities = require('./cities.json');

const client = elasticsearch.Client({
  hosts: ['http://localhost:9200/']
});

client.ping({
  requestTimeout: 30000,
  }, (error) => {
  if(error) {
    console.error('Elasticsearch cluster is down!');
  } else {
    console.log('Everything is ok');
  }
});

// client.indices.create({
//   index: 'scotch.io-tutoria'
// }, (error, response, status) => {
//   if(error) {
//     console.log(error);
//   } else {
//     console.log('created a new index', response);
//   }
// });

let bulk = [];

cities.forEach(city => {
  bulk.push({index: {
    _index: 'scotch.io-tutorial',
    _type: 'cities_list'
    }
  });
  bulk.push(city);
});

client.bulk({body: bulk}, (error, response) => {
  if (error) {
    console.log("Failed Bulk operation".red, error);
  } else {
    console.log("Successfully imported %s".green, cities.length);
  }
});

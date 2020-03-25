const axios = require('axios');

exports.handler = function(event, context, callback) {
  const lat = event.queryStringParameters.lat;
  const lng = event.queryStringParameters.lng;
  const radius = event.queryStringParameters.radius;
  const url = `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${lat}&lng=${lng}&radius=${radius}`;

  axios
    .get(url)
    .then(json => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(json.data)
      });
    })
    .catch(ex => callback(ex));
};

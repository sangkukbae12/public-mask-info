import axios from 'axios';

export const fetchStoreByBounds = (lat, lng, radius) =>
  axios.get(
    `https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=${lat}&lng=${lng}&m=${radius}`
  );

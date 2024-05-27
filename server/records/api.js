 
require("dotenv").config()
var apiKey = process.env.POD_APIKEY;
var apiSecret = process.env.POD_SECRETKEY;
console.log(apiKey)
console.log(apiSecret)

let crypto = require('crypto');
var apiHeaderTime = Math.floor(Date.now()/1000); //console.log(`apiHeaderTime=[${apiHeaderTime}]`);
var sha1Algorithm = "sha1"; 
var sha1Hash = crypto.createHash(sha1Algorithm);
var data4Hash = apiKey + apiSecret + apiHeaderTime.toString();
sha1Hash.update(data4Hash); 
var hash4Header = sha1Hash.digest('hex'); 
console.log(`hash4Header=[${hash4Header}]`);

import('node-fetch').then(fetchModule => {
    const fetch = fetchModule.default;
    let options = { 
      method: "get",
      headers: { 
        "X-Auth-Date": ""+apiHeaderTime,
        "X-Auth-Key": apiKey,
        "Authorization": hash4Header,
        "User-Agent": "SuperPodcastPlayer/1.8"
      },
    };
    var query = "745287"; 
    var url = "https://api.podcastindex.org/api/1.0/podcasts/byfeedid?id=745287"; 
    fetch(url, options)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(json => { 
      console.log(json); 
    })
    .catch(err => {
      console.error('Error fetching data:', err);
    });
  }).catch(err => {
    console.error('Failed to import node-fetch:', err);
  });
  
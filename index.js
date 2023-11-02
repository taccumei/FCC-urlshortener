require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  url: String,
  shorturl: Number
});

const URL = mongoose.model("URL", urlSchema);

// // const urlParser = require('url');
// const { MongoClient } = require('mongodb');

// //create object client from mongodb
// const client = new MongoClient(process.env.DB_URL);
// //create database name urlshortener
// const db = client.db('urlshortener');
// //create collection urls
// const urls = db.collection('urls');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
// app.use(express.urlencoded({ extended: true }));
//use a body parsing middleware to handle the POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//cach 2
app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;
  const dnsLookup = dns.lookup(new URL(url).hostname, async (err, address) => {
    if (!address) {
      res.json({ error: 'invalid url' })
    } else {
      // const urlCount = await urlSchema.countDocuments();
      let urlDoc = new URL({url: "url",shorturl: 1});
      urlDoc.save(function(err, data) {
      if (err) return done(err);
        done(null, data);
      });
      res.json({ original_url: url, short_url: urlCount });
    }
  });
});


// // cach 1
// app.post('/api/shorturl', function(req, res) {
//   //get the value from input form 
//   const url = req.body.url;
//   // const hostname = urlParser.parse(url).hostname;
//   //verify a submitted URL, get hostname from url object
//   const dnsLookup = dns.lookup(new URL(url).hostname, async (err, address) => {
//     //check if the submitted URL is valid by checking a string representation of an IPv4 or IPv6 address is valid
//     if (!address) {
//       res.json({ error: 'invalid url' })
//     } else {
//       // returns the number of documents in the urls collection
//       const urlCount = await urls.countDocuments({});
//       //create urlDoc object that have url(original url) and shorturl
//       const urlDoc = {
//         url,
//         shorturl: urlCount
//       };
//       //insert the urlDoc object to the collection urls
//       const result = await urls.insertOne(urlDoc);
//       // a JSON response with original_url and short_url properties
//       res.json({ original_url: url, short_url: urlCount });
//     }
//   });
// });


app.get("/api/shorturl/:short_url", async (req, res) => {
  //get the /short_url value
  const shorturl = req.params.short_url;
  //check if the /short_url value is in the collections
  const urlDoc = await urls.findOne({ shorturl: +shorturl });
  res.redirect(urlDoc.url);
});

app.listen(port, async()=> {
  try {
    await connect();  
    console.log("connect");  
   } catch (error) {
        console.log({"message": error.message})
   }
  console.log(`Listening on port ${port}`);
});

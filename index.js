const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const objectId = require('mongodb').ObjectID;

require('dotenv').config()
const port = process.env.PORT || 9000;
app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mivuu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  // console.log('connsectio err',err)
  const productCollection = client.db("happyMart").collection("booking");

  // console.log('databae connected')

    //add product to database
  app.post('/admin',(req, res) => {
    const newProduct = req.body;
    // console.log("add new pd", newProduct)
    productCollection.insertOne(newProduct)
      .then(result => {
      // console.log('insert conunt',result.insertedCount)
      res.send(result.insertedCount > 0)
      })
  })

  // show data in UI
  app.get('/booking', (req, res) => {
    productCollection.find()
      .toArray((err, items) => {
        console.log( err)
        res.send(items)
      })

  })

  app.get('/checkOut/:id', (req, res) => {
    // const id = ObjectID(req.params.id);
    // console.log(id)
    productCollection.find({ _id: objectId(req.params.id)})
    .toArray((err, result) => {
      res.send(result[0])
      console.log(err, result)
  })

});
   app.post('/addConfirmOrder', (req, res) => {    //for data create
   const NewProduct = req.body
   console.log(NewProduct);
   orderCollection.insertOne(NewProduct)
     .then(result => {
      //  console.log(result)
      res.send(result.insertedCount > 0)
    })
  })
const orderCollection = client.db("happyMart").collection("order");

  app.get('/orders', (req, res) => {
    // console.log(req.query.email);
    orderCollection.find({email: req.query.email})
      .toArray((err, results) => {
        res.send(results);
        console.log(err)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    // console.log(req.params.id)
    productCollection.deleteOne({ _id: objectId(req.params.id)})
    .then((result) => {
      console.log(result);
    })
  })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)
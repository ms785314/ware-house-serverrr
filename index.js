const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 5000;
const cors = require('cors');
require('dotenv').config()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('working all');
})


// mongo db 

const uri = `mongodb+srv://${process.env.BOOK_BUCKET_USER}:${process.env.BOOK_BUCKET_PASSWORD}@cluster0.emv1qjy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     console.log('db connected');
//     // client.close();
//     console.log(err);
// });


async function run() {
    try {
        await client.connect();
        const database = client.db("BookBucket");
        const items = database.collection("Items");
        app.get('/items',async(req,res)=>{
            const query = {};
            const cursor = await items.find(query).toArray();
            // console.log(cursor);
            res.send(cursor);
            // const cursor = movies.find(query);
        })


        app.get('/items/:id', async(req, res) => {
            // console.log('item',item);
            const {id} = req.params;
            // console.log(id);
            // const query = {};
            const query = {_id:ObjectId(id)}
            const item = await items.findOne(query);
            res.send(item)
            // console.log('item',item);
        })
        app.post('/update/:id',async(req,res)=>{
            const updatedItem = req.body;
            // console.log(updatedItem);

            // to find the item by id
            const filter = {_id:ObjectId(updatedItem._id)}
            const result = await items.updateOne(filter,{$set: {"quantity" : updatedItem.quantity}},{});
            console.log('result',result);
        })
        app.post('/removeItem/:id',async(req,res)=>{
            const targetItemId = req.body.id;
            
            console.log(targetItemId);
            // to find the item by id
            const filter = {_id:ObjectId(targetItemId)}
            const result = await items.deleteOne(filter);
            console.log('result',result);
        })
        app.post('/addItem',async(req,res)=>{
            const item = req.body
            const result = await items.insertOne(item);
            console.log(result);
            // console.log('item',item);
            
        })
    }
    catch {
        console.log('from error');
        console.dir;
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('listening port', port);
})
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



async function run() {
    try {
        await client.connect();
        const database = client.db("BookBucket");
        const items = database.collection("Items");
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = await items.find(query).toArray();
            
            res.send(cursor);
            
        })


        app.get('/items/:id', async (req, res) => {
           
            const { id } = req.params;
            
            const query = { _id: ObjectId(id) }
            const item = await items.findOne(query);
            res.send(item)
           
        })
        app.post('/update/:id', async (req, res) => {
            const updatedItem = req.body;
            

            // to find the item by id
            const filter = { _id: ObjectId(updatedItem._id) }
            const result = await items.updateOne(filter, { $set: { "quantity": updatedItem.quantity } }, {});
           
        })
        app.post('/removeItem/:id', async (req, res) => {
            const targetItemId = req.body.id;

         
            // to find the item by id
            const filter = { _id: ObjectId(targetItemId) }
            const result = await items.deleteOne(filter);
           
        })
        app.post('/addItem', async (req, res) => {
            const item = req.body
            const result = await items.insertOne(item);
            console.log(result);
            res.send(result);
          
        })
        app.post('/myitems', async (req, res) => {
            const email = req.body.email;
            console.log('email', email);
           
            const query = {addedBy:email};

           
            if (email) {
                const cursor = await items.find(query).toArray();
                
                res.send(cursor);
                
            }
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
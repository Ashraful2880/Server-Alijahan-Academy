const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());


//<------------- Database Code Here ---------->

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxp8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        //<------------ Database All Collections ------------->

        const database = client.db("Ali-Jahan-Academy");
        const events = database.collection("Events-Collection");
        const programme = database.collection("Programme-Collection");
        const testimonial = database.collection("Testimonial-Collections");
        const tutors = database.collection("Tutors-Collection");
        const students = database.collection("Students-Collection");
        const users = database.collection("Users-Collection");

        //<------------ Database All API ------------->

        // Get All Events From DB

        app.get('/events', async (req, res) => {
            const allEvent = await events.find({}).toArray();
            res.send(allEvent)
        })

        // Get All Programmes From DB

        app.get('/programmes', async (req, res) => {
            const allPrograms = await programme.find({}).toArray();
            res.send(allPrograms)
        })

        // Get All Testimonial From DB

        app.get('/testimonials', async (req, res) => {
            const allTestimonial = await testimonial.find({}).toArray();
            res.send(allTestimonial)
        })

        // Get All Tutors From DB

        app.get('/tutors', async (req, res) => {
            const allTutors = await tutors.find({}).toArray();
            res.send(allTutors)
        })

        // Get All Students From DB

        app.get('/students', async (req, res) => {
            const allStudents = await students.find({}).toArray();
            res.send(allStudents)
        })


        //<--------------- Save register User info to Database----------------->

        app.post('/users', async (req, res) => {
            const newUsers = req.body;
            const result = await users.insertOne(newUsers);
            res.json(result);
        });
        //<--------------- Update Google Sign User info to Database----------------->

        app.put('/users', async (req, res) => {
            const newUser = req.body;
            const filter = { email: newUser.email }
            const options = { upsert: true };
            const updateUser = { $set: newUser }
            const result = await users.updateOne(filter, updateUser, options);
            res.json(result);
        });
        //<--------------- Update Admin Role to Database----------------->

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateAdmin = { $set: { role: 'admin' } }
            const result = await users.updateOne(filter, updateAdmin);
            res.json(result);
        });

        //<------------ Get Admin Data From Database ------------->

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const getAdmin = await users.findOne(query);
            let isAdmin = false
            if (getAdmin?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        });

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Ali Jahan Academy')
});


app.listen(port, () => {
    console.log("Running Server Port is", port);
});
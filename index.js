const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middlewere
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.qu4ehcj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const addVolunteerCollection = client
      .db("VolunteerInfo")
      .collection("volunteer");
    const addVolunteerCollectionModal = client
      .db("VolunteerInfo")
      .collection("volunteerModal");
    const giveFeedBack = client
      .db("VolunteerInfo")
      .collection("feedback");

    // volunteer data get entry on data base (addvolunteer post)


    // send data on server

    app.post("/addVolunteer", async (req, res) => {
      const VolunteerPost = req.body;
      // console.log(VolunteerPost);
      const result = await addVolunteerCollection.insertOne(VolunteerPost);
      res.send(result);
    });

    app.get("/addVolunteer", async (req, res) => {
      const volunteerData = await addVolunteerCollection.find().toArray();
      res.send(volunteerData);
    });
    // send data on server on modal

    app.post("/addVolunteerModal", async (req, res) => {
      const VolunteerPost = req.body;
      // console.log(VolunteerPost);
      const result = await addVolunteerCollectionModal.insertOne(VolunteerPost);
      res.send(result);
    });

    app.get("/addVolunteerModal", async (req, res) => {
      const volunteerData = await addVolunteerCollectionModal.find().toArray();
      res.send(volunteerData);
    });

    app.delete("/addVolunteerModal/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addVolunteerCollectionModal.deleteOne(query);
      res.send(result);
    });





    //volunteerdetails
    app.get("/addVolunteer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addVolunteerCollection.findOne(query);
      res.send(result);
    });

    // tabuler form recived data show on client side
    app.get("/managePost/:email", async (req, res) => {
      const result = await addVolunteerCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // delete mypost
    app.delete("/managePost/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addVolunteerCollection.deleteOne(query);
      res.send(result);
    });

    app.put('/managePost/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updated = req.body;

      const volunteer = {
          $set: {
             
              title: updated.title, 
              thumbnail: updated.thumbnail, 
              category: updated.category, 
              location: updated.location, 
              volunteerAdded: updated.volunteerAdded, 
              date: updated.date, 
             
          }
      }

      const result = await addVolunteerCollection.updateOne(filter, volunteer, options);
      res.send(result);
  })



  // feedback  

  app.post("/feedBack", async (req, res) => {
    const VolunteerFeedBack = req.body;
    // console.log(VolunteerPost);
    const result = await giveFeedBack.insertOne(VolunteerFeedBack);
    res.send(result);
  });


  app.get("/feedBack", async (req, res) => {
    const volunteerfeedBack = await giveFeedBack.find().toArray();
    res.send(volunteerfeedBack);
  });



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Volunteer-Management-server");
});

app.listen(port, () => {
  console.log(`Volunteer-Management-server is running on port ${port}`);
});

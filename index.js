require("dotenv").config();
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Store ID: faith68a5d8d3a3093
// Store Password (API/Secret Key): faith68a5d8d3a3093@ssl

// Merchant Panel URL: https://sandbox.sslcommerz.com/manage/ (Credential as you inputted in the time of registration)

// Store name: testfaithevqj
// Registered URL: www.faithbridgeacademy.com
// Session API to generate transaction: https://sandbox.sslcommerz.com/gwprocess/v3/api.php
// Validation API: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?wsdl
// Validation API (Web Service) name: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h2tkvzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // ----------------------Collection Start-----------------------------------------
    const usersCollection = client.db("faithBridge-school").collection("user");
    const studentsApplyInformationCollection = client
      .db("faithBridge-school")
      .collection("students-information");
    const paymentCollection = client
      .db("faithBridge-school")
      .collection("payments");
    // --------------------------Collection End-----------------------------------------

    // ----------------------User collection Start--------------------------------------

    // Save user
    app.post("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;

      const query = { email };
      const isExist = await usersCollection.findOne(query);
      if (isExist) return isExist;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Get user by specific email
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;

      const user = await usersCollection.findOne({ email });
      res.send(user);
    });

    // Get user role
    app.get("/user/role/:email", async (req, res) => {
      const email = req.params.email;

      const query = { email };
      const user = await usersCollection.findOne(query);

      res.send({ role: user?.role });
    });
    // ----------------------------User collection End-------------------------------

    // ----------------------------Students Apply Information Start------------------

    // Save student information
    app.post("/student-information/:email", async (req, res) => {
      const email = req.params.email;
      const students_information = req.body;

      const query = { email };
      const isExist = await studentsApplyInformationCollection.findOne(query);
      if (isExist) {
        return isExist;
      }
      const result = await studentsApplyInformationCollection.insertOne(
        students_information
      );
      res.send(result);
    });

    // Get student information
    app.get("/student-information", async (req, res) => {
      const result = await studentsApplyInformationCollection.find().toArray();
      res.send(result);
    });
    // ------------------------------Students Apply Information End--------------------------

    // ------------------------------Payment Start---------------------------------
    app.post("/create-payment", async (req, res) => {
      const paymentInfo = req.body;

      // Transaction id create
      const trxId = new ObjectId().toString();
      paymentInfo.transactionId = trxId;

      const initiate = {
        store_id: "faith68a5d8d3a3093",
        store_passwd: "faith68a5d8d3a3093@ssl",
        total_amount: paymentInfo.amount,
        currency: "BDT",
        tran_id: trxId, // use unique tran_id for each api call
        success_url: "http://localhost:5000/success-payment",
        fail_url: "http://localhost:5173/fail",
        cancel_url: "http://localhost:5173/cancel",
        ipn_url: "http://localhost:5000/ipn-success-payment",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: `${paymentInfo.name}`,
        cus_email: `${paymentInfo.email}`,
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };

      const iniResponse = await axios({
        url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
        method: "post",
        data: initiate,
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });

      await paymentCollection.insertOne(paymentInfo);
      const gateWayUrl = iniResponse.data.GatewayPageURL;
      res.send({ gateWayUrl });
    });

    app.post("/success-payment", async (req, res) => {
      const paymentSuccess = req.body;
     
      // Validation
      const { data } = await axios.get(
        `https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php?val_id=${paymentSuccess.val_id}&store_id=faith68a5d8d3a3093&store_passwd=faith68a5d8d3a3093@ssl`
      );

      if (data.status !== "VALID") {
        return res.send("Invalid Payment");
      }

      // Update payment-collection
      const query = { transactionId: data.tran_id };
      const update = await paymentCollection.updateOne(query, {
        $set: { status: "success" },
      });

      //Query payment-success email and match students Apply Information Collection email,then payment status update.
      const paymentSuccessEmail = await paymentCollection.findOne(query)

      if(paymentSuccessEmail.status === 'success'){
        const email = paymentSuccessEmail.email
        const query = {email}
        const update = await studentsApplyInformationCollection.updateOne(query, {
          $set: {
            payment_status: 'Done'
          }
        })
      }
    
    });
    // ------------------------------Payment End---------------------------------

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
  res.send("The school website server running");
});

app.listen(port, () => {
  console.log("the website running on port", port);
});

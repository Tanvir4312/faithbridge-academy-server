require("dotenv").config();
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const nodemailer = require("nodemailer");

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

// send email using nodemailer
const sendEmail = (emailAddress, emailData) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  // Transport Verify
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Transport email is ready", success);
    }
  });

  // transport.sendMail Obj.
  const mailBody = {
    from: process.env.NODEMAILER_USER,
    to: emailAddress,
    subject: emailData.subject,
    // text: "Hello world?", // plain‑text body
    html: `<p>${emailData.message}</p>`, // HTML body
  };

  // send email
  transporter.sendMail(mailBody, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("sent email: " + info?.response);
    }
  });
};

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
    const formFillUpInfoCollection = client
      .db("faithBridge-school")
      .collection("form-fillUp-infos");
    const timerCollection = client
      .db("faithBridge-school")
      .collection("application_settings");
    const form_fill_up_timerCollection = client
      .db("faithBridge-school")
      .collection("form-fill-up-time-setting");
    const transcriptApplyCollection = client
      .db("faithBridge-school")
      .collection("transcript-Apply-Collection");
    const testimonialApplyCollection = client
      .db("faithBridge-school")
      .collection("testimonial-Apply-Collection");
    const certificateApplyCollection = client
      .db("faithBridge-school")
      .collection("certificate-Apply-Collection");

    // ---------Notice-----------
    const noticeCollection = client
      .db("faithBridge-school")
      .collection("notice-Collection");

    // -------Image----------
    const imageCollection = client
      .db("faithBridge-school")
      .collection("image-Collection");
    // -------Courses----------
    const courseCollection = client
      .db("faithBridge-school")
      .collection("course-Collection");
    // -------Other Activities----------
    const other_activities_Collection = client
      .db("faithBridge-school")
      .collection("other-activities-Collection");
    // -------More Image----------
    const moreImageCollection = client
      .db("faithBridge-school")
      .collection("more-image-Collection");
    // -------contact-number Image----------
    const contact_number_Collection = client
      .db("faithBridge-school")
      .collection("contact-number-Collection");

    // --------------------------Collection End---------------------------

    // ------------------------------------------------Admin Start-------------------------------------------

    // --------------------------Notice Related------------------------------------
    // Save Notice data
    app.post("/notice", async (req, res) => {
      const notice = req.body;
      const result = await noticeCollection.insertOne(notice);
      res.send(result);
    });

    // Get Notice
    app.get("/notice", async (req, res) => {
      const result = await noticeCollection.find().toArray();
      res.send(result);
    });

    // Get Notice By specific id
    app.get("/get-notice/:id", async (req, res) => {
      const id = req.params.id;
      const result = await noticeCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Update
    app.patch("/notice-update/:id", async (req, res) => {
      const id = req.params.id;
      const update_notice = req.body;
      const result = await noticeCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: update_notice,
        }
      );
      res.send(result);
    });

    // Delete Notice By specific id
    app.delete("/notice-delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await noticeCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // --------------------------------Image Related----------------------
    // Add Image
    app.post("/upload-image-admin", async (req, res) => {
      const image = req.body;
      const result = await imageCollection.insertOne(image);
      res.send(result);
    });

    // Get Image
    app.get("/fetch-image", async (req, res) => {
      const result = await imageCollection.find().toArray();
      res.send(result);
    });

    // Delete Image By specific id
    app.delete("/image-delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await imageCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // ---------------------Course Related---------------------------------
    // Add Course
    app.post("/upload-courses-admin", async (req, res) => {
      const image = req.body;
      const result = await courseCollection.insertOne(image);
      res.send(result);
    });
    // Get Courses
    app.get("/get-courses", async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });

    // Get course By specific id for update field
    app.get("/course-data-get/:id", async (req, res) => {
      const id = req.params.id;
      const result = await courseCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //Course Data Update
    app.patch("/course-data-update/:id", async (req, res) => {
      const id = req.params.id;
      const update_course = req.body;
      const result = await courseCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: update_course,
        }
      );
      res.send(result);
    });

    // Delete Course By specific id
    app.delete("/course-delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await courseCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // -----------------Other Activities Related----------------------
    // Add Activities
    app.post("/upload-activities-admin", async (req, res) => {
      const activities = req.body;
      const result = await other_activities_Collection.insertOne(activities);
      res.send(result);
    });
    // Get Activities
    app.get("/get-activities", async (req, res) => {
      const result = await other_activities_Collection.find().toArray();
      res.send(result);
    });
    // Delete Course By specific id
    app.delete("/activities-delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await other_activities_Collection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    // Get activities By specific id for update field
    app.get("/activities-data-get/:id", async (req, res) => {
      const id = req.params.id;
      const result = await other_activities_Collection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    //Activities Data Update
    app.patch("/activities-data-update/:id", async (req, res) => {
      const id = req.params.id;
      const update_activities = req.body;
      const result = await other_activities_Collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: update_activities,
        }
      );
      res.send(result);
    });

    // --------------------------------More Image Related----------------------
    // Add More Image
    app.post("/upload-more-image-admin", async (req, res) => {
      const more_image = req.body;
      const result = await moreImageCollection.insertOne(more_image);
      res.send(result);
    });

    // // Get More Image
    app.get("/fetch-more-image", async (req, res) => {
      const result = await moreImageCollection.find().toArray();
      res.send(result);
    });

    // // Delete More Image By specific id
    app.delete("/image-more-delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await moreImageCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // --------------------------Contact Number Related------------------------------------
    // Save Contact Number
    app.post("/contact-number", async (req, res) => {
      const number = req.body;
      const result = await contact_number_Collection.insertOne(number);
      res.send(result);
    });

    // // Get Notice
    app.get("/get-contact-number", async (req, res) => {
      const result = await contact_number_Collection.find().toArray();
      res.send(result);
    });

    //  // Delete Notice By specific id
    app.delete("/number-delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await contact_number_Collection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    //-------------------------------Users Related------------------------
    // Get Users for admin
    app.get("/all-user", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    // Get Users search for admin
    app.get("/users-search", async (req, res) => {
      const search = req.query.search || "";
      let query = {
        $or: [
          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            role: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // Update and make a teacher role
    app.patch("/make-teacher/:id", async (req, res) => {
      const id = req.params.id;

      const update = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            role: "teacher",
          },
        }
      );
      res.send(update);
    });

    // Delete User By specific id
    app.delete("/user-delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // ------------------------------Pagination------------------------------------
    //Users Count
    app.get("/users-data-count", async (req, res) => {
      const count = await usersCollection.estimatedDocumentCount();

      res.send({ count });
    });

    // Students Info Data count
    app.get("/students-data-count", async (req, res) => {
      const count =
        await studentsApplyInformationCollection.estimatedDocumentCount();

      res.send({ count });
    });
    // Students Info Data count
    app.get("/form-fillUp-data-count", async (req, res) => {
      const count = await formFillUpInfoCollection.estimatedDocumentCount();

      res.send({ count });
    });

    // Pagination
    app.get("/data-pagination", async (req, res) => {
      const page = Number(req.query.page);
      const size = Number(req.query.size);
      const text = req.query.type;
      console.log(text);
      let result;
      if (text === "studentsPagination") {
        result = await studentsApplyInformationCollection
          .find()
          .skip(page * size)
          .limit(size)
          .toArray();
      } else if (text === "formDataPagination") {
        result = await formFillUpInfoCollection
          .find()
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        result = await usersCollection
          .find()
          .skip(page * size)
          .limit(size)
          .toArray();
      }

      res.send(result);
    });

    // // ---------------Students Info Related-----------------------
    app.get("/all-student-info", async (req, res) => {
      const result = await studentsApplyInformationCollection.find().toArray();
      res.send(result);
    });

    // Update When Admin accept or Reject
    app.patch("/update-student-data/:id", async (req, res) => {
      const id = req.params.id;
      const { text } = req.body;

      const studentInfo = await studentsApplyInformationCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!studentInfo) {
        return res.status(404).send({ message: "Student info not found" });
      }
      const email = studentInfo.email;
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      let updateStudentInfo;
      let updateUserRole;

      if (text === "exam") {
        updateStudentInfo = await studentsApplyInformationCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status_exam: "verified",
            },
          }
        );
      } else if (text === "accept") {
        updateStudentInfo = await studentsApplyInformationCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: "verified",
            },
          }
        );

        updateUserRole = await usersCollection.updateOne(
          { email },
          {
            $set: {
              role: "student",
            },
          }
        );
      } else if (text === "reject") {
        updateStudentInfo = await studentsApplyInformationCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: "rejected",
            },
          }
        );
      }

      res.send({ updateStudentInfo, updateUserRole });
    });

    // Search payment Status
    app.get("/student-payment-info", async (req, res) => {
      const search = req.query.search;
      const query = {
        payment_status: {
          $regex: search,
          $options: "i",
        },
      };
      const result = await studentsApplyInformationCollection
        .find(query)
        .toArray();
      res.send(result);
    });

    // Search by Admin
    app.get("/student-info", async (req, res) => {
      const search = req.query.search;

      let query = {
        $or: [
          {
            registration_no: {
              $regex: search,
              $options: "i",
            },
          },
          {
            status: {
              $regex: search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
          {
            status_exam: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
      const result = await studentsApplyInformationCollection
        .find(query)
        .toArray();
      res.send(result);
    });

    // // Delete Student By specific id
    app.delete("/student-delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await studentsApplyInformationCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // ---------------Form Fill Up Info Related-----------------------
    //  Get Form Fill Up Data for Admin
    app.get("/formFill-up-info", async (req, res) => {
      const result = await formFillUpInfoCollection.find().toArray();
      res.send(result);
    });

    // Update Data when admin accept
    app.patch("/formFill-up-data/:id", async (req, res) => {
      const id = req.params.id;
      const update = await formFillUpInfoCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "verified",
          },
        }
      );
      res.send(update);
    });

    // Delete User By specific id
    app.delete("/formFill-up-data-delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await formFillUpInfoCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Search
    app.get("/formFill-up-info-data", async (req, res) => {
      const search = req.query.search || "";

      let query = {};

      if (search) {
        query = {
          $or: [
            {
              registration_no: {
                $regex: search,
                $options: "i",
              },
            },
            {
              payment: {
                $regex: search,
                $options: "i",
              },
            },
            {
              status: {
                $regex: search,
                $options: "i",
              },
            },
            {
              name_en: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        };
      }

      const result = await formFillUpInfoCollection.find(query).toArray();
      res.send(result);
    });

    // ------------------------------------------------Admin End-------------------------------------------------

    // ----------------------Apply Time Start------------------------------

    app.get("/application-timer", async (req, res) => {
      const timerObg = await timerCollection.findOne({ _id: 1 });

      const now_date = new Date();

      const start_time = new Date(timerObg.form_start);
      const end_time = new Date(timerObg.form_end);

      if (now_date < start_time || now_date > end_time) {
        return res.status(403).send({
          message: "Application form is closed",
          start_time: start_time.toLocaleString("en-BD", {
            timeZone: "Asia/Dhaka",
          }),
          end_time: end_time.toLocaleString("en-BD", {
            timeZone: "Asia/Dhaka",
          }),
        });
      }

      // valid হলে return
      return res.send({ message: "Application form is open" });
    });

    // ----------------------Apply Time End------------------------------

    // -------------------Form fill-up time Start----------------------------

    app.get("/form-fill-up-time", async (req, res) => {
      const timeObj = await form_fill_up_timerCollection.findOne({ _id: 1 });

      const nowDate = new Date();
      const start_time = new Date(timeObj.form_start);
      const end_time = new Date(timeObj.form_end);

      if (nowDate < start_time || nowDate > end_time) {
        return res.status(403).send({
          message: "Form fill-up Time Over",
          start_time: start_time.toLocaleString("en-BD", {
            timeZone: "Asia/Dhaka",
          }),
          end_time: end_time.toLocaleString("en-BD", {
            timeZone: "Asia/Dhaka",
          }),
        });
      }

      return res.status(200).send({
        message: "Application form is open",
        end_time: end_time.toLocaleString("en-BD", {
          timeZone: "Asia/Dhaka",
        }),
      });
    });

    // -------------------Form fill-up time end----------------------------

    // ----------------------User collection Start--------------------------------------

    // Save user
    app.post("/user", async (req, res) => {
      const user = req.body;

      const query = { email: user?.email };
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

    // Ensure these indexes once run somewhere in server startup
    await studentsApplyInformationCollection.createIndex(
      { registration_no: 1 },
      { unique: true }
    );
    await studentsApplyInformationCollection.createIndex(
      { email: 1 },
      { unique: true }
    );

    // Save student information
    app.post("/student-information/:email", async (req, res) => {
      const email = req.params.email;
      const students_information = req.body;

      // 1️⃣ Function: Generate unique registration number
      async function generateUniqueRegNo() {
        while (true) {
          const newRegNo =
            `${new Date().getFullYear()}` +
            Math.floor(100000 + Math.random() * 900000);

          const exists = await studentsApplyInformationCollection.findOne({
            registration_no: newRegNo,
          });

          if (!exists) return newRegNo; // unique number found
        }
      }

      // 2️⃣ Function: Insert with retry mechanism
      async function insertStudentWithUniqueRegNo(maxRetries = 5) {
        for (let i = 0; i < maxRetries; i++) {
          try {
            students_information.registration_no = await generateUniqueRegNo();

            const result = await studentsApplyInformationCollection.insertOne(
              students_information
            );
            return result;
          } catch (error) {
            if (error.code === 11000) {
            } else {
              throw error;
            }
          }
        }
        throw new Error("Failed to insert student after multiple retries");
      }

      try {
        // 3️⃣ Check if email already applied
        const isExist = await studentsApplyInformationCollection.findOne({
          email,
        });
        if (isExist) {
          return res.status(400).send({
            message:
              "An application has already been applied using this email!",
          });
        }

        // 4️⃣ Insert student safely
        const result = await insertStudentWithUniqueRegNo();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // Get student information
    app.get("/student-information", async (req, res) => {
      const result = await studentsApplyInformationCollection.find().toArray();
      res.send(result);
    });
    // Get student information by specific email
    app.get("/student-information/:email", async (req, res) => {
      const email = req.params.email;

      const result = await studentsApplyInformationCollection.findOne({
        email,
      });
      res.send(result);
    });
    // Get student information using id for update
    app.get("/profile-update/:id", async (req, res) => {
      const id = req.params.id;

      const result = await studentsApplyInformationCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Update Profile
    app.patch("/update-profile/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const update = await studentsApplyInformationCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: updateData,
        }
      );
      res.send(update);
    });
    // ------------------------------Students Apply Information End--------------------------

    // ----------------------------------Form FillUp Start--------------------------------

    // Save Form FillUp Info
    app.post("/form-fillUp-info", async (req, res) => {
      const info = req.body;
      const result = await formFillUpInfoCollection.insertOne(info);
      res.send(result);
    });

    // Get Form FillUp info by specific Email
    app.get("/form-fillUp-info/:email", async (req, res) => {
      const email = req.params.email;
      const formFillUpData = await formFillUpInfoCollection.findOne({ email });
      res.send(formFillUpData);
    });

    // Admit Card--------
    app.get("/admit-card-info/:id", async (req, res) => {
      const id = req.params.id;
      const admitCardData = await formFillUpInfoCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(admitCardData);
    });

    // ----------------------------------Form FillUp End----------------------------------

    //-----------------------------------Apply For Documents Start------------------------

    // Apply Documents Data save
    app.post("/apply-docs", async (req, res) => {
      const apply_docs = req.body;
      let result;
      if (apply_docs.type === "transcript") {
        result = await transcriptApplyCollection.insertOne(apply_docs);
      } else if (apply_docs.type === "testimonial") {
        result = await testimonialApplyCollection.insertOne(apply_docs);
      } else if (apply_docs.type === "certificate") {
        result = await certificateApplyCollection.insertOne(apply_docs);
      }

      res.send(result);
    });

    // Get Transcript Data
    app.get("/transcript-data/:email", async (req, res) => {
      const email = req.params.email;
      const result = await transcriptApplyCollection.find({ email }).toArray();
      res.send(result);
    });
    // Get Testimonial Data
    app.get("/testimonial-data/:email", async (req, res) => {
      const email = req.params.email;
      const result = await testimonialApplyCollection.find({ email }).toArray();
      res.send(result);
    });
    // Get Certificate Data
    app.get("/certificate-data/:email", async (req, res) => {
      const email = req.params.email;
      const result = await certificateApplyCollection.find({ email }).toArray();
      res.send(result);
    });
    //-----------------------------------Apply For Documents End--------------------------

    // ------------------------------Apply Payment Start---------------------------------
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
      try {
        const paymentSuccess = req.body;

        // Validation
        const { data } = await axios.get(
          `https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php?val_id=${paymentSuccess.val_id}&store_id=faith68a5d8d3a3093&store_passwd=faith68a5d8d3a3093@ssl`
        );

        if (data.status !== "VALID") {
          return res.send("Invalid Payment");
        }

        // Query Payment Data
        const paymentData = await paymentCollection.findOne({
          transactionId: data.tran_id,
        });

        // Update payment-collection
        const query = { transactionId: data.tran_id };
        await paymentCollection.updateOne(query, {
          $set: { status: "success" },
        });

        // Admission Payment Status update in student info collection
        if (data.status === "VALID") {
          const query = { email: paymentData.email };
          await studentsApplyInformationCollection.updateOne(query, {
            $set: {
              payment_status: "Done",
            },
          });
        }
        // form fill up Payment Status update in student info collection
        if (data.status === "VALID") {
          const query = { email: paymentData.email };
          await formFillUpInfoCollection.updateOne(query, {
            $set: {
              payment: "Done",
            },
          });
        }

        // Email Sent
        if (data.status === "VALID") {
          sendEmail(paymentData?.email, {
            subject: "Payment Successful",
            message: `Your Payment Successfully Done, Transaction Id: ${data.tran_id}`,
          });
        }
        // Send transactionId back to client
        res.redirect(
          `http://localhost:5173/success-payment?transactionId=${data.tran_id}`
        );
      } catch (err) {
        res.status(500).send({ success: false, message: "Server error" });
      }
    });

    // ------------------------------Apply Payment End---------------------------------

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

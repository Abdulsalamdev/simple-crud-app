const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/products");
dotenv.config;
const PORT = process.env.PORT || 3000;
// Middleware to parse JSON bodies
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://Abdulsalam:30GovyQjTByIdz1U@backenddb.ihnyd.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB"
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB Atlas", err));

// app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

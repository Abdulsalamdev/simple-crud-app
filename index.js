const express = require("express");
const app = express();
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");
const addressRoutes = require("./routes/address");
const authRoutes = require("./routes/users");
const config = require("./config");
// require("dotenv").config();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(config.uri)
  .then(() => {
    console.log("Connected to MongoDB server");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB server", err));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/address", addressRoutes);

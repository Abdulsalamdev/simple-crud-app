const express = require("express");
const app = express();
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/users");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const indexRoutes = require("./routes/index.route");


app.use(cors());
app.use(express.json());
app.use("/", indexRoutes)

const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB server");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB server", err));


app.use("/auth", authRoutes);
app.use("/products", productRoutes);


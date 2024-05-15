const express = require("express");
const app = express();
app.use(express.json());
const { connect } = require("./Services/DbMongo");
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const userRouter = require("./Controller/routes/user");

connect(process.env.DB_URL, (error) => {
  if (error) {
    console.log("Failed to connect");
    process.exit(-1);
  } else {
    console.log("successfully connected");
  }
});

app.use("/", userRouter);

app.listen(process.env.PORT, () => {
  console.log("im listening on port", process.env.PORT);
});

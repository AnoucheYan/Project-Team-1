const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/users.route");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL1);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log("Unable to connect to the database", error);
  }
}

main();

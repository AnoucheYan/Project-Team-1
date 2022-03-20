const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/users.route");
const ticketRouter = require("./routes/ticket.rout");

const swaggerSpecs = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Team1-Ticketing System",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.js"],
});

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/tickets", ticketRouter);

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });
    });
    console.log("Connected to mongodb");
  } catch (error) {
    console.log("Unable to connect to the database", error);
  }
}

main();

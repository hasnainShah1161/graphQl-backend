const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

const graphQlSchema = require("./graphQl/schema/index");
const graphQlResolvers = require("./graphQl/resolvers/index");

app.use(
  "/api",
  graphQlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@storybook-34fwa.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("app is running on Port : ", 3000);
    });
  })
  .catch(err => {
    console.log(err);
  });

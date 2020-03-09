// server.js
const express = require("express");
const app = express();
require('dotenv').config()
const path = require("path");
const morgan = require("morgan");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt");

const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(
    'mongodb://localhost:27017/flows',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    },
    () => console.log('Connected to the DB')
)

app.use("/api", expressJwt({secret: process.env.SECRET || config.secret}));

app.use("/api/favorite", require("./routes/favoriteRoutes"));

app.use("/stream", require("./routes/streamRoutes"));

app.use("/auth", require("./routes/authRoutes"));

app.use((err, req, res, next) => {
    console.log(err)
    if(err.name === "UnauthorizedError"){
      res.status(err.status)
    }
    return res.send({errMsg: err.message})
})  

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


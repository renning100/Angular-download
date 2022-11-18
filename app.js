const express = require("express");
const https = require("https");
const bodyParser = require('body-parser')
const cors = require("cors");
const path = require('path')
//Routes
const downloadRoute = require("./Routes/downloadRoute");
const connectionRoute = require("./Routes/connectionRoute");

const port = 3000;
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'files')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });


app.use(downloadRoute);
app.use(connectionRoute);


app.get('/', (req, res) => {
  res.render('home');
})

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message;
  const data = err.data;

  res.status(status).json({
    message: message,
    data: data,
    error: err,
  });
});

app.all("*", (req, res, next) => {
  res.status(404).json({
    message: "No Route found"
  })
});

app.listen(3000,function(){
    console.log("App is running ...")
})
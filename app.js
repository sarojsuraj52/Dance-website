var express = require('express');
var app = express();
var port = 80;
var path = require("path");
// ***this section allow middleware which parse the data from server and convert into json format which is easy for us to save in data base *******
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//********************** */

// connecting to database
var mongoose = require("mongoose");
mongoose.Promise = global.Promise; mongoose.connect("mongodb://localhost:27017/node-demo", { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

// creating schema
var nameSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    desc: String,

});

// creating model
var User = mongoose.model("User", nameSchema);

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded())

//Endpoint
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
//using post method to to get the data and using mongoose saving the data to the mongodb
app.post("/contacts", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("Item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

// server
app.listen(port, () => {
    console.log(`Connection has successfully started on port ${port}`);
});


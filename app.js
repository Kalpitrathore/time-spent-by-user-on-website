const express = require('express');
const ejs = require('ejs');
const bodyParser= require('body-parser');
const app = express()
const port = 80

app.set('view engine', 'ejs');
app.use(bodyParser.json());

var analytics = {};

// It will render home page
app.get('/', (req, res) => {    
    res.render('index');
})
// ------------------------

// It will render dashboard page
app.get('/dashboard', (req, res) => {
    res.render('dashboard', {"analytics": analytics});
})
// ------------------------

// It will catch the data sent from "sendBeacon" method on home page
app.post('/updatetimespentonpage', bodyParser.text(), function(req,res){  
    var body = JSON.parse(req.body)    
    analytics[body["uid"]] = (analytics[body["uid"]]) ? (analytics[body["uid"]] + body["timeSpentOnPage"]) : (body["timeSpentOnPage"]);
    res.send({"status": "done"});
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
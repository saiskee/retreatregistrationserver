// server.js

// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var Todo;
// configuration=================
let mongouri = "mongodb://sairam:sairam99@ds133762.mlab.com:33762/retreatregistrationserver";
                //mongodb://saiskee:sairam99@ds133762.mlab.com:33762/retreatregistrationserver
mongoose.connect(mongouri); 

app.listen(8080);
console.log("App listening on port 8080");
// connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================


// define model =================
Registree = mongoose.model('Registree', mongoose.Schema({
    mainregistree: {type: String, default:''},
    name:  {type: String, default:''},
    address:  {type: String, default:''},
    formsubmittime:  {type: Number, default:0},
    email:  {type: String, default:''},
    gender:  {type: String, default:''},
    phone: {type: String, default:''},
    centername:  {type: String, default:''},
    ssegroup:  {type: String, default:''},
    age:  {type: Number, default:'0'},
    durationofstay: {type:Object, default:{'friday':false,'saturday':false,'sunday':false}},
    ya:  {type: Boolean, default:false},
    newcomer:  {type: Boolean, default:false},
    accommodation:  {type: Boolean, default:false},
    dietaryrestrictions:  {type: String, default:''},
    specialaccommodations:  {type: String, default:''},
    checkintime: {type: String, default: 'Not Checked In'},
    checkouttime: {type: String, default: 'Not Checked Out'},
    paid: {type: Boolean, default: false},
    amountpaid: {type: Number, default: 0}
}));

//routes=======================================================================

// api ---------------------------------------------------------------------

app.post('/api/registree', function (req, res) {
    for (property in req.body){
        if (req.body[property] == undefined){
            req.body[property] = null;
        }
    }
    // create a todo, information comes from AJAX request from Angular
    Registree.create({
        mainregistree: req.body.mainregistree,
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        formsubmittime: req.body.formsubmittime,
        email: req.body.email,
        ssegroup: req.body.ssegroup,
        ya: req.body.ya,
        gender: req.body.gender,
        newcomer: req.body.newcomer,
        phone: req.body.phone,
        centername : req.body.centername,
        durationofstay: req.body.durationofstay,
        accommodation: req.body.accommodation,
        dietaryrestrictions: req.body.dietaryrestrictions,
        specialaccommodations: req.body.specialaccommodations,
        checkintime: req.body.checkintime,
        checkouttime: req.body.checkouttime,
        paid: req.body.paid,
        amountpaid: req.body.amountpaid

    }, function (err, todo) {

        if (err) {
            res.send(err);
        }
        // get and return all the registrees after you create another
        Registree.find(function (err, registrees) {
            if (err)
                res.send(err)
            res.json(registrees);
        });
    });

});

app.get('/api/registree/', function (req, res) {
    Registree.find(function (err, registrees) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(registrees);
        }
    });
});



app.delete('/api/registree/:registree_id', function (req, res) {
    Registree.remove({
        _id: req.params.registree_id
    }, (err, registree) => {
        if (err)
            res.send(err);
        Registree.find((err, registrees) => {
            if (err)
                res.send(err);
            res.json(registrees)
        })
    })
})


//update a todo
app.put('/api/registree/:registree_id', (req, res) => {
    // for (property in req.body){
    //     if (req.body[property] == undefined){
    //         req.body[property] = null;
    //     }
    // }
    Registree.findByIdAndUpdate(req.params.registree_id, {
        mainregistree: req.body.mainregistree,
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        formsubmittime: req.body.formsubmittime,
        email: req.body.email,
        ssegroup: req.body.ssegroup,
        ya: req.body.ya,
        gender: req.body.gender,
        newcomer: req.body.newcomer,
        phone: req.body.phone,
        centername : req.body.centername,
        durationofstay: req.body.durationofstay,
        accommodation: req.body.accommodation,
        dietaryrestrictions: req.body.dietaryrestrictions,
        specialaccommodations: req.body.specialaccommodations,
        checkintime: req.body.checkintime,
        checkouttime: req.body.checkouttime,
        paid: req.body.paid,
        amountpaid: req.body.amountpaid

    }
    ,(err, registree) => {
            if (err) {
                console.log(" PUT error :", err);
                res.send(err);
               
            } else{
                console.log("Registree Updated:", registree)
            }
        }
    );
});




// application -------------------------------------------------------------

app.get('/api/table', function(req,res){
    res.sendfile('./public/table/table.html')
})
app.get('/scripts/:script', (req,res) => {
    res.sendfile('./public/scripts/'+req.params.script);
})

app.get('/form', function (req, res) {
    res.sendfile('./public/form/index.html'); 
    // load the single view file (angular will handle the page changes on the front-end)
});



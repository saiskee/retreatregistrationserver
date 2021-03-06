// server.js

// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
// configuration=================
let mongouri = "mongodb://sairam:sairam99@ds133762.mlab.com:33762/retreatregistrationserver";
                //mongodb://saiskee:sairam99@ds133762.mlab.com:33762/retreatregistrationserver
mongoose.connect(mongouri,{useNewUrlParser:true}, function(error){
    if (error){
    console.log("Connection to ",mongouri,"failed");
    }
}); 

// listen (start app with node server.js) ======================================
let port = 8080;
app.listen(port);
console.log("App listening on port "+ port + " connected to " + mongouri);
// connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// define Registree and Room =================
Registree = mongoose.model('Registree', mongoose.Schema({
    mainregistreeid: {type: String, default: ''},
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
    bhajanlist: {type: String, default:''},
    dietaryrestrictions:  {type: String, default:''},
    specialaccommodations:  {type: String, default:''},
    checkintime: {type: String, default: 'Not Checked In'},
    checkouttime: {type: String, default: 'Not Checked Out'},
    paid: {type: Boolean, default: false},
    amountpaid: {type: Number, default: 0},
    room: {}
}));

getReqParamsRegistree = function(req){
    return {
        mainregistreeid :req.body.mainregistreeid,
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
        bhajanlist: req.body.bhajanlist,
        centername : req.body.centername,
        durationofstay: req.body.durationofstay,
        accommodation: req.body.accommodation,
        dietaryrestrictions: req.body.dietaryrestrictions,
        specialaccommodations: req.body.specialaccommodations,
        checkintime: req.body.checkintime,
        checkouttime: req.body.checkouttime,
        paid: req.body.paid,
        amountpaid: req.body.amountpaid,
        room: req.body.room

    }
}

Room = mongoose.model('Room', mongoose.Schema({
    roomnumber: {type:String, default: ''},
    floornumber: {type:String, default: ''},
    building: {type: String, default: ''},
    handicap: {type: Boolean, default: false},
    beds: {type: Number, default: 0},
    maxoccupancy: {type: Number, default: 0},
    occupants: {type: Number, default:0},
    additionalnotes: {type: String, default: ''}
}));

getReqParamsRoom = function(req){
    return{
    roomnumber: req.body.roomnumber,
    floornumber: req.body.floornumber,
    building: req.body.building,
    handicap: req.body.handicap,
    beds: req.body.beds,
    maxoccupancy: req.body.maxoccupancy,
    occupants: req.body.occupants,
    additionalnotes: req.body.additionalnotes
    }
}
//routes=======================================================================

// api ---------------------------------------------------------------------

// registree api -------------------------------------------------------------
// create a registree, information comes from AJAX request from Angular
app.post('/api/registree', function (req, res) {
 
    Registree.create(getReqParamsRegistree(req), function (err,registree) {

        if (err) {
            res.send(err);
        }else{
            res.send(registree._id); //send registree._id for mainregistree updating purposes
        }
    
    });

});

// get a list of all the registrees
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

// find registree by id :mainregistreeid, passed as url argument in request
app.get('/api/mainregistree/:mainregistreeid', function(req,res){
    Registree.find({mainregistreeid: req.params.mainregistreeid},function(err, registrees){
        res.json(registrees);
    });
});


// delete a registree matching with registree_id in request
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
});


//update a registree matching with registree_id in request
app.put('/api/registree/:registree_id', (req, res) => {
    Registree.findByIdAndUpdate(req.params.registree_id, getReqParamsRegistree(req)
    ,(err, registree) => {
            if (err) {
                console.log(" PUT error :", err);
                res.send(err);
               
            } else{
                // console.log("Registree Updated:", registree)
            }
        }
    );
});

//room api -----------------------------------------------------------------
        //create a room
app.post('/api/room', function (req,res){
    Room.create(getReqParamsRoom(req), function(err,room){
        if (err){

        }else{
            res.send(room);
        }
    });
});

// get a list of all the registrees
        //retrieve all rooms
app.get('/api/room/', function (req, res) {
    Room.find(function (err, rooms) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(rooms);
        }
    });
});

// delete a room matching with room_id in request
app.delete('/api/room/:room_id', function (req, res) {
    Room.remove({_id: req.params.room_id}, 
        function (err, room){
        if (err)
            res.send(err);
        Room.find((err, rooms) => {
            if (err){
                res.send(err);
            }
            res.json(rooms);
        });
    });
});


//update a room matching with room_id in request
app.put('/api/room/:room_id', (req, res) =>{
    Room.findOneAndUpdate({_id:req.params.room_id}, getReqParamsRoom(req), 
    function (err, room) {
            if (err) {
                res.send(err);
               
            } else{
            }
        }
    );
});

// application -------------------------------------------------------------

app.get('/',function(req,res){
    res.sendfile('./public/form/form.html');
})

app.get('/api/table', function(req,res){
    res.sendfile('./public/table/table.html')
})
app.get('/scripts/:script', (req,res) => {
    res.sendfile('./public/scripts/'+req.params.script);
})

app.get('/form', function (req, res) {
    res.sendfile('./public/form/form.html'); 
    // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/housing', function (req, res){
    res.sendfile('./public/housing/housing.html');
})

app.get('/thapp', function(req,res){
    res.sendfile('./public/table/tableandhousing.html')
})



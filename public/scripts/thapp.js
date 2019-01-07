class Registree{
    constructor(){
        this.mainregistree,this.name,this.formsubmittime,this.age,this.email,this.newcomer,this.address,this.ssegroup,this.ya,this.gender,this.phone,this.center,this.durationofstay,this.accommmodation,this.dietaryrestrictions,this.specialaccommodations,this.checkintime,this.checkouttime,this.paid,this.amountpaid = '',this.room,this.bhajanlist;
    }
  }
  class Room{
    constructor(){
      this.roomnumber,this.floornumber,this.building,this.handicap,this.beds,this.maxoccupancy,this.occupants=0,this.additionalnotes;
    }
  }
  
  
 
  
  var thapp = angular.module("thApp", ["ngMaterial"]);
  
  thapp.controller("HousingAppController", function($scope,$http,$mdDialog) {
    $scope.rooms = [];
    // $scope.roomschema = ["Room Number","Floor Number","Building Name","Handicap","Amount of Beds","Max Occupancy","Current Occupants"]
    $scope.roomschema = [
      { name: "Room Number", propertyname: "roomnumber", show: true},
      { name: "Floor Number", propertyname: "floornumber", show: true },
      { name: "Building Name", propertyname: "building", show: true },
      { name: "Handicap", propertyname: "handicap", show: true },
      { name: "Amount of Beds", propertyname: "beds", show: true },
      { name: "Max Occupancy", propertyname: "maxoccoupancy", show: true },
      { name: "Current Occupants", propertyname: "occupants", show: true },
      { name: "Additional Notes", propertyname: "additionalnotes", show:true }
    ];
    $scope.CSVFile = undefined;
    $scope.editingRoom = new Room();
    $scope.search = {}
  
    //FileReader Input
    const input = document.querySelector('#registrationUpload');
    input.addEventListener('change',function(e){
      var reader = new FileReader()
      reader.onload = function(){
        $scope.importData = CSVToJSONConvertor(reader.result);
        
      }
      reader.readAsText(input.files[0])
      
    },false);
    
    //====Room CRUD===
  
    $scope.getRooms = function() {
      $http.get("/api/room").then(function(res) {
        $scope.rooms = res.data;
      });
    };

    $scope.createRoom = function(createdRoom){
      $http.post('/api/room', createdRoom);
      $scope.getRooms();
    }
  
    $scope.editRoom = function(editedRoom) {
      $http.put("/api/room/" + editedRoom._id, editedRoom)
        .then(function(res) {
        });
      
    };
  
    $scope.deleteRoom = function(id) {
      $http.delete("/api/room/" + id);
      $scope.getRooms();
    };
    //====Modal===
  
    $scope.showEditBox = function(editingRoom) {
      $scope.editingRoom = editingRoom;
     }

     $scope.showImportBox = function(event){
      $mdDialog.show(
        {
          contentElement: "#importHousingDialog",
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: false,
          fullscreen: $scope.customFullScreen
        });
    }
   
    //==JSON to CSV==
    $scope.downloadData = function(){
      $http.get('/api/room').then(function(data){
         JSONToCSVConvertor(data.data,"Regional Retreat Room Report", true);
      });
    };

    //===Import and Upload
    $scope.importAndUpload = function(){
      let locData = $scope.importData;
      for (let i = 1; i < locData.length; i++){
        let room = locData[i];
        if (room._id == undefined){
          console.log(room);
          $scope.createRoom(room);
        }else {
          $scope.editRoom(room);
        }

      }
    }
    
  
   
    
  });

  thapp.controller("TableAppController", function($scope,$http,$mdDialog) {
  
    $scope.registrees = [];
    // $scope.registreeschema = ["Main Registree","Name", "Age", "Email", "SSE Group", "YA", "Gender", "Phone Number", "Center", "Center Address", "Stay Duration", "Accomodation", "Dietary Restrictions", "Special Accommodations"]
    $scope.registreeschema = [
      { name: "Main Registree Id", propertyname: "mainregistreeid", show: true},
      { name: "Main Registree", propertyname: "mainregistree", show: true },
      { name: "Name", propertyname: "name", show: true },
      { name: "Form Submit Time", propertyname: "formsubmittime", show: true },
      { name: "Age", propertyname: "age", show: true },
      { name: "Email", propertyname: "email", show: true },
      { name: "New Comer", propertyname: "newcomer", show: true },
      { name: "Address", propertyname: "address", show: true },
      { name: "SSE Group", propertyname: "ssegroup", show: true },
      { name: "YA", propertyname: "ya", show: true },
      { name: "Gender", propertyname: "gender", show: true },
      { name: "Phone Number", propertyname: "phone", show: true },
      { name: "Center", propertyname: "centername", show: true },
      { name: "Stay Duration", propertyname: "durationofstay", show: true },
      { name: "Accommodation", propertyname: "accommodation", show: true },
      { name: "Dietary Restrictions", propertyname: "dietaryrestrictions", show: true },
      { name: "Special Accommodations", propertyname: "specialaccommodations", show: true },
      { name: "Check In Time", propertyname: "checkintime", show: true},
      { name: "Check Out Time", propertyname: "checkouttime", show: true},
      { name: "Paid?", propertyname: "paid", show: true},
      { name: "Amount Paid", propertyname:"amountpaid", show: true},
      { name: "Room", propertyname:"room", show: true},
      { name: "Bhajans", propertyname:"bhajanlist", show: true}
    ];
    $scope.editingRegistree = new Registree();
    $scope.search = {}
    $scope.rooms = [];
    $scope.family = [];
    $scope.selectedFamily = [];
  
    $scope.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };
  
    const input = document.querySelector('#housingUpload');
    input.addEventListener('change',function(e){
      var reader = new FileReader()
      reader.onload = function(){
        $scope.importData = CSVToJSONConvertor(reader.result);
        
      }
      reader.readAsText(input.files[0])
      
    },false);

    $scope.propertytostring = function(propertyname, content) {
      if (content == undefined){
        return "";
      }
      switch (propertyname) {
        case "formsubmittime":
          let date = new Date(content);
          return date.toLocaleString();
          break;
        case "newcomer":
          if (content){
            return "Yes - This is my first time at Sailent Retreat";
          } else {
            return "No - I have not attended before";
          }
          break;
        case "ya":
        case "accommodation":
          if (content) {
            return "Yes";
          } else return "No";
          break;
        case "durationofstay":
          if (!content) {
            return "";
          }
          let staylength = 0;
          durationString = new String();
          if (content["friday"]) {
            durationString += "Friday, ";
            staylength++;
          }
          if (content["saturday"]) {
            durationString += "Saturday, ";
            staylength++;
          }
          if (content["sunday"]) {
            durationString += "Sunday, ";
            staylength++;
          }
          durationString =
            "(" +
            staylength +
            " days): " +
            durationString.substring(0, durationString.length - 2);
          return durationString;
          break;
        case "amountpaid":
          return "$"+content;
          break;
        case "room":
          return content.roomnumber;
          break;
        default:
          if (content == "") {
            return "--";
          }
          return content;
      }
    };
  
      //=======REGISTREE CRUD ============
    $scope.getRegistrees = function() {
      $http.get("/api/registree").then(res => {
        $scope.registrees = res.data;
      });
    };
  
    $scope.createRegistree = function(createdRegistree){
      $http.post('/api/registree', createdRegistree);
      $scope.getRegistrees();
    }
  
    $scope.editRegistree = function(editedRegistree) {
      $http.put("/api/registree/" + editedRegistree._id, editedRegistree)
      
    };
  
    $scope.deleteRegistree = function(id) {
      $http.delete("/api/registree/" + id);
      $scope.getRegistrees();
    };
  
    //=======modal Dialog Controllers=========
  
    $scope.showEditBox = function(event, editingregistree) {
      $scope.editingRegistree = editingregistree;
    };
  
    $scope.showCheckinBox = function (event, registree){
      $mdDialog.show(
        {
          contentElement: "#checkinDialog",
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: false,
          fullscreen:$scope.customFullScreen
  
        });
      if (registree.mainregistree = ''){
        getFamily(registree);
      }
      $scope.editingRegistree = registree;
    }
  
    $scope.closeCheckinBox = function(){
      $mdDialog.hide({
        contentElement:"#checkinDialog"
      })
    }
  
    $scope.showMoneyBox = function(event, registree){
      $mdDialog.show(
        {
          contentElement: "#moneyDialog",
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: false,
          fullscreen: $scope.customFullScreen
        });
        $scope.editingRegistree = registree;
    }
  
    $scope.closeMoneyBox = function(){
      $mdDialog.hide({
        contentElement:"#moneyDialog"
      })
    }
  
    $scope.showHousingBox = function(event, registree){
      $mdDialog.show(
        {
          contentElement: "#housingDialog",
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: false,
          fullscreen: $scope.customFullScreen 
        });
      $scope.selectedFamily = [];
      $scope.editingRegistree = registree;
      $scope.getFamily(registree);
    }

    $scope.showImportBox = function(event){
      $mdDialog.show(
        {
          contentElement: "#importRegistrationDialog",
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: false,
          fullscreen: $scope.customFullScreen
        });
    }
  
    //======Assistant functions for modal dialogs======
  
    //update $scope.rooms list from database
    $scope.getRooms = function() {
      $http.get("/api/room").then(function(res) {
        $scope.rooms = res.data;
      });
    }
    //update occupants in $scope.rooms and also update Registrees.room data
    $scope.assignRoom = function(room){
      for (let i = 0; i < $scope.selectedFamily.length; i++){
        // let id = $scope.selectedFamily[i]._id;
        if ($scope.selectedFamily[i].room != undefined){
        // console.log("REMOVING FAMILY MEMBER");
        //remove family member from current room
        let currentRoom = searchID($scope.selectedFamily[i].room._id, $scope.rooms);
        $scope.rooms[$scope.rooms.indexOf(currentRoom)].occupants--;
        // console.log("Removing" + $scope.selectedFamily[i] + " from Room " + currentRoom);
        }
      let newRoom = searchID(room._id,$scope.rooms);
      $scope.rooms[$scope.rooms.indexOf(newRoom)].occupants++;
      $scope.selectedFamily[i].room =$scope.rooms[$scope.rooms.indexOf(newRoom)];
  
      }
    }
    
    //debugging print method for HTML console printing button
    $scope.print = function(x){
      console.log(x);
      //console.log($scope.rooms);
    }
  
    //update room assignments with DB (currently PUTS all rooms, not just ones edited, can be optimized)
    $scope.updateRooms = function(){
      for (let i = 0; i < $scope.selectedFamily.length;i++){
          $scope.editRegistree($scope.selectedFamily[i]);
      }
      for (let j = 0; j < $scope.rooms.length; j++){
          $scope.updateRoom($scope.rooms[j]);
        }
  
    }
  
    //$http.put(/api/room), updates room with DB
    $scope.updateRoom = function(editedRoom){
      // console.log(editedRoom);
      $http.put("/api/room/" + editedRoom._id, editedRoom);
        
    }
    
    //Updates registree.checkintime and PUT in DB
    $scope.checkInRegistree = function (registree) {
      registree.checkintime = new Date(Date.now()).toLocaleString();
      $http.put('/api/registree/'+registree._id,registree).then(function(res){
      })
    }
  
    //Updates registree.checkouttime and PUT in DB
    $scope.checkOutRegistree = function (registree) {
      registree.checkouttime = new Date(Date.now()).toLocaleString();
      $http.put('/api/registree/'+registree._id,registree).then(function(res){
      });
    }
  
    //refreshes family list, then checks out all in family
    $scope.checkOutFamily = function(registree,mainregistreeid){
      $scope.getFamily(registree);
      for (let i = 0; i < $scope.family.length; i++){
        $scope.checkOutRegistree($scope.family[i]);
      }
    }
  
    //refreshses family list, then checks in all in family
    $scope.checkInFamily = function(registree){
      $scope.getFamily(registree);
      for (let i = 0; i < $scope.family.length; i++){
        $scope.checkInRegistree($scope.family[i]);
      }
    }
  
    //Simple PUT for money and closeMoneyBox();
    $scope.moneyRegistree = function(registree) {
      $http.put('/api/registree/'+registree._id,registree).then(function(res){
      });
      $scope.closeMoneyBox();
    }
    
    //refreshes family list by looking up through local list with current registrees
    $scope.getFamily = function(parent){
      $scope.family=[];
      $scope.family.push(parent);   
      for (let index = 0; index < $scope.registrees.length; index++){
        if ($scope.registrees[index].mainregistreeid == parent._id){
          $scope.family.push($scope.registrees[index]);
        }
      }
    }
  
    //downloads data to CSV, uses JSONToCSVConverter()
    $scope.downloadData = function(){
      $http.get('/api/registree').then(function(data){
        // console.log("Testing download data function \n" + JSON.stringify(data.data));
        // JSONToTSVConvertor(data,"Test report", true,"Testdata");
         JSONToCSVConvertor(data.data,"Regional Retreat Registrees Report", true);
      });
    };

    
    $scope.importAndUpload = function(){
      let locData = $scope.importData;
      for (let i = 1; i < locData.length; i++){
        let room = locData[i];
        if (room._id == undefined){
          console.log(room);
          $scope.createRoom(room);
        }else {
          $scope.editRoom(room);
        }

      }
    }
    
  });
  
  //======GLOBAL functions=======
  
  //Searches for _id in DBlist
  function searchID(_id,list){
    for (let i = 0; i < list.length; i++){
      if (list[i]._id == _id){
        return list[i];
      }
    }
    return undefined;
  }
  
  //replaces all occurences of replacement in search
  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };
  //Turns JSON data into CSV Data
  function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line
    
    CSV += ReportTitle + '\r\n\n';
  
    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }
  
        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            // console.log(index + JSON.stringify(arrData[i][index]).replace(",", " "));  
            row += '' + JSON.stringify(arrData[i][index]).replaceAll(",", " ") + ',';
        }
  
        row.slice(0, row.length - 1);
        
        //add a line break after each row
        CSV += row + '\r\n';
    }
  
    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = ReportTitle.replace(/ /g,"_");
    //this will remove the blank-spaces from the title and replace it with an underscore    
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function CSVToJSONConvertor(readerResult){
    let parsedFile = Papa.parse(readerResult).data;
    console.log(parsedFile);
    parsedFile.splice(parsedFile.length-1,1);
    let headers = parsedFile[1];
    let result = [];
    // headers.splice(headers.indexOf('__v'),1);headers.splice(headers.indexOf('_id'),1);
    result.push(headers);
    for (let i = 2; i < parsedFile.length; i++){
      let newObj = {};
      for (let h = 0; h < headers.length; h++){
        let newHeader = headers[h].replace(/[^a-z0-9_]/gi,'') //remove non-alphanumeric characters + non-_
        newObj[newHeader] = parsedFile[i][h].toLowerCase();
      }
      result.push(newObj);
      console.log(newObj);
    }
    console.log(result);
    return result;
  }
  
  //Papa CSV to JSON
!function(e,t){"function"==typeof define&&define.amd?define([],t):"object"==typeof module&&"undefined"!=typeof exports?module.exports=t():e.Papa=t()}(this,function s(){"use strict";var f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{};var n=!f.document&&!!f.postMessage,o=n&&/blob:/i.test((f.location||{}).protocol),a={},h=0,k={parse:function(e,t){var r=(t=t||{}).dynamicTyping||!1;M(r)&&(t.dynamicTypingFunction=r,r={});if(t.dynamicTyping=r,t.transform=!!M(t.transform)&&t.transform,t.worker&&k.WORKERS_SUPPORTED){var i=function(){if(!k.WORKERS_SUPPORTED)return!1;var e=(r=f.URL||f.webkitURL||null,i=s.toString(),k.BLOB_URL||(k.BLOB_URL=r.createObjectURL(new Blob(["(",i,")();"],{type:"text/javascript"})))),t=new f.Worker(e);var r,i;return t.onmessage=g,t.id=h++,a[t.id]=t}();return i.userStep=t.step,i.userChunk=t.chunk,i.userComplete=t.complete,i.userError=t.error,t.step=M(t.step),t.chunk=M(t.chunk),t.complete=M(t.complete),t.error=M(t.error),delete t.worker,void i.postMessage({input:e,config:t,workerId:i.id})}var n=null;k.NODE_STREAM_INPUT,"string"==typeof e?n=t.download?new l(t):new p(t):!0===e.readable&&M(e.read)&&M(e.on)?n=new _(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new c(t));return n.stream(e)},unparse:function(e,t){var i=!1,g=!0,m=",",v="\r\n",n='"',r=!1;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||k.BAD_DELIMITERS.filter(function(e){return-1!==t.delimiter.indexOf(e)}).length||(m=t.delimiter);("boolean"==typeof t.quotes||Array.isArray(t.quotes))&&(i=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(r=t.skipEmptyLines);"string"==typeof t.newline&&(v=t.newline);"string"==typeof t.quoteChar&&(n=t.quoteChar);"boolean"==typeof t.header&&(g=t.header)}();var s=new RegExp(n,"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return o(null,e,r);if("object"==typeof e[0])return o(a(e[0]),e,r)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:a(e.data[0])),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),o(e.fields||[],e.data||[],r);throw new Error("Unable to serialize unrecognized input");function a(e){if("object"!=typeof e)return[];var t=[];for(var r in e)t.push(r);return t}function o(e,t,r){var i="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&g){for(var a=0;a<e.length;a++)0<a&&(i+=m),i+=y(e[a],a);0<t.length&&(i+=v)}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(r&&!n&&(u="greedy"===r?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===r&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c])}u=""===d.join("").trim()}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(i+=m);var _=n&&s?e[p]:p;i+=y(t[o][_],p)}o<t.length-1&&(!r||0<h&&!f)&&(i+=v)}}return i}function y(e,t){if(null==e)return"";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);e=e.toString().replace(s,n+n);var r="boolean"==typeof i&&i||Array.isArray(i)&&i[t]||function(e,t){for(var r=0;r<t.length;r++)if(-1<e.indexOf(t[r]))return!0;return!1}(e,k.BAD_DELIMITERS)||-1<e.indexOf(m)||" "===e.charAt(0)||" "===e.charAt(e.length-1);return r?n+e+n:e}}};if(k.RECORD_SEP=String.fromCharCode(30),k.UNIT_SEP=String.fromCharCode(31),k.BYTE_ORDER_MARK="\ufeff",k.BAD_DELIMITERS=["\r","\n",'"',k.BYTE_ORDER_MARK],k.WORKERS_SUPPORTED=!n&&!!f.Worker,k.NODE_STREAM_INPUT=1,k.LocalChunkSize=10485760,k.RemoteChunkSize=5242880,k.DefaultDelimiter=",",k.Parser=b,k.ParserHandle=r,k.NetworkStreamer=l,k.FileStreamer=c,k.StringStreamer=p,k.ReadableStreamStreamer=_,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var r=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return!0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},r)})}),e(),this;function e(){if(0!==h.length){var e,t,r,i,n=h[0];if(M(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,r=n.inputElem,i=s.reason,void(M(o.error)&&o.error({name:e},t,r,i));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config))}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){M(a)&&a(e,n.file,n.inputElem),u()},k.parse(n.file,n.instanceConfig)}else M(o.complete)&&o.complete()}function u(){h.splice(0,1),e()}}}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=E(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new r(t),(this._handle.streamer=this)._config=t}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&M(this._config.beforeFirstChunk)){var r=this._config.beforeFirstChunk(e);void 0!==r&&(e=r)}this.isFirstChunk=!1;var i=this._partialLine+e;this._partialLine="";var n=this._handle.parse(i,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=i.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:k.WORKER_ID,finished:a});else if(M(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return;n=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!M(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}},this._sendError=function(e){M(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:k.WORKER_ID,error:e,finished:!1})}}function l(e){var i;(e=e||{}).chunkSize||(e.chunkSize=k.RemoteChunkSize),u.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(i=new XMLHttpRequest,this._config.withCredentials&&(i.withCredentials=this._config.withCredentials),n||(i.onload=w(this._chunkLoaded,this),i.onerror=w(this._chunkError,this)),i.open("GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)i.setRequestHeader(t,e[t])}if(this._config.chunkSize){var r=this._start+this._config.chunkSize-1;i.setRequestHeader("Range","bytes="+this._start+"-"+r)}try{i.send()}catch(e){this._chunkError(e.message)}n&&0===i.status?this._chunkError():this._start+=this._config.chunkSize}},this._chunkLoaded=function(){4===i.readyState&&(i.status<200||400<=i.status?this._chunkError():(this._finished=!this._config.chunkSize||this._start>function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return-1;return parseInt(t.substr(t.lastIndexOf("/")+1))}(i),this.parseChunk(i.responseText)))},this._chunkError=function(e){var t=i.statusText||e;this._sendError(new Error(t))}}function c(e){var i,n;(e=e||{}).chunkSize||(e.chunkSize=k.LocalChunkSize),u.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((i=new FileReader).onload=w(this._chunkLoaded,this),i.onerror=w(this._chunkError,this)):i=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t)}var r=i.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:r}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(i.error)}}function p(e){var r;u.call(this,e=e||{}),this.stream=function(e){return r=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?r.substr(0,e):r;return r=e?r.substr(e):"",this._finished=!r,this.parseChunk(t)}}}function _(e){u.call(this,e=e||{});var t=[],r=!0,i=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){i&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):r=!0},this._streamData=w(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),r&&(r=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}},this),this._streamError=w(function(e){this._streamCleanUp(),this._sendError(e)},this),this._streamEnd=w(function(){this._streamCleanUp(),i=!0,this._streamData("")},this),this._streamCleanUp=w(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function r(g){var a,o,h,i=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,n=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,r=0,s=0,u=!1,e=!1,f=[],d={data:[],errors:[],meta:{}};if(M(g.step)){var l=g.step;g.step=function(e){if(d=e,p())c();else{if(c(),0===d.data.length)return;r+=e.data.length,g.preview&&r>g.preview?o.abort():l(d,t)}}}function m(e){return"greedy"===g.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function c(){if(d&&h&&(v("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+k.DefaultDelimiter+"'"),h=!1),g.skipEmptyLines)for(var e=0;e<d.data.length;e++)m(d.data[e])&&d.data.splice(e--,1);return p()&&function(){if(!d)return;for(var e=0;p()&&e<d.data.length;e++)for(var t=0;t<d.data[e].length;t++){var r=d.data[e][t];M(g.transformHeader)&&(r=g.transformHeader(r)),f.push(r)}d.data.splice(0,1)}(),function(){if(!d||!g.header&&!g.dynamicTyping&&!g.transform)return d;for(var e=0;e<d.data.length;e++){var t,r=g.header?{}:[];for(t=0;t<d.data[e].length;t++){var i=t,n=d.data[e][t];g.header&&(i=t>=f.length?"__parsed_extra":f[t]),g.transform&&(n=g.transform(n,i)),n=_(i,n),"__parsed_extra"===i?(r[i]=r[i]||[],r[i].push(n)):r[i]=n}d.data[e]=r,g.header&&(t>f.length?v("FieldMismatch","TooManyFields","Too many fields: expected "+f.length+" fields but parsed "+t,s+e):t<f.length&&v("FieldMismatch","TooFewFields","Too few fields: expected "+f.length+" fields but parsed "+t,s+e))}g.header&&d.meta&&(d.meta.fields=f);return s+=d.data.length,d}()}function p(){return g.header&&0===f.length}function _(e,t){return r=e,g.dynamicTypingFunction&&void 0===g.dynamicTyping[r]&&(g.dynamicTyping[r]=g.dynamicTypingFunction(r)),!0===(g.dynamicTyping[r]||g.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(i.test(t)?parseFloat(t):n.test(t)?new Date(t):""===t?null:t):t;var r}function v(e,t,r,i){d.errors.push({type:e,code:t,message:r,row:i})}this.parse=function(e,t,r){var i=g.quoteChar||'"';if(g.newline||(g.newline=function(e,t){e=e.substr(0,1048576);var r=new RegExp(y(t)+"([^]*?)"+y(t),"gm"),i=(e=e.replace(r,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<i[0].length;if(1===i.length||s)return"\n";for(var a=0,o=0;o<i.length;o++)"\n"===i[o][0]&&a++;return a>=i.length/2?"\r\n":"\r"}(e,i)),h=!1,g.delimiter)M(g.delimiter)&&(g.delimiter=g.delimiter(e),d.meta.delimiter=g.delimiter);else{var n=function(e,t,r,i){for(var n,s,a,o=[",","\t","|",";",k.RECORD_SEP,k.UNIT_SEP],h=0;h<o.length;h++){var u=o[h],f=0,d=0,l=0;a=void 0;for(var c=new b({comments:i,delimiter:u,newline:t,preview:10}).parse(e),p=0;p<c.data.length;p++)if(r&&m(c.data[p]))l++;else{var _=c.data[p].length;d+=_,void 0!==a?1<_&&(f+=Math.abs(_-a),a=_):a=_}0<c.data.length&&(d/=c.data.length-l),(void 0===s||f<s)&&1.99<d&&(s=f,n=u)}return{successful:!!(g.delimiter=n),bestDelimiter:n}}(e,g.newline,g.skipEmptyLines,g.comments);n.successful?g.delimiter=n.bestDelimiter:(h=!0,g.delimiter=k.DefaultDelimiter),d.meta.delimiter=g.delimiter}var s=E(g);return g.preview&&g.header&&s.preview++,a=e,o=new b(s),d=o.parse(a,t,r),c(),u?{meta:{paused:!0}}:d||{meta:{paused:!1}}},this.paused=function(){return u},this.pause=function(){u=!0,o.abort(),a=a.substr(o.getCharIndex())},this.resume=function(){u=!1,t.streamer.parseChunk(a,!0)},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),d.meta.aborted=!0,M(g.complete)&&g.complete(d),a=""}}function y(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function b(e){var S,O=(e=e||{}).delimiter,x=e.newline,I=e.comments,D=e.step,T=e.preview,L=e.fastMode,A=S=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(A=e.escapeChar),("string"!=typeof O||-1<k.BAD_DELIMITERS.indexOf(O))&&(O=","),I===O)throw new Error("Comment character same as delimiter");!0===I?I="#":("string"!=typeof I||-1<k.BAD_DELIMITERS.indexOf(I))&&(I=!1),"\n"!==x&&"\r"!==x&&"\r\n"!==x&&(x="\n");var F=0,z=!1;this.parse=function(i,r,t){if("string"!=typeof i)throw new Error("Input must be a string");var n=i.length,e=O.length,s=x.length,a=I.length,o=M(D),h=[],u=[],f=[],d=F=0;if(!i)return C();if(L||!1!==L&&-1===i.indexOf(S)){for(var l=i.split(x),c=0;c<l.length;c++){if(f=l[c],F+=f.length,c!==l.length-1)F+=x.length;else if(t)return C();if(!I||f.substr(0,a)!==I){if(o){if(h=[],k(f.split(O)),R(),z)return C()}else k(f.split(O));if(T&&T<=c)return h=h.slice(0,T),C(!0)}}return C()}for(var p,_=i.indexOf(O,F),g=i.indexOf(x,F),m=new RegExp(A.replace(/[-[\]/{}()*+?.\\^$|]/g,"\\$&")+S,"g");;)if(i[F]!==S)if(I&&0===f.length&&i.substr(F,a)===I){if(-1===g)return C();F=g+s,g=i.indexOf(x,F),_=i.indexOf(O,F)}else if(-1!==_&&(_<g||-1===g))f.push(i.substring(F,_)),F=_+e,_=i.indexOf(O,F);else{if(-1===g)break;if(f.push(i.substring(F,g)),w(g+s),o&&(R(),z))return C();if(T&&h.length>=T)return C(!0)}else for(p=F,F++;;){if(-1===(p=i.indexOf(S,p+1)))return t||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:F}),E();if(p===n-1)return E(i.substring(F,p).replace(m,S));if(S!==A||i[p+1]!==A){if(S===A||0===p||i[p-1]!==A){var v=b(-1===g?_:Math.min(_,g));if(i[p+1+v]===O){f.push(i.substring(F,p).replace(m,S)),F=p+1+v+e,_=i.indexOf(O,F),g=i.indexOf(x,F);break}var y=b(g);if(i.substr(p+1+y,s)===x){if(f.push(i.substring(F,p).replace(m,S)),w(p+1+y+s),_=i.indexOf(O,F),o&&(R(),z))return C();if(T&&h.length>=T)return C(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:F}),p++}}else p++}return E();function k(e){h.push(e),d=F}function b(e){var t=0;if(-1!==e){var r=i.substring(p+1,e);r&&""===r.trim()&&(t=r.length)}return t}function E(e){return t||(void 0===e&&(e=i.substr(F)),f.push(e),F=n,k(f),o&&R()),C()}function w(e){F=e,k(f),f=[],g=i.indexOf(x,F)}function C(e,t){return{data:t||!1?h[0]:h,errors:u,meta:{delimiter:O,linebreak:x,aborted:z,truncated:!!e,cursor:d+(r||0)}}}function R(){D(C(void 0,!0)),h=[],u=[]}},this.abort=function(){z=!0},this.getCharIndex=function(){return F}}function g(e){var t=e.data,r=a[t.workerId],i=!1;if(t.error)r.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){i=!0,m(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:v,resume:v};if(M(r.userStep)){for(var s=0;s<t.results.data.length&&(r.userStep({data:[t.results.data[s]],errors:t.results.errors,meta:t.results.meta},n),!i);s++);delete t.results}else M(r.userChunk)&&(r.userChunk(t.results,n,t.file),delete t.results)}t.finished&&!i&&m(t.workerId,t.results)}function m(e,t){var r=a[e];M(r.userComplete)&&r.userComplete(t),r.terminate(),delete a[e]}function v(){throw new Error("Not implemented.")}function E(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var r in e)t[r]=E(e[r]);return t}function w(e,t){return function(){e.apply(t,arguments)}}function M(e){return"function"==typeof e}return o&&(f.onmessage=function(e){var t=e.data;void 0===k.WORKER_ID&&t&&(k.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:k.WORKER_ID,results:k.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var r=k.parse(t.input,t.config);r&&f.postMessage({workerId:k.WORKER_ID,results:r,finished:!0})}}),(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(_.prototype=Object.create(u.prototype)).constructor=_,k});
  
  
  



  
  
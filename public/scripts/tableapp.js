class Registree{
  constructor(){
      this.mainregistree,this.name,this.formsubmittime,this.age,this.email,this.newcomer,this.address,this.ssegroup,this.ya,this.gender,this.phone,this.center,this.durationofstay,this.accommmodation,this.dietaryrestrictions,this.specialaccommodations,this.checkintime,this.checkouttime,this.paid,this.amountpaid = '',this.room;
  }
}
var tableapp = angular.module("tableApp", ["ngMaterial"]);

tableapp.controller("TableAppController", function($scope,$http,$mdDialog) {

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
    { name: "Room", propertyname:"room", show: true}
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

    // let roomAssignments = $scope.rooms; //{_id:02340234, occupants:[Raj,Sree]}
    // let indices = [];
    // for (let i = 0; i < $scope.selectedFamily.length;i++){
    //   $scope.editRegistree($scope.selectedFamily[i]);
    //   let roomid = $scope.selectedFamily[i].room._id;
    //   let filteredroom = roomAssignments.filter(function(assignment){
    //     if (assignment._id == roomid){
    //       return true;
    //     }
    //     else return false;
    //   })
    //   indices.push(roomAssignments.indexOf(filteredroom[0]));
    //   console.log(roomAssignments[roomAssignments.indexOf(filteredroom[0])].occupants)
    //   roomAssignments[roomAssignments.indexOf(filteredroom[0])].occupants.push($scope.selectedFamily[i]);
    // }
    // for (let j = 0; j < indices.length; j++){
    //   console.log("Updating " + roomAssignments[indices[j]]);
    //   updateRoom(roomAssignments[indices[j]]);
    // }
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




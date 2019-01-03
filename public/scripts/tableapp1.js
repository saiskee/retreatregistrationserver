class Registree{
  constructor(){
      this.mainregistree,this.name,this.formsubmittime,this.age,this.email,this.newcomer,this.address,this.ssegroup,this.ya,this.gender,this.phone,this.center,this.durationofstay,this.accommmodation,this.dietaryrestrictions,this.specialaccommodations,this.checkintime,this.checkouttime,this.paid,this.amountpaid = '';
  }
}
var tableapp = angular.module("tableApp", ["ngMaterial"]);

tableapp.controller("TableAppController", function(
  $scope,
  $http,
  $mdDialog
) {
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
    { name: "Amount Paid", propertyname:"amountpaid", show: true}
  ];

  $scope.editingRegistree = new Registree();
  $scope.search = {}
  $scope.propertytostring = function(propertyname, content) {
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
      default:
        if (content == "") {
          return "--";
        }
        return content;
    }
  };

  $scope.getRegistrees = function() {
    $http.get("/api/registree").then(res => {
      $scope.registrees = res.data;
    });
  };


  $scope.showEditBox = function(event, editingregistree) {
    $scope.editingRegistree = editingregistree;
    console.log(editingregistree);
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
    $scope.editingRegistree = registree;
  }

  $scope.closeCheckinBox = function(){
    $mdDialog.hide({
      contentElement:"checkinDialog"
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


  $scope.showHousingBox = function(event, registree){
    $mdDialog.show(
      {
        contentElement: "#housingDialog",
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: false,
        fullscreen: $scope.customFullScreen 
      });
      
    $scope.editingRegistree = registree;
  }

  $scope.checkInRegistree = function (registree) {
    registree.checkintime = new Date(Date.now()).toLocaleString();
    $http.put('/api/registree/'+registree._id,registree).then(function(res){
      console.log("Checked in registree:", res)
    })
  }

  $scope.checkOutRegistree = function (registree) {
    registree.checkouttime = new Date(Date.now()).toLocaleString();
    $http.put('/api/registree/'+registree._id,registree).then(function(res){
      console.log("Checked in registree:", res)
    });
  }
  $scope.checkOutFamily = function(registree,mainregistreeid){
    $http.get('/api/mainregistree/'+mainregistreeid).then(function(res){
      for (let i = 0; i < res.data.length; i++){
        $scope.checkOutRegistree(res.data[i]);
      }
      $scope.checkOutRegistree(registree);
      
    })
  }
  $scope.checkInFamily = function(registree,mainregistreeid){
    $http.get('/api/mainregistree/'+mainregistreeid).then(function(res){
      for (let i = 0; i < res.data.length; i++){
        $scope.checkInRegistree(res.data[i]);
      }
      $scope.checkInRegistree(registree);
      
    })
  }

  $scope.moneyRegistree = function(registree) {
    $http.put('/api/registree/'+registree._id,registree).then(function(res){
      console.log("Money Updated registree:", res)
    });
    $scope.closeMoneyBox();
  }


  $scope.downloadData = function(){
    $http.get('/api/registree').then(function(data){
      console.log("Testing download data function \n" + JSON.stringify(data.data));
      // JSONToTSVConvertor(data,"Test report", true,"Testdata");
       JSONToCSVConvertor(data.data,"Regional Retreat Registrees Report", true);
    });
  };

  $scope.createRegistree = function(createdRegistree){
    $http.post('/api/registree', createdRegistree);
    $scope.getRegistrees();
  }

  $scope.editRegistree = function(editedRegistree) {
    $http
      .put("/api/registree/" + editedRegistree._id, editedRegistree)
      .then(function(res) {

        console.log("Edited Registree: ",res);
      });
    
  };

  $scope.deleteRegistree = function(id) {
    $http.delete("/api/registree/" + id);
    $scope.getRegistrees();
  };

 
  
});

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
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
 


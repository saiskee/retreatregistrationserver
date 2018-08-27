var tableapp = angular.module("tableApp", ["ngMaterial"]);

tableapp.controller("TableAppController", function(
  $scope,
  $http,
  $mdSidenav,
  $mdDialog
) {
  $scope.registrees = [];
  // $scope.registreeschema = ["Main Registree","Name", "Age", "Email", "SSE Group", "YA", "Gender", "Phone Number", "Center", "Center Address", "Stay Duration", "Accomodation", "Dietary Restrictions", "Special Accommodations"]
  $scope.registreeschema = [
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

  $scope.editingRegistree = {};
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
    $mdDialog.show({
      contentElement: "#editDialog",
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose: false,
      fullscreen: $scope.customFullScreen
    });
    $scope.editingRegistree = editingregistree;
    console.log(editingregistree);
  };
  closeEditBox = () => {
    $mdDialog.hide({
      contentElement: "#editDialog"
    })
  }

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
  closeCheckinBox = function(){
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
  closeMoneyBox = function(){
    $mdDialog.hide({
      contentElement: "#moneyDialog"
    })
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

  $scope.moneyRegistree = function(registree) {
    console.log(registree)
    $http.put('/api/registree/'+registree._id,registree).then(function(res){
      console.log("Money Updated registree:", res)
    });
    closeMoneyBox();
  }

  $scope.toggleLeft = function() {
    $mdSidenav("left").toggle();
  };



  $scope.editRegistree = function(editedRegistree) {
    $http
      .put("/api/registree/" + editedRegistree._id, editedRegistree)
      .then(function(res) {

        console.log("Edited Registree: ",res);
      });
    closeEditBox();
  };

  $scope.deleteRegistree = function(id) {
    $http.delete("/api/registree/" + id).then(function(data) {
      $scope.contacts = data;
    });
    $scope.getRegistrees();
  };
});


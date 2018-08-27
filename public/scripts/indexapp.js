class Registree{
    constructor(){
        this.mainregistree,this.name,this.formsubmittime,this.age,this.email,this.newcomer,this.address,this.ssegroup,this.ya,this.gender,this.phone,this.center,this.durationofstay,this.accommmodation,this.dietaryrestrictions,this.specialaccommodations,this.checkintime,this.checkouttime,this.paid,this.amountpaid = '';
    }
}
var indexapp = angular.module("myApp", ["ngMaterial", "ngMessages"]);

indexapp.controller("ContactController", function($scope, $http) {
  console.clear();
  $scope.registree = new Registree();
  $scope.forms = [];
  $scope.subMembers = [];
  $scope.validateForms = () => {
    for (let i = 0; i < $scope.forms.length; i++) {
      if ($scope.forms[i].$invalid) {
        return false;
      }
    }
    return true;
  };
  $scope.tabSelectedIndex = 0;
  $scope.subMembers = [];
  $scope.addMember = () => {
    $scope.subMembers.push(new Registree());
    $scope.tabSelectedIndex++;
  };
  
  $scope.centers = [
    "None of these",
    "Northborough Center",
    "Boston Center",
    "Stamford Center",
    "Norwalk Center",
    "Shelton Center",
    "Scarsdale Center",
    "Farmington Center",
    "Glastonbury Center",
    "Scarborough Center",
    "Albany Center",
    "Buffalo Center",
    "Rochester Center",
    "Chelmsford Center",
    "Norwood Center",
    "Poughkeepsie Center",
    "Cumberland Center"
    // { centername: "None of these", address: "null" }, // { centername: "Northborough Center", address: "40 Church Street, Northborough, MA 01532" }, // { centername: "Boston Center", address: "6 William Street, Somerville, MA 02144" }, // { centername: "Stamford Center", address: "83 Lockwood Ave., Stamford, CT 06902" }, // { centername: "Norwalk Center", address: "435 Rowayton Ave, Norwalk, CT 06854" }, // { centername: "Shelton Center", address: "2 Brook Pine Drive, Shelton, CT 06484" }, // { centername: "Scarsdale Center", address: "130 River Court, White Plains, NY 10603" }, // { centername: "Farmington Center", address: "1 Serra Dr, Unionville, CT 06085" }, // { centername: "Glastonbury Center", address: "Glastonbury, CT 06025" }, // { centername: "Scarborough Center", address: "Scarborough, ME 04074" }, // { centername: "Albany Center", address: "108 Heartland Drive, Schenectady, NY 12301" }, // { centername: "Buffalo Center", address: "1595 N.French Rd, Getzville, NY 14068" }, // { centername: "Rochester Center", address: "1400 N. Winton Rd, Rochester, NY 14609" }, // { centername: "Chelmsford Center", address: "Chelmsford, MA" }, // { centername: "Norwood Center", address: "150 Chapel St, Norwood, MA 02062" }, // { centername: "Poughkeepsie Center", address: "Poughkeepsie, NY" }, // { centername: "Cumberland Center", address: "25 Apple Ridge Rd, Cumberland, RI 02864" }
  ];

  $scope.saveRegistrees = function(registree) {
    if (registree == null || registree == angular.undefined) return;

    registree.formsubmittime = Date.now();
    console.log(registree);
    $http.post("/api/registree", registree).then(res => {
      /*console.log(res)*/
    });

    for (let i = 0; i < $scope.subMembers.length; i++) {
      $scope.subMembers[i].formsubmittime = Date.now();

      $http.post("/api/registree", $scope.subMembers[i]).then(function(res) {
        //console.log(res);
      });
    }
    $scope.registree = {};
    $scope.subMembers = {};
  };
});

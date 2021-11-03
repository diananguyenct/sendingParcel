locApp = angular.module('angLocApp', []);

locApp.controller('LocationsListController',  function($scope, $http) {

	let host = "http://localhost:8888";
	
	let URL_ALL_LOCS = host + "/getAllLocations";
	let URL_INSERT_LOC = host +  "/insLocation?";
	let URL_UPDATE_LOC = host +  "/updLocation?";
	let URL_DELETE_LOC = host +  "/delLocation?";
    
	$scope.viewFormUpdate = false;
	$scope.locations = [];
			
	$http.get(URL_ALL_LOCS).then(function(response) {
		
      $scope.locations =  response.data;
	  
    });
	
	$scope.newLocation = function() {
		let newRawLoc = {};
		let newLoc ={};
		$http.get(URL_INSERT_LOC + `newAddress=${$scope.newAddress}&newCity=${$scope.newCity}`)
			.then(function (response) {
				newRawLoc = response.data;
				
				newLoc = {"locId": newRawLoc.id, "locAddress": newRawLoc.address, "city": newRawLoc.city};
		
				$scope.locations.push(newLoc);
			});
	}
	
	$scope.showUpdateFormLocation = function(location) {
		$scope.viewFormUpdate = true;
		$scope.updLocId = location.locId;
		$scope.updLocation = angular.copy(location);
	}
	
	$scope.updateLocation = function() {
		let updRawLoc = {};
		let updLoc ={};
		let index;
		
		var add = $scope.updLocation.locAddress;
		var city = $scope.updLocation.locCity;
		
		$http.get(URL_UPDATE_LOC + `updId=${$scope.updLocId}&updAddress=${add}&updCity=${city}`).then(function (response) {
				
			updRawLoc = response.data;
				
			updLoc = {"locId": updRawLoc.id, "locAddress": updRawLoc.address, "locCity": updRawLoc.city};
		
			index = $scope.locations.findIndex(l => l.locId === $scope.updLocId);
			
			if(index !== undefined) {
				$scope.locations[index] = $scope.updLocation;	
			}	
			$scope.viewFormUpdate = false;
		});
	}
	
	$scope.cancelUpdate = function(location) {

		$scope.viewFormUpdate = false;
		$scope.updLocId = undefined;

	}

    $scope.showConfirmDeleteLocation = function(location) {
		let okDelete = false;
		
		$scope.viewFormUpdate = false;
		okDelete = window.confirm("Delete Location : " + location.locAddress + " - " + 	location.locCity + "(" + location.locId + ")");
						
		if(okDelete == true) {
			$http.get(URL_DELETE_LOC + `delId=${location.locId}`).then(function (response) {
				
				index = $scope.locations.findIndex(l => l.locId === location.locId);
				if(index !== undefined) {
					$scope.locations.splice(index, 1);
				}				
		        })
		}
	}

});


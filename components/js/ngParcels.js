locApp = angular.module('angParcelApp', []);

locApp.controller('ParcelListController',  function($scope, $http) {

	let host = "http://localhost:8888";
	
	let URL_ALL_PARCELS = host + "/getAllParcels";
	let URL_INSERT_PARCEL = host +  "/insParcel?";
	let URL_UPDATE_PARCEL = host +  "/updParcel?";
	let URL_DELETE_PARCEL = host +  "/delParcel?";

    let URL_ALL_LOCS = host + "/getAllLocations";
    let URL_ALL_CUSTS = host + "/getAllCustomers";
    
	$scope.viewFormUpdate = false;
    $scope.parcels = [];
	$scope.customers = [];
    $scope.locations = [];
			
	$http.get(URL_ALL_PARCELS).then(function(response) {
		
      $scope.parcels =  response.data;
      console.log($scope.parcels);
      
    });

    $http.get(URL_ALL_LOCS).then(function(response) {
		
        $scope.locations =  response.data;
        
    });

    $http.get(URL_ALL_CUSTS).then(function(response) {
		
        $scope.customers =  response.data;
        
    });
	
    //Create a new parcel
	$scope.newParcel = function() {
		let newRawParcel = {};
		let newParcel ={};
        
		const customer = $scope.customers.find(x => x.custId === Number.parseInt($scope.selectedCustomer));

		$http.get(URL_INSERT_PARCEL 
			+ `newWeight=${$scope.newWeight}&newCustId=${$scope.selectedCustomer}&newLocId=${$scope.selectedLocation}&custLocation=${customer.custLocation}`)
			.then(function (response) {
				newRawParcel = response.data;

                const custIndex = $scope.customers.findIndex(x => x.custId === Number.parseInt(newRawParcel.custId));
                const locIndex = $scope.locations.findIndex(x => x.locId === Number.parseInt(newRawParcel.finalLocation));
                
                let custName = '';
                let locAddress = '';
                if (custIndex >= 0){
                    custName = $scope.customers[custIndex].custName;
                }
                if (locIndex >= 0){
                    locAddress = $scope.locations[locIndex].locAddress;
                }

				newParcel = {"parcelId": newRawParcel.id, "weight": newRawParcel.weight, 
                            "custId": newRawParcel.custId, "finalLocation": locAddress, "custName": custName};
                
				$scope.parcels.push(newParcel);
			});
	}
	
	$scope.showUpdateFormCustomer = function(customer) {
		$scope.viewFormUpdateCust = true;
		$scope.updCustId = customer.custId;
		$scope.updCustomer = angular.copy(customer);
	}
	
	$scope.updateCustomer = function() {
		let updRawCust = {};
		let updCust ={};
		let index;
		
		var name = $scope.updCustomer.custName;
		var loc = $scope.updCustomer.custLocation;
		
		$http.get(URL_UPDATE_PARCEL + `updId=${$scope.updCustId}&updCustNames=${name}&updCustLocation=${loc}`).then(function (response) {
				
			updRawCust = response.data;
				
			updCust = {"custId": updRawCust.id, "custName": updRawCust.custName, "custLocation": updRawCust.custLocation};
		
			index = $scope.customers.findIndex(l => l.custId === $scope.updCustId);
			
			if(index !== undefined) {
				$scope.customers[index] = $scope.updCustomer;	
			}	
			$scope.viewFormUpdateCust = false;
		});
	}
	
	$scope.cancelUpdate = function(customer) {

		$scope.viewFormUpdateCust = false;
		$scope.updCustId = undefined;

	}

    $scope.showConfirmDeleteCustomer = function(customer) {
		let okDelete = false;
		
		$scope.viewFormUpdateCust = false;
		okDelete = window.confirm("Delete Customer : " + customer.custName + " - " + 	customer.custLocation + "(" + customer.custId + ")");
						
		if(okDelete == true) {
			$http.get(URL_DELETE_PARCEL + `delId=${customer.custId}`).then(function (response) {
				
				index = $scope.customers.findIndex(l => l.custId === customer.custId);
				if(index !== undefined) {
					$scope.customers.splice(index, 1);
				}				
		        })
		}
	}

    $scope.sort = function(crit) {
		$scope.sortCrit = crit;
	}

});


custApp = angular.module('angCustApp', []);

custApp.controller('CustomersListController',  function($scope, $http, $window) {

	let host = "http://localhost:8888";
	
	let URL_ALL_CUSTS = host + "/getAllCustomers";
	let URL_INSERT_CUST = host +  "/insCustomer?";
	let URL_UPDATE_CUST = host +  "/updCustomer?";
	let URL_DELETE_CUST = host +  "/delCustomer?";

    let URL_ALL_LOCS = host + "/getAllLocations";
	let URL_PARCEL_CUSTOMER = host + "/customerParcels";
	let URL_PARCEL_HISTORY = host + "/parcelHistory";

	let URL_PARCEL_NEXT_STATUS = host + "/nextParcelStatus";
	let URL_PARCEL_ROLLBACK_STATUS = host + "/rollbackStatus";
	
	$scope.viewFormUpdate = false;
	$scope.viewTableCustParcel = false;
	$scope.popupDetail = false;
	$scope.viewFormAddStatus = false;
	$scope.slectedCustomer = null;
	$scope.selectedParcel = null;
	$scope.newParcelStatus = null;
	$scope.customers = [];
    $scope.locations = [];
			
	$http.get(URL_ALL_CUSTS).then(function(response) {
		
      $scope.customers =  response.data;
      
    });

    $http.get(URL_ALL_LOCS).then(function(response) {
		
        $scope.locations =  response.data;
        
    });
	
	$scope.newCustomer = function() {
		let newRawCust = {};
		let newCust ={};
        
		$http.get(URL_INSERT_CUST + `newCustName=${$scope.newCustName}&newCustLocation=${$scope.selectedLocation}`)
			.then(function (response) {
				newRawCust = response.data;
                const index = $scope.locations.findIndex(x => x.locId === Number.parseInt(newRawCust.custLocation));
                let locAddress = '';
                if (index >= 0){
                    locAddress = $scope.locations[index].locAddress;
                }

				newCust = {"custId": newRawCust.id, "custName": newRawCust.custName, 
                            "custLocation": newRawCust.custLocation, "locAddress": locAddress};
                console.log(newCust);
				$scope.customers.push(newCust);
			});
	}
	
	//display update customer form
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
		
		$http.get(URL_UPDATE_CUST + `updId=${$scope.updCustId}&updCustNames=${name}&updCustLocation=${loc}`).then(function (response) {
				
			updRawCust = response.data;
			let locAddress = '';
			const locIndex = $scope.locations.findIndex(x => x.locId === Number.parseInt(updRawCust.custLocation));
			locAddress = locIndex >= 0? $scope.locations[locIndex].locAddress: '';
			updCust = {"custId": updRawCust.id, "custName": updRawCust.custName, "custLocation": updRawCust.custLocation, 
					"locAddress": locAddress};
			
			index = $scope.customers.findIndex(l => l.custId === $scope.updCustId);
			
			if(index >= 0) {
				$scope.customers[index] = updCust;
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
			$http.get(URL_DELETE_CUST + `delId=${customer.custId}`).then(function (response) {
				
				index = $scope.customers.findIndex(l => l.custId === customer.custId);
				if(index !== undefined) {
					$scope.customers.splice(index, 1);
				}				
		        })
		}
	}

	$scope.showListCustomerParcel = function(customer) {
		$scope.slectedCustomer = customer;
		
		$http.get(URL_PARCEL_CUSTOMER + `?custId=${customer.custId}`).then(function (response) {
			$scope.parcels = response.data;	
		})

		$scope.viewTableCustParcel = true;
	}

	$scope.viewParcelHistory = function(parcel) {

		$window.location.href = URL_PARCEL_HISTORY + `?parcelId=${parcel.parcelId}`;
	}

	$scope.nextStatusParcel = function(parcel){
		$scope.newParcelStatus = parcel;
		$scope.newParcelStatus.date = new Date();
		const today = new Date();
		$scope.newParcelStatus.time = `${today.getHours()}:${today.getMinutes()}`;
		$scope.viewFormAddStatus = true;
	} 

	//Delete a transaction of a parcel
	$scope.rollBackStatusParcel = function(parcel){
		$http.get(URL_PARCEL_ROLLBACK_STATUS + 
			`?parcelId=${parcel.parcelId}&locId=${parcel.locId}`
			)
		.then(function (response) {
			$scope.parcel = [];
		})
	}

	//Add new status of a parcel
	$scope.addParcelStatus = function (){
		const parcelId = $scope.newParcelStatus.parcelId;
		const locId = $scope.newParcelStatus.locId;
		const date = $scope.newParcelStatus.date;
		const weight = $scope.newParcelStatus.weight;
		const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
		const time = $scope.newParcelStatus.time;
		const formmatedTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
		const operation = $scope.newParcelStatus.operation;

		$http.get(URL_PARCEL_NEXT_STATUS + 
			`?parcelId=${parcelId}&locId=${locId}&weight=${weight}&date=${formattedDate}&time=${formmatedTime}&operation=${operation}`
			)
		.then(function (response) {
			$scope.viewFormAddStatus = false;
			let returnedParcel = response.data;
			const locIndex = $scope.locations.findIndex(x => x.locId === Number.parseInt(returnedParcel.locId));
			if (locIndex >= 0){
				returnedParcel.locAddress = $scope.locations[locIndex].locAddress;
			}
			$scope.parcel = returnedParcel;
			console.log(response.data);
		})
	}
});


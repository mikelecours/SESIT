// Developed by the SBU senior project team: Joshua Moose, Jimmy Schmitzer, Simon Poe, Preston Tate, Paul Kramer

var app = angular.module('myApp', []);

app.controller('searchCtrl', function($scope) {
    $scope.searchParameter = "";
	$scope.searchKeyword = "";
});
/////////////////////////////// Directive to clear fields when they are empty (set them from "" to null)//////////////////////(
app.directive('deleteIfEmpty', function () {
    return {
        restrict: 'A',
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch("ngModel", function (newValue, oldValue) {
                if (typeof scope.ngModel !== 'undefined' && scope.ngModel.length === 0) {
                    delete scope.ngModel;
                }
            });
        }
    };
});

app.controller('resultsCtrl', function($scope, $http) { //On button click this function will populate table
	////// GET RESULTS //////
	$scope.init = function() {
		var pageData = {
			table: 'devices', //CHANGE THIS TO NAME OF TABLE (CHECK ACCESS FOR TABLE NAME)
		};		
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'contract_type_codes'},
		})
		.then(function (response) {
			$scope.contractTypeCodes = response.data;
		}, function (error) {
				console.log(error);
		});	
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'program_codes'},
		})
		.then(function (response) {
			$scope.programCodes = response.data;
		}, function (error) {
				console.log(error);
		});	
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'contract_vehicle_codes'},
		})
		.then(function (response) {
			$scope.contractVehicleCodes = response.data;
		}, function (error) {
				console.log(error);
		});	
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'security_class_codes'},
		})
		.then(function (response) {
			$scope.securityCodes = response.data;
		}, function (error) {
				console.log(error);
		});	
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'device_type_codes'},
		})
		.then(function (response) {
			$scope.deviceTypeCodes = response.data;
		}, function (error) {
				console.log(error);
		});	
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'state_prov_cntry_codes'},
		})
		.then(function (response) {
			$scope.stateProvCntryCodes = response.data;
			console.log(response.data);
		}, function (error) {
				console.log(error);
		});	
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'organization_type_codes'},
		})
		.then(function (response) {
			$scope.organizationTypeCodes = response.data;
		}, function (error) {
				console.log(error);
		});
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'role_codes'},
		})
		.then(function (response) {
			$scope.roleCodes = response.data;
		}, function (error) {
				console.log(error);
		});	
	}
	
	$scope.init();
	////// END RESULTS //////
	
});


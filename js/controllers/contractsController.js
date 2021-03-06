// Developed by the SBU senior project team: Joshua Moose, Jimmy Schmitzer, Simon Poe, Preston Tate, Paul Kramer

var app = angular.module('myApp', ['ngSanitize', 'ngCsv']);

var types = {
	'contr_id': 'String',
	'contr_org_id': 'Integer',
	'contr_end_cust_id': 'Integer',
	'contr_type_cd': 'String',
	'prime_contr_id': 'Integer',
	'prime_contract_no': 'String',
	'contr_prog_cd': 'String',
	'contr_vehicle_cd': 'String',
	'contr_sec_level_cd': 'String',
	'contr_info_safe_level_cd': 'String',
	'contr_open_date': 'TimeStamp',
	'contr_close_date': 'TimeStamp',
	'is_open': 'Boolean',
	'exemptions': 'String',
	'dd254_recv': 'Boolean',
	'dd254_date': 'TimeStamp',
}
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

$(document).ready(function(){
	$('#contr_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#contr_org_id').tooltip({'trigger':'focus', 'title': 'Required Field.', 'placement': 'right'});
	$('#contr_end_cust_id').tooltip({'trigger':'focus', 'title': 'Should be an integer with 9 digits or less.', 'placement': 'right'});
	$('#contr_type_cd').tooltip({'trigger':'focus', 'title': 'Required Field.', 'placement': 'right'});
	//$('#prime_contr_id').tooltip({'trigger':'focus', 'title': 'Should be an integer with 9 digits or less.', 'placement': 'right'});
	$('#prime_contract_no').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	//$('#contr_prog_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#contr_vehicle_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	//$('#contr_sec_level_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	//$('#contr_info_safe_level_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#contr_open_date').tooltip({'trigger':'focus', 'title': 'Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'right'});
	$('#contr_close_date').tooltip({'trigger':'focus', 'title': 'Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'right'});
	$('#is_open').tooltip({'trigger':'focus', 'title': 'Boolean value', 'placement': 'right'});
	$('#exemptions').tooltip({'trigger':'focus', 'title': 'Text field.', 'placement': 'right'});
	$('#dd254_recv').tooltip({'trigger':'focus', 'title': 'Boolean value.', 'placement': 'right'});
	$('#dd254_date').tooltip({'trigger':'focus', 'title': 'Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'right'});
		
});

app.controller('searchCtrl', function($scope) {
    $scope.searchParameter = "";
	$scope.searchKeyword = "";
});

app.controller('resultsCtrl', function($scope, $http) { //On button click this function will populate table
	////// GET RESULTS //////
	$scope.searchResults = function() {
		var pageData = {
			table: 'contracts', //CHANGE THIS TO NAME OF TABLE (CHECK ACCESS FOR TABLE NAME)
		};		
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : pageData,
		})
		.then(function (response) {
			$scope.myResults = response.data;

			console.log('Data loaded.');
			$('#search').collapse("show");			
		}, function (error) {
				console.log(error);
		});	
	}
	
	////// END RESULTS //////
	////// Clear search filter ////// ************************************** Add this to all pages, adapt it to the filter inputs on the page
	$scope.clearFilters = function () {
		delete $scope.f.contr_id;
		delete $scope.f.contr_org_id;
		delete $scope.f.cont_end_cust_id;
		delete $scope.f.contr_type_cd;
		delete $scope.f.prime_contr_id;
		delete $scope.f.prime_contract_no;
		delete $scope.f.contr_prog_cd;
		delete $scope.f.contr_vehicle_cd;
		delete $scope.f.contr_sec_level_cd;
		delete $scope.f.contr_info_safe_level_cd;
		delete $scope.f.contr_open_date;
		delete $scope.f.contr_close_date;
		delete $scope.f.is_open;
		delete $scope.f.exemptions;
		delete $scope.f.dd254_recv;
		delete $scope.f.dd254_date;
	}
	////// End clear search filters //////
	
	///// REFRESH RESULTS //////
	$scope.refreshSearch = function() {
		var pageData = {
			table: 'contracts', //CHANGE THIS TO NAME OF TABLE (CHECK ACCESS FOR TABLE NAME)
		};		
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : pageData,
		})
		.then(function (response) {
			$scope.myResults = response.data;

			console.log('Data loaded.');
		}, function (error) {
				console.log(error);
		});	
	}
	///// END REFRESH RESULTS
	
	
	////// EDITING RESULTS //////
	var newField = []; 
    $scope.editing = false;

	$scope.editResults = function(field) {
		$('.edit_contr_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_contr_org_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_contr_end_cust_id').tooltip({'trigger':'focus', 'title': 'Should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_contr_type_cd').tooltip({'trigger':'focus', 'title': 'Required Field.  Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_prime_contr_id').tooltip({'trigger':'focus', 'title': 'Should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_prime_contract_no').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_contr_prog_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_contr_vehicle_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_contr_sec_level_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_contr_info_safe_level_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_contr_open_date').tooltip({'trigger':'focus', 'title': 'Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'bottom'});
		$('.edit_contr_close_date').tooltip({'trigger':'focus', 'title': 'Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'bottom'});
		//$('.edit_is_open').tooltip({'trigger':'focus', 'title': 'Boolean value', 'placement': 'bottom'});
		$('.edit_exemptions').tooltip({'trigger':'focus', 'title': 'Text field.', 'placement': 'bottom'});
		//$('.edit_dd254_recv').tooltip({'trigger':'focus', 'title': 'Boolean value.', 'placement': 'bottom'});
		$('.edit_dd254_date').tooltip({'trigger':'focus', 'title': 'Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'bottom'});
		
		$scope.editing = $scope.myResults.indexOf(field);
		newField[$scope.myResults.indexOf(field)] = angular.copy(field);
		$scope.myResults.editing = false;
	}

	$scope.saveField = function(field) {	///////////////////////////////////////////////////////////Update all saveField functions to this (just need to update table in editData	
		
		var index = $scope.myResults.indexOf(field);
		
		var editData = {
			'table': 'contracts', //////////////////////////////*******
		}
		
		//console.log( "field = " + field + "Result field = " + $scope.myResults.indexOf(field) );
		
		editData.original =	newField[index];
		editData.updated = field;
		editData.types = types;
		
		$http({
			method : 'POST',
			url : 'DatabaseUpdateHandler',
			contentType: 'application/json',
			data : editData,
		})
		.then(function (response) { ///////////////////////////////////////////////////////// Add code like this to saveField function of all pages /////////////////////////////////////
			if( response.data.Success ) {
				//$scope.myResults = response.data;
				console.log('Item edited successfully.');
				
				$scope.editing = false;
			} else {
				console.log('Item edit failure.');
				console.log(editData);
				console.log(response.data.Message);
				
				$scope.databaseIssue = response.data.Message;
				$('#updateDatabaseErrorModal').modal('show');
				$scope.myResults[$scope.editing] = newField[index];					
			}	
		}, function (error) {
			console.log(error);
		});	
		
	};

	$scope.cancel = function(field) {
		var index = $scope.myResults.indexOf(field);
		$scope.myResults[index] = newField[index];
		$scope.editing = false;
	};
	////// END EDITING RESULTS //////
});

app.controller('addCtrl', function($scope, $http) { 
	/////////////////////////////////////////// Load Options block here is for populating new selects, adapt it per page ///////////////////////////////////////////////////////
	loadOptions = function() {
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'contract_type_codes'},
		})
		.then(function (response) {
			$scope.contrSelect = response.data;
			console.log($scope.contrSelect);
		}, function (error) {
			console.log(error);
		});	
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'organization_name'},
		})
		.then(function (response) {
			$scope.orgSelect = response.data;
			console.log($scope.orgSelect);
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
			$scope.secSelect = response.data;
			console.log($scope.secSelect);
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
			$scope.progSelect = response.data;
			console.log($scope.progSelect);
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
			$scope.vehSelect = response.data;
			console.log($scope.vehSelect);
		}, function (error) {
			console.log(error);
		});		
	}
	loadOptions();
	//////////////////////////////////// End loading options for selects ///////////////////////////////////////////////
	$scope.addFunction = function() {
		
		if ($scope.addForm.$invalid ) {
			$('#addErrorsModal').modal('show');
		} else {
			//CHANGE THESE: ORDER ORDER IS (NAME OF COLUMN FROM DATABASE): $SCOPE.(NAME OF COLUMN FROM DATABASE)
			var addData = {
				'table': 'contracts',
			};
			
			addData.values = {
				'contr_id': $scope.contr_id,
				'contr_org_id': $scope.contr_org_id,
				'contr_end_cust_id': $scope.contr_end_cust_id,
				'contr_type_cd': $scope.contr_type_cd,
				'prime_contr_id': $scope.prime_contr_id,
				'prime_contract_no': $scope.prime_contract_no,
				'contr_prog_cd': $scope.contr_prog_cd,
				'contr_vehicle_cd': $scope.contr_vehicle_cd,
				'contr_sec_level_cd': $scope.contr_sec_level_cd,
				'contr_info_safe_level_cd': $scope.contr_info_safe_level_cd,
				'contr_open_date': $scope.contr_open_date,
				'contr_close_date': $scope.contr_close_date,
				'is_open': $scope.is_open,
				'exemptions': $scope.exemptions,
				'dd254_recv': $scope.dd254_recv,
				'dd254_date': $scope.dd254_date,
			}
			addData.types = types;
			
			$http({
				method : 'POST',
				url : 'DatabaseInsertHandler',
				contentType: 'application/json',
				data : addData,
			})
						.then(function (response) {
				//$scope.myResults = response.data;
				
				console.log('Item Added.');				
				console.log(response.data); //////////////////////////***********************
				
				///////////////////////////////////////// Clears fields when successfully adding a contract; apply to all pages and use for clear buttons ////////////////////////
				if( response.data.Success ) {
					console.log("Item added successfully.");
					$('#addSuccessModal').modal('show');
						delete $scope.contr_id;
						delete $scope.contr_org_id;
						delete $scope.contr_end_cust_id;
						delete $scope.contr_type_cd;
						delete $scope.prime_contr_id;
						delete $scope.prime_contract_no;
						delete $scope.contr_prog_cd;
						delete $scope.contr_vehicle_cd;
						delete $scope.contr_sec_level_cd;
						delete $scope.contr_info_safe_level_cd;
						delete $scope.contr_open_date;
						delete $scope.contr_close_date;
						delete $scope.is_open;
						delete $scope.exemptions;
						delete $scope.dd254_recv;
						delete $scope.dd254_date;
					
				} else {
					console.log(response.data.Message);
					$scope.databaseIssue = response.data.Message;
					$('#addDatabaseErrorModal').modal('show');
				}
				
			}, function (error) {
				console.log(error);
			});	
		}
	}	
});



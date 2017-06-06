// Developed by the SBU senior project team: Joshua Moose, Jimmy Schmitzer, Simon Poe, Preston Tate, Paul Kramer

var app = angular.module('myApp', ['ngSanitize', 'ngCsv']);

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
	$('#dev_id').tooltip({'trigger':'focus', 'title': 'Required Field. Must be an integer with 9 digits or less.', 'placement': 'right'});
	$('#dev_type').tooltip({'trigger':'focus', 'title': 'Required Field.', 'placement': 'right'});
	$('#dev_desc').tooltip({'trigger':'focus', 'title': 'Required Field. Must be a string shorter than 256 characters.', 'placement': 'right'});
	$('#dev_owner_id').tooltip({'trigger':'focus', 'title': 'Required Field.', 'placement': 'right'});
	//$('#dev_user_id').tooltip({'trigger':'focus', 'title': 'Required Field. Must be an integer with 9 digits or less.', 'placement': 'right'});
	$('#dev_sn').tooltip({'trigger':'focus', 'title': 'Must be a string shorter than 256 characters.', 'placement': 'right'});
});
	
var types = {
	'dev_id': 'Integer',
	'dev_type': 'String',
	'dev_desc': 'String',
	'dev_owner_id': 'Integer',
	'dev_user_id': 'Integer',
	'dev_sn': 'String',	
}

app.controller('searchCtrl', function($scope) {
    $scope.searchParameter = "";
	$scope.searchKeyword = "";
});

app.controller('resultsCtrl', function($scope, $http) { //On button click this function will populate table
	////// GET RESULTS //////
	$scope.searchResults = function() {
		
		var pageData = {
			table: 'devices', //CHANGE THIS TO NAME OF TABLE (CHECK ACCESS FOR TABLE NAME)
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
		delete $scope.f.dev_id;
		delete $scope.f.dev_type;
		delete $scope.f.dev_desc;
		delete $scope.f.dev_owner_id;
		delete $scope.f.dev_user_id;
		delete $scope.f.dev_sn;
	}
	////// End clear search filters //////
	$scope.refreshSearch = function() {
		var pageData = {
			table: 'devices', //CHANGE THIS TO NAME OF TABLE (CHECK ACCESS FOR TABLE NAME)
		};		
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : pageData,
		})
		.then(function (response) {
			$scope.myResults = response.data;
			
			console.log($scope.myResults);
			console.log('Data loaded.');
		}, function (error) {
				console.log(error);
		});	
		
	}
	
	////// EDITING RESULTS //////
	var newField = []; 
    $scope.editing = false;

	$scope.editResults = function(field) {
		
		$('#edit_dev_id').tooltip({'trigger':'focus', 'title': 'Required Field. Must be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('#edit_dev_type').tooltip({'trigger':'focus', 'title': 'Required Field. Must be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('#edit_dev_desc').tooltip({'trigger':'focus', 'title': 'Required Field. Must be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('#edit_dev_owner_id').tooltip({'trigger':'focus', 'title': 'Required Field. Must be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('#edit_dev_user_id').tooltip({'trigger':'focus', 'title': 'Required Field. Must be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('#edit_dev_sn').tooltip({'trigger':'focus', 'title': 'Must be a string shorter than 256 characters.', 'placement': 'bottom'});
		
		$scope.editing = $scope.myResults.indexOf(field);
		newField[$scope.myResults.indexOf(field)] = angular.copy(field);
		$scope.myResults.editing = false;
	}

	$scope.saveField = function(field) {	///////////////////////////////////////////////////////////Update all saveField functions to this (just need to update table in editData	
		
		var index = $scope.myResults.indexOf(field);
		
		var editData = {
			'table': 'devices', //////////////////////////////*******
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
			data : {table: 'device_type_codes'},
		})
		.then(function (response) {
			$scope.devSelect = response.data;
			console.log($scope.devSelect);
		}, function (error) {
			console.log(error);
  		});	
  		
  		$http({
  			method : 'POST',
  			url : 'DatabaseSearchHandler',
  			contentType: 'application/json',
  			data : {table: 'employee_id'},
  		})
  		.then(function (response) {
  			$scope.employeeSelect = response.data;
  			console.log($scope.employeeSelect);
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
				'table': 'devices', 
			};
			
			addData.values = {
				'dev_id': $scope.dev_id,
				'dev_type': $scope.dev_type,
				'dev_desc': $scope.dev_desc,
				'dev_owner_id': $scope.dev_owner_id,
				'dev_user_id': $scope.dev_user_id,
				'dev_sn': $scope.dev_sn,
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
					delete $scope.dev_id;
					delete $scope.dev_type;
					delete $scope.dev_desc;
					delete $scope.dev_owner_id;
					delete $scope.dev_user_id;
					delete $scope.dev_sn;
	
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



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


//////////////////////////////////   Adjust tooltips on fields which get turned to selects (they only need required or nothing ////////////////////////////////////////////////////////
$(document).ready(function(){
	$('#cont_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be an integer with 9 digits or less.', 'placement': 'right'});
	$('#cont_org_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be an integer with 9 digits or less.', 'placement': 'right'}); // should be an integer with 9 digits or less.', 'placement': 'right'});
	// ...
});

app.controller('searchCtrl', function($scope) {
    $scope.searchParameter = "";
	$scope.searchKeyword = "";
});

app.controller('resultsCtrl', function($scope, $http) { //On button click this function will populate table
	////// GET RESULTS //////
	$scope.searchResults = function() {
		var pageData = {
			table: '________', //CHANGE THIS TO NAME OF TABLE (CHECK ACCESS FOR TABLE NAME)
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
		delete $scope.f.cont_id;
		delete $scope.f.cont_org_id;
		// ...
	}
	////// End clear search filters //////
	
	
	////// EDITING RESULTS //////
	var newField = []; 
    $scope.editing = false; 

	$scope.editResults = function(field) {
		$('.edit_cont_id').tooltip({'trigger':'focus', 'title': 'Required Field. should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_cont_org_id').tooltip({'trigger':'focus', 'title': 'Required Field. should be an integer with 9 digits or less.', 'placement': 'bottom'});
		// ...
		
		$scope.editing = $scope.myResults.indexOf(field);
		newField[$scope.myResults.indexOf(field)] = angular.copy(field);
		$scope.myResults.editing = false;
	}

	$scope.saveField = function(field) {	///////////////////////////////////////////////////////////Update all saveField functions to this (just need to update table in editData	
		
		var index = $scope.myResults.indexOf(field);
		
		var editData = {
			'table': '_______', //////////////////////////////***************************************************************
		}
		
		//console.log( "field = " + field + "Result field = " + $scope.myResults.indexOf(field) );
		
		editData.original =	newField[index];
		editData.updated = field;
		
		$http({
			method : 'POST',
			url : 'DatabaseUpdateHandler',
			contentType: 'application/json',
			data : editData,
		})
		.then(function (response) { 
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
			data : {table: '________'},
		})
		.then(function (response) {
			$scope.________Select = response.data;
			console.log($scope._________Select);
		}, function (error) {
			console.log(error);
		});	
		
		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: '_________'},
		})
		.then(function (response) {
			$scope._______Select = response.data;
			console.log($scope._______Select);
		}, function (error) {
			console.log(error);
		});	
		// ...
	}
	loadOptions();
	//////////////////////////////////// End loading options for selects ///////////////////////////////////////////////
	
	/////////////////////////////////// Verify all pages add functions are similiar to this ////////////////////////////
	$scope.addFunction = function() {
		if ($scope.addForm.$invalid ) {
			$('#addErrorsModal').modal('show');
		} else {
			//CHANGE THESE: ORDER ORDER IS (NAME OF COLUMN FROM DATABASE): $SCOPE.(NAME OF COLUMN FROM DATABASE)
			var addData = {
				'table': '_________', 
			};
			
			addData.values = {
				'cont_id': $scope.cont_id,
				'cont_org_id': $scope.cont_org_id,
				'cont_role_cd': $scope.cont_role_cd,
				// ...
			}
			
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
						delete $scope.cont_id;
						delete $scope.cont_org_id;
						// ...
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

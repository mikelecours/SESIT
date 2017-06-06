// Developed by the SBU senior project team: Joshua Moose, Jimmy Schmitzer, Simon Poe, Preston Tate, Paul Kramer

var app = angular.module('myApp', []);

var types = {
	'rel_id': "Integer",
	'dir_id': "String",
	'rel_by': "Integer",
	'rel_date': 'TimeStamp',
	'recv_by': 'Integer',
	'recv_date': 'TimeStamp',
	'rel_cntry_cd': 'String',
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
	$('#rel_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be an integer with 9 digits or less.', 'placement': 'right'});
	//$('#dir_id').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#rel_by').tooltip({'trigger':'focus', 'title': 'Required Field.', 'placement': 'right'});
	$('#rel_date').tooltip({'trigger':'focus', 'title': 'Required Field.  Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'right'});
	$('#recv_by').tooltip({'trigger':'focus', 'title': 'Required Field.', 'placement': 'right'});
	$('#recv_date').tooltip({'trigger':'focus', 'title': 'Required Field. Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'right'});
	$('#rel_cntry_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	
});

app.controller('searchCtrl', function($scope) {
    $scope.searchParameter = "";
	$scope.searchKeyword = "";
});

app.controller('resultsCtrl', function($scope, $http) { //On button click this function will populate table
	////// GET RESULTS //////
	$scope.searchResults = function() {
		var pageData = {
			table: 'releases', //CHANGE THIS TO NAME OF TABLE (CHECK ACCESS FOR TABLE NAME)
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
		delete $scope.f.rel_id;
		delete $scope.f.dir_id;
		delete $scope.f.rel_by;
		delete $scope.f.rel_date;
		delete $scope.f.recv_by;
		delete $scope.f.recv_date;
		delete $scope.f.rel_cntry_cd;

	}
	////// End clear search filters //////
	
	////// EDITING RESULTS //////
	var newField = []; 
    $scope.editing = false;

	$scope.editResults = function(field) {

		$('.edit_rel_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_dir_id').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_rel_by').tooltip({'trigger':'focus', 'title': 'Required Field. Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_rel_date').tooltip({'trigger':'focus', 'title': 'Required Field.  Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'bottom'});
		$('.edit_recv_by').tooltip({'trigger':'focus', 'title': 'Required Field. Should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_recv_date').tooltip({'trigger':'focus', 'title': 'Required Field. Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'bottom'});
		$('.edit_rel_cntry_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
	
		$scope.editing = $scope.myResults.indexOf(field);
		newField[$scope.myResults.indexOf(field)] = angular.copy(field);
		$scope.myResults.editing = false;
	}

	$scope.saveField = function(field) {	///////////////////////////////////////////////////////////Update all saveField functions to this (just need to update table in editData	
		
		var index = $scope.myResults.indexOf(field);
		
		var editData = {
			'table': 'releases', //////////////////////////////*******
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
			data : {table: 'directive_id'},
		})
		.then(function (response) {
			$scope.dirSelect = response.data;
			console.log($scope.dirSelect);
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
			$scope.empSelect = response.data;
			console.log($scope.empSelect);
		}, function (error) {
			console.log(error);
		});	

		$http({
			method : 'POST',
			url : 'DatabaseSearchHandler',
			contentType: 'application/json',
			data : {table: 'contact_name'},
		})
		.then(function (response) {
			$scope.contSelect = response.data;
			console.log($scope.contSelect);
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
				'table': 'releases', 
			};
			
			addData.values = {
				'rel_id': $scope.rel_id,
				'dir_id': $scope.dir_id,
				'rel_by': $scope.rel_by,
				'rel_date': $scope.rel_date,
				'recv_by': $scope.recv_by,
				'recv_date': $scope.recv_date,
				'rel_cntry_cd': $scope.rel_cntry_cd,
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
						delete $scope.rel_id;
						delete $scope.dir_id;
						delete $scope.rel_by;
						delete $scope.rel_date;
						delete $scope.recv_by;
						delete $scope.recv_date;
						delete $scope.rel_cntry_cd;

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



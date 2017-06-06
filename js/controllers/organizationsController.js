// Developed by the SBU senior project team: Joshua Moose, Jimmy Schmitzer, Simon Poe, Preston Tate, Paul Kramer

var app = angular.module('myApp', ['ngSanitize', 'ngCsv']);

var types = {
	'org_id': "Integer",
	'org_type_cd': "String",
	'org_name': "String",
	'org_div': "String",
	'org_addr1': "String",
	'org_addr2': "String",
	'org_city': "String",
	'org_state_prov_cd': "String",
	'org_post_cd': "String",
	'org_cntry_cd': "String",
	'cage_cd': "String",
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
	$('#org_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be an integer with 9 digits or less.', 'placement': 'right'});
	$('#org_type_cd').tooltip({'trigger':'focus', 'title': 'Required Field.', 'placement': 'right'});
	$('#org_name').tooltip({'trigger':'focus', 'title': 'Required Field. Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#org_div').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#org_addr1').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#org_addr2').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#org_city').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	//$('#org_state_prov_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#org_post_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#org_cntry_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cage_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	
});


app.controller('searchCtrl', function($scope) {
    $scope.searchParameter = "";
	$scope.searchKeyword = "";
});

app.controller('resultsCtrl', function($scope, $http) { //On button click this function will populate table
	////// GET RESULTS //////
	$scope.searchResults = function() {
		var pageData = {
			table: 'organizations', //CHANGE THIS TO NAME OF TABLE (CHECK ACCESS FOR TABLE NAME)
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
		delete $scope.f.org_id;
		delete $scope.f.org_type_cd;
		delete $scope.f.org_name;
		delete $scope.f.org_div;
		delete $scope.f.org_addr1;
		delete $scope.f.org_addr2;
		delete $scope.f.org_city;
		delete $scope.f.org_state_prov_cd;
		delete $scope.f.org_post_cd;
		delete $scope.f.org_cntry_cd;
		delete $scope.f.cage_cd;
	}
	////// End clear search filters //////
	
	////// EDITING RESULTS //////
	var newField = []; 
    $scope.editing = false;

	$scope.editResults = function(field) {
		$('.edit_org_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_org_type_cd').tooltip({'trigger':'focus', 'title': 'Required Field. Should be a string shorter than 50 characters.', 'placement': 'bottom'});
		$('.edit_org_name').tooltip({'trigger':'focus', 'title': 'Required Field. Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_org_div').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_org_addr1').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_org_addr2').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_org_city').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_org_state_prov_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_org_post_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_org_cntry_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cage_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
			
	$scope.editing = $scope.myResults.indexOf(field);
		newField[$scope.myResults.indexOf(field)] = angular.copy(field);
		$scope.myResults.editing = false;
	}

	$scope.saveField = function(field) {	///////////////////////////////////////////////////////////Update all saveField functions to this (just need to update table in editData	
		
		var index = $scope.myResults.indexOf(field);
		
		var editData = {
			'table': 'organizations', //////////////////////////////*******
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
			data : {table: 'organization_type_codes'},
		})
		.then(function (response) {
			$scope.orgTypeSelect = response.data;
			console.log($scope.orgTypeSelect);
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
			$scope.stateProvSelect = response.data;
			console.log($scope.stateProvSelect);
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
				'table': 'organizations', 
			};
			
			addData.values = {
				'org_id': $scope.org_id,
				'org_type_cd': $scope.org_type_cd,
				'org_name': $scope.org_name,
				'org_div': $scope.org_div,
				'org_addr1': $scope.org_addr1,
				'org_addr2': $scope.org_addr2,
				'org_city': $scope.org_city,
				'org_state_prov_cd': $scope.org_state_prov_cd,
				'org_post_cd': $scope.org_post_cd,
				'org_cntry_cd': $scope.org_cntry_cd,
				'cage_cd': $scope.cage_cd,
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
						delete $scope.org_id;
						delete $scope.org_type_cd;
						delete $scope.org_name;
						delete $scope.org_div;
						delete $scope.org_addr1;
						delete $scope.org_addr2;
						delete $scope.org_city;
						delete $scope.org_state_prov_cd;
						delete $scope.org_post_cd;
						delete $scope.org_cntry_cd;
						delete $scope.cage_cd;
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



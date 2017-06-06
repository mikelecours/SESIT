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


//////////////////////////////////   Adjust tooltips on fields which get turned to selects (they only need required or nothing ////////////////////////////////////////////////////////
$(document).ready(function(){
	$('#cont_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be an integer with 9 digits or less.', 'placement': 'right'});
	$('#cont_org_id').tooltip({'trigger':'focus', 'title': 'Required Field.', 'placement': 'right'}); // should be an integer with 9 digits or less.', 'placement': 'right'});
	//$('#cont_role_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_first_name').tooltip({'trigger':'focus', 'title': 'Required Field. should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_middle_name').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_last_name').tooltip({'trigger':'focus', 'title': 'Required Field. should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_name_title').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_name_suffix').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_addr1').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_addr2').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_city').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	//$('#cont_state_prov_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_post_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	//$('#cont_cntry_Cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_office_phone').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_mobile_phone').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_home_phone').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#cont_email').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});	
	$('#cont_alt_email').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	
});

app.controller('searchCtrl', function($scope) {
    $scope.searchParameter = "";
	$scope.searchKeyword = "";
});

app.controller('resultsCtrl', function($scope, $http) { //On button click this function will populate table
	////// GET RESULTS //////
	$scope.searchResults = function() {
		var pageData = {
			table: 'contacts', //CHANGE THIS TO NAME OF TABLE (CHECK ACCESS FOR TABLE NAME)
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
		delete $scope.f.cont_role_cd;
		delete $scope.f.cont_first_name;
		delete $scope.f.cont_middle_name;
		delete $scope.f.cont_last_name;
		delete $scope.f.cont_name_title;
		delete $scope.f.cont_name_suffix;
		delete $scope.f.cont_addr1;
		delete $scope.f.cont_addr2;
		delete $scope.f.cont_city;
		delete $scope.f.cont_state_prov_cd;
		delete $scope.f.cont_post_cd;
		delete $scope.f.cont_cntry_Cd;
		delete $scope.f.cont_office_phone;
		delete $scope.f.cont_mobile_phone;
		delete $scope.f.cont_home_phone;
		delete $scope.f.cont_email;
		delete $scope.f.cont_alt_email;
	}
	////// End clear search filters //////
	
	
	////// EDITING RESULTS //////
	var newField = []; 
    $scope.editing = false; 

	$scope.editResults = function(field) {
		$('.edit_cont_id').tooltip({'trigger':'focus', 'title': 'Required Field. should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_cont_org_id').tooltip({'trigger':'focus', 'title': 'Required Field. should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_cont_role_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_first_name').tooltip({'trigger':'focus', 'title': 'Required Field. should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_middle_name').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_last_name').tooltip({'trigger':'focus', 'title': 'Required Field. should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_name_title').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_name_suffix').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_addr1').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_addr2').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_city').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_state_prov_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_post_cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_cntry_Cd').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_office_phone').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_mobile_phone').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_home_phone').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_cont_email').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});	
		$('.edit_cont_alt_email').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		
		
		$scope.editing = $scope.myResults.indexOf(field);
		newField[$scope.myResults.indexOf(field)] = angular.copy(field);
		$scope.myResults.editing = false;
	}

	$scope.saveField = function(field) {	///////////////////////////////////////////////////////////Update all saveField functions to this (just need to update table in editData	
		
		var index = $scope.myResults.indexOf(field);
		
		var editData = {
			'table': 'contacts', //////////////////////////////***************************************************************
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
			data : {table: 'role_codes'},
		})
		.then(function (response) {
			$scope.roleSelect = response.data;
			console.log($scope.roleSelect);
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
	
	/////////////////////////////////// Verify all pages add functions are similiar to this ////////////////////////////
	$scope.addFunction = function() {
		if ($scope.addForm.$invalid ) {
			$('#addErrorsModal').modal('show');
		} else {
			//CHANGE THESE: ORDER ORDER IS (NAME OF COLUMN FROM DATABASE): $SCOPE.(NAME OF COLUMN FROM DATABASE)
			var addData = {
				'table': 'contacts', 
			};
			
			addData.values = {
				'cont_id': $scope.cont_id,
				'cont_org_id': $scope.cont_org_id,
				'cont_role_cd': $scope.cont_role_cd,
				'cont_first_name': $scope.cont_first_name,
				'cont_middle_name': $scope.cont_middle_name,
				'cont_last_name': $scope.cont_last_name,
				'cont_name_title': $scope.cont_name_title,
				'cont_name_suffix': $scope.cont_name_suffix,
				'cont_addr1': $scope.cont_addr1,
				'cont_addr2': $scope.cont_addr2,
				'cont_city': $scope.cont_city,
				'cont_state_prov_cd': $scope.cont_state_prov_cd,
				'cont_post_cd': $scope.cont_post_cd,
				'cont_cntry_Cd': $scope.cont_cntry_Cd,
				'cont_office_phone': $scope.cont_office_phone,
				'cont_mobile_phone': $scope.cont_mobile_phone,
				'cont_home_phone': $scope.cont_home_phone,
				'cont_email': $scope.cont_email,
				'cont_alt_email': $scope.cont_alt_email,
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
						delete $scope.cont_role_cd;
						delete $scope.cont_first_name;
						delete $scope.cont_middle_name;
						delete $scope.cont_last_name;
						delete $scope.cont_name_title;
						delete $scope.cont_name_suffix;
						delete $scope.cont_addr1;
						delete $scope.cont_addr2;
						delete $scope.cont_city;
						delete $scope.cont_state_prov_cd;
						delete $scope.cont_post_cd;
						delete $scope.cont_cntry_Cd;
						delete $scope.cont_office_phone;
						delete $scope.cont_mobile_phone;
						delete $scope.cont_home_phone;
						delete $scope.cont_email;
						delete $scope.cont_alt_email;
						
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

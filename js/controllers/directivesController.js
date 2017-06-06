// Developed by the SBU senior project team: Joshua Moose, Jimmy Schmitzer, Simon Poe, Preston Tate, Paul Kramer

var app = angular.module('myApp', ['ngSanitize', 'ngCsv']);

var types = {
	'dir_id': "String",
	'dir_contr_id': "String",
	'dir_desc': "String",
	'dir_issued_by': "Integer",
	'dir_issued_date': "TimeStamp",
	'dir_recv_by': "Integer",
	'dir_recv_date': "TimeStamp",
}

$(document).ready(function(){
	$('#dir_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#dir_contr_id').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#dir_desc').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'right'});
	$('#dir_issued_by').tooltip({'trigger':'focus', 'title': 'Required Field.', 'placement': 'right'});
	$('#dir_issued_date').tooltip({'trigger':'focus', 'title': 'Required Field. Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'right'});
	$('#dir_recv_by').tooltip({'trigger':'focus', 'title': 'Required Field.', 'placement': 'right'});
	$('#dir_recv_date').tooltip({'trigger':'focus', 'title': 'Required Field. Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'right'});
	
});

app.controller('searchCtrl', function($scope) {
    $scope.searchParameter = "";
	$scope.searchKeyword = "";
});

app.controller('resultsCtrl', function($scope, $http) { //On button click this function will populate table
	////// GET RESULTS //////
	$scope.searchResults = function() {
		var pageData = {
			table: 'directives', //CHANGE THIS TO NAME OF TABLE (CHECK ACCESS FOR TABLE NAME)
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
		$scope.clearFilters = function () {
		delete $scope.f.dir_id;
		delete $scope.f.dir_contr_id;
		delete $scope.f.dir_desc;
		delete $scope.f.dir_issued_by;
		delete $scope.f.dir_issued_date;
		delete $scope.f.dir_recv_by;
		delete $scope.f.dir_recv_date;
	}
	////// EDITING RESULTS //////
	var newField = []; 
    $scope.editing = false;

	$scope.editResults = function(field) {
		$scope.editing = $scope.myResults.indexOf(field);
		$scope.newField = angular.copy(field);
		
		$('.edit_dir_id').tooltip({'trigger':'focus', 'title': 'Required Field. Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_dir_contr_id').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_dir_desc').tooltip({'trigger':'focus', 'title': 'Should be a string shorter than 256 characters.', 'placement': 'bottom'});
		$('.edit_dir_issued_by').tooltip({'trigger':'focus', 'title': 'Required Field.  Should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_dir_issued_date').tooltip({'trigger':'focus', 'title': 'Required Field. Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'bottom'});
		$('.edit_dir_recv_by').tooltip({'trigger':'focus', 'title': 'Required Field. Should be an integer with 9 digits or less.', 'placement': 'bottom'});
		$('.edit_dir_recv_date').tooltip({'trigger':'focus', 'title': 'Required Field. Timestamp in the format of yyyy-dd-mm hh:mm:ss.', 'placement': 'bottom'});
	
	}

	$scope.saveField = function(index) {		
		var editData = {
			'table': 'directives',
		}
		
		editData.original =	$scope.newField;
		editData.updated = $scope.myResults[$scope.editing];
		editData.types = types;
		
		if ($scope.editing !== false) {
			//$scope.myResults[$scope.editing] = $scope.newField;
			//$scope.editing = false;
			console.log(editData);
			
			$http({
				method : 'POST',
				url : 'DatabaseUpdateHandler',
				contentType: 'application/json',
				data : editData,
			})
			
		}       
	};

	$scope.cancel = function(index) {
		if ($scope.editing !== false) {
			$scope.myResults[$scope.editing] = $scope.newField;
			$scope.editing = false;
		}
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
			data : {table: 'contract_id'},
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
			data : {table: 'contact_name'},
		})
		.then(function (response) {
			$scope.contSelect = response.data;
			console.log($scope.contSelect);
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
	}
	loadOptions();
	//////////////////////////////////// End loading options for selects ///////////////////////////////////////////////
	$scope.addFunction = function() {
		
		if ($scope.addForm.$invalid ) {
			$('#addErrorsModal').modal('show');
		} else {
			//CHANGE THESE: ORDER ORDER IS (NAME OF COLUMN FROM DATABASE): $SCOPE.(NAME OF COLUMN FROM DATABASE)
			var addData = {
				'table': 'directives', 
			};
			
			addData.values = {
				'dir_id': $scope.dir_id,
				'dir_contr_id': $scope.dir_contr_id,
				'dir_desc': $scope.dir_desc,
				'dir_issued_by': $scope.dir_issued_by,
				'dir_issued_date': $scope.dir_issued_date,
				'dir_recv_by': $scope.dir_recv_by,
				'dir_recv_date': $scope.dir_recv_date,
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
					delete $scope.dir_id;
					delete $scope.dir_contr_id;
					delete $scope.dir_desc;
					delete $scope.dir_issued_by;
					delete $scope.dir_issued_date;
					delete $scope.dir_recv_by;
					delete $scope.dir_recv_date;
				
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



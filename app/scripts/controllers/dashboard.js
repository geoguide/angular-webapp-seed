'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('DashboardCtrl', function ($scope,$modal,$modalStack,dashboardFactory,toasty,applicationFactory,$log) {

	var _this = this;
	this.leads = [];
	this.loading = true;
	
	
	_this.getResults = function() {
		_this.loading = true;
		var pageNumber = _this.currentPage || 1;
		var queryData = {
			search_query: _this.searchQuery,
			page: pageNumber,
			sort_by: _this.sortBy,
			sort_direction: _this.sortDirection,
			disposition: _this.disposition,
			score_low: _this.score_low,
			score_high: _this.score_high,
			specialty_id: _this.searchSpecialty,
			state: _this.searchState
		};
		dashboardFactory.getLeads(queryData).then(function(response) {
			_this.leads = response.leads;
			_this.total = response.total;
			_this.loading = false;
		});
	};
	
	this.sortResult = function(sortOn){
		_this.sortDirection = !_this.sortDirection;
		_this.sortBy = sortOn;
		_this.getResults();
	};
	
	//New Lead Modal
	this.openNewLeadForm = function () {

		this.modalInstance = $modal.open({
			templateUrl: 'create-lead-modal',
			controller: 'DashboardCtrl',
			controllerAs: 'dash',
			scope: $scope,
			windowClass: 'lg-modal-window',
			resolve: {
				//Variables to add to modal's scope - not needed since using the same controller
				parentCtrl: _this
			}
		});

		_this.modalInstance.result.then(function (data) {
			//something on close
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	this.closeModal = function(){
		$modalStack.dismissAll();
	};
	
	this.submitLead = function(){
		dashboardFactory.submitLead(_this.newLead).then(function(response){
			applicationFactory.goTo('/lead/'+response.data.id);
			$modalStack.dismissAll();
		},function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	_this.getResults();
});

'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('DashboardCtrl', function (dashboardFactory,$log,applicationFactory) {

	var _this = this;
	this.loading = true;
	
	this.dynamicPopover = {
		content: 'Hello, World!',
		templateUrl: 'notes-template.html',
		title: 'Doctor Notes'
	};
//	_this.twoWayMatches = applicationFactory.twoWayMatches;
	
	this.get2Way = function(){
		_this.loading = true;
		dashboardFactory.get2Way().then(function(result){
			_this.twoWayMatches = result;
			dashboardFactory.twoWayMatches = result;
//			applicationFactory.twoWayMatches = result;
			_this.loading = false;
		},function(error){
			_this.loading = false;
			$log.error(error);
		});
	};
	
	this.setTooltip = function(item){
		_this.tooltipSales = item.sales_notes;
		_this.tooltipJob = item.modio_notes;
	};
	this.twoWayMatches = dashboardFactory.twoWayMatches;

	
	if(_this.twoWayMatches.length < 1){
		_this.get2Way();
	} else {
		_this.loading = false;
	}
	
});

'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('DashboardCtrl', function (dashboardFactory,$log) {

	var _this = this;
	this.loading = true;
	
	this.dynamicPopover = {
		content: 'Hello, World!',
		templateUrl: 'notes-template.html',
		title: 'Doctor Notes'
	};
	
	this.setTooltip = function(item){
		_this.tooltipSales = item.sales_notes;
		_this.tooltipJob = item.modio_notes;
	};
	
	
	
});

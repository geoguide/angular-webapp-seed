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
	this.loading = true;
	this.twoWayMatches = [];
	this.stats = {};
	this.get2Way = function(){
		_this.loading = true;
		dashboardFactory.get2Way().then(function(result){
			_this.twoWayMatches = result;
			_this.loading = false;
		},function(error){
			_this.loading = false;
			$log.error(error);
		});
	};
	
	this.getStats = function(){
		_this.loading = true;
		dashboardFactory.getDashboardStats().then(function(result){
			_this.stats = result;
			_this.loading = false;
		},function(error){
			_this.loading = false;
			$log.error(error);
		});
	};
	
	this.dynamicPopover = {
		content: 'Hello, World!',
		templateUrl: 'notes-template.html',
		title: 'Doctor Notes'
	};
	
	this.setTooltip = function(item){
		_this.tooltipSales = item.sales_notes;
		_this.tooltipJob = item.modio_notes;
	};
	
	this.getStats();
	this.get2Way();
});

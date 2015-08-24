'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('DashboardCtrl', function ($scope,$modal,$modalStack,doctorFactory,toasty,applicationFactory,$log) {

	var _this = this;
	this.leads = [];
	_this.getLeads = function() {

		doctorFactory.getLeads().then(function(response) {
			_this.leads = response;
		});
	};
	
	_this.getLeads();
});

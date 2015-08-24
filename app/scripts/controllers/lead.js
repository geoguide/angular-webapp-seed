'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:LeadCtrl
 * @description
 * # LeadCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('LeadCtrl', function ($modal, $modalStack, doctorFactory, facilityFactory, toasty, $log, $routeParams) {
	var _this = this;
	this.leadData = {};
	this.leadId = $routeParams.id;
	//Date picker
	_this.opened = { 'start': false, 'end': false };
	this.open = function($event, which) {
		$event.preventDefault();
		$event.stopPropagation();

		_this.opened[which] = true;
	};

	this.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','MM/dd/yyyy'];
	this.format = this.formats[4];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};

	this.save = function(){
		doctorFactory.saveLead(_this.leadId,_this.leadData).success(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Lead Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.jobData = data;
		}).error(function(error){
			toasty.error({
				title: 'Error!',
				msg: error.message,
				showClose: true,
				clickToClose: true
			});
		});
	};
	/*this.delete = function(){
		jobFactory.deleteJob(_this.jobId).then(function(data){
			_this.jobData = null;
			_this.error = true;
			toasty.success({
				title: 'Success!',
				msg: 'Job Deleted.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.message,
				showClose: true,
				clickToClose: true
			});
		});
	};*/

	var init = function(){

		doctorFactory.getLead(_this.leadId).then(function(data){
			_this.leadData = data;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.jobData = null;
		});
	};

	init();

});

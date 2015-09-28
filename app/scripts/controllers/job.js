'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobCtrl
 * @description
 * # JobCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobCtrl', function ($modal, $modalStack, jobFactory, facilityFactory, toasty, $log, $routeParams) {
	var _this = this;
	this.jobData = {};
	this.jobId = $routeParams.id;
	this.jobData.tags = [];
	this.tags = [];

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
	
	this.bookmarkedJobs = [];

	this.save = function(){
		_this.jobData.start_date = (_this.jobData.start_date === '06/22/2015') ? null : _this.jobData.start_date;
		_this.jobData.end_date = (_this.jobData.end_date === '06/22/2015') ? null : _this.jobData.end_date;
		var tags = [];
		//_this.jobData.tags = JSON.stringify(_this.jobData.tags);
		jobFactory.saveJob(_this.jobData).success(function(data){
			data.tags = JSON.parse(data.tags);
			toasty.success({
				title: 'Success!',
				msg: 'Job Saved.',
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
	this.delete = function(){
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
	};
	
	this.bookmark = function(idIn){
		_this.bookmarked = !!!_this.bookmarked;
		if(_this.bookmarked){
			jobFactory.bookmarkJob(idIn).then(function(){
				
			}, function(error){
				$log.error(error);
			});	
		} else {
			jobFactory.removeBookmark(idIn).then(function(){
				
			}, function(error){
				$log.error(error);
			});	
		}
		
	};

	var init = function(){
		jobFactory.getJob(_this.jobId).then(function(data){
			data.tags = JSON.parse(data.tags);
			_this.bookmarked = data.bookmarked;
			_this.jobData = data;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.jobData = null;
		});
		
		jobFactory.getJobTags().then(function(data){
			_this.tags = data;
		},function(error){
			_this.error = true;
		});
		
		jobFactory.findCandidates(_this.jobId).then(function(data){
			_this.candidates = data;
		},function(error){
			_this.error = true;
		});
	};

	init();

});

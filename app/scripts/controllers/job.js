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
	_this.loading = true;

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
		var tags = [];
		//_this.jobData.tags = JSON.stringify(_this.jobData.tags);
		jobFactory.saveJob(_this.jobData).success(function(data){
			data.tags = JSON.parse(data.tags);
			toasty.success('Job Saved.');
			_this.jobData = data;
		}).error(function(error){
			$log.error(error);
			toasty.error(error.message);
		});
	};
	this.delete = function(){
		jobFactory.deleteJob(_this.jobId).then(function(data){
			_this.jobData = null;
			_this.error = true;
			toasty.success('Job Deleted.');
		}, function(error){
			$log.error(error);
			toasty.error(error.message);
		});
	};

	this.submitRate = function(dataIn){
		jobFactory.submitRate(dataIn).then(function(data){
			return _this.load();
		}).then(function(result){
			toasty.success('Rate Saved.');
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};

	this.addRate = function(){
		_this.jobData.rates.push({ job_id: _this.jobId});
	};

	this.deleteRate = function(dataIn){
		jobFactory.deleteRate(dataIn).then(function(data){
			return _this.load();
		}).then(function(result){
			toasty.success('Rate Deleted');
		}, function(error){
			$log.error(error);
			toasty.error(error.message);
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

	this.load = function(){
		return jobFactory.getJob(_this.jobId).then(function(data){
			data.tags = JSON.parse(data.tags);
			_this.bookmarked = data.bookmarked;
			_this.jobData = data;
			_this.error = false;
			_this.loading = false;
		},function(error){
			_this.error = true;
			_this.jobData = null;
		});
	};

	var init = function(){

		_this.load();
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

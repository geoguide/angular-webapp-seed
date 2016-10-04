'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('DashboardCtrl', function (dashboardFactory,$log,applicationFactory, MODIOCORE) {

	var _this = this;
	this.loading = true;

	this.sortBy = ['Licensed', 'score'];
	this.sortDir = true;

	this.sortColumn = function(column){
		if(_this.sortBy != column){
			_this.sortBy = column;
		} else {
			_this.sortDir = !_this.sortDir;
		}
	};

	this.dynamicPopover = {
		content: 'Hello, World!',
		templateUrl: 'notes-template.html',
		title: 'Doctor Notes'
	};
	this.get2Way = function(){
		_this.loading = true;
		applicationFactory.loading = true;
		dashboardFactory.get2Way().then(function(result){
			applicationFactory.loading = false;
			_this.twoWayMatches = result;

			var jobTypes = MODIOCORE.jobTypes.getValues();
			for (var i = 0; i < _this.twoWayMatches.length; i++) {
				var match = _this.twoWayMatches[i];
				var job_jobtype_result = [];
				var dr_jobtype_result = [];
				for (var key in jobTypes) {
					var job_type = jobTypes[key];
					if ((match.job_jobtype & job_type.id) == job_type.id) {
						job_jobtype_result.push(job_type.short_label);
					}
					if ((match.dr_job_type & job_type.id) == job_type.id) {
						dr_jobtype_result.push(job_type.short_label);
					}
				}
				match.job_jobtype_title = job_jobtype_result.join(', ');
				match.dr_jobtype_title = dr_jobtype_result.join(', ');
			}

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
	this.includeMatch = function(data){
		data.exclude = false;
		dashboardFactory.matchExclusion(data).then(function(result){
			//
		},function(eror){
			$log.error('error');
		});
		$log.info('include match: '+data.job_id+','+data.doctor_id);
	};
	this.excludeMatch = function(data){
		data.exclude = true;
		dashboardFactory.matchExclusion(data).then(function(result){
		},function(eror){
			$log.error('error');
		});
		$log.warn('exclude match: '+data.job_id+','+data.doctor_id);
	};
	this.twoWayMatches = dashboardFactory.twoWayMatches;


	if(_this.twoWayMatches.length < 1){
		_this.get2Way();
	} else {
		_this.loading = false;
	}

});

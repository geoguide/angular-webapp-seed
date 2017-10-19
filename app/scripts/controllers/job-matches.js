'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:JobMatchesCtrl
 * @description
 * # JobMatchesCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobMatchesCtrl', function (ENV,$routeParams, $window, doctorFactory, $log, $modal, offerFactory, MODIOCORE) {

	var _this = this;
	this.tab = 'matches';
	this.loading = true;
	this.doctorId = $routeParams.id;
	this.matches = [];
	this.trackingData = [];
	
	
	this.get = function(doctorId){
		_this.loading = true;
		doctorFactory.getJobMatches(doctorId).then(function(result){
			_this.matches = result;

			var jobTypes = MODIOCORE.jobTypes.getValues();
			for (var i = 0; i < _this.matches.length; i++) {
				var match = _this.matches[i];
				if (match.jobtype) {
					var result = [];
					for (var key in jobTypes) {
						var job_type = jobTypes[key];

						if ((match.jobtype & job_type.id) == job_type.id) {
							result.push(job_type.short_label);
						}
					}
					match.jobtype_title = result.join(', ');
				}
			}

			_this.loading = false;
			return doctorFactory.getDoctor(doctorId);
		}).then(function(result){
			_this.bookmarked = result.data.bookmarked;
		},function(error){
			$log.error(error);
		});
		
	};
	
	this.bookmark = function(idIn){
		_this.bookmarked = !!!_this.bookmarked;
		if(_this.bookmarked){
			doctorFactory.bookmark(idIn).then(function(){
				
			}, function(error){
				$log.error(error);
			});	
		} else {
			doctorFactory.removeBookmark(idIn).then(function(){
				//silence
			}, function(error){
				$log.error(error);
			});	
		}
		
	};
	
	doctorFactory.getTracking(_this.doctorId).then(function(result){
		_this.trackingData = result;
	});
	
	doctorFactory.getJobOffers(_this.doctorId).then(function(result){
	   _this.offers = result;
	},function(error){
		$log.error(error);
	});

	/* Init */

	var init = function(){
		_this.get(_this.doctorId);

	};

	init();

});

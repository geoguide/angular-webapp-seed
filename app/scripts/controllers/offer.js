'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:OfferCtrl
 * @description
 * # OfferCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('OfferCtrl', function ($modal, $modalStack, offerFactory, toasty, $log, $routeParams, jobFactory) {
	var _this = this;
	this.offerData = {};
	this.offerId = $routeParams.id;

	//Date picker
	this.open = function($event) {
		$log.log('open called');
		$event.preventDefault();
		$event.stopPropagation();

		_this.opened = true;
	};

	this.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};

	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	this.format = this.formats[0];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};

	this.save = function(){
		_this.offerData.start_date = (_this.offerData.start_date === '2000-06-22') ? null : _this.offerData.start_date;
		_this.offerData.end_date = (_this.offerData.end_date === '2000-06-22') ? null : _this.offerData.end_date;
		offerFactory.saveOffer(_this.offerData).then(function(data){
			toasty.success('Offer Saved.');
		}, function(error){
			$log.error(error);
			toasty.error(error.message);
		});
	};

  this.submitRate = function(dataIn){
    offerFactory.submitRate(dataIn).then(function(data){
      return _this.load();
    }).then(function(result){
      toasty.success('Rate Saved.');
    }, function(error){
      $log.error(error);
      toasty.error(error.data);
    });
  };

  this.addRate = function(){
    _this.offerData.rates.push({ job_id: _this.offerData.job_id,type:'O',doctor_id:_this.offerData.doctor_id});
  };

  this.deleteRate = function(dataIn){
    offerFactory.deleteRate(dataIn).then(function(data){
      return _this.load();
    }).then(function(result){
      toasty.success('Rate Deleted');
    }, function(error){
      $log.error(error);
      toasty.error(error.message);
    });
  };

	this.acceptOffer = function(){
		offerFactory.acceptOffer(_this.offerId).success(function(){
			_this.offerData.status = 'accepted';
			toasty.success('Offer Accepted.');
		}).error(function(error){
			$log.error(error);
			toasty.error(error.message);
		});
	};

	this.rejectOffer = function(){
		offerFactory.rejectOffer(_this.offerId).success(function(){
			_this.offerData.status = 'rejected';
			toasty.success('Offer Accepted.');
		}).error(function(error){
			$log.error(error);
			toasty.error(error.message);
		});
	};

	this.delete = function(){
		offerFactory.deleteOffer(_this.jobId).then(function(data){
			_this.offerData = null;
			_this.error = true;
			toasty.success('Offer Deleted.');
		}, function(error){
			$log.error(error);
			toasty.error(error.message);
		});
	};

  this.load = function(){
    return offerFactory.getOffer(_this.offerId).then(function(data){
			_this.offerData = data;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.offerData = null;
		});
  };

	var init = function(){
    _this.load();
	};

	init();

});

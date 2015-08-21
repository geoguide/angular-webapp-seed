'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:CoordinatorCtrl
 * @description
 * # CoordinatorCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('CoordinatorCtrl', function ($routeParams, doctorFactory, toasty, $log, $modal, s3factory, Upload) {

	var _this = this;
	this.coordId = $routeParams.id;
	this.coordinatorData = null;

	this.get = function(coordId){

		var coordinatorData = doctorFactory.getCoordinator(coordId);

		coordinatorData.then(function(data){
			_this.coordinatorData = data;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.coordinatorData = null;
		});
	};

	this.save = function(){
		doctorFactory.saveCoordinator(_this.coordinatorData).then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Coordinator Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.coordinatorData = data;
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.delete = function(){
		doctorFactory.deleteCoordinator(_this.coordId).then(function(data){
			_this.coordinatorData = null;
			toasty.success({
				title: 'Success!',
				msg: 'Coordinator Deleted.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};


	/* Init */

	var init = function(){
		_this.get(_this.coordId);

	};

	init();

});

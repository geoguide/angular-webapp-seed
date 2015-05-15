'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:DoctorCtrl
 * @description
 * # DoctorCtrl
 * Controller of the angularWebappSeedApp
 */

angular.module('angularWebappSeedApp')
  .controller('DoctorCtrl', function ($routeParams, $http, API_URL, doctorFactory, toasty) {
	
	var _this = this;
	this.doctorId = $routeParams.id;
	this.doctorData = null;
	this.activeTab = 0;
   
	this.get = function(doctorId){
		
		var doctorData = doctorFactory.getDoctor(doctorId);
		
		doctorData.then(function(data){
			_this.doctorData = data;
		},function(error){
			_this.doctorData = null;
		});
	};
	
	this.create = function(newDoc){
		
		var doctorData = doctorFactory.createDoctor(newDoc);
		
		doctorData.then(function(data){
			_this.doctorData = data;
		},function(error){
			_this.doctorData = null;
		});
	};
	
	this.save = function(){
		doctorFactory.saveDoctor(_this.doctorData).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Doctor Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.doctorData = data;
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.message,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.delete = function(){
		doctorFactory.deleteDoctor(_this.doctorId).then(function(data){
			_this.doctorData = null;
			toasty.pop.success({
				title: 'Success!',
				msg: 'Doctor Deleted.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.message,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.get(this.doctorId);
	
});

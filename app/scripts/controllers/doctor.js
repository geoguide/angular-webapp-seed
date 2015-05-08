'use strict';

/**
 * @ngdoc function
 * @name angularWebappSeedApp.controller:DoctorCtrl
 * @description
 * # DoctorCtrl
 * Controller of the angularWebappSeedApp
 */
 
//TODO: Move these to doctorFactory
//TODO: Convert form to formly http://angular-formly.com/#/example/other/advanced-layout

angular.module('angularWebappSeedApp')
  .controller('DoctorCtrl', function ($scope,$routeParams,$http, API_URL,doctorFactory,toasty) {
	$scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
	];
	var _this = this;
	this.doctorId = $routeParams.id;
   this.formData = null;
   

   this.activeTab = 0;
   
	this.get = function(doctorId){
		
		var doctorData = doctorFactory.getDoctor(doctorId);
		
		doctorData.then(function(data){
			_this.formData = data;
		},function(error){
			_this.formData = null;
		});
	};
	
	this.save = function(){
		doctorFactory.saveDoctor(_this.formData).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Doctor Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.formData = data;
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
			_this.formData = null;
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

'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:LookupDoctorCtrl
 * @description
 * # LookupDoctorCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('LookupDoctorCtrl', function ($routeParams, lookupFactory, toasty, $log,$modal) {
	
	var _this = this;
	this.doctorId = $routeParams.claim_id;
	this.doctorData = null;
	var licenseData = [];
	
	this.today = new Date();
	var dd = this.today.getDate();
	var mm = this.today.getMonth()+1; //January is 0!
	var yyyy = this.today.getFullYear();
	
	if(dd<10) {
	    dd='0'+dd;
	} 
	
	if(mm<10) {
	    mm='0'+mm;
	} 
	
	this.opened = { 'start': false, 'end': false };
	this.open = function($event,which) {
		$event.preventDefault();
		$event.stopPropagation();
		
		_this.opened[which] = true;
	};
	
	this.today = mm+'/'+dd+'/'+yyyy;
	
	this.get = function(doctorId){
		
		var doctorData = lookupFactory.getLookupDoctor(doctorId);
		
		doctorData.then(function(data){
			_this.doctorData = data;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.doctorData = null;
		});
	};
	
	this.getLicenses = function(doctorId){
		
		
		lookupFactory.getLicenses(doctorId).then(function(data){
			_this.licenseData = data;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.doctorData = null;
		});
	};
	
	this.save = function(){
		lookupFactory.saveLookup(_this.doctorData).then(function(data){
			toasty.pop.success({
				title: 'Success!',
				msg: 'Record Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.get(_this.doctorId);
		}, function(error){
			toasty.pop.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.delete = function(){
		lookupFactory.deleteLookup(_this.doctorId).then(function(data){
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
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};
	
	this.openModal = function(modalId,dataIn){
		this.modalInstance = $modal.open({
			templateUrl: modalId,
			controller: 'ModalCtrl',
			controllerAs: 'modal',
			resolve: {
				modalObject: function(){
					return dataIn;
				},
				title: function(){
					return 'Lookup License';
				},
				parentCtrl: function(){
					return _this;
				}
			}
		});

		_this.modalInstance.result.then(function (data) {
			console.log(data);
			var licenseAction;
			if(data.id){
				licenseAction = lookupFactory.updateLicense(_this.doctorId,data);
			} else {
				data.claim_id = _this.doctorId;
				licenseAction = lookupFactory.addLicense(_this.doctorId,data);
			}
			licenseAction.then(function(){
				_this.getLicenses(_this.doctorId);
				_this.get(_this.doctorId);
			},function(error){
				$log.error(error);
			});
		}, function () {
			//something on close
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	
	/* Init */

	var init = function(){
		_this.get(_this.doctorId);
		_this.getLicenses(_this.doctorId);
		
	};
	
	init();
	
});

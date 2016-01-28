'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:LookupDoctorCtrl
 * @description
 * # LookupDoctorCtrl
 * Controller of the modioAdminPortal
 */

angular.module('modioAdminPortal').controller('LookupDoctorCtrl', function ($routeParams, lookupFactory, toasty, $log,$modal) {

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

		lookupFactory.getLookupDoctor(doctorId).then(function(data){
			_this.doctorData = data;
			return lookupFactory.getLicenses(_this.doctorId);
		}).then(function(result){
			_this.licenseData = result;
			_this.error = false;
		},function(error){
			_this.error = true;
			_this.doctorData = null;
		});
	};

	this.save = function(){
		lookupFactory.saveLookup(_this.doctorData).then(function(data){
			toasty.success('Record Saved.');
			_this.get(_this.doctorId);
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};

	this.delete = function(){
		lookupFactory.deleteLookup(_this.doctorId).then(function(data){
			_this.doctorData = null;
			toasty.success('Doctor Deleted.');
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};

	this.setPrimaryLicense = function(obj){
      for(var i=0;i<_this.licenseData.length;i++){
        var license = _this.licenseData[i];
        //$log.info('license:' + license);
        if (license.id != obj.id) {
          if (license.primary_license === 1) {
            //$log.info('setting to non primary:' + license.id);
            license.primary_license = 0;
            lookupFactory.updateLicense(_this.doctorId,license);
          }
        }
      }
      obj.primary_license = 1;
      //$log.info('setting to primary:' + obj.id);

      lookupFactory.updateLicense(_this.doctorId,obj);
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
			var licenseAction;
			if(data.id){
				licenseAction = lookupFactory.updateLicense(_this.doctorId,data);
			} else {
				data.claim_id = _this.doctorId;
				licenseAction = lookupFactory.addLicense(_this.doctorId,data);
			}
			licenseAction.then(function(){
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
	_this.get(_this.doctorId);

});

'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:AccountInfoCtrl
 * @description
 * # AccountInfoCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('AccountInfoCtrl', function ($routeParams, doctorFactory,specialtyFactory, toasty, $log, $modal, offerFactory, jobFactory) {

	var _this = this;
	this.doctorId = $routeParams.id;
	this.newPassword = null;
	this.doctorData = null;
	this.states = [];
	this.drSpecialties = [];
	this.offers = [];
	this.jobs = [];
	this.newOffer = {};
	this.additionalCerts = [];
	this.abmsCertifications = [];
	this.boardSpecialties = [];
	this.additional_certification_types = [
		{ id: 0, name: 'ATLS/ACLS'},
		{ id: 1, name: 'PALS'},
		{ id: 2, name: 'BLS'},
		{ id: 3, name: 'ARLS'},
		{ id: 4, name: 'NALS'}
	];


	this.loadCertifications = function(boardName){
		_this.boardSpecialties = specialtyFactory.getCertificationsByBoard(boardName);
	};
	this.get = function(doctorId){

		var doctorData = doctorFactory.getDoctor(doctorId);

		doctorFactory.getSpecialties(doctorId).then(function(data){
			_this.specialtyData = data;
		});

		doctorFactory.getAdditionalCertifications(doctorId).then(function(data){
			_this.additionalCerts = data;
		});

		doctorFactory.getABMSCertifications(doctorId).then(function(data){
			_this.abmsCertifications = data;
		});

		doctorData.then(function(data){
			_this.doctorData = data;
			_this.doctorData.date_of_birth = _this.doctorData.date_of_birth || '2000-06-22';
			_this.drSpecialties = data.specialties;
			_this.error = false;

		},function(error){
			_this.error = true;
			_this.doctorData = null;
		});
	};

	/* date picker stuff */
	this.opened = {};
	this.open = function($event,which) {
		$event.preventDefault();
		$event.stopPropagation();

		_this.opened[which] = true;
	};
	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
	this.format = this.formats[4];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};


	this.submitSpecialty = function(dspec){
		doctorFactory.saveSpecialty(_this.doctorId,dspec).then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Specialties Saved.',
				showClose: true,
				clickToClose: true
			});
			doctorFactory.getSpecialties(_this.doctorId).then(function(data){
				_this.specialtyData = _this.drSpecialties = data;
			});
			_this.doctorData = data;
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.submitABMSCertifications = function(abmscert){

		doctorFactory.saveABMSCertification(_this.doctorId,abmscert).then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Certification Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.doctorData = data;
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.deleteABMSCertification = function(dcert){
		doctorFactory.removeABMSCertification(_this.doctorId,dcert).then(function(data){
			doctorFactory.getABMSCertifications(_this.doctorId).then(function(data){
				_this.abmsCertifications = data;
			});
			toasty.success({
				title: 'Success!',
				msg: 'Certification Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.doctorData = data;
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.submitAdditionalCertification = function(dcert){

		doctorFactory.saveAdditionalCertification(_this.doctorId,dcert).then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Certification Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.doctorData = data;
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.deleteCertification = function(dcert){
		doctorFactory.removeAdditionalCertification(_this.doctorId,dcert).then(function(data){
			doctorFactory.getAdditionalCertifications(_this.doctorId).then(function(data){
				_this.additionalCerts = data;
			});
			toasty.success({
				title: 'Success!',
				msg: 'Certification Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.doctorData = data;
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	/* Other stuff */

	this.deleteSpecialty = function(dspec){
		doctorFactory.removeSpecialty(_this.doctorId,dspec).then(function(data){
			doctorFactory.getSpecialties(_this.doctorId).then(function(data){
				_this.specialtyData = data;
			});
			toasty.success({
				title: 'Success!',
				msg: 'Certification Saved.',
				showClose: true,
				clickToClose: true
			});
			_this.doctorData = data;
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.updatePassword = function(){
		if(_this.newPassword && _this.newPassword.length >= 8){
			doctorFactory.updatePassword(_this.doctorId,_this.newPassword).then(function(data){
				toasty.success({
					title: 'Success!',
					msg: 'Password Changed.',
					showClose: true,
					clickToClose: true
				});
				_this.doctorData = data;
			}, function(error){
				toasty.error({
					title: 'Error!',
					msg: error.data,
					showClose: true,
					clickToClose: true
				});
			});
		} else {
			toasty.error({
				title: 'Error!',
				msg: 'Invalid password',
				showClose: true,
				clickToClose: true
			});
		}

	};

	this.updateEmail = function(){
		doctorFactory.saveDoctor({id: _this.doctorId, email:_this.doctorData.email}).then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Email Changed.',
				showClose: true,
				clickToClose: true
			});
			_this.doctorData = data;
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: JSON.stringify(error.data),
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.updateState = function(abbr){
		var action;
		if(_this.states[abbr]){ //If it is checked
			action = doctorFactory.addState(_this.doctorId,abbr);
	   } else {
		 	action = doctorFactory.removeState(_this.doctorId,abbr);
		}
		action.then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'State Updated.',
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

	this.addSpecialty = function(){
		_this.specialtyData.push({});
	};
	this.addCertification = function(){
		_this.additionalCerts.push({});
	};
	this.addABMSCertification = function(){
		_this.abmsCertifications.push({});
	};

	/* Offers */

	this.acceptOffer = function(offerId){
		offerFactory.acceptOffer(offerId).then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Offer Updated.',
				showClose: true,
				clickToClose: true
			});
			loadOffers();
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.rejectOffer = function(offerId){
		offerFactory.rejectOffer(offerId).then(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Offer Updated.',
				showClose: true,
				clickToClose: true
			});
			loadOffers();
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
		});
	};

	this.submitOffer = function(){
		_this.newOffer.doctor_id = _this.doctorId;
		offerFactory.createOffer(_this.newOffer).success(function(data){
			toasty.success({
				title: 'Success!',
				msg: 'Offer Updated.',
				showClose: true,
				clickToClose: true
			});
			loadOffers();
			_this.newOffer = {};
			_this.edit_offer_form.$setPristine();
		}).error(function(error){
			toasty.error({
				title: 'Error!',
				msg: 'Offer Bad.',
				showClose: true,
				clickToClose: true
			});
		});
	};

	var loadOffers = function(){
		doctorFactory.getJobOffers(_this.doctorId).then(function(data){
			_this.offers = data;
		});
	};

	var loadJobs = function(){
		jobFactory.queryJobs({}).then(function(jobsInfo){
			_this.jobs = jobsInfo.jobs;
		});
	};

	var init = function(){
		_this.get(_this.doctorId);

		doctorFactory.getStates(_this.doctorId).then(function(data){

			_this.states = data;
			for(var s=0;s<_this.states.length;s++){
				var abbr = _this.states[s];
				_this.states[abbr] = true;
			}
		});
		loadJobs();
		loadOffers();
	};
	init();
});

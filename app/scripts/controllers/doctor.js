'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DoctorCtrl
 * @description
 * # DoctorCtrl
 * Controller of the modioAdminPortal
 */

angular.module('modioAdminPortal').controller('DoctorCtrl', function (ENV, $routeParams, $window, doctorFactory, toasty, $log, MODIOCORE) {

  var _this = this;
  this.doctorId = $routeParams.id;
  this.tab = 'general-info';
  this.doctorData = null;
  this.loading = true;
  this.error = false;
  this.trackingData = [];
  this.env = ENV;
  this.licenses = [];

  //Date of Birth Picker
  this.opened = false;
  this.open = function ($event) {
    $log.log('open called');
    $event.preventDefault();
    $event.stopPropagation();
    _this.opened = true;
  };

  this.get = function (doctorId) {
    _this.loading = true;
    _this.getTracking(_this.doctorId);
    _this.getJobMatches(_this.doctorId);
    _this.getJobOffers(_this.doctorId);

    doctorFactory.getDoctor(doctorId).then(function (response) {
      _this.doctorData = response.data;
      _this.doctorData.date_of_birth = _this.doctorData.date_of_birth || null;
      _this.setJobTypeDesired(_this.doctorData);

      _this.drSpecialties = response.data.specialties;
      _this.rates = response.data.rates;
      _this.bookmarked = response.data.bookmarked;
      _this.error = false;
      _this.loading = false;
      return doctorFactory.getMedicalLicenses(_this.doctorId);
    }).then(function (result) {
      _this.licenses = result;
    }, function (error, status) {
      _this.loading = false;
      _this.error = true;
      _this.doctorData = null;
    });
  };

  this.save = function () {
    delete _this.doctorData.rates;
    _this.doctorData.job_type_desired = 0;
    for (var i = 0; i < _this.doctorData.selected_job_type_desired.length; i++) {
      _this.doctorData.job_type_desired += _this.doctorData.selected_job_type_desired[i];
    }

    doctorFactory.saveDoctor(_this.doctorData).then(function (data) {
      toasty.success({title: 'Success!', msg: 'Doctor Saved.'});
      _this.doctorData = data;
      _this.setJobTypeDesired(_this.doctorData);
    }, function (error) {
      $log.error(error);
      toasty.error({title: 'Error!', msg: error.data});
    });
  };

  this.archive = function () {
    _this.doctorData.disposition = 6;
    _this.save();
  };

  this.delete = function () {
    doctorFactory.deleteDoctor(_this.doctorId).then(function (data) {
      _this.doctorData = null;
      toasty.success({title: 'Admin Wins!', msg: 'Flawless Victory.'});
      _this.doctorData = null;
      _this.error = true;
      _this.eggActivated = false;
    }, function (error) {
      $log.error(error);
      toasty.error({title: 'Error!', msg: 'Please Insert More Credits'});
    });
  };

  this.actAs = function () {
    doctorFactory.actAs(_this.doctorId).then(function (response) {
      $window.open(ENV.doctorApp + '/admin/act-as/' + response.data.token, '_blank');
      toasty.success('u r provider');
    }, function (error) {
      $log.error(error);
      toasty.error({title: 'Error!', msg: error.data});
    });
  };

  this.bookmark = function (idIn) {
    _this.bookmarked = !!!_this.bookmarked;
    if (_this.bookmarked) {
      doctorFactory.bookmark(idIn).then(function () {

      }, function (error) {
        $log.error(error);
      });
    } else {
      doctorFactory.removeBookmark(idIn).then(function () {
        //silence
      }, function (error) {
        $log.error(error);
      });
    }

  };

  this.getTracking = function (doctor_id) {
    return doctorFactory.getTracking(doctor_id).then(function (result) {
      _this.trackingData = result;
      return result;
    }).catch(function (error) {
      $log.error(error);
    });
  };

  this.getJobMatches = function (doctor_id) {
    return doctorFactory.getJobMatches(doctor_id).then(function (result) {
      _this.matches = result;
      return result;
    }).catch(function (error) {
      $log.error(error);
    });
  };

  this.getJobOffers = function (doctor_id) {
    return doctorFactory.getJobOffers(doctor_id).then(function (result) {
      _this.offers = result;
      return result;
    }).catch(function (error) {
      $log.error(error);
    });
  };

  this.setJobTypeDesired = function (doctorData) {
    doctorData.selected_job_type_desired = [];
    var jobTypes = MODIOCORE.jobTypes.getValues();

    for (var key in jobTypes) {
      var jobType = jobTypes[key].id;
      if ((doctorData.job_type_desired & jobType) == jobType) {
        doctorData.selected_job_type_desired.push(jobType);
      }
    }
  };

  /* Init */
  _this.get(_this.doctorId);

});

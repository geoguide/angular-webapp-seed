'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:TrackingCtrl
 * @description
 * # TrackingCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('TrackingCtrl', function ($routeParams, doctorFactory, toasty, $log, $modal) {

  var _this = this;
  this.doctorId = $routeParams.id;
  this.tab = 'tracking';
  this.trackingData = [];

  /* Init */

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

  var init = function () {
    _this.getJobMatches(_this.doctorId);
    _this.getJobOffers(_this.doctorId);
    _this.getTracking(_this.doctorId).then(function () {
      return doctorFactory.getDoctor(_this.doctorId);
    }).then(function (result) {
      _this.bookmarked = result.data.bookmarked;
      _this.loading = false;
    }, function (error) {
      $log.error(error);
    });
  };

  init();

});

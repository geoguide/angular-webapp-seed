'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ProviderOffersCtrl
 * @description
 * # ProviderOffersCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('ProviderOffersCtrl', function ($routeParams, doctorFactory, $log) {

  var _this = this;
  this.doctorId = $routeParams.id;
  this.offers = [];
  this.tab = 'offers';

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

  this.load = function () {
    _this.getTracking(_this.doctorId);
    _this.getJobMatches(_this.doctorId);
    _this.getJobOffers(_this.doctorId).then(function () {
      return doctorFactory.getDoctor(_this.doctorId);
    }).then(function (result) {
      _this.bookmarked = result.data.bookmarked;
    }, function (error) {
      $log.error(error);
    });
  };

  this.load();

});

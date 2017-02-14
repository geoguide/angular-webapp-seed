'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ProviderNotesCtrl
 * @description
 * # FacilityCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('ProviderNotesCtrl', function($routeParams, $log, doctorFactory, toasty) {
    var _this = this;
    this.doctorId = $routeParams.id;
    this.tab = 'provider-notes';
    this.provider = null;
    this.error = false;
    this.loading = true;

    this.load = function(providerId) {
      return doctorFactory.getDoctor(providerId).then(function(response) {
        _this.provider = response.data;
        _this.loading = false;
      }).catch(function(error) {
        _this.error = true;
        _this.loading = false;
        $log.error(error);
      });
    };

    this.save = function() {
      doctorFactory.saveDoctor(_this.provider).then(function(data) {
        toasty.success({
          title: 'Success!',
          msg: 'Doctor Saved.'
        });
        _this.provider = data;
      }, function(error) {
        $log.error(error);
        toasty.error({
          title: 'Error!',
          msg: error.data
        });
      });
    };

    this.load(this.doctorId);
  });

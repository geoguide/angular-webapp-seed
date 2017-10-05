'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilityPermissionsCtrl
 * @description
 * # FacilityPermissionsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('FacilityPermissionsCtrl', function($routeParams, facilityFactory, MODIOCORE, toasty) {
    var _this = this;
    this.facilityId = $routeParams.id;
    this.membership = false;
    this.tab = 'facility-permissions';
    this.error = false;
    this.loading = true;
    this.facilityData = null;
    this.permissions = {};
    this.MODIOCORE = MODIOCORE;
    this.payorTypes = this.MODIOCORE.payorTypes.toArray();

    this.get = function (facilityId) {
      var facilityData = facilityFactory.getFacility(facilityId);
      facilityData.then(function (data) {
        _this.facilityData = data;
        _this.membership = _this.facilityData.settings & _this.MODIOCORE.facilitySettings.values.membership.id;
        return facilityFactory.getPermissions(_this.facilityId);
      }).then(function(permissions) {
        _this.permissions.selected_payors = permissions.payors.map(function(payor_id) {
          return _this.MODIOCORE.payorTypes.get({id: payor_id});
        });
        _this.error = false;
        _this.loading = false;
      }, function (error) {
        _this.error = true;
        _this.facilityData = null;
        _this.loading = false;
      });
    };

    this.savePermissions = function() {
      var payors = this.permissions.selected_payors.map(function(payor) {
        return payor.id;
      });

      facilityFactory.submitPermissions(this.facilityId, {
        payors: payors
      }).then(function (data) {
        toasty.success('Permissions Saved.');
      }, function (error) {
        toasty.error(error.data);
      });
    };

    /* Init */

    var init = function() {
      _this.get(_this.facilityId);
    };

    init();
  });

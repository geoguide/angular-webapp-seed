'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilityCtrl
 * @description
 * # FacilityCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('FacilityCtrl', function ($scope, $routeParams, facilityFactory, toasty, $log, $modal, MODIOCORE, $modalStack) {
    var _this = this;
    this.MODIOCORE = MODIOCORE;
    this.facilityId = $routeParams.id;
    this.facilityData = null;
    this.tab = 'facility-info';
    this.opened = false;
    this.error = false;
    this.loading = true;
    this.membership = false;
    this.facilitySettings = facilityFactory.getSettings().values;
    this.settings = facilityFactory.getSettingsList();
    this.facilityTypes = MODIOCORE.facilityTypes.toArray();
    this.states = MODIOCORE.states.toArray();
    this.services = [];
    this.open = function ($event) {
      $log.log('open called');
      $event.preventDefault();
      $event.stopPropagation();

      _this.opened = true;
    };

    this.openAssignServiceOwnerModal = function (item) {
      facilityFactory.getFacilityMembers({
        facility_id: _this.facilityId,
        user_roles: ['C', 'R']
      }).then(function(facilityMembers){

        _this.facilityMembers = facilityMembers.map(function(member) {
          member.full_name = member.first_name + ' ' + member.last_name;

          if (member.user_role === 'C') {
            member.role = 'Coordinator';
          } else if (member.user_role === 'R') {
            member.role = 'Recruiter';
          }

          return member;
        });
        this.modalInstance = $modal.open({
          templateUrl: 'assign-service-owner-modal',
          controller: 'ModalCtrl',
          controllerAs: 'modal',
          size: 'sm',
          scope: $scope,
          resolve: {
            modalObject: function(){
              return item;
            },
            parentCtrl: function(){
              return _this;
            }
          }
        });

        _this.modalInstance.result.then(function (data) {
          console.log(data);
          //something on close
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      }).catch(function(error){
        toasty.error(error.data);
      });
    };

    this.closeModal = function(){
      $modalStack.dismissAll();
    };

    this.getFacility = function (facilityId) {
      return facilityFactory.getFacility(facilityId).catch(function (error) {
        _this.error = true;
        _this.loading = false;
        _this.facilityData = null;
        throw error;
      });
    };

    this.getServicesList = function () {
      return facilityFactory.getServicesList();
    };

    this.save = function () {
      var facility = {};

      var settings = _this.facilityData.selected_settings.concat(_this.facilityData.selected_statuses);
      _this.facilityData.settings = facilityFactory.mapSettings(settings);

      angular.copy(_this.facilityData, facility);

      var mapped_services = _this.facilityData.selected_services.map(function(item){
        return {
          service_id: item.id,
          owner_id: item.owner_id,
          enabled: 1
        };
      });

      for (var i = 0; i < _this.facilityData.services.length; i++) {
        var service = _this.facilityData.services[i];

        var foundServices = mapped_services.filter(function(item) {
          return item.service_id === service.service_id;
        });

        if (!foundServices.length) {
          mapped_services.push({
            service_id: service.service_id,
            enabled: 0
          });
        }
      }


      facility.services = mapped_services;
      delete facility.selected_settings;
      delete facility.selected_statuses;
      delete facility.selected_services;

      facilityFactory.saveFacility(facility).then(function (data) {
        toasty.success('Facility Saved.');
        _this.doctorData = data;
      }, function (error) {
        toasty.error(error.data);
      });
    };

    /* Init */

    var init = function () {
      _this.getServicesList().then(function (services) {
        _this.services = services;
        return _this.getFacility(_this.facilityId);
      }).then(function (data) {
        _this.facilityData = data;
        _this.facilityData.selected_settings = [];
        _this.facilityData.selected_statuses = [];
        _this.facilityData.selected_services = [];

        _this.membership = _this.facilityData.settings & _this.MODIOCORE.facilitySettings.values.membership.id;

        for (var i = 0; i < _this.settings.length; i++) {
          var item = _this.settings[i];
          if ((_this.facilityData.settings & item.id) === item.id) {
            if (item.group === 'Facility Settings') {
              _this.facilityData.selected_settings.push(item);
            } else if (item.group === 'Client Status') {
              _this.facilityData.selected_statuses.push(item);
            }
          }
        }

        for (i = 0; i < _this.facilityData.services.length; i++) {
          var facility_service = _this.facilityData.services[i];
          for (var j = 0; j < _this.services.length; j++) {
            var service = _this.services[j];
            if (facility_service.service_id === service.id) {
              service.owner_id = facility_service.owner_id;
              _this.facilityData.selected_services.push(service);
            }
          }
        }

        _this.loading = false;
      }).catch(function(error){
        toasty.error(error.data);
      });
    };

    init();
  });

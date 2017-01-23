'use strict';
/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilitiesCtrl
 * @description
 * # FacilitiesCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('FacilitiesCtrl', function ($scope, facilityFactory, applicationFactory, $log, $modalStack, $modal, MODIOCORE) {
  var _this = this;
  this.facilities = [];
  this.facilitiesWithMembers = [];
  this.formData = {};
  this.newFacility = {};
  this.totalFacilities = 0;
  this.perPage = 25;
  this.totalPages = this.totalFacilities / this.perPage;
  this.maxSize = 8;
  /* Private Functions */
  this.loading = true;
  this.queryData = facilityFactory.queryData;
  this.servicesFilterList = [];
  this.servicesList = [];
  this.settings = facilityFactory.getSettingsList();
  this.MODIOCORE = MODIOCORE;
  this.servicesRatesPopover = {
    templateUrl: 'services-rates-template.html'
  };

  this.open = function (modalId, dataIn) {
    _this.newFacility.selected_settings = _this.settings.filter(function (item) {
      return item.isDefault;
    });
    this.modalInstance = $modal.open({
      templateUrl: 'create-facility-modal',
      controller: 'ModalCtrl',
      controllerAs: 'modal',
      scope: $scope,
      resolve: {
        modalObject: function () {
          return dataIn;
        },
        parentCtrl: function () {
          return _this;
        }
      }
    });

    _this.modalInstance.result.then(function (data) {
      //something on close
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  this.closeModal = function () {
    $modalStack.dismissAll();
  };

  this.getResults = function () {
    _this.loading = true;
    _this.queryData.exclude_location = true;

    if (!_this.selectedServiceOwner) {
      _this.queryData.service_owner_id = null;
    }

    if (!_this.selectedFacilityName) {
      _this.queryData.q = null;
    }

    facilityFactory.queryFacilities(_this.queryData).then(function (response) {
      _this.facilities = response.facilities;
      _this.totalFacilities = response.total;
      _this.totalPages = _this.totalFacilities / _this.perPage;
      _this.loading = false;
    });
  };

  this.isMainTabActive = function () {
    if (_this.queryData.settings) {
      var tabs = _this.getTabs();
      for (var i = 0; i < tabs.length; i++) {
        if (_this.queryData.settings == tabs[i].id) {
          return false;
        }
      }
    }
    return true;
  };

  this.getTabs = function () {
    var tabs = facilityFactory.getSettings().toSortedArray('asc', 'orderPriority');
    return tabs.filter(function (item) {
      return item.group == 'Client Status';
    });
  };

  this.getServicesFilterList = function () {
    return facilityFactory.getServicesFilterList().then(function (result) {
      _this.servicesFilterList = result;
    });
  };

  this.getServicesList = function () {
    return facilityFactory.getServicesList().then(function(result) {
      _this.servicesList = result;
    });
  };

  this.changeTab = function (clientStatus) {
    _this.queryData.settings = clientStatus;
    _this.getResults();
  };

  this.getTotalAmount = function (rates) {
    var sum = 0;
    for (var i = 0; i < rates.length; i++) {
      if (rates[i].is_admin_filter) {
        sum += parseFloat(rates[i].rate) * parseInt(rates[i].quantity);
      }
    }

    return sum;
  };

  this.filterByService = function (service, owner) {
    if (service.id == _this.queryData.service_id) {
      _this.queryData.service_id = null;
    } else {
      _this.queryData.service_id = service.id;
    }

    if (owner) {
      _this.selectedServiceOwner = owner.first_name + ' ' + owner.last_name;
      _this.queryData.service_owner_id = owner.id;
    }
    _this.getResults();
  };

  this.getServicesOwners = function (queryString) {
    var queryData = {
      q: queryString
    };

    return facilityFactory.getServicesOwners(queryData).then(function (owners) {
      return owners.map(function (owner) {
        owner.full_name = owner.first_name + ' ' + owner.last_name;
        return owner;
      });
    });
  };

  this.submitFacility = function () {
    _this.newFacility.settings = facilityFactory.mapSettings(_this.newFacility.selected_settings);
    delete _this.newFacility.selected_settings;
    facilityFactory.createFacility(_this.newFacility).then(function (response) {
      applicationFactory.goTo('/facility/' + response.data.id);
      $modalStack.dismissAll();
    });
  };

  /* Public Functions */
  this.sortResult = function (sortOn) {
    _this.queryData.sortDirection = !_this.queryData.sortDirection;
    _this.queryData.sort_by = sortOn;
    _this.getResults();
  };
  this.goTo = applicationFactory.goTo;

  this.init = function () {
    if (!angular.equals({}, _this.queryData)) {
      for (var i = 0; i < _this.settings.length; i++) {
        var setting = _this.settings[i];
        if (_this.queryData.hasOwnProperty(setting.property)) {
          _this.facilitiesFilter = setting;
        }
      }
    }
    _this.getResults();
    _this.getServicesFilterList();
    _this.getServicesList();
  };

  //Init
  this.init();
});

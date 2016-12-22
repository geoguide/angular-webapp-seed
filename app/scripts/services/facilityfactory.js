'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.facilityFactory
 * @description
 * # facilityFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('facilityFactory', function ($http, API_URL, $log, MODIOCORE) {
  // Service logic
  // ...


  // Public API here
  return {
    getFacilities: function () {
      return $http.get(API_URL + '/admin/facilities/').then(function (response) {
        return response.data;
      });
    }, getFacilityMembers: function (data) {
      return $http.get(API_URL + '/admin/facilities/' + data.facility_id + '/members', {
        params: data
      }).then(function (response) {
        return response.data;
      });
    }, getSettings: function () {
      return MODIOCORE.facilitySettings;
    }, getSettingsList: function () {
      return MODIOCORE.facilitySettings.toArray();
    }, getServicesList: function () {
      return $http.get(API_URL + '/admin/services').then(function (response) {
        return response.data;
      });
    }, getServicesFilterList: function () {
      return $http.get(API_URL + '/admin/services-filter-data').then(function (response) {
        return response.data;
      });
    }, getServicesOwners: function (queryData) {
      return $http.get(API_URL + '/admin/facility-services/owners', {
        params: queryData
      }).then(function (response) {
        return response.data;
      });
    }, mapSettings: function (selected_settings) {
      var result = 0;
      for (var i = 0; i < selected_settings.length; i++) {
        result += selected_settings[i].id;
      }
      return result;
    }, getSettingsTitle: function (settings) {
      var facilitySettings = MODIOCORE.facilitySettings.toArray();
      var result = [];
      for (var i = 0; i < facilitySettings.length; i++) {
        var setting = facilitySettings[i];

        if ((settings & setting.id) == setting.id) {
          result.push(setting.name);
        }
      }
      return result.join(', ');
    }, getFacility: function (facilityId) {
      return $http.get(API_URL + '/admin/facilities/' + facilityId).then(function (response) {
        return response.data;
      });
    }, saveFacility: function (formData) {
      return $http.put(API_URL + '/admin/facilities/' + formData.id, formData);
    }, createFacility: function (formData) {
      return $http.post(API_URL + '/admin/facilities/', formData);
    }, queryFacilities: function (queryIn) {
      queryIn.sort_direction = (queryIn.sortDirection === true) ? 'DESC' : 'ASC';
      return $http.get(API_URL + '/admin/facilities', {params: queryIn}).then(function (response) {
        return response.data;
      }, function (error) {
        $log.error(error);
      });
    }, facilitiesWithMembers: function (query) {
      query = query || {};
      query.settings = MODIOCORE.facilitySettings.values.membership.id;
      return $http.get(API_URL + '/admin/facilities/', {params: query}).then(function (response) {
        return response.data.facilities;
      }, function (error) {
        $log.error(error);
      });
    }, queryMedicalSchools: function (queryIn) {
      queryIn.sort_direction = (queryIn.sortDirection === true) ? 'DESC' : 'ASC';
      return $http.get(API_URL + '/admin/medical-schools', {params: queryIn}).then(function (response) {
        return response.data;
      }, function (error) {
        $log.error(error);
      });
    }, queryData: {}
  };
});

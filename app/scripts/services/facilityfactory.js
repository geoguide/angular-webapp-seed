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
    }, deleteFacility: function(facility_id) {
      return $http.delete(API_URL + '/admin/facilities/' + facility_id);
    }, getMoodTypes: function() {
      return [
        {
          id: 0,
          name: 'Happy',
          class: 'fa-smile-o'
        },
        {
          id: 1,
          name: 'Neutral',
          class: 'fa-meh-o'
        },
        {
          id: 2,
          name: 'Unhappy',
          class: 'fa-frown-o'
        }
      ];
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
    }, getContacts: function(facilityId) {
      return $http.get(API_URL + '/admin/facilities/' + facilityId + '/contacts').then(function(response) {
        return response.data;
      });
    }, getListFacilitiesBySetting: function(setting_id) {
      return $http.get(API_URL + '/admin/facilities/settings/' + setting_id).then(function (response) {
        return response.data;
      });
    }, getPermissions: function(facilityId) {
      return $http.get(API_URL + '/admin/facilities/' + facilityId + '/permissions').then(function(response) {
        return response.data;
      });
    }, submitPermissions: function(facilityId, permissions) {
      return $http.post(API_URL + '/admin/facilities/' + facilityId + '/permissions', permissions).then(function(response) {
        return response.data;
      });
    } ,deleteContact: function(facilityId, contactId) {
      return $http.delete(API_URL + '/admin/facilities/' + facilityId + '/contacts/' + contactId).then(function(response) {
        return response.data;
      });
    }, submitContacts: function(facilityId, contacts) {
      return $http.post(API_URL + '/admin/facilities/' + facilityId + '/contacts', { contacts: contacts }).then(function(response) {
        return response.data;
      });
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
    }, queryData: {},
    getBusinessHours: function(facilityId) {
      return $http.get(API_URL + '/admin/facilities/' + facilityId + '/hours').then(function(response) {
          return response.data;
      });
    }, submitBusinessHours: function(facilityId, hours) {
      return $http.post(API_URL + '/admin/facilities/' + facilityId + '/hours', hours).then(function(response) {
          return response.data;
      });
    }, getBillingEntities: function () {
      return $http.get(API_URL + '/admin/facilities/billing-entities').then(function (response) {
          return response.data;
      });
    }
  };
});

'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.facilityFactory
 * @description
 * # facilityFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('facilityFactory', function ($http,API_URL,$log) {
	// Service logic
	// ...


	// Public API here
	return {
		getFacilities: function(){
			return $http.get(API_URL+'/admin/facilities/').then(function(response) {
				return response.data;
			});
		}, getSettingsList: function(){
		return [{
			property: 'is_medical_school',
			defaultValue: 0,
			label: 'Medical School'
		}, {
			property: 'is_primary',
			defaultValue: 0,
			label: 'Parent Facility'
		}, {
			property: 'is_active_client',
			defaultValue: 0,
			label: 'Active Client'
		}, {
			property: 'is_fellowship',
			defaultValue: 1,
			label: 'Fellowship'
		}, {
			property: 'is_residency',
			defaultValue: 1,
			label: 'Residency'
		}, {
			property: 'is_internship',
			defaultValue: 1,
			label: 'Internship'
		}, {
			property: 'is_education',
			defaultValue: 1,
			label: 'Education'
		}, {
			property: 'is_affiliation',
			defaultValue: 1,
			label: 'Affiliation'
		}, {
			property: 'is_work_history',
			defaultValue: 1,
			label: 'Work History'
		}];
		}, mapSettings: function(settings, obj) {
			var facility = angular.copy(obj);
			for (var i = 0; i < settings.length; i++) {
				var option = settings[i].property;
				var value = 0;

				for (var j = 0; j < facility.settings.length; j++) {
					var selectedOption = facility.settings[j].property;
					if (selectedOption == option) {
						value = 1;
						break;
					} else {
						value = 0;
					}
				}
				facility[option] = value;
			}
			delete facility.settings;
			return facility;
		}, settingsToProperties: function(settings, obj) {
				var mappedSettings = [];
				for (var i = 0; i < settings.length; i++) {
					var item = settings[i];
					if (obj.hasOwnProperty(item.property) && obj[item.property] == 1) {
						mappedSettings.push(item);
					}
				}
			return mappedSettings;
		}, getFacility: function(facilityId){
			return $http.get(API_URL+'/admin/facilities/'+facilityId).then(function(response) {
				return response.data;
			});
		}, saveFacility: function(formData){
			return $http.put(API_URL+'/admin/facilities/'+formData.id,formData);
		}, createFacility: function(formData){
			return $http.post(API_URL+'/admin/facilities/',formData);
		}, queryFacilities: function(queryIn){
			queryIn.sort_direction = (queryIn.sortDirection === true) ? 'DESC' : 'ASC';
			return $http.get(API_URL+'/admin/facilities',{params: queryIn}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, facilitiesWithMembers: function(query){
			return $http.get(API_URL+'/admin/facilities/memberships',{params: query}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, queryMedicalSchools: function(queryIn){
			queryIn.sort_direction = (queryIn.sortDirection === true) ? 'DESC' : 'ASC';
			return $http.get(API_URL+'/admin/medical-schools',{params: queryIn}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, queryData: {}
	};
});

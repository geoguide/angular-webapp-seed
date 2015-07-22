'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.doctorFactory
 * @description
 * # doctorFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('doctorFactory', function ($http,API_URL,$log) {
	// Service logic
	// ...

	var meaningOfLife = 42;

	// Public API here
	return {
		someMethod: function () {
			return meaningOfLife;
		}, createDoctor: function(formData){
			return $http.post(API_URL+'/admin/doctors/', formData).then(function(response) {
				return response.data;
			});
		}, getDoctor: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId).then(function(response) {
				return response.data;
			});
		}, saveDoctor: function(formData){
			return $http.put(API_URL+'/admin/doctors',formData).then(function(response) {
				return response.data;
			});
		}, deleteDoctor: function(doctorId){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId).then(function(response) {
				return true;
			},function(error){
				$log.error(error);
			});
		}, queryDoctors: function(queryData){
			var searchQuery, searchSpecialty, searchState, pageNumber, sortBy, sortDirection;
			searchQuery = queryData.search_query || '';
			searchSpecialty = queryData.search_specialty;
			searchState = queryData.search_state;
			pageNumber = queryData.page_number || 1;
			sortBy = queryData.sort_by;
			sortDirection = (queryData.sort_direction === true) ? 'ASC' : 'DESC';
			
			var request = API_URL+'/admin/doctors?q='+searchQuery+'&p='+pageNumber;
			
			if(searchSpecialty){
				request += '&specialty_id='+searchSpecialty;
			}
			if(searchState) {
				request += '&state='+searchState;
			}
			if(sortBy){
				request += '&sort_by='+sortBy;
			}
			request += '&sort_direction='+sortDirection;
			return $http.get(request).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, updatePassword: function(doctorId, newPass){
			$log.info('changing '+doctorId+'s password to '+newPass);
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/change-password',{password: newPass}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, getStates: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/states').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, addState: function(doctorId,abbr){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/add-state',{state: abbr}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, removeState: function(doctorId,abbr){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/remove-state',{state: abbr}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, addSpecialty: function(doctorId,spec){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/specialty',{specialty_id: spec}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, removeSpecialty: function(doctorId,spec){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/specialty/'+spec).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, saveRates: function(doctorId,rates){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/rates',{rates:rates}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, getJobApplications: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/job-applications').then(function(response) {
				return response.data;	
			}, function(error){
				$log.error(error);
			});
		},
	};
});

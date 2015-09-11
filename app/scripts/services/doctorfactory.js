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
		}, createCoordinator: function(formData){
			return $http.post(API_URL+'/admin/coordinators/', formData).then(function(response) {
				return response.data;
			});
		}, getDoctor: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId).then(function(response) {
				return response.data;
			});
		}, getCoordinator: function(idId){
			return $http.get(API_URL+'/admin/coordinators/'+idId).then(function(response) {
				return response.data;
			});
		}, getSpecialties: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/specialties').then(function(response) {
				return response.data;
			});
		}, getAdditionalCertifications: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/additional-certifications').then(function(response) {
				return response.data;
			});
		}, getABMSCertifications: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/abms-certifications').then(function(response) {
				return response.data;
			});
		}, saveDoctor: function(formData){
			return $http.put(API_URL+'/admin/doctors',formData).then(function(response) {
				return response.data;
			});
		}, saveCoordinator: function(formData){
			return $http.put(API_URL+'/admin/coordinators',formData).then(function(response) {
				return response.data;
			});
		}, deleteDoctor: function(doctorId){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId).then(function(response) {
				return true;
			},function(error){
				$log.error(error);
			});
		}, deleteCoordinator: function(idIn){
			return $http.delete(API_URL+'/admin/coordinators/'+idIn).then(function(response) {
				return true;
			},function(error){
				$log.error(error);
			});
		}, queryDoctors: function(queryData){
			//Put these all in array (or get as an array) and just parse the array for easiness
			var searchQuery, searchSpecialty, searchState, pageNumber, sortBy, sortDirection,searchDisposition,scoreLow,scoreHigh;
			searchDisposition = queryData.search_disposition || '';
			searchQuery = queryData.search_query || '';
			searchSpecialty = queryData.search_specialty;
			searchState = queryData.search_state;
			pageNumber = queryData.page_number || 1;
			sortBy = queryData.sort_by;
			sortDirection = (queryData.sort_direction === true) ? 'ASC' : 'DESC';
			scoreLow = queryData.score_low || null;
			scoreHigh = queryData.score_high || null;
			
			var request = API_URL+'/admin/doctors?q='+searchQuery+'&p='+pageNumber;
			
			if(searchSpecialty){
				request += '&specialty_id='+searchSpecialty;
			}
			if(scoreHigh){
				request += '&score_high='+scoreHigh;
			}
			if(scoreLow){
				request += '&score_low='+scoreLow;
			}
			if(searchDisposition){
				request += '&disposition='+searchDisposition;
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
		}, queryCoordinators: function(queryData){
			//Put these all in array (or get as an array) and just parse the array for easiness
			var searchQuery,pageNumber, sortBy, sortDirection;
			searchQuery = queryData.search_query || '';
			pageNumber = queryData.page_number || 1;
			sortBy = queryData.sort_by;
			sortDirection = (queryData.sort_direction === true) ? 'ASC' : 'DESC';
			
			var request = API_URL+'/admin/coordinators?q='+searchQuery+'&p='+pageNumber;
			
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
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/remove-state',{state: abbr});
		}, addSpecialty: function(doctorId,spec){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/specialty',{specialty_id: spec}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, saveSpecialty: function(doctorId,specialtyData){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/specialties',specialtyData).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, saveAdditionalCertification: function(doctorId,certificationInfo){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/additional-certifications',certificationInfo).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		},saveABMSCertification: function(doctorId,certificationInfo){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/abms-certifications',certificationInfo).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, removeAdditionalCertification: function(doctorId,cert){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/additional-certifications/'+cert);
		}, removeABMSCertification: function(doctorId,cert){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/abms-certifications/'+cert);
		}, removeSpecialty: function(doctorId,spec){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/specialties/'+spec);
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
		}, submitMembership: function(coordId,memData){
			return $http.post(API_URL+'/admin/coordinators/'+coordId+'/memberships', memData);
		}, removeMembership: function(coordId,membershipId){
			return $http.delete(API_URL+'/admin/coordinators/'+coordId+'/memberships/'+membershipId);
		}, getMemberships: function(coordId){
			return $http.get(API_URL+'/admin/coordinators/'+coordId+'/memberships/');
		}, actAs: function(userIdIn){
			return $http.post(API_URL+'/admin/'+userIdIn+'/act-as');
		}
	};
});

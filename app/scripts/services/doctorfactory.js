'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.doctorFactory
 * @description
 * # doctorFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('doctorFactory', function ($http,API_URL,$log,dateFactory) {
	// Service logic
	// ...

	// Public API here
	return {
		createDoctor: function(formData){
			return $http.post(API_URL+'/admin/doctors/', formData).then(function(response) {
				return response.data;
			});
		}, createCoordinator: function(formData){
			return $http.post(API_URL+'/admin/coordinators/', formData).then(function(response) {
				return response.data;
			});
		}, getDoctor: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId).success(function(response) {
				return response.data;
			}).error(function(error,status){
				return {status: status,error: error};
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
			formData.date_of_birth = dateFactory.process(formData.date_of_birth);
			return $http.put(API_URL+'/admin/doctors',formData).then(function(response) {
				return response.data;
			});
		}, saveUser: function(formData){
			return $http.put(API_URL+'/admin/users',formData).then(function(response) {
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
			queryData.sort_direction = (queryData.sort_direction === true) ? 'ASC' : 'DESC';
			queryData.score_low = queryData.score_low || null;
			queryData.score_high = (queryData.score_high != 100) ? queryData.score_high : null;

			var request = API_URL+'/admin/doctors';

			return $http.get(request, {params: queryData});
		}, queryCoordinators: function(queryData){
			delete queryData.score_low;
			delete queryData.score_high;
			queryData.sort_direction = (queryData.sort_direction === true) ? 'ASC' : 'DESC';

			var request = API_URL+'/admin/coordinators';

			return $http.get(request, { params: queryData }).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, updatePassword: function(userIdIn, newPass){
			return $http.post(API_URL+'/admin/users/'+userIdIn+'/change-password',{password: newPass}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
				return error;

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
		}, saveAdditionalCertification: function(doctorId,data){
			data.expiration_date = dateFactory.process(data.expiration_date);
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/additional-certifications',data).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, saveABMSCertification: function(doctorId,data){
			data.issue_date = dateFactory.process(data.issue_date);
			data.expiration_date = dateFactory.process(data.expiration_date);
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/abms-certifications',data).then(function(response) {
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
		}, getJobOffers: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/offers').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, submitMembership: function(coordId,memData){
			return $http.post(API_URL+'/admin/providers/'+coordId+'/memberships', memData);
		}, removeMembership: function(coordId,membershipId){
			return $http.delete(API_URL+'/admin/providers/'+coordId+'/memberships/'+membershipId);
		}, getMemberships: function(coordId){
			return $http.get(API_URL+'/admin/providers/'+coordId+'/memberships/').then(function(response){
				return response.data;
			});
		}, actAs: function(userIdIn){
			return $http.post(API_URL+'/admin/'+userIdIn+'/act-as');
		}, queryData: {
			score_low: 0,
			score_high: 100
		}, bookmark: function(idIn){
			return $http.post(API_URL+'/admin/doctors/'+idIn+'/bookmark');
		}, removeBookmark: function(idIn){
			return $http.delete(API_URL+'/admin/doctors/'+idIn+'/bookmark');
		}, getTracking: function(idIn){
			return $http.get(API_URL+'/admin/doctors/'+idIn+'/tracking').then(function(response){
				return response.data;
			});
		}, getJobMatches: function(idIn){
			return $http.get(API_URL+'/admin/doctors/'+idIn+'/matches').then(function(response){
				return response.data;
			});
		}, getJobMatchTotals: function(){
			return $http.get(API_URL+'/admin/doctors/match-count').then(function(response) {
				return response.data;
			});
		}, submitAuthInfo: function(doctorIdIn,authInfo){
			return $http.post(API_URL+'/admin/doctors/'+doctorIdIn+'/auth',authInfo).then(function(response) {
				return response.data;
			});
		}, getMedicalLicenses: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/medical-licenses').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		},
	};
});

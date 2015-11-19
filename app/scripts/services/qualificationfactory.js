'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.qualificationFactory
 * @description
 * # qualificationFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal')
  .factory('qualificationFactory', function ($http,$log,API_URL,$filter) {
    // Service logic
    // ...


    // Public API here
    return {
      getClinicalEvaluations: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/clinical-evaluations').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, submitClinicalEvaluation: function(doctorId,data){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/clinical-evaluations',data).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, deleteClinicalEvaluation: function(doctorId,evId){
			//TODO
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/medical-licenses/'+evId).then(function(response) {
				return true;
			}, function(error){
				$log.error(error);
			});
		}, getMedicalLicenses: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/medical-licenses').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, submitMedicalLicense: function(doctorId,data){
			data.issue_date = (data.issue_date === '2000-06-22') ? null : $filter('date')(new Date(data.issue_date), 'MM/dd/yyyy');
			data.expiration_date = (data.expiration_date === '2000-06-22') ? null : $filter('date')(new Date(data.expiration_date), 'MM/dd/yyyy');
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/medical-licenses',data).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, deleteMedicalLicense: function(doctorId,evId){
			//TODO
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/medical-licenses/'+evId).then(function(response) {
				return true;
			}, function(error){
				$log.error(error);
			});
		}, getFacilityAffiliations: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/facility-affiliations').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, queryFacilities: function(queryIn){
			return $http.get(API_URL+'/admin/facilities?q='+queryIn).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, submitFacilityAffiliation: function(doctorId,data){
			data.start_date = (data.start_date === '2000-06-22') ? null : $filter('date')(new Date(data.start_date), 'MM/dd/yyyy');
			data.end_date = (data.start_date === '2000-06-22') ? null : $filter('date')(new Date(data.end_date), 'MM/dd/yyyy');
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/facility-affiliations',data).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, deleteFacilityAffiliation: function(doctorId,evId){
			//TODO
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/facility-affiliations/'+evId).then(function(response) {
				return true;
			}, function(error){
				$log.error(error);
			});
		}, submitInsurance: function(docId,insuranceData){
			insuranceData.policy_effective_date = (insuranceData.policy_effective_date === '2000-06-22') ? null : $filter('date')(new Date(insuranceData.policy_effective_date), 'MM/dd/yyyy');
			insuranceData.policy_expiration_date = (insuranceData.policy_expiration_date === '2000-06-22') ? null : $filter('date')(new Date(insuranceData.policy_expiration_date), 'MM/dd/yyyy');
			insuranceData.retroactive_date = (insuranceData.retroactive_date === '2000-06-22') ? null : $filter('date')(new Date(insuranceData.retroactive_date), 'MM/dd/yyyy');
			return $http.post(API_URL+'/admin/doctors/'+docId+'/insurance', insuranceData);
		}, deleteInsurance: function(docId,insuranceId){
			return $http.delete(API_URL+'/admin/doctors/'+docId+'/insurance/'+insuranceId);
		}, getInsurance: function(docId){
			return $http.get(API_URL+'/admin/doctors/'+docId+'/insurance/');
		}
    };
  });

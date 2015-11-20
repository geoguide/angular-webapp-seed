'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.qualificationFactory
 * @description
 * # qualificationFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal')
  .factory('qualificationFactory', function ($http,$log,API_URL,dateFactory) {
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
			data.issue_date = dateFactory.process(data.issue_date);
			data.expiration_date = dateFactory.process(data.expiration_date);
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
			data.start_date = dateFactory.process(data.start_date);
			data.end_date =  dateFactory.process(data.end_date);
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
		}, submitInsurance: function(docId,data){
			data.policy_effective_date = dateFactory.process(data.policy_effective_date);
			data.policy_expiration_date = dateFactory.process(data.policy_expiration_date);
			data.retroactive_date = dateFactory.process(data.retroactive_date);
			return $http.post(API_URL+'/admin/doctors/'+docId+'/insurance', data);
		}, deleteInsurance: function(docId,insuranceId){
			return $http.delete(API_URL+'/admin/doctors/'+docId+'/insurance/'+insuranceId);
		}, getInsurance: function(docId){
			return $http.get(API_URL+'/admin/doctors/'+docId+'/insurance/');
		}
    };
  });

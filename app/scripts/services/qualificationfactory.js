'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.qualificationFactory
 * @description
 * # qualificationFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal')
  .factory('qualificationFactory', function ($http,$log,API_URL) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      },getClinicalEvaluations: function(doctorId){
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
			return $http.post(API_URL+'/admin/doctors/'+docId+'/insurance', insuranceData);
		}, deleteInsurance: function(docId,insuranceId){
			return $http.delete(API_URL+'/admin/doctors/'+docId+'/insurance/'+insuranceId);
		}, getInsurance: function(docId){
			return $http.get(API_URL+'/admin/doctors/'+docId+'/insurance/');
		}
    };
  });

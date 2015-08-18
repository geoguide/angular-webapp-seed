'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.experienceFactory
 * @description
 * # experienceFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal')
  .factory('experienceFactory', function ($http,API_URL,$log) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
			return meaningOfLife;
		}, submitTraining: function(doctorId, formData){
			$log.log('id recenived: '+JSON.stringify(doctorId));
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/training', formData).then(function(response) {
				return response.data;
			});
		}, deleteTraining: function(doctorId,expId){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/training/'+expId).then(function(response) {
				return response.data;
			});
		}, getTraining: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/training').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, submitMedicalSchool: function(doctorId,data){
			delete data.facility_name;
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/medical-school',data).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, getMedicalSchool: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/medical-school').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, getMedicalSchools: function(){
			return $http.get(API_URL+'/admin/medical-schools').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		},	submitWorkHistory: function(doctorId,data){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/work-history',data).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}, getWorkHistory: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/work-history').then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		},deleteWorkHistory: function(doctorId,expId){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/work-history/'+expId).then(function(response) {
				return response.data;
			});
		}
    };
  });

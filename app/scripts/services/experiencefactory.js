'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.experienceFactory
 * @description
 * # experienceFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('experienceFactory', function ($http,API_URL,$log,dateFactory) {
    // Service logic
    // ...

    // Public API here
    return {
	    submitTraining: function(doctorId, data){
			data.start_date = dateFactory.process(data.start_date);
			data.end_date = dateFactory.process(data.end_date);
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/training', data).then(function(response) {
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
			console.log(data.start_date);
			data.start_date = dateFactory.process(data.start_date);
			data.end_date = dateFactory.process(data.end_date);

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
			data.start_date = dateFactory.process(data.start_date);
			data.end_date = dateFactory.process(data.end_date);
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
		}, deleteWorkHistory: function(doctorId,expId){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/work-history/'+expId).then(function(response) {
				return response.data;
			});
		}
    };
  });

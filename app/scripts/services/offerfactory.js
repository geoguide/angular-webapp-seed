'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.offerFactory
 * @description
 * # offerFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('offerFactory', function ($http,API_URL,$log) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
     return {
		someMethod: function () {
			return meaningOfLife;
		}, getOffer: function(offerId){
			return $http.get(API_URL+'/admin/offers/'+offerId).then(function(response) {
				return response.data;
			});
		}, acceptOffer: function(offerId){
			return $http.post(API_URL+'/admin/offers/'+offerId+'/accept');
    }, submitRate: function(formData){
			return $http.post(API_URL+'/admin/offers/'+formData.id+'/rates',formData);
    }, deleteRate: function(data){
  			return $http.delete(API_URL+'/admin/rates/'+data.id);
		}, saveOffer: function(formData){
			return $http.put(API_URL+'/admin/offers/'+formData.id,formData).then(function(response) {
				return response.data;
			});
		}, rejectOffer: function(offerId){
			return $http.post(API_URL+'/admin/offers/'+offerId+'/reject');
		}, createOffer: function(offerData){
			return $http.post(API_URL+'/admin/offers/',offerData);
		}, queryOffers: function(queryData){
			queryData.q = queryData.q || '';
			queryData.sort_direction = (queryData.sort_direction === true) ? 'ASC' : 'DESC';
			queryData.p = queryData.p || 1;

			var request = API_URL+'/admin/offers';

			return $http.get(request,{params: queryData}).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}
	};
  });

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
		}, saveOffer: function(formData){
			return $http.put(API_URL+'/admin/offers/'+formData.id,formData).then(function(response) {
				return response.data;
			});
		}, rejectOffer: function(offerId){
			return $http.post(API_URL+'/admin/offers/'+offerId+'/reject');
		}, createOffer: function(offerData){
			return $http.post(API_URL+'/admin/offers/',offerData);
		}, queryOffers: function(queryData){
			var searchQuery, searchSpecialty, searchState, pageNumber, sortBy,sortDirection, jobStatus, jobSource;
			searchQuery = queryData.search_query || '';
			sortDirection = (queryData.sort_direction === true) ? 'ASC' : 'DESC';
			sortBy = queryData.sort_by;
			pageNumber = queryData.pageNumber || 1;
			
			var request = API_URL+'/admin/offers?q='+searchQuery+'&p='+pageNumber;
			
			
			if(sortBy){
				request += '&sort_by='+sortBy;
			}
			request += '&sort_direction='+sortDirection;
			return $http.get(request).then(function(response) {
				return response.data;
			}, function(error){
				$log.error(error);
			});
		}
	};
  });

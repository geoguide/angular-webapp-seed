'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.invoiceFactory
 * @description
 * # invoiceFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('invoiceFactory', function ($http,API_URL,$log) {
    // Service logic
    // ...


    // Public API here
    return {
      getInvoices: function(){
			return $http.get(API_URL+'/admin/invoices').then(function(response){
				return response.data;
			});
		}, submitInvoice: function(invoiceInfo){
			return $http.put(API_URL+'/admin/invoices',invoiceInfo).then(function(response){
				return response.data;
			});
		}
    };
  });

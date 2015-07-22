'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.userFactory
 * @description
 * # userFactory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('userFactory', function ($http, API_URL, $log) {

	var meaningOfLife = 42;

	// Public API here
	return {
		someMethod: function () {
			return meaningOfLife;
		}, changePassword: function(oldPassword,newPassword){
	      return $http.post(API_URL+'/admin/change-password', { old_password: oldPassword, new_password: newPassword });
		}
	};
});

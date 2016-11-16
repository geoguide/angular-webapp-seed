'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ChangePasswordCtrl
 * @description
 * # ChangePasswordCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('ChangePasswordCtrl', function (userFactory, toasty, $log) {

	var _this = this;

	this.oldPassword = '';
	this.newPassword = '';
	this.passwordRepeat = '';
	this.bookmarkedJobs = [];
	this.bookmarkedProviders = [];
	this.bookmarkedCoordinators = [];

	this.updatePassword = function(){
		if(_this.oldPassword){
			if(_this.newPassword == _this.passwordRepeat){
				userFactory.changePassword(_this.oldPassword,_this.newPassword).success(function(response){
					toasty.success('Password Updated.');
				}).error(function(error){
					$log.error(error);
					toasty.error('Something went wrong');
				});
			} else {
				toasty.error('Passwords did not match');
			}
		} else {
			toasty.error('Include your old password');
		}
	};

	this.getBookmarks = function(){
		userFactory.getBookmarks().then(function(books){
			_this.bookmarkedJobs = books.jobs;
			_this.bookmarkedProviders = books.providers;
			_this.bookmarkedCoordinators = books.coordinators;
		},function(error){
			$log.error(error);
		});
	};

});

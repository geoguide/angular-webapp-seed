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

	this.updatePassword = function(){
		if(_this.oldPassword){
			if(_this.newPassword == _this.passwordRepeat){
				userFactory.changePassword(_this.oldPassword,_this.newPassword).success(function(response){
					toasty.success({
						title: 'Success!',
						msg: 'Password Updated.',
						showClose: true,
						clickToClose: true
					});
				}).error(function(error){
					toasty.error({
						title: 'Error!',
						msg: 'Something went wrong',
						showClose: true,
						clickToClose: true
					});
				});
			} else {
				toasty.error({
					title: 'Error!',
					msg: 'Passwords did not match',
					showClose: true,
					clickToClose: true
				});
			}
		} else {
			toasty.error({
				title: 'Error!',
				msg: 'Include your old password',
				showClose: true,
				clickToClose: true
			});
		}
	};
	
	this.getBookmarks = function(){
		userFactory.getBookmarks().then(function(books){
			_this.bookmarkedJobs = books.jobs;
			_this.bookmarkedProviders = books.providers;
		},function(error){
			$log.error(error);
		});
	};

});

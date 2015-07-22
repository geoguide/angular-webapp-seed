'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ChangePasswordCtrl
 * @description
 * # ChangePasswordCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('ChangePasswordCtrl', function (userFactory, toasty) {

	var _this = this;
	
	this.oldPassword = '';
	this.newPassword = '';
	this.passwordRepeat = '';
	
	this.updatePassword = function(){
		if(_this.oldPassword){
			if(_this.newPassword == _this.passwordRepeat){
				userFactory.changePassword(_this.oldPassword,_this.newPassword).success(function(response){
					toasty.pop.success({
						title: 'Success!',
						msg: 'Password Updated.',
						showClose: true,
						clickToClose: true
					});
				}).error(function(error){
					toasty.pop.error({
						title: 'Error!',
						msg: 'Something went wrong',
						showClose: true,
						clickToClose: true
					});
				});
			} else {
				toasty.pop.error({
					title: 'Error!',
					msg: 'Passwords did not match',
					showClose: true,
					clickToClose: true
				});
			}
		} else {
			toasty.pop.error({
				title: 'Error!',
				msg: 'Include your old password',
				showClose: true,
				clickToClose: true
			});
		}
	};
	
});

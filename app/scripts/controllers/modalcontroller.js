'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ModalCtrl
 * @description
 * # ModalCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('ModalCtrl', function ($scope, $modalInstance, title, modalObject, parentCtrl) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
	this.modalObject = modalObject;
	this.parentCtrl = parentCtrl;
	this.title = title;
	
	this.ok = function () {
		$modalInstance.close(this.modalObject);
	};
	
	this.cancel = function () {
		$modalInstance.dismiss('cancel');
	};


	//Date picker stuff, this should be handled in a different place
	this.dpOpened = true;
	this.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		
		this.dpOpened = true;
	};
});

'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:InvoicesCtrl
 * @description
 * # InvoicesCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('InvoicesCtrl', function ($scope,invoiceFactory,$log,toasty) {
	var _this = this;
   this.statusList = [
		{ id: 0, name: 'Draft'},
		{ id: 1, name: 'Submitted'},
		{ id: 2, name: 'Approved'},
		{ id: 3, name: 'Invoiced'},
		{ id: 4, name: 'Paid'},
		{ id: 5, name: 'Rejected'}
	];
	
	this.getInvoices = function(){
		invoiceFactory.getInvoices().then(function(result){
			_this.invoices = result;
		}, function(error){
			$log.error(error);
		});
	};
	
	this.updateInvoice = function(iin){
		invoiceFactory.submitInvoice(iin).then(function(result){
			toasty.success({
				title: 'Success!',
				msg: 'Invoice Saved.',
				showClose: true,
				clickToClose: true
			});
		}, function(error){
			toasty.error({
				title: 'Error!',
				msg: error.data,
				showClose: true,
				clickToClose: true
			});
			$log.error(error);
		});
	};
	
	this.getInvoices();
});
  

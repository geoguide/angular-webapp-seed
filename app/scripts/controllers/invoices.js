'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:InvoicesCtrl
 * @description
 * # InvoicesCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('InvoicesCtrl', function ($scope,invoiceFactory,doctorFactory,ENV,$window,$log,toasty) {
	var _this = this;
   this.statusList = [
		{ id: 0, name: 'Draft'},
		{ id: 1, name: 'Submitted'},
		{ id: 2, name: 'Approved'},
		{ id: 3, name: 'Invoiced'},
		{ id: 4, name: 'Paid'},
		{ id: 5, name: 'Rejected'}
	];
	_this.queryData = {};

	this.getInvoices = function(){
		invoiceFactory.getInvoices(_this.queryData).then(function(result){
			_this.invoices = result;
		}, function(error){
			$log.error(error);
		});
	};

	this.sortResult = function(sortOn){
		_this.queryData.sort_by = sortOn;
		_this.queryData.sort_direction = (_this.queryData.sort_direction == 'DESC') ? 'ASC' : 'DESC';
		_this.getInvoices();
	};

	this.actAs = function(invoiceData){
		doctorFactory.actAs(invoiceData.doctor_id).then(function(response){
			console.log(invoiceData);
			$window.open(ENV.doctorApp+'/admin/act-as/'+response.data.token+'?target=accounting&facility_id='+invoiceData.facility_id, '_blank');
			toasty.success('Doctor Acted As.');
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};

	this.updateInvoice = function(iin){
		invoiceFactory.submitInvoice(iin).then(function(result){
			toasty.success('Invoice Saved.');
		}, function(error){
			$log.error(error);
			toasty.error(error.data);
		});
	};

	this.getInvoices();
});

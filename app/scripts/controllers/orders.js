'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:OrdersCtrl
 * @description
 * # OrdersCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('OrdersCtrl', function ($log, orderFactory,toasty) {

	var _this = this;
	this.orders = [];	
	this.statusList = [
		{
			id: 'N',
			name: 'New'	
		},{
			id: 'I',
			name: 'In Progress'	
		},{
			id: 'C',
			name: 'Completed'	
		},{
			id: 'X',
			name: 'Cancelled'
		}
		
	];
	
	this.getOrders = function(){
		orderFactory.getOrders().then(function(result){
			_this.orders = result;
		}, function(error){
			$log.error(error);
		});
	};
	
	this.updateOrder = function(orderIn){
		orderFactory.submitOrder(orderIn).then(function(result){
			toasty.success({
				title: 'Success!',
				msg: 'Order Saved.',
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
	this.getOrders();

});

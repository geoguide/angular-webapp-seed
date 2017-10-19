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
	this.queryData = {};
	this.getOrders = function(){
		orderFactory.getOrders(_this.queryData).then(function(result){
			_this.orders = result;
		}, function(error){
			$log.error(error);
		});
	};
	
	this.updateOrder = function(orderIn){
		orderFactory.submitOrder(orderIn).then(function(result){
			toasty.success('Order Saved.');
		}, function(error){
			toasty.error(error.data);
			$log.error(error);
		});
	};
	this.getOrders();

});

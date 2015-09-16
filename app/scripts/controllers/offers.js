'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:OffersCtrl
 * @description
 * # OffersCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('OffersCtrl', function ($modal, $modalStack, toasty, offerFactory, $log) {
	
	this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
	
	var _this = this;
	
	this.offers = [];
	this.searchQuery = '';
	this.totalJobs = 0;
	this.currentPage = 1;
	this.perPage = 25;
	this.totalPages = this.totalJobs / this.jobsPerPage;
	this.maxSize = 8;
	this.loading = true;
	
	/* Calendar */
	this.open = function($event) {
		$log.log('open called');
		$event.preventDefault();
		$event.stopPropagation();
		
		_this.opened = true;
	};
	
	this.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	
	this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	this.format = this.formats[0];
	this.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	};
	this.minDate = new Date();
	
	/* Methods */
	
	this.getResults = function(pageNumber) {
		_this.loading = true;
		pageNumber = pageNumber || 1;
		var queryData = {
			search_query: _this.searchQuery,
			page_number: _this.pageNumber,
			sort_by: _this.sortBy,
			sort_direction: _this.sortDirection
		};
		offerFactory.queryOffers(queryData).then(function(data) {
			_this.offers = data.offers;
			_this.totalOffers = data.total;
			_this.totalPages = _this.totalOffers / _this.perPage;
			_this.loading = false;
		});
	};
	
	this.sortResult = function(sortOn){
		_this.sortDirection = !_this.sortDirection;
		_this.sortBy = sortOn;
		_this.getResults();
	};
	
	var init = function(){
		_this.getResults(1);
	};
	init();
});
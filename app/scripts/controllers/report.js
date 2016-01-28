'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the modioAdminPortal
 */
 /* global
  moment, jQuery
*/
angular.module('modioAdminPortal').controller('ReportCtrl', function ($window,reportFactory,MODIOCORE,API_URL,localStorageService) {

  var  _this = this;

  this.licenses = [
    { id: 1, provider_name: 'Mernie Bann', type_id: 1, state: 'MA', expiration_date: '12/30/2017', expires: '94', alerts: 'wtf', date_updated: '01/26/2016'}
  ];
	this.totalRecords = 0;
	this.perPage = 25;
	this.totalPages = this.totalRecords / this.perPage;
	this.maxSize = 8;
	this.loading = false;
	this.queryData = reportFactory.queryData;

  this.licenseTypes = MODIOCORE.licenseTypes;

  this.serialize = function(obj) {
    var str = [];
    for(var p in obj){
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  };

  this.go = function () {
  $window.open( this.csvEndpoint+'&'+_this.serialize(_this.queryData));
};

  this.csvEndpoint = API_URL+'/public/download-license-csv?token='+localStorageService.get('adminAuthToken');

  this.changeLicenseType = function(typeId){
    _this.queryData.type_id = typeId;
    _this.getResults();
  };


	this.getResults = function() {
		_this.loading = true;
		reportFactory.queryLicenses(_this.queryData).then(function(response) {
			_this.licenses = response;
			_this.totalRecords = response.length;
			_this.totalPages = _this.totalRecords / _this.perPage;
			_this.loading = false;
		});
	};

  this.sortResult = function(sortOn){
		_this.queryData.sortDir = !!!_this.queryData.sortDir;
		_this.queryData.sort_by = sortOn;
		_this.getResults();
	};


  this.getDuration = function(date) {
      if (date) {
          var now = moment.utc();
          var expirationDate = moment.utc(date);
          if (expirationDate < now) {
              return 'expired';
          }
          try {
              return ((moment.duration(expirationDate - now)).humanize());
          } catch (e) {
              return 'Can not evaluate';
          }
      }
      return '';
  };
	_this.getResults();

});

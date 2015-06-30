'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:UploadsCtrl
 * @description
 * # UploadsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('UploadsCtrl', function (Upload,$scope,s3factory,$routeParams,$log,$timeout) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	var _this = this;
	
	this.doctorId = $routeParams.id;
	
	this.downloads = [];
	this.uploads = [];
	
	this.uploadTypes = [
		{
			short: 'cv',
			long: 'Curriculum Vitae (CV)'
		}, {
			short: 'color_passport',
			long: 'Color Passport Photo'
		}, {
			short: 'ppd_test_results',
			long: 'PPD Test Results'
		}, {
			short: 'liability_insurance_certificate',
			long: 'Professional Liability Insurance Certificate'
		}, {
			short: 'ecfmg_certificate',
			long: 'ECFMG Certificate'
		}
	];
	 
	$scope.upload = function (files,type) {
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				var filetype = files[i].type;
				var filesize = files[i].size;
				var filename = files[i].name;
				var ext = filename.split('.').pop();
				/* jshint ignore:start */
				s3factory.putObject(_this.doctorId, type, file).then(function(data){
					return s3factory.updateUploads(_this.doctorId, type, file.name);
				}).then(function(result){
					_this.loadUploads();
				}, function(error){
					$log.error(error);	
				});
				/* jshint ignore:end */
			}
		}
	};
    
    this.getFileLink = function(type){
	    s3factory.getSignedUrl(_this.doctorId,_this.uploads[type].file_name).then(function(response){
		    $log.info(response);
		 	_this.downloads[type] = response;
		 	$timeout(function(){ _this.downloads[type] = null; }, 60000);
	    });
    };
    
    this.loadUploads = function(){
		s3factory.getUploads(_this.doctorId).then(function(result){
			var files = [];
			for(var d=0;d<result.length;d++){
				var key = result[d].file_type;
				_this.uploads[key] = result[d];
	 		}
		});
	};
	
	this.deleteUpload = function(type){
		s3factory.deleteObject(_this.doctorId, type).then(function(response){
			return s3factory.deleteUploadRecord(_this.doctorId, type);
		}).then(function(response){
			_this.uploads = _this.downloads = [];
			_this.loadUploads();
		},function(error){
			$log.error(error);
		});
	};
    
    var init = function(){
	   _this.loadUploads(); 
    };
    
    init();
});

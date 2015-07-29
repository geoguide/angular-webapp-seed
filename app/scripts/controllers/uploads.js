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
        id:1,
        file:null,
        filename:null,
        title:'Curriculum Vitae (CV)',
        type:'cv'
      },
      {
        id:2,
        file:null,
        filename:null,
        title:'Color Passport Photo',
        type:'color_passport'
      },
      {
        id:3,
        file:null,
        filename:null,
        title:'PPD Test Results',
        type:'ppd_test_results'
      },
      {
        id:4,
        file:null,
        filename:null,
        title:'Professional Liability Insurance Certificate',
        type:'liability_insurance_certificate'
      },
      {
        id:5,
        file:null,
        filename:null,
        title:'ECFMG Certificate',
        type:'ecfmg_certificate'
      },
      {
        id:6,
        file:null,
        filename:null,
        title:'MD Diploma',
        type:'md_diploma'
      },
      {
        id:7,
        file:null,
        filename:null,
        title:'Residency, Internship, Fellowship Certificates',
        type:'residency_certificates'
      },
      {
        id:8,
        file:null,
        filename:null,
        title:'Social Security Card',
        type:'social_security_card'
      },
      {
        id:9,
        file:null,
        filename:null,
        title:'Immunization Information',
        type:'immunization_information'
      },
      {
        id:10,
        file:null,
        filename:null,
        title:'Case Logs',
        type:'case_logs'
      },
      {
        id:11,
        file:null,
        filename:null,
        title:'Board Certification Certificate(s)',
        type:'board_certification_certificate'
      },
      {
        id:12,
        file:null,
        filename:null,
        title:'NPDB Self-Query',
        type:'npdb_self_query'
      },
      {
        id:13,
        file:null,
        filename:null,
        title:'Facility Applications',
        type:'facility_applications'
      },
      {
        id:14,
        file:null,
        filename:null,
        title:'Facility Attestations',
        type:'facility_attestations'
      },
      {
        id:15,
        file:null,
        filename:null,
        title:'Payor Contracts',
        type:'payor_contracts'
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

'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:UploadsCtrl
 * @description
 * # UploadsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('JobFilesCtrl', function (Upload,$scope,s3factory,$routeParams,$log,$timeout,$window) {
  this.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
  var _this = this;

  this.entityId = $routeParams.id;
  this.componentId = 2;

  this.downloads = [];
  this.uploads = [];

  this.uploadTypes = [
    {
      id:0,
      file:null,
      filename: null,
      title: 'Private Files',
      type: 'private'
    },
    {
      id:1,
      file:null,
      filename:null,
      title:'Public Files',
      type:'public'
    }
  ];

  //$scope.getFileSize = function() {
  //  $log.info('getFileSize');
  //  return 'test';
  //};

  $scope.upload = function (files,tag) {
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        //var filetype = files[i].type;
        //var filesize = files[i].size;
        var filename = files[i].name;
        //var ext = filename.split('.').pop();
        /* jshint ignore:start */
        s3factory.putObject(tag, file, _this.componentId, _this.entityId, tag,
          function(data, status, headers, config) {
            //Success
            //_this.uploads[tag].push(
            //  {
            //    filename:filename
            //  }
            //);
            $log.info('s3 upload done');
            //_this.loadUploads();
          },
          function(data, status, headers, config) {
            //Error
            $log.info('s3 upload failed');
          }
        );
      }
    }
  };

  this.getFileLink = function(file){
    s3factory.getSignedUrl(_this.componentId, file.id).then(function(response){
      $log.info(response);
      _this.downloads[file.tag] = response;
      $window.location.href = response;
      //$timeout(function(){ _this.downloads[type] = null; }, 60000);
    });
  };

  this.loadUploads = function(){
    s3factory.getUploads(_this.componentId, _this.entityId, function(result){
      $log.log('loadUploads:'+result);
      _this.uploads = _this.downloads = [];
      //var files = [];
      for (var i=0;i<_this.uploadTypes.length;i++) {
        var key = _this.uploadTypes[i].type;
        //$log.info('key='+key);
        _this.uploads[key] = [];
      }
      for(var d=0;d<result.length;d++){
        $log.info('Result=' + result[d].filename);
        var key = result[d].tag;
        var file = result[d];
        if (file.filesize) {
          file.filesizeKB = Math.round(file.filesize / 1024 * 100)/100;
          file.filesizeMB = Math.round(file.filesize / 1024 / 1024 * 100)/100;
          if (file.filesizeMB > 1) {
            file.filesize = file.filesizeMB + ' MB';
          }
          else {
            file.filesize = file.filesizeKB + ' KB';
          }
        }
        _this.uploads[key].push(result[d]);
      }
      //$scope.$apply();
    });
  };

  this.deleteUpload = function(file){
    $log.log('deleteUpload:' + file.id);

    s3factory.deleteObject(_this.componentId, _this.entityId, file.id,
      function(data, status, headers, config) {
        //Success
        console.log("Deleted file: " + file.filename);
        $log.log(data);
        _this.loadUploads();
      },
      function(data, status, headers, config) {
        //Error
        console.log("FAILED to delete file: " + file.filename);
        $log.log(data);
        _this.loadUploads();
      }
    );
  };

  var init = function(){
    _this.loadUploads();
  };

  init();
});

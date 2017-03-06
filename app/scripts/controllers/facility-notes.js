'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilityCtrl
 * @description
 * # FacilityCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('FacilityNotesCtrl', function($routeParams, facilityFactory, toasty, $log, $modal, $window, s3factory, dateFactory, MODIOCORE) {
    var _this = this;
    this.facilityId = $routeParams.id;
    this.componentId = 3;
    this.facilityData = null;
    this.files = [];
    this.tab = 'facility-notes';
    this.error = false;
    this.loading = true;
    this.uploading = false;
    this.membership = false;
    this.MODIOCORE = MODIOCORE;
    this.moodTypes = facilityFactory.getMoodTypes();
    
    this.opened = {};
    this.open = function ($event, which) {
      $event.preventDefault();
      $event.stopPropagation();

      _this.opened[which] = true;
    };
    this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
    this.format = this.formats[4];
    this.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    this.get = function(facilityId) {
      var facilityData = facilityFactory.getFacility(facilityId);
      facilityData.then(function(data) {
        _this.facilityData = data;
        _this.membership = _this.facilityData.settings & _this.MODIOCORE.facilitySettings.values.membership.id;
        _this.error = false;
        _this.loading = false;
      }, function(error) {
        _this.error = true;
        _this.facilityData = null;
        _this.loading = false;
      });
    };

    this.save = function() {
      if (_this.facilityData.due_date) {
        _this.facilityData.due_date = dateFactory.process(_this.facilityData.due_date);        
      }
      
      facilityFactory.saveFacility(_this.facilityData).then(function(data) {
        toasty.success('Facility Saved.');
        _this.doctorData = data;
      }, function(error) {
        toasty.error(error.data);
      });
    };

    this.processS3 = function(tag, file, componentId, entityId, security) {
      _this.uploading = true;
      s3factory.putObject(file, componentId, entityId, tag, security, function(data,
        status, headers, config) {
        _this.loadUploads();
        _this.uploading = false;
        $log.info('s3 upload done');
      }, function(data, status, headers, config) {
        _this.uploading = false;
        $log.info('s3 upload failed');
      });
    };

    this.upload = function(files) {
      var tag = 'notes';
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var filename = files[i].name;
          _this.processS3(tag, file, _this.componentId, _this.facilityId, 'a');
        }
      }
    };

    this.loadUploads = function() {
      var key;
      s3factory.getUploads({
        componentId: _this.componentId,
        entityId: _this.facilityId,
        tag: 'notes'
      }, function(result) {
        $log.log(result);
        _this.files = [];
        for (var i = 0; i < result.length; i++) {
          $log.info(result[i].filename);
          key = result[i].tag;
          var file = result[i];
          if (file.filesize) {
            file.filesizeKB = Math.round(file.filesize / 1024 * 100) /
              100;
            file.filesizeMB = Math.round(file.filesize / 1024 / 1024 *
              100) / 100;
            if (file.filesizeMB > 1) {
              file.filesize = file.filesizeMB + ' MB';
            } else {
              file.filesize = file.filesizeKB + ' KB';
            }
          }
          _this.files.push(file);
        }
        console.log(_this.files);
        //$scope.$apply();
      });
    };

    this.getFileLink = function(file) {
      s3factory.getSignedUrl(_this.componentId, file.id).then(function(
        response) {
        $log.info(response);
        $window.location.href = response;
      });
    };

    this.deleteUpload = function(file) {
      $log.log('deleteUpload:' + file.id);

      s3factory.deleteObject(_this.componentId, _this.facilityId, file.id,
        function(data, status, headers, config) {
          //Success
          $log.log('Deleted file: ' + file.filename);
          $log.log(data);
          _this.loadUploads();
        },
        function(data, status, headers, config) {
          //Error
          $log.log('FAILED to delete file: ' + file.filename);
          $log.log(data);
          _this.loadUploads();
        }
      );
    };

    /* Init */

    var init = function() {
      _this.get(_this.facilityId);
      _this.loadUploads();
    };

    init();
  });

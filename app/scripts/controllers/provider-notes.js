'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:ProviderNotesCtrl
 * @description
 * # FacilityCtrl
 * Controller of the modioAdminPortal
 */

angular.module('modioAdminPortal')
  .controller('ProviderNotesCtrl', function($routeParams, $log, doctorFactory, $window, toasty, s3factory, MODIOCORE) {
    var _this = this;
    this.doctorId = $routeParams.id;
    this.tab = 'provider-notes';
    this.componentId = 1; //1 - Doctor
    this.doctorData = null;
    this.error = false;
    this.loading = true;
    this.uploading = false;
  

    this.load = function(providerId) {
      return doctorFactory.getDoctor(providerId).then(function(response) {
        _this.doctorData = response.data;
        _this.loading = false;
      }).catch(function(error) {
        _this.error = true;
        _this.loading = false;
        $log.error(error);
      });
    };

    this.save = function() {
      doctorFactory.saveDoctor(_this.doctorData).then(function(data) {
        toasty.success({
          title: 'Success!',
          msg: 'Doctor Saved.'
        });
        _this.doctorData = data;
      }, function(error) {
        $log.error(error);
        toasty.error({
          title: 'Error!',
          msg: error.data
        });
      });
    };

    this.processS3 = function(tag, file, security, components) {
      this.uploading = true;
      s3factory.putObject(file, tag, security, components, function(data,
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
      var components = [{
        component_id: _this.componentId, 
        entity_id: _this.doctorId
      }];
      
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          var filename = files[i].name;
          _this.processS3(tag, file, MODIOCORE.securityFlags.values.admin.id, components);
        }
      }
    };

    this.loadUploads = function() {
      var key;
      s3factory.getUploads({
        componentId: _this.componentId,
        entityId: _this.doctorId,
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
      });
    };

    this.getFileLink = function(file) {
      s3factory.getSignedUrl(file.id).then(function(
        response) {
        $log.info(response);
        $window.location.href = response;
      });
    };

    this.deleteUpload = function(file) {
      $log.log('deleteUpload:' + file.id);

      s3factory.deleteObject(file.id, function(data, status, headers, config) {
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

    this.load(this.doctorId);
    this.loadUploads();
  });

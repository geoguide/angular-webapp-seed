'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.s3factory
 * @description
 * # s3factory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('s3factory', function($http, ENV, API_URL, $log, filesAPI) {
  // Service logic
  // ...

  var meaningOfLife = 42;

  this.credentials = {};

  // Public API here
  return {
    putObject: function(file, tag, security, components, success, error) {
      var filename = file.name;
      var filesize = file.size;
      
      return $http.get(API_URL + '/admin/s3-credentials/').then(function(response) {
        var creds = response.data;
        
        $log.log(creds.AccessKeyId + ' ' + creds.SecretAccessKey + ' ' + creds.SessionToken);
        
        AWS.config.update({
          accessKeyId: creds.AccessKeyId,
          secretAccessKey: creds.SecretAccessKey,
          sessionToken: creds.SessionToken
        });
        
        $log.info('S3_SETTINGS=' + ENV.s3Bucket);
        
        var s3obj = new AWS.S3({
          params: {
            Bucket: ENV.s3Bucket + '/' + creds.uuid,
            region: 'us-east-1'
          }
        });
        
        s3obj.putObject({
          Key: filename,
          Body: file,
          ServerSideEncryption: 'AES256',
          ACL: 'private'
        }, function(err, data) {
          if (err) {
            $log.log('S3 Error: ', err);
          } else {
            $log.log('s3 no error');
            $log.info(data);

            filesAPI.save({
                uuid: creds.uuid,
                filename: filename,
                filesize: filesize,
                tag: tag,
                security: security,
                components: components
              },
              function(data, status, headers, config) {
                //Success
                $log.info('Saved file info: ' + filename);
                success();
              },
              function(data, status, headers, config) {
                //Error
                $log.error('FAILED to save file info: ' +
                  filename);
                error();
              });
          }
        }).on('httpUploadProgress', function(progress) {
          //In order to show this it needs to be in the controller, in order to do this we need to returned abstracted out getCredentials and putObject into different methods,
          $log.log(progress);
        });
        //return creds.data;
      });
    },
    deleteObject: function(fileId, success, err) {
      $log.log('deleteObject:' + fileId);
      return filesAPI.delete({
        id: fileId
      }, success, err);
    },
    getSignedUrl: function(fileId) {
      return $http.get(API_URL + '/admin/files/' + fileId + '/url').then(function(response) {
        return response.data;
      });
    },
    listObjects: function() {
      return $http.get(API_URL + '/admin/s3-credentials/').then(function(
        response) {
        var creds = response.data;
        $log.log(creds.AccessKeyId + ' ' + creds.SecretAccessKey +
          ' ' + creds.SessionToken);
        AWS.config.update({
          accessKeyId: creds.AccessKeyId,
          secretAccessKey: creds.SecretAccessKey,
          sessionToken: creds.SessionToken
        });
        var s3obj = new AWS.S3({
          params: {
            Bucket: 'doctor-uploads/test1',
            region: 'us-east-1'
          }
        });
        s3obj.listObjects({
          Prefix: creds.uuid
        }, function(err, data) {
          if (err) {
            $log.error('Error: ', err);
          } else {
            $log.log('no error');
            $log.log(JSON.stringify(data.Contents));
          }
        });
        return creds.data;
      });
    },
    getUploads: function(params, result) {
      return filesAPI.query(params, result);
    }
  };
});

angular.module('modioAdminPortal')
  .factory('filesAPI', function($resource, API_URL) {
    return $resource(API_URL + '/admin/files/:id');
  });

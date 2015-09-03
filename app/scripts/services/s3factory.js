'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.s3factory
 * @description
 * # s3factory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('s3factory', function ($http,ENV,API_URL,$log, filesAPI) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    this.credentials = {};

    // Public API here
    return {
      putObject: function(filetype, file, componentId, entityId, tag, success, err){
        var filename = file.name;
        var ext = filename.split('.').pop();
        return $http.get(API_URL+'/admin'+'/s3-credentials/'+componentId).then(function(response) {
          var creds = response.data;
          $log.log(creds.AccessKeyId+' '+creds.SecretAccessKey+' '+creds.SessionToken);
          AWS.config.update({accessKeyId: creds.AccessKeyId, secretAccessKey: creds.SecretAccessKey, sessionToken: creds.SessionToken });
          $log.info('S3_SETTINGS=' + ENV.s3Bucket);
          var s3obj = new AWS.S3({params: { Bucket: ENV.s3Bucket + '/'+componentId+'/'+creds.uuid, region: 'us-east-1' }});
          s3obj.putObject({ Key: filename, Body: file, ServerSideEncryption: 'AES256', ACL: 'private' },function(err, data) {
            if (err) {
              $log.log('S3 Error: ', err);
            } else {
              $log.log('s3 no error');
              $log.info(data);

              filesAPI.save(
                {
                  componentId:componentId,
                  entityId:entityId,
                  uuid:creds.uuid,
                  filename:filename,
                  tag:tag
                },
                function(data, status, headers, config) {
                  //Success
                  console.log('Saved file info: ' + filename);
                  success();
                },
                function(data, status, headers, config) {
                  //Error
                  console.log('FAILED to save file info: ' + filename);
                  err();
                });
            }
          }).on('httpUploadProgress', function (progress) {
            //In order to show this it needs to be in the controller, in order to do this we need to returned abstracted out getCredentials and putObject into different methods,
            console.log(progress);
          });
          //return creds.data;
        });
      },
      deleteObject: function(componentId, entityId, fileId, success, err){
        $log.log('deleteObject:' + entityId);
        return filesAPI.delete({ componentId:componentId, entityId:entityId, fileId:fileId }, success, err);
      },
      getSignedUrl: function(componentId, fileId){
			return $http.get(API_URL+'/admin/doctors/'+componentId+'/doctor-file/'+fileId).then(function(response) {
				return response.data;
			});
		},
      listObjects: function(){
			return $http.get(API_URL+'/admin/s3-credentials/').then(function(response) {
				var creds = response.data;
				$log.log(creds.AccessKeyId+' '+creds.SecretAccessKey+' '+creds.SessionToken);
				AWS.config.update({accessKeyId: creds.AccessKeyId, secretAccessKey: creds.SecretAccessKey, sessionToken: creds.SessionToken });
				var s3obj = new AWS.S3({params: { Bucket: 'doctor-uploads/test1', region: 'us-east-1' }});
				s3obj.listObjects({ Prefix: creds.uuid },function(err, data) {
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
      getUploads: function(componentId, entityId, result){
        return filesAPI.query({ componentId:1, entityId:entityId }, result);
		}
    };
  });

angular.module('modioAdminPortal')
  .factory('filesAPI', function($resource, API_URL) {
    return $resource(API_URL + '/admin/files/:id');
  });


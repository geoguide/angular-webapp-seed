'use strict';

/**
 * @ngdoc service
 * @name modioAdminPortal.s3factory
 * @description
 * # s3factory
 * Factory in the modioAdminPortal.
 */
angular.module('modioAdminPortal').factory('s3factory', function ($http,API_URL,$log) {
    // Service logic
    // ...

    var meaningOfLife = 42;
    
    this.credentials = {};

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }, putObject: function(){
			return $http.get(API_URL+'/admin/s3-credentials/').then(function(response) {
				var creds = response.data;
				$log.log(creds.AccessKeyId+' '+creds.SecretAccessKey+' '+creds.SessionToken);
				AWS.config.update({accessKeyId: creds.AccessKeyId, secretAccessKey: creds.SecretAccessKey, sessionToken: creds.SessionToken });
				var s3obj = new AWS.S3({params: { Bucket: 'doctor-uploads/test1', region: 'us-east-1' }});
				s3obj.putObject({ Key: 'myKey52', Body: 'fine body from app', ServerSideEncryption: 'AES256', ACL: 'private' },function(err, data) {
					if (err) { 
						$log.error(err); 
					} else {
						$log.log('no error');
						$log.info(data);
					}
				});
				return creds.data;
			});
		}, listObjects: function(){
			return $http.get(API_URL+'/admin/s3-credentials/').then(function(response) {
				var creds = response.data;
				$log.log(creds.AccessKeyId+' '+creds.SecretAccessKey+' '+creds.SessionToken);
				AWS.config.update({accessKeyId: creds.AccessKeyId, secretAccessKey: creds.SecretAccessKey, sessionToken: creds.SessionToken });
				var s3obj = new AWS.S3({params: { Bucket: 'doctor-uploads/test1', region: 'us-east-1' }});
				s3obj.listObjects({ Prefix: 'user1' },function(err, data) {
					if (err) { 
						$log.error('Error: ', err); 
					} else {
						$log.log('no error');
						$log.log(JSON.stringify(data.Contents));
					}
				});
				return creds.data;
			});
		}
    };
  });

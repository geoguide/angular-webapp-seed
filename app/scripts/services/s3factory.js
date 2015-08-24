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
      }, putObject: function(doctorId, filetype, file){
	      var filename = file.name;
	      var ext = filename.split('.').pop();
         return $http.get(API_URL+'/admin/doctors/'+doctorId+'/s3-credentials').then(function(response) {
				var creds = response.data;
				$log.log(JSON.stringify(creds));
				AWS.config.update({accessKeyId: creds.AccessKeyId, secretAccessKey: creds.SecretAccessKey, sessionToken: creds.SessionToken });
				var s3obj = new AWS.S3({params: { Bucket: 'doctor-uploads/'+creds.uuid, region: 'us-east-1' }});
				s3obj.putObject({ Key: filetype+'.'+ext, Body: file, ServerSideEncryption: 'AES256', ACL: 'private' },function(err, data) {
						if (err) {
							$log.log('S3 Error: ', err);
						} else {
							//store upload
                     $log.log('s3 no error');
						}
				}).on('httpUploadProgress', function (progress) {
					//In order to show this it needs to be in the controller, in order to do this we need to returned abstracted out getCredentials and putObject into different methods,
				 	console.log(progress);
				});
         });
     }, deleteObject: function(doctorId, filetype){
         return $http.get(API_URL+'/admin/doctors/'+doctorId+'/s3-credentials').then(function(response) {
				var creds = response.data;
				$log.log(JSON.stringify(creds));
				AWS.config.update({accessKeyId: creds.AccessKeyId, secretAccessKey: creds.SecretAccessKey, sessionToken: creds.SessionToken });
				var s3obj = new AWS.S3({params: { Bucket: 'doctor-uploads/'+creds.uuid, region: 'us-east-1' }});
				s3obj.deleteObject({ Key: filetype },function(err, data) {
					if (err) {
						$log.error('S3 Error: ', err);
					} else {
						//store upload
						$log.log('s3 no error');
					}
				});
				return creds.data;
         });
     }, getSignedUrl: function(doctorId, type){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/doctor-file/'+type).then(function(response) {
				return response.data;
			});
		}, listObjects: function(){
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
		}, getUploads: function(doctorId){
			return $http.get(API_URL+'/admin/doctors/'+doctorId+'/uploads').then(function(response) {
				return response.data;
			});
		}, updateUploads: function(doctorId, filetype, file){
			return $http.post(API_URL+'/admin/doctors/'+doctorId+'/uploads', { type: filetype, file: file }).then(function(response){
				$log.log(response.data);
			}, function(error){
				$log.error(error);
			});
		}, deleteUploadRecord: function(doctorId, filetype){
			return $http.delete(API_URL+'/admin/doctors/'+doctorId+'/uploads/'+filetype).then(function(response){
				$log.log(response.data);
			}, function(error){
				$log.error(error);
			});
		}
    };
  });

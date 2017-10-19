'use strict';

 angular.module('config', [])

.constant('ENV', {
  name:'dev',
  apiEndpoint:'http://localhost:3000',
  s3Bucket:'files.modiohealth.org',
  doctorApp:'http://localhost:8600/#'
});

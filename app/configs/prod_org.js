'use strict';

 angular.module('config', [])

.constant('ENV', {
  name:'qa',
  apiEndpoint:'https://api.modiohealth.org',
  s3Bucket:'files.modiohealth.com',
  doctorApp:'https://www.modiohealth.org/physicians/#'
});

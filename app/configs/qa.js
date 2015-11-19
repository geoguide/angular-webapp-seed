'use strict';

 angular.module('config', [])

.constant('ENV', {
  name:'qa',
  apiEndpoint:'https://api.modiohealth.net',
  s3Bucket:'files.modiohealth.org',
  doctorApp:'https://www.modiohealth.net/physicians/#'
});
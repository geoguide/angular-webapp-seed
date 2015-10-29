'use strict';

 angular.module('config', [])

.constant('ENV', {
  name:'qa',
  apiEndpoint:'https://api.modiohealth.com',
  s3Bucket:'files.modiohealth.test',
  doctorApp:'https://www.modiohealth.com/#'
});

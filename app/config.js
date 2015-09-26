'use strict';

 angular.module('config', [])

.constant('ENV', {name:'development',apiEndpoint:'https://api.modiohealth.com',s3Bucket:'files.modiohealth.com',doctorApp:'https://www.modiohealth.com/physicians/#'})

;
'use strict';

 angular.module('config', [])

.constant('ENV', {name:'development',apiEndpoint:'https://api.modiohealth.net',s3Bucket:'files.modiohealth.test',doctorApp:'https://www.modiohealth.net/physicians/#'})

;
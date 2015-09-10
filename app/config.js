'use strict';

 angular.module('config', [])

.constant('ENV', {name:'development',apiEndpoint:'https://api.modiohealth.org',s3Bucket:'files.modiohealth.org'})

;
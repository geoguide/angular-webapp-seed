'use strict';

 angular.module('config', [])

.constant('ENV', {name:'development',apiEndpoint:'http://localhost:3001',s3Bucket:'files.modiohealth.test',doctorApp:'http://localhost:8600'})

;
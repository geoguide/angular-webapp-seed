'use strict';
describe('Controller: JobsCtrl', function() {
	// load the controller's module
	beforeEach(module('modioAdminPortal'));
	var JobsCtrl, scope;
	// Initialize the controller and a mock scope
	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		JobsCtrl = $controller('JobsCtrl as jobs', {
			$scope: scope
		});
	}));
	it('should attach a list of awesomeThings to the scope', function() {
		expect(scope.jobs.awesomeThings.length).toBe(3);
	});
});
'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('DashboardCtrl', function (dashboardFactory,$log,applicationFactory) {

	var _this = this;
	this.loading = true;
	
	this.dynamicPopover = {
		content: 'Hello, World!',
		templateUrl: 'notes-template.html',
		title: 'Doctor Notes'
	};
	var rowTemplate = '<div ng-class="{\'text-muted\':row.entity.excluded == 1}"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
	this.gridOptions = {
		//enableFiltering: true,
		enableSorting: true,
		enableColumnResize : true,
		rowTemplate: rowTemplate,cellFilter: 'dash:_this',
		columnDefs: [
			{ name: 'ID', field: 'job_id', width: '50'},
			{ name: 'Facility', field: 'facility_name', width: '400'  },
			{ name: 'Job Types ', cellTemplate: '<span>{{row.entity.JOB_TYPE}} | {{row.entity.dr_job_type}}</span>', width: '150' },
			{ name: 'Name ', cellTemplate: '<span>{{row.entity.first_name}} {{row.entity.last_name}}</span>', width: '150' },
			{ name: 'Licensed? ', cellTemplate: '<span>{{ row.entity.Licensed == 0 ? "No" : "Yes" }}</span>', width: '*' },
			{ name: 'Specialty ', cellTemplate: '<span style="word-wrap: normal">{{row.entity.job_specialty}} in {{row.entity.doctor_desired_state}}</span>', width: '150' },
			{ name: 'Score', field: 'score', width: '50' },
			{ name: 'Manager', field: 'account_manager', width: '*' },
			{ name: ' ', cellTemplate: '<div><a ng-click="row.entity.excluded = 0;grid.appScope.includeMatch({job_id:{{row.entity.job_id}},doctor_id:{{row.entity.doctor_id}}, index: $index})" ng-if="row.entity.excluded == 1"><i class="fa fa-user-times text-muted"></i></a><a ng-click="row.entity.excluded = 1;grid.appScope.excludeMatch({job_id:{{row.entity.job_id}},doctor_id:{{row.entity.doctor_id}}, index: 0})" ng-if="row.entity.excluded != 1"><i class="fa fa-user-times"></i></a></div>', width: '*' }
		]
	};
	this.gridOptions.appScopeProvider = this;
//	_this.twoWayMatches = applicationFactory.twoWayMatches;
	
	this.get2Way = function(){
		_this.loading = true;
		dashboardFactory.get2Way().then(function(result){
			_this.twoWayMatches = result;
			_this.gridOptions.data = result;
			_this.loading = false;
		},function(error){
			_this.loading = false;
			$log.error(error);
		});
	};
	
	this.setTooltip = function(item){
		_this.tooltipSales = item.sales_notes;
		_this.tooltipJob = item.modio_notes;
	};
	this.includeMatch = function(data){
		data.exclude = false;
		dashboardFactory.matchExclusion(data).then(function(result){
			//
		},function(eror){
			$log.error('error');
		});
		$log.info('include match: '+data.job_id+','+data.doctor_id);
	};
	this.excludeMatch = function(data){
		data.exclude = true;
		dashboardFactory.matchExclusion(data).then(function(result){
		},function(eror){
			$log.error('error');
		});
		$log.warn('exclude match: '+data.job_id+','+data.doctor_id);
	};
	this.twoWayMatches = dashboardFactory.twoWayMatches;

	
	if(_this.twoWayMatches.length < 1){
		_this.get2Way();
	} else {
		_this.loading = false;
	}
	
	dashboardFactory.tempDEA();
	
});

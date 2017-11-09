'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilityHoursCtrl
 * @description
 * # FacilityHoursCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
    .controller('FacilityHoursCtrl', function($routeParams, facilityFactory, toasty, MODIOCORE) {
        var _this = this;
        var time = new Date('1970-01-01T00:00:00');
        this.facilityId = $routeParams.id;
        this.membership = false;
        this.tab = 'facility-hours';
        this.error = false;
        this.loading = true;
        this.MODIOCORE = MODIOCORE;
        this.facilityData = null;
        this.businessHours = [
            {active: '0', day_id: '0', from: time, to: time},
            {active: '0', day_id: '1', from: time, to: time},
            {active: '0', day_id: '2', from: time, to: time},
            {active: '0', day_id: '3', from: time, to: time},
            {active: '0', day_id: '4', from: time, to: time},
            {active: '0', day_id: '5', from: time, to: time},
            {active: '0', day_id: '6', from: time, to: time}
        ];

        this.get = function (facilityId) {
            var _this = this;
            facilityFactory.getFacility(facilityId).then(function (data) {
                _this.facilityData = data;
                _this.membership = _this.facilityData.settings & _this.MODIOCORE.facilitySettings.values.membership.id;
                return facilityFactory.getBusinessHours(facilityId);
            }).then(function (hours) {
                if (hours.length) {
                    hours.map(function (hour) {
                        hour.from = new Date('1970-01-01T' + hour.from);
                        hour.to = new Date('1970-01-01T' + hour.to);
                    });
                    _this.businessHours = angular.extend(_this.businessHours, hours);
                }
                _this.error = false;
                _this.loading = false;
            }, function (error) {
                _this.error = true;
                _this.businessHours = null;
                _this.loading = false;
            });
        };

        this.saveHours = function() {
            var hours = JSON.parse(JSON.stringify(this.businessHours));
            hours.map(function (hour) {
                hour.from = new Date(hour.from).toTimeString().split(' ')[0];
                hour.to = new Date(hour.to).toTimeString().split(' ')[0];
            });
            facilityFactory.submitBusinessHours(this.facilityId, {
                hours: hours
            }).then(function () {
                toasty.success('Business Hours Saved.');
            }, function (error) {
                toasty.error(error.data);
            });
        };

        /* Init */

        var init = function() {
            _this.get(_this.facilityId);
        };

        init();
    });

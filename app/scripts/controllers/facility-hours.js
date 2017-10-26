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
        this.facilityId = $routeParams.id;
        this.membership = false;
        this.tab = 'facility-hours';
        this.error = false;
        this.loading = true;
        this.MODIOCORE = MODIOCORE;
        this.facilityData = null;
        this.businessHours = [
            {active: '0', day_id: '0', from: '12:00 AM', to: '12:00 AM'},
            {active: '0', day_id: '1', from: '12:00 AM', to: '12:00 AM'},
            {active: '0', day_id: '2', from: '12:00 AM', to: '12:00 AM'},
            {active: '0', day_id: '3', from: '12:00 AM', to: '12:00 AM'},
            {active: '0', day_id: '4', from: '12:00 AM', to: '12:00 AM'},
            {active: '0', day_id: '5', from: '12:00 AM', to: '12:00 AM'},
            {active: '0', day_id: '6', from: '12:00 AM', to: '12:00 AM'}
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
                        hour.from = moment(hour.from, ["HH:mm:ss"]).format("h:mm A");
                        hour.to = moment(hour.to, ["HH:mm:ss"]).format("h:mm A");
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
                hour.from = moment(hour.from, ["h:mm A"]).format("HH:mm:ss");
                hour.to = moment(hour.to, ["h:mm A"]).format("HH:mm:ss");
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

'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilityPermissionsCtrl
 * @description
 * # FacilityPermissionsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
    .controller('FacilityPermissionsCtrl', function ($routeParams, facilityFactory, MODIOCORE, toasty) {
        var _this = this;
        this.facilityId = $routeParams.id;
        this.membership = false;
        this.tab = 'facility-permissions';
        this.error = false;
        this.loading = true;
        this.facilityData = null;
        this.permissions = {};
        this.MODIOCORE = MODIOCORE;
        this.payorTypes = this.MODIOCORE.payorTypes.toSortedArray('asc', 'name');
        this.facilities = [];

        this.payorsConfig = {
            plugins: ['remove_button'],
            valueField: 'id',
            labelField: 'name',
            searchField: 'name'
        };

        this.facilitiesConfig = {
            plugins: ['remove_button'],
            valueField: 'id',
            labelField: 'full_name',
            searchField: 'full_name',
            optgroupField: 'group',
            optgroups: [
                {value: 'practice_affiliation', label: 'Practice/Affiliation(s)'},
                {value: 'affiliation', label: 'Affiliations'},
                {value: 'practice', label: 'Practices'}
            ],
            render: {
                optgroup_header: function(data, escape) {
                    return '<h5 class="optgroup-header"><strong>' + escape(data.label) + '</strong></h5>';
                }
            }
        };

        this.get = function (facilityId) {
            var facilityData = facilityFactory.getFacility(facilityId);
            facilityData.then(function (data) {
                _this.facilityData = data;
                _this.membership = _this.facilityData.settings & _this.MODIOCORE.facilitySettings.values.membership.id;
                return facilityFactory.getPermissions(_this.facilityId);
            }).then(function (permissions) {
                _this.permissions.selected_payors = permissions.payors;
                _this.permissions.selected_facilities = permissions.facilities;
                _this.error = false;
                _this.loading = false;
            }, function (error) {
                _this.error = true;
                _this.facilityData = null;
                _this.loading = false;
            });
        };

        this.getPracticeAffiliations = function () {
            var setting_id = MODIOCORE.facilitySettings.values.practice.id + MODIOCORE.facilitySettings.values.affiliation.id;
            return facilityFactory.getListFacilitiesBySetting(setting_id).then(function (facilities) {

                for (var i = 0; i < facilities.length; i++) {
                    var facility = facilities[i];
                    var full_name = facility.facility_name;
                    var strings = [];
                    if (facility.city) {
                        strings.push(facility.city);
                    }
                    if (facility.state) {
                        strings.push(facility.state);
                    }
                    if (strings.length) {
                        full_name += ' (' + strings.join(', ') + ')';
                    }
                    facility.full_name = full_name;

                    switch (true) {
                        case ((facility.settings | (MODIOCORE.facilitySettings.values.affiliation.id + MODIOCORE.facilitySettings.values.practice.id)) == facility.settings):
                            facility.group = 'practice_affiliation';
                            break;
                        case ((facility.settings | MODIOCORE.facilitySettings.values.affiliation.id) == facility.settings):
                            facility.group = 'affiliation';
                            break;
                        case ((facility.settings | MODIOCORE.facilitySettings.values.practice.id) == facility.settings):
                            facility.group = 'practice';
                            break;
                    }
                }

                _this.facilities = facilities;
            }, function (error) {
                _this.error = true;
                _this.loading = false;
            });
        };

        this.savePermissions = function () {
            var payors = this.permissions.selected_payors;
            var facilities = this.permissions.selected_facilities;

            facilityFactory.submitPermissions(this.facilityId, {
                payors: payors,
                facilities: facilities
            }).then(function (data) {
                toasty.success('Permissions Saved.');
            }, function (error) {
                toasty.error(error.data);
            });
        };

        /* Init */

        var init = function () {
            _this.getPracticeAffiliations().then(function () {
                _this.get(_this.facilityId);
            });
        };

        init();
    });
    
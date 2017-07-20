'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:FacilityContactsCtrl
 * @description
 * # FacilityContactsCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal')
  .controller('FacilityContactsCtrl', function($routeParams, facilityFactory, MODIOCORE, toasty) {
    var _this = this;
    this.facilityId = $routeParams.id;
    this.membership = false;
    this.tab = 'facility-contacts';
    this.error = false;
    this.loading = true;
    this.facilityData = null;
    this.MODIOCORE = MODIOCORE;
    this.contactTypes = MODIOCORE.contactTypes.toArray();
    this.contactSettings = MODIOCORE.facilityContactSettings.toArray();
    this.states = MODIOCORE.states.toArray();

    this.get = function (facilityId) {
      var facilityData = facilityFactory.getFacility(facilityId);
      facilityData.then(function (data) {
        _this.facilityData = data;
        _this.facilityData.contacts = [];
        _this.membership = _this.facilityData.settings & _this.MODIOCORE.facilitySettings.values.membership.id;
        return facilityFactory.getContacts(_this.facilityId);
      }).then(function (contacts) {
        _this.facilityData.contacts = contacts.map(function(contact) {
          contact.typeName = _this.MODIOCORE.contactTypes.get({id: contact.type}).name;
          contact.selected_settings = [];

          for (var i = 0; i < _this.contactSettings.length; i++) {
            var item = _this.contactSettings[i];
            if ((contact.settings & item.id) == item.id) {
              contact.selected_settings.push(item);
            }
          }

          return contact;
        });
        _this.error = false;
        _this.loading = false;
      }, function (error) {
        _this.error = true;
        _this.facilityData = null;
        _this.loading = false;
      });
    };

    this.deleteContact = function(contact) {
      var index = _this.facilityData.contacts.indexOf(contact);
      if (index > -1) {
        _this.facilityData.contacts.splice(index, 1);
      }
      if (contact.id) {
        facilityFactory.deleteContact(this.facilityId, contact.id).then(function() {
          toasty.success('Contacts Saved.');
        }).catch(function(error) {
          toasty.error(error.data);
        });
      }
    };

    this.addContact = function() {
      var newContact = {
        type: null,
        name: null,
        title: null,
        selected_settings: [],
        address: null,
        address2: null,
        city: null,
        county: null,
        country: 'USA',
        zip: null,
        phone: null,
        email: null,
        phone_ext: null,
        fax: null,
        state: null
      };
      _this.facilityData.contacts.push(newContact);
    };

    this.onContactTypeChange = function(contact) {
      if (contact && typeof contact.type !== 'undefined' && contact.type !== null) {
        contact.typeName = MODIOCORE.contactTypes.get({id: contact.type}).name;
      }
    };

    this.saveContacts = function() {
      var contacts = [];

      for (var i = 0; i < _this.facilityData.contacts.length; i++) {
        var contact = {};
        angular.copy(_this.facilityData.contacts[i], contact);

        contact.settings = facilityFactory.mapSettings(_this.facilityData.contacts[i].selected_settings);
        delete contact.selected_settings;
        contacts.push(contact);
      }

      facilityFactory.submitContacts(this.facilityId, contacts).then(function (data) {
        toasty.success('Contacts Saved.');
      }, function (error) {
        toasty.error(error.data);
      });
    };

    this.getUsedContactTypes = function() {
      return this.facilityData.contacts.map(function(contact) {
        return contact.type;
      });
    };

    /* Init */

    var init = function() {
      _this.get(_this.facilityId);
    };

    init();
  });

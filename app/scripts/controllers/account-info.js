'use strict';

/**
 * @ngdoc function
 * @name modioAdminPortal.controller:AccountInfoCtrl
 * @description
 * # AccountInfoCtrl
 * Controller of the modioAdminPortal
 */
angular.module('modioAdminPortal').controller('AccountInfoCtrl', function ($routeParams, doctorFactory, specialtyFactory, toasty, $log, $modal, MODIOCORE) {

  var _this = this;
  this.doctorId = $routeParams.id;
  this.tab = 'account-info';
  this.newPassword = null;
  this.doctorData = null;
  this.states = [];
  this.drSpecialties = [];
  this.offers = [];
  this.jobs = [];
  this.newOffer = {};
  this.additionalCerts = [];
  this.abmsCertifications = [];
  this.boards = [];
  this.boardSpecialties = [];
  this.trackingData = [];
  this.additional_certification_types = MODIOCORE.additionalCertificationsTypes.toSortedArray('asc', 'name', function (a, b) {
    if (a.name.toLowerCase() === 'other') return 1;
    if (b.name.toLowerCase() === 'other') return -1;
  });

  this.loadCertifications = function (boardName) {
    _this.boardSpecialties = specialtyFactory.getCertificationsByBoard({q: boardName});
    console.log(_this.boardSpecialties);
  };

  this.get = function (doctorId) {

    var doctorDataGet = doctorFactory.getDoctor(doctorId);

    doctorFactory.getSpecialties(doctorId).then(function (data) {
      _this.specialtyData = data;
    });

    doctorFactory.getAdditionalCertifications(doctorId).then(function (data) {
      _this.additionalCerts = data;
    });

    doctorFactory.getABMSCertifications(doctorId).then(function (data) {
      _this.abmsCertifications = data;
    });

    specialtyFactory.getABMSBoards().then(function (result) {
      _this.boards = result;
    });


    doctorDataGet.success(function (data) {
      _this.doctorData = data;
      _this.drSpecialties = data.specialties;
      _this.bookmarked = data.bookmarked;
      _this.error = false;
      _this.auth_email = (_this.auth_email) ? _this.auth_email : _this.doctorData.email;
    }, function (error) {
      _this.error = true;
      _this.doctorData = null;
    });
  };

  /* date picker stuff */
  this.opened = {};
  this.open = function ($event, which) {
    $event.preventDefault();
    $event.stopPropagation();

    _this.opened[which] = true;
  };
  this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'MM/dd/yyyy'];
  this.format = this.formats[4];
  this.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };


  this.submitSpecialty = function (dspec) {
    doctorFactory.saveSpecialty(_this.doctorId, dspec).then(function (data) {
      toasty.success('Specialties Saved.');
      doctorFactory.getSpecialties(_this.doctorId).then(function (data) {
        _this.specialtyData = _this.drSpecialties = data;
      });
      _this.doctorData = data;
    }, function (error) {
      $log.error(error);
      toasty.error(error.data);
    });
  };

  this.submitABMSCertifications = function (abmscert) {

    doctorFactory.saveABMSCertification(_this.doctorId, abmscert).then(function (data) {
      toasty.success('Certification Saved.');
      doctorFactory.getABMSCertifications(_this.doctorId).then(function (data) {
        _this.abmsCertifications = data;
      });
    }, function (error) {
      $log.error(error);
      toasty.error(error.data);
    });
  };

  this.deleteABMSCertification = function (dcert) {
    doctorFactory.removeABMSCertification(_this.doctorId, dcert).then(function (data) {
      doctorFactory.getABMSCertifications(_this.doctorId).then(function (data) {
        _this.abmsCertifications = data;
      });
      toasty.success('Certification Saved.');
      _this.doctorData = data;
    }, function (error) {
      $log.error(error);
      toasty.error(error.data);
    });
  };

  this.submitAdditionalCertification = function (dcert) {

    doctorFactory.saveAdditionalCertification(_this.doctorId, dcert).then(function (data) {
      toasty.success('Certification Saved.');
      doctorFactory.getAdditionalCertifications(_this.doctorId).then(function (data) {
        _this.additionalCerts = data;
      });
    }, function (error) {
      $log.error(error);
      toasty.error(error.data);
    });
  };

  this.deleteCertification = function (dcert) {
    doctorFactory.removeAdditionalCertification(_this.doctorId, dcert).then(function (data) {
      doctorFactory.getAdditionalCertifications(_this.doctorId).then(function (data) {
        _this.additionalCerts = data;
      });
      toasty.success('Certification Saved.');
      doctorFactory.getAdditionalCertifications(_this.doctorId).then(function (data) {
        _this.additionalCerts = data;
      });
    }, function (error) {
      toasty.error(error.data);
    });
  };

  /* Other stuff */

  this.deleteSpecialty = function (dspec) {
    doctorFactory.removeSpecialty(_this.doctorId, dspec).then(function (data) {
      doctorFactory.getSpecialties(_this.doctorId).then(function (data) {
        _this.specialtyData = data;
      });
      toasty.success('Certification Saved.');
      _this.doctorData = data;
    }, function (error) {
      toasty.error('Error!');
    });
  };

  this.updatePassword = function () {
    if (_this.newPassword && _this.newPassword.length >= 8) {
      doctorFactory.updatePassword(_this.doctorData.user_id, _this.newPassword).then(function (data) {
        toasty.success('Password Changed.');
      }, function (error) {
        $log.error(error);
        toasty.error(error.data);
      });
    } else {
      toasty.error('Invalid password');
    }

  };

  this.bookmark = function (idIn) {
    _this.bookmarked = !!!_this.bookmarked;
    if (_this.bookmarked) {
      doctorFactory.bookmark(idIn).then(function () {

      }, function (error) {
        $log.error(error);
      });
    } else {
      doctorFactory.removeBookmark(idIn).then(function () {
        //silence
      }, function (error) {
        $log.error(error);
      });
    }

  };

  this.updateAuthEmail = function () {
    doctorFactory.saveUser({id: _this.doctorData.user_id, email: _this.doctorData.auth_email}).then(function (data) {
      toasty.success('Email Changed.');
      _this.doctorData.auth_email = data.email;
    }, function (error) {
      $log.error(error);
      toasty.error(JSON.stringify(error.data));
    });
  };

  this.submitAuthInfo = function () {
    var postData = {
      email: _this.auth_email,
      password: _this.password
    };
    doctorFactory.submitAuthInfo(_this.doctorId, postData).then(function (data) {
      toasty.success('Auth Created Updated.');
      _this.get(_this.doctorId);
    }, function (error) {
      $log.error(error);
      toasty.error(error.data);
    });
  };

  this.updateState = function (abbr) {
    var action;
    if (_this.states[abbr]) { //If it is checked
      action = doctorFactory.addState(_this.doctorId, abbr);
    } else {
      action = doctorFactory.removeState(_this.doctorId, abbr);
    }
    action.then(function (data) {
      toasty.success('State Updated.');
    }, function (error) {
      $log.error(error);
      toasty.error(error.data);
    });

  };

  this.getTracking = function (doctor_id) {
    return doctorFactory.getTracking(doctor_id).then(function (result) {
      _this.trackingData = result;
    }).catch(function (error) {
      $log.error(error);
    });
  };

  this.getJobMatches = function (doctor_id) {
    return doctorFactory.getJobMatches(doctor_id).then(function (result) {
      _this.matches = result;
    }).catch(function (error) {
      $log.error(error);
    });
  };

  this.getJobOffers = function (doctor_id) {
    return doctorFactory.getJobOffers(doctor_id).then(function (result) {
      _this.offers = result;
    }).catch(function (error) {
      $log.error(error);
    });
  };

  this.addSpecialty = function () {
    _this.specialtyData.push({});
  };
  this.addCertification = function () {
    _this.additionalCerts.push({});
  };
  this.addABMSCertification = function () {
    _this.abmsCertifications.push({});
  };

  var init = function () {
    _this.get(_this.doctorId);
    _this.getTracking(_this.doctorId);
    _this.getJobMatches(_this.doctorId);
    _this.getJobOffers(_this.doctorId);
    _this.loading = true;
    doctorFactory.getStates(_this.doctorId).then(function (data) {

      _this.states = data;
      for (var s = 0; s < _this.states.length; s++) {
        var abbr = _this.states[s];
        _this.states[abbr] = true;
      }
      return specialtyFactory.queryABMS();
    }).then(function (result) {
      _this.abmsSpecialties = result;
      _this.loading = false;
    }, function (error) {
      $log.error(error);
    });
  };
  init();
});

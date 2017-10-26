'use strict';

/**
 * @ngdoc directive
 * @name modioAdminPortal.directive:directives
 * @description
 * # directives
 */
angular.module('modioAdminPortal').directive('directives', function () {
  return {
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      element.text('this is the directives directive');
    }
  };
}).directive('passwordMatch', function () {
  return {
    restrict: 'A',
    scope: true,
    require: 'ngModel',
    link: function (scope, elem, attrs, control) {
      var checker = function () {

        //get the value of the first password
        var e1 = scope.$eval(attrs.ngModel);

        //get the value of the other password
        var e2 = scope.$eval(attrs.passwordMatch);
        return e1 === e2;
      };
      scope.$watch(checker, function (n) {

        //set the form control to valid if both
        //passwords are the same, else invalid
        control.$setValidity('unique', n);
      });
    }
  };
}).directive('ngReallyClick', function ($window) {
  var linkFunction = function (scope, element, attrs) {
    element.bind('click', function () {
      var message = attrs.ngReallyMessage;
      if (message && $window.confirm(message)) {
        scope.$apply(attrs.ngReallyClick);
      }
    });
  };
  return {
    restrict: 'A',
    link: linkFunction
  };
}).directive('datePicker', function () {
  return {
    restrict: 'E',
    scope: {
      model: '='
    },
    replace: true,
    controller: 'datepickerCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'templates/datepicker.html'
  };
}).controller('datepickerCtrl', function ($scope) {
  this.opened = false;
  var _this = this;
  this.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    _this.opened = true;
  };
  this.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  this.format = 'MM/dd/yyyy';
  this.maxDate = new Date();
  this.minDate = new Date('1/1/1900');
}).directive('actAs', ['ENV', '$window', '$log', 'doctorFactory', 'toasty', function (ENV, $window, $log, doctorFactory, toasty) {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      element.click(function () {
        if (attrs.actAs) {
          doctorFactory.actAs(attrs.actAs).then(function (response) {
            $window.open(ENV.doctorApp + '/admin/act-as/' + response.data.token, '_blank');
            toasty.success('Act As ' + attrs.actAs);
          }, function (error) {
            $log.error(error);
            toasty.error({title: 'Error!', msg: error.data});
          });
        }
      });
    }
  };
}]).directive('noFocus', [function () {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      element.on('click', function () {
        element.blur();
      });
    }
  };
}]).directive('businessHours', function(MODIOCORE) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            model: "=",
            dayId: "=",
            active: "=",
            from: "=",
            to: "="
        },
        templateUrl: 'templates/business_hours.html',
        link: function(scope, elem, attr, ctrl) {
            scope.model = {};
            scope.model.day_id = scope.dayId;
            scope.model.active = scope.active || 0;
            scope.model.from = scope.from || '12:00 AM';
            scope.model.to = scope.to || '12:00 AM';
            scope.day_label = MODIOCORE.dayTypes.get({id: parseInt(scope.dayId)}).name;

            elem.find('.timepicker-open').timepicker({
                template: false,
                showInputs: false,
                minuteStep: 1,
                defaultTime: scope.from || '12:00 AM'
            });

            elem.find('.timepicker-close').timepicker({
                template: false,
                showInputs: false,
                minuteStep: 1,
                defaultTime: scope.to || '12:00 AM'
            });
        }
    };
});

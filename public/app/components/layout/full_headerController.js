(function() {
  'use strict';

  angular
    .module('dietviewApp')
    .controller('full_headerCtrl', [
      '$rootScope',
      '$scope',
      '$timeout',
      function($rootScope, $scope, $timeout) {

        $rootScope.fullHeaderActive = true;

        $scope.$on('$destroy', function() {
          $rootScope.fullHeaderActive = false;
        });
      }
    ]);
}());

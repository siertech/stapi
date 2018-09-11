/*
 * angular-confirm
 * http://schlogen.github.io/angular-confirm/
 * Version: 1.1.0 - 2015-14-07
 * License: Apache
 */
angular.module('angular-confirm', [])
  .controller('ConfirmModalController', ['$scope', 'data', function ($scope, data) {
    $scope.data = angular.copy(data);

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }])
  .value('$confirmModalDefaults', {
    template: '<div class="modal-header"><h3 class="modal-title">{{data.title}}</h3></div>' +
    '<div class="modal-body">{{data.text}}</div>' +
    '<div class="modal-footer">' +
    '<button id="confirm-ok"  class="btn btn-primary" ng-click="ok()">{{data.ok}}</button>' +
    '<button id="confirm-cancel" class="btn btn-default" ng-click="cancel()">{{data.cancel}}</button>' +
    '</div>',
    controller: 'ConfirmModalController',
    defaultLabels: {
      title: 'Confirmar',
      ok: 'OK',
      cancel: 'Cancelar'
    }
  })
  .factory('$confirm', ['$mdDialog', function ($mdDialog) {
    return function (scope) {
     
      
       var confirm = $mdDialog.confirm({
    	   multiple: true
       })
      .title(scope.confirmTitle || "")
      .textContent(scope.confirm || "Tem certeza que deseja executar esta ação?")
      .ariaLabel('')
      .targetEvent(event)
      .ok(scope.confirmOk || "Sim")
      .cancel(scope.confirmCancel || "Não");
       return  $mdDialog.show(confirm);


      //return $modal.open(settings).result;
    };
  }])
  .directive('confirm', ['$confirm', function ($confirm) {
    return {
      priority: 1,
      restrict: 'A',
      scope: {
        confirmIf: "=",
        ngClick: '&',
        confirm: '@',
        confirmContent: '@',
        confirmSettings: "=",
        confirmTitle: '@',
        confirmOk: '@',
        confirmCancel: '@'
      },
      link: function (scope, element, attrs) {

    	  

        element.unbind("click").bind("click", function ($event) {

          $event.preventDefault();

          if (angular.isUndefined(scope.confirmIf) || scope.confirmIf) {
        	  
        	var data = {text: scope.confirm};
            
            data.cancel = "Cancelar";
            
            
            if (scope.confirmTitle) {
              data.title = scope.confirmTitle;
            }
            if (scope.confirmOk) {
              data.ok = scope.confirmOk;
            }
           
            $confirm(scope).then(function(res){
            	
            	scope.ngClick();
            });
          } else {

            scope.$apply(scope.ngClick);
          }
        });

      }
    }
  }]);

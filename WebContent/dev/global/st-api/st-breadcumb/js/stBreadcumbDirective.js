"use strict";
(function(){

	angular.module("stapi")
    .directive("breadcumb", stBreadcumb)
	.directive("stBreadcumb", stBreadcumb)

	function stBreadcumb(configUtil, stService, $rootScope, $route, $filter, stUtil){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-breadcumb/html/stBreadcumb.html",
			controllerAs: "$stBreadcumbCtrl",
			bindController: true,
			controller: function($scope, $controller, stMenuUtil){
				var ctrl = this;
				ctrl.scope = $scope;
				ctrl.data = {};
				ctrl.data.changePath = function(path){
					
					stMenuUtil.changePath(path);
				}
			}

		}
	}

})();


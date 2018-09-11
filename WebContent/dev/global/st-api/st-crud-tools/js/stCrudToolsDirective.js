"use strict";

(function(){

	angular.module("stapi")

	.directive('crudTools', stCrudTools)
	
	.directive('stCrudTools', stCrudTools);

	/**
	 * @ngdoc directive
	 * @name stapi.directive: crud-tools
	 * @restrict E
	 * @example
	 * <pre>
	 *     <crud-tools ob="vm.ob"  delete-function="vm.deleteFunction" edit-function="vm.editFunction" ></crud-tools>
	 * </pre>
	 **/
	
	function stCrudTools(){
		return {
			restrict: 'E',
			scope:{

				item: "<",
				openDetail: "&",
				deleteFunction: "&",
				icon: "@"

			},

			templateUrl:'global/st-api/st-crud-tools/html/crudTools.html',
			bindToController:true,
			controllerAs:"$stCrudToolsCtrl",
			controller: function(){

				var ctrl = this;
				
				ctrl.openMenu = function($mdMenu, event){
					event.stopPropagation();
					$mdMenu.open();
				}
				
			}
		}
	}

})();


"use strict";
(function(){

	angular.module("stapi") 

	.directive('stNav', stNav);
	
	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-nav
	 * @restrict E
	 * @example
	 * <pre>
	 *    <st-nav active-tab="tab"  tabs="[{icon:'home',label:'Início'}, {label:'Clientes', icon:'user'}]" </ st-nav>
	 * </pre>
	 **/
	function stNav(){

		return{
			restrict:"E",
			templateUrl:'global/st-api/st-nav/html/stNav.html',
			scope:{

				activeTab:"=",
				tabs:"="
			},

			controller:function($scope){

				if(!$scope.activeTab)
					$scope.activeTab=0;

				$scope.alterarTab =function (tab){

					$scope.activeTab = tab;

				}

			}
		}
	}

})();

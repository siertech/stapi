"use strict";
(function(){
	
	angular.module("stapi")
	
	.directive('buttonOpenConfig', buttonOpenConfig);
	
	 function buttonOpenConfig(configUtil) {
		return {
			templateUrl:"global/st-api/st-config/html/button-config.html",
			
			scope:{
				activeTab:"=",
				label:"=",
				extraClass:"="
			},
			controller: function($scope){
				
				$scope.open = function(){
					
					configUtil.openConfig($scope.activeTab||0);
				}
			}
		}
	}

})();

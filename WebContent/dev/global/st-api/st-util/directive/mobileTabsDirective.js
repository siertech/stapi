"use strict";
(function(){

	angular.module("stapi") 
	
	
	//Diretiva necessária para upload de arquivos
	.directive('mobileTabs',function (onlineStatus) {
		return {
			restrict: 'E',
			templateUrl:"global/st-api/st-util/template-module/mobileTabs.html",
			scope:{
				activeTab:"=",
				tabs: "=",
				disableFixToBotton:"="
			},
			controllerAs:"vm",
			bindToController:true,
			controller: function() {
				
				var vm = this;
				
				if( vm.activeTab!=0)
				vm.activeTab = 	vm.activeTab || 1;
				
				vm.alterarTab =function (tab){

					vm.activeTab = tab;

				}
				
			}
		};
	})

})();

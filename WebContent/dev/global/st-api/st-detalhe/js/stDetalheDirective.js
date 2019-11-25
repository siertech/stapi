"use strict";
(function(){
angular.module("stapi")

.directive("stDetalhe", stDetalhe);

function stDetalhe(){
	
	return{
		
		templateUrl: "global/st-api/st-detalhe/html/stDetalhe.html",
		bindToController: true,
		replace:true,
		transclude: true,
		scope: {
			saveFunction: "&",
			cancelFunction: "&",
			deleteFunction: "&",
			item: "<",
			hideCrudButtons: "<",
			loading:"<",
			title: "@"
		},
		controllerAs: "$stDetalheCtrl",
		controller: function($scope, $mdMedia){
			var ctrl = this;
			ctrl.scope = $scope;
			
			var isMobile = ($mdMedia('sm') || $mdMedia('xs'));
			
			if(isMobile==true){
				 ctrl.dialogContentStyle = {
						padding: "2px"
				 }
			}
				
		
		
		}
		
	}
}

})();
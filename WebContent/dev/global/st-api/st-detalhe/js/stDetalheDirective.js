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
		controller: function($scope){
			var ctrl = this;
			ctrl.scope = $scope;
			
			console.log("saveFunction aqui: ");
			console.log(ctrl.saveFunction);
		
		}
		
	}
}

})();
"use strict";
(function(){
angular.module("stapi")

.directive("stSelectedItemsActions", stSelectedItemsActions);

function stSelectedItemsActions(){
	
	return{
		
		templateUrl: "global/st-api/st-selected-items-actions/html/stSelectedItemsActions.html",
		bindToController: true,
		transclude: true,
		scope: {
			selectedItems: "<",
			deleteFunction: "&"
		},
		controllerAs: "$stSelectedItemsActionsCtrl",
		controller: function($scope){
			var ctrl = this;
			ctrl.scope = $scope;
		
		}
		
	}
}

})();
"use strict";

(function(){

	angular.module("stapi")

	.directive('stCardList', stCardList)
	.directive('cardList', stCardList);

	/**
	 * @ngdoc directive
	 * @name stapi.directive: st-card-list
	 * @restrict E
	 * @example
	 * <pre>
	 *    <div ng-repeat="ob in objetos" class="col-lg-4 generic-transition">
		   	 <st-card-list  index="{{$index}}"  ob="ob" pivo="'nome'"  edit-function="openItem" delete-function="deletarItem">
		   </st-card-list>
	 </div>
	 * </pre>
	 **/
	function stCardList(){
		return {
			restrict: 'E', 
			transclude:true,
			scope:{

				ob:"=",
				hideButtons:"=",
				pivo:"=",
				editFunction:"=",
				deleteFunction:"=",
				index:"@",
				icon:"@"

			},

			templateUrl:'global/st-api/st-card-list/html/stCardList.html',
			bindToController:true,
			controllerAs:"vm",
			controller: "stCardListController"
		}
	}

})();


"use strict";
(function(){

	angular.module("stapi")

	.directive("buttonFilial", buttonFilial)
	.directive("alertFilial", alertFilial)
	.directive("setAllFilials", setAllFilials);

	function buttonFilial(filialUtil, $mdDialog){
		
		return{
			templateUrl:"global/st-api/st-filial/html/buttonFilial.html",
			controllerAs:"$buttonFilialCtrl",
			bindToController: "true",
			controller: "buttonFilialCtrl"

		}

	}

	function alertFilial(filialUtil){

		return{
			templateUrl:"global/st-api/st-filial/html/alertFilial.html",
			scope:{
				label:"="
			},
			controller:function($scope,$rootScope){

				$scope.currentFilial = $rootScope.currentFilial;
			}

		}

	}

	function setAllFilials(filialUtil){

		return{
			templateUrl:'global/st-api/st-filial/html/setAllFilials.html',
			scope:{
				objeto:"=",
				defaultValue:"=",//true ou false
			},
			controller :function($scope,$rootScope){

				if($scope.defaultValue=="true")
					$scope.defaultValue = true;
				else if($scope.defaultValue=="false")
					$scope.defaultValue=false;

				$scope.filiais = $rootScope.filiais;

				if(!$scope.objeto)
					$scope.objeto  = {allFilials:true};

				if(!$scope.objeto.id){
					$scope.objeto.allFilials = $scope.defaultValue || false;

				}

			}

		}

	}

})();

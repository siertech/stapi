"use strict";
(function(){
	angular.module("stapi").config(function($routeProvider, $httpProvider){

		$routeProvider.when("/testdefinition",{

			templateUrl:"global/st-api/st-test-user/html/testDefinition.html",
			controller: function($scope, stService, stUtil, $mdDialog){

				$scope.openDetalhe = function(definition){

					var modal = $mdDialog.show({
						animation: true,
						templateUrl:"global/st-api/st-test-user/html/detalheTestDefinition.html",
						size:'lg',
						controller: function($scope, $modalInstance){

							$scope.definition = definition || {};
							$scope.salvar = function(){

								stService.executePost("testdefinition/add/",$scope.definition).then(function(){

									$modalInstance.close();

								});
							}

						}

					});
				}

			}

		}); 

		$routeProvider.when("/teste",{

			templateUrl:"global/st-api/st-test-user/html/test.html",

		}); 

	})
})();


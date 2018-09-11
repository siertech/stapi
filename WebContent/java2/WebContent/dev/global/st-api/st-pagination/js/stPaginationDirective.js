"use strict";
(function(){

	angular.module("stapi") 
	
	//Diretiva para Status de carregamento
	.directive('stPagination', stPagination);
	
	 function stPagination(anchorScroll) {
		return {
			restrict: 'AE',
			templateUrl:'global/st-api/st-pagination/html/stPagination.html',
			scope:{
                
				idElementToScroll:"@",
				querys:"=",//Querys bindadas

			},
			controller:function($scope, $rootScope){
				
				$scope.pagina=0;
				$scope.max = $rootScope.config.confs.maxItensPage || 7

				$scope.setPagina = function(pagina){

					anchorScroll.scrollTo($scope.idElementToScroll || "anchor_cima");
					$scope.pagina=pagina;
					
					if($scope.$parent.getLikeMap){
				     	$scope.$parent.getLikeMap($scope.querys||[''],$scope.pagina, $rootScope.config.confs.maxItensPage||7, "", "id", "DESC");
					}

				}

			}

		}
	}
	

})();

"use strict";
(function(){

	angular.module("stapi") 
	
	//Select simples (Sem auto-complete)
	.directive("stSelect",function(stService){

		return{
			restrict:"E",
			templateUrl:"global/st-api/st-util/template-module/stSelect.html",
			scope:{
				
			   urlBase:"=",//url base no control do objeto (Ex: 'produto')
			   attrLabel:"=",//Nome do atributo a ser exibido no label do select	 
			   ngModel:"="//ng-model associado	   
			},
			controller:function($scope){
				
				//Recupera todos os objetos
			    stService.getAll($scope.urlBase).then(function(data){
			    	
			    	$scope.itens = data.itens;
			    });

			}

		}
	})
	
})();

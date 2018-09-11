"use strict";
(function(){

	angular.module("stapi")

	.controller("buttonFilialCtrl", buttonFilialController);
	
	function buttonFilialController($scope, $rootScope, $timeout, $localStorage, configUtil, cacheGet, stUtil){

		var ctrl = this;
		ctrl.scope = $scope;
		ctrl.changeFilial = changeFilial;
		
		$rootScope.$watch("currentFilial",function(currentFilial){

			if(currentFilial)
				ctrl.currentFilial = currentFilial;
		});
		
		$rootScope.$watch("filiais",function(filiais){

			if(filiais)
				ctrl.filiais = filiais
		});

	
		function changeFilial(filial){
			
			var previousFilial = ctrl.currentFilial;
			
			
		$rootScope.$broadcast("filialChangeStart", ctrl.currentFilial, filial);
			
			if(filial.bloqueada==1){
                 
				stUtil.showMessage("","A origem '"+filial.nome+"' está bloqueada.","danger");
				return;
			}

			if($scope.filiaisPermitidas!=null && $scope.filiaisPermitidas.indexOf(filial.id+"")==-1){

				stUtil.showMessage("","A origem '"+filial.nome+"' não está disponível para este usuário","danger");
				return;
			}
			
			//ctrl.currentFilial = filial;
			$rootScope.currentFilial = filial;
			$localStorage.currentFilial = filial;
			stUtil.showMessage("","Origem alterada para  '"+filial.nome || filial.xNome+"'.","info");
			
			$rootScope.$broadcast("filialChangeSuccess", ctrl.currentFilial, previousFilial);
			
			//atualizar caches
			/*
			cacheGet.getOfflineCache(function(){

				stUtil.showMessage("","Origem alterada para  '"+filial.nome || filial.xNome+"'.","info");

			});
			*/
		
		}

	}

})();

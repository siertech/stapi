"use strict";
(function(){

	angular.module("stapiApp")
	.controller("artigoDetalheCtrl", artigoDetalheCtrl)
	.controller("artigoListCtrl", artigoListCtrl);

	var objectName = "Artigo";

	function artigoDetalheCtrl($scope, $controller, item, functionToDetailNotify, objectName, stUtil){

		var ctrl = this;
		angular.extend(ctrl, $controller('genericDetalheController', {
			$scope: $scope,
			functionToDetailNotify: functionToDetailNotify,
			objectName: objectName,
			item: item
		}));
	
	}

	function artigoListCtrl($scope, $controller, config, stCrudTools, stUtil, $route){

		var ctrl = this;
		
		angular.extend(ctrl, $controller('genericListController', {
			$scope: $scope,
			objectName: objectName,
			detalheTemplateUrl:"app/artigo/html/artigoDetalhe.html",
			detalheController: "artigoDetalheCtrl",
			detalheControllerAs: "$artigoDetalheCtrl",
			filtros:  [ 
				{attr:'titulo', label: 'Título do artigo'}

				]
		}));
		
		ctrl.data.tableColumns = [
			
			{label: "Título do artigo", attr: "titulo", orderBy: true, labelIcon: "text_format"}
			
		];
		
		ctrl.data.orderBy = "titulo";
		
		//Objeto que define as opções para listagem dos itens
		ctrl.data.requestListParams = {	
				objectName: objectName,
				maxItensPerPage: config.confs.maxItemsPerPage || 9,

		}
		
		//Override
		ctrl.data.saveSuccesResolve = saveSuccessResolve;
		ctrl.data.cancelResolve = cancelResolve;
		
		function saveSuccessResolve(obj){
			stUtil.showMessage("","Salvo com sucesso!");
			obj.$mdDialog.hide();
			$route.reload();
		}
		
		function cancelResolve(){
			
		}

		//Inicializa a lista de objetos
		ctrl.data.getList();

	}

})();

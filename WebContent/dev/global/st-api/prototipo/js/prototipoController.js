"use strict";
(function(){

	angular.module("stapi")
	.controller("prototipoDetalheCtrl", prototipoDetalheCtrl)
	.controller("prototipoListCtrl", prototipoListCtrl);

	var objectName = "Prototipo";

	function prototipoDetalheCtrl($scope, $controller, itemId, stUtil, stService, $route, $location, $compile){

		var ctrl = this;
		
		$scope.$watch("$prototipoDetalheCtrl.activeTab", function(value){
			
			
			if(value==1){
				changeHtmlCompiled();
			}
			
		});
		
		$scope.$watch("$prototipoDetalheCtrl.versaoPrototipo", function(){
			
			if(ctrl.activeTab==1){
				changeHtmlCompiled();
			}
			
		});
		
		function changeHtmlCompiled(){
			
			ctrl.versaoPrototipo.cssContent = ctrl.versaoPrototipo.cssContent || "";
		
			var css = "<style type='text/css'>\n" +ctrl.versaoPrototipo.cssContent + "\n</style>\n";
			var html =  css + ctrl.versaoPrototipo.codigo;
			
			var element = $('#htmlContent');
		    element.html($compile(html)($scope));
			
              			
		}

		var options = {
				objectName: "VersaoPrototipo",		
				querys: ["prototipo.id="+itemId]
		};
		
		function getList(){
			
			stService.getList(options).then(function(data){
				ctrl.versoesPrototipo = data.itens;
				ctrl.versaoPrototipo = ctrl.versaoPrototipo ||  data.itens[0] || {};
				ctrl.versaoPrototipo.label = ctrl.versaoPrototipo.label || "V1.0";
			});
			
		}
		getList();
		
		
		ctrl.deletarPrototipo = function(versaoPrototipo){

			stService.delete("Prototipo", [versaoPrototipo.prototipo.id]).then(function(data){

				$location.path("prototipo");
			});
		}	
		
		ctrl.deletarVersao = function(versaoPrototipo){

			stService.delete("VersaoPrototipo", [versaoPrototipo.id]).then(function(data){

				$route.reload();
			});
		}	

		ctrl.salvar = function(versaoPrototipo){

			stService.save("VersaoPrototipo", versaoPrototipo).then(function(data){
				ctrl.versaoPrototipo = data.item;
				stUtil.showMessage("","Salvo com sucesso");
				getList();
			});
		}	

		ctrl.salvarComoNovaVersao = function(versaoPrototipo){

			var copyOb = angular.copy(versaoPrototipo);
			copyOb.id = 0;
			stService.save("VersaoPrototipo", copyOb).then(function(data){
				ctrl.versaoPrototipo = data.item;
				stUtil.showMessage("","Salvo com sucesso");
				getList();
			});
		}	

	}

	function prototipoListCtrl($scope, $controller, config, stCrudTools, stUtil, $route, $location){

		var ctrl = this;

		angular.extend(ctrl, $controller('genericListController', {
			$scope: $scope,
			objectName: objectName,
			detalheTemplateUrl:"global/st-api/prototipo/html/prototipoDetalhe.html",
			detalheController: "prototipoDetalheCtrl",
			detalheControllerAs: "$prototipoDetalheCtrl",
			filtros:  [ 
				{attr:'titulo', label: 'Título do protótipo'}

				]
		}));

		ctrl.data.tableColumns = [

			{label: "Título do protótipo", attr: "titulo", orderBy: true, labelIcon: "code"}

			];


		ctrl.data.openDetail = function(item){

			item = item || {};
			var id = item.id || 0;

			$location.path("prototipo/"+id);
		}

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

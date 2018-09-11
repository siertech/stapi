"use strict";
(function(){

	angular.module("stapi")

	/**
	 * @ngdoc controller
	 * @name stapi.controller:StControl
	 * @description Controlador genérico de requisições
	 * 
	 */

	.controller("genericListController", genericListController)
	.controller("genericListControl", genericListControl)
	.controller("genericDetalheController", genericDetalheController)

	function genericDetalheController($scope, stService, functionToDetailNotify, objectName, stCrudTools, $mdDialog, item){

		var ctrl = this;
		ctrl.data = {};
		ctrl.data.item = item;
		ctrl.scope = $scope;
		ctrl.data.loading = false;
		ctrl.data.cancelFunction = cancelFunction;
		ctrl.data.deleteFunction = deleteFunction;
		ctrl.data.saveFunction = saveFunction;

		function cancelFunction(){

			$mdDialog.cancel();
		}

		function deleteFunction(item){

			ctrl.data.loading = true;
			var options = {
					objectName: objectName,
					item: item,
					$mdDialog: $mdDialog,
					functionToNotify: functionToDetailNotify
			};
			stCrudTools.deleteAndNotify(options).then(function(){

				ctrl.data.loading = false;

			}).catch(function(){

				ctrl.data.loading = false;
			});

		}

		function saveFunction(item){

			ctrl.data.loading = true;
			var options = {
					objectName: objectName,
					item: item,
					$mdDialog: $mdDialog,
					functionToNotify: functionToDetailNotify
			};
			stCrudTools.saveAndNotify(options).then(function(data){

				ctrl.data.loading = false;
				ctrl.data.item.id  = data.item.id;


			}).catch(function(){

				ctrl.data.loading = false;
			});

		}
	}
	
	

	function genericListControl($scope, filtros, $route, $mdMedia, $mdDialog, options , config, $q, stService, stUtil,  $mdEditDialog, stCrudTools, $log){

		var ctrl = this;
		var  objectName  = options.objectName,
		detalheTemplateUrl = options.detalheTemplateUrl, 
		detalheController = options.detalheController,
		detalheControllerAs =  options.detalheControllerAs,
		fixProperties = options.fixProperties|| {},
		fixQuerys = options.fixQuerys || [];
		
		ctrl.scope = $scope;

		$scope.$on("filialChangeStart", function(evt, current, next){


		});

		$scope.$on("filialChangeSuccess", function(evt, current, previous){

			ctrl.data.filialChangeSuccess();
		});

		$scope.$on("filialChangeError", function(evt, current, next){


		});

		//Os propriedades e funções definidas em ctrl.data permitem override
		ctrl.data = {};

		ctrl.data.objectName = objectName;
		ctrl.data.filtros = filtros;
		ctrl.data.selectedItems = [];
		ctrl.showMdMenu = showMdMenu;
		ctrl.data.getSelectedItemsIds = getSelectedItemsIds;
		ctrl.data.resolveDetalheNotify = resolveDetalheNotify;

		//Funções de CRUD
		ctrl.data.getList = getList;
		ctrl.data.saveFunction = saveFunction;
		ctrl.data.openDetail = openDetail;
		ctrl.data.deleteFunction = deleteFunction;
		ctrl.data.editColumn = editColumn;
		ctrl.data.changeAttrValue = changeAttrValue;

		//Resolução do detalhamento do item
		ctrl.data.saveSuccesResolve =  saveSuccessResolve;
		ctrl.data.saveErrorResolve =  saveErrorResolve;
		ctrl.data.deleteSuccessResolve =  deleteSuccessResolve;
		ctrl.data.deleteErrorResolve =  deleteErrorResolve;
		ctrl.data.cancelResolve =  cancelResolve;

		//Alteração de filial
		ctrl.data.filialChangeStart = filialChangeStart;
		ctrl.data.filialChangeSuccess = filialChangeSuccess;
		ctrl.data.filialChangeError = filialChangeError;
		
		function filialChangeStart(){
             
		}

		function filialChangeSuccess(){
			
			 getList();
		}
		
		function filialChangeError(){

		}

		function cancelResolve(obj){

		}

		function saveSuccessResolve(obj){

			stUtil.showMessage("","Salvo com sucesso!");
			obj.$mdDialog.hide();
			
			if(obj.itemAnt.id){
				ctrl.data.getList();
			}
			
			else{
			    $route.reload();
			}

		}

		function saveErrorResolve(obj){
			stUtil.showMessage("","Ocorreu um erro ao salvar o item", "danger");
		}

		function deleteSuccessResolve(obj){

			stUtil.showMessage("","Item deletado com sucesso");
			obj.$mdDialog.hide();
			ctrl.data.getList();
		}

		function deleteErrorResolve(obj){
			stUtil.showMessage("","Ocorreu um erro ao deletar o item", "danger");
		}

		function resolveDetalheNotify(obj){

			var preMsg = "";

			if(obj.event == stCrudTools.CANCEL){

				ctrl.data.cancelResolve(obj);
			}

			else if(obj.event == stCrudTools.SAVE_SUCCESS){

				ctrl.data.saveSuccesResolve(obj);
			}

			else if(obj.event == stCrudTools.SAVE_ERROR){

				ctrl.data.saveErrorResolve(obj);

			}
			else if(obj.event == stCrudTools.DELETE_SUCCESS){

				ctrl.data.deleteSuccessResolve(obj);
			}
			else if(obj.event == stCrudTools.DELETE_ERROR){

				ctrl.data.deleteErrorResolve(obj);

			}

		}

		function getSelectedItemsIds(){

			var ids = [];
			ctrl.data.selectedItems.filter(function(item){

				ids.push(item.id);
			});

			return ids;
		}

		function showMdMenu($mdMenu, ev){

			$mdMenu.open(ev);
		}

		function editColumn (event, options) {
			event.stopPropagation(); // in case autoselect is enabled

			var editDialog = {
					modelValue:  stUtil.getValue(options.item, options.column),
					placeholder: options.placeholder,
					save: function (input) {

						stUtil.setValue(options.item, options.column, input.$modelValue);
						changeAttrValue(options.item.id, options.column, input.$modelValue);

					},
					targetEvent: event,
					title: options.title || "",
					validators: options.validators || {}
			};

			return  $mdEditDialog.small(editDialog);

		};

		function changeAttrValue(idItem, column, value){

			stService.changeAttrValue(objectName, idItem, column, value);
		}

		function saveFunction(_item){

			stService.save(objectName, _item).then(function(){

			});

		}

		function deleteFunction(ids){

			stService.delete(objectName, ids).then(function(){

				stUtil.showMessage("","Os itens foram deletados com sucesso!");
				getList();

			}).catch(function(){

				stUtil.showMessage("","Ocorreu um erro ao deletar os itens!","md-error");

			});

		}

		function openDetail(item, parent){
			

			if(typeof item === 'number'){

				stService.getById(objectName, item).then(function(data){

					var item =  setFixPropertiesToItem(data.item);
					showDetailDialog(item, parent);

				}).catch(function(){

					stUtil.showMessage("","Ocorreu um erro ao recuperar o item","danger");
				});

			}else {
			
				item = item || {};
				item = angular.copy(item);
				item = setFixPropertiesToItem(item);
				showDetailDialog(item, parent);
			}

		}
		
		function setFixPropertiesToItem(item){
			
			var fix = fixProperties || {};
			
			for(var key in fix){
				
				item = stUtil.setValueOfNivel(item, key, fix[key]);
			}
			
			return item;
			
		}

		function showDetailDialog(item, parent){

			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
			$mdDialog.show({
				controllerAs: detalheControllerAs,
				controller: detalheController,
				resolve:{
					item: function(){return  item},
					objectName: function(){ return objectName},
					functionToDetailNotify: function(){ return ctrl.data.resolveDetalheNotify},

				},
				templateUrl: detalheTemplateUrl,

				parent: parent || angular.element(document.body),
				clickOutsideToClose: false,
				multiple: true,
				fullscreen: config.fullScreenItemDetail || true,
				autoWrap: true
			})
			.then(function(res) {

			}, function() {

				stCrudTools.cancelAndNotify(ctrl.data.resolveDetalheNotify);

			});

		}

		function getList(){

			var deferred = $q.defer();
			ctrl.data.loading = true;
			ctrl.data.requestListParams.querys =  ctrl.data.requestListParams.querys || [];
			var fixQuerysAndFixProperties =  [];
			fixQuerysAndFixProperties = fixQuerysAndFixProperties.concat(stUtil.transformJSONToSqlComparators(fixProperties));
			fixQuerysAndFixProperties  = fixQuerysAndFixProperties.concat(fixQuerys);
			var paramOptions = angular.copy(ctrl.data.requestListParams);
			paramOptions.querys = paramOptions.querys || [];
			paramOptions.querys = paramOptions.querys.concat(fixQuerysAndFixProperties);
			stService.getList(paramOptions).then(function(data){
				
				if(ctrl.data.requestListParams.pagina!=0 && data.itens.length==0){
					ctrl.data.requestListParams.pagina = 0;
					getList();
					return;
				}

				ctrl.data.loading = false;
				deferred.resolve(data);
				ctrl.data.totalItens = data.countAll;
				ctrl.data.objetos = data.itens;
				ctrl.data.selectedItems = [];

			}).catch(function(){
				ctrl.data.loading = false;
				deferred.reject();
			});
			
			return deferred.promise;

		}

	}

	//DEPRECATED
	function genericListController($scope, filtros, $route, $mdMedia, $mdDialog, objectName, detalheTemplateUrl, detalheController, detalheControllerAs, config, $q, stService, stUtil,  $mdEditDialog, stCrudTools, $log){

		var ctrl = this;
		
		$log.warn("genericListController is now deprecated use genericListControl instead");
		
		ctrl.scope = $scope;


		$scope.$on("filialChangeStart", function(evt, current, next){


		});

		$scope.$on("filialChangeSuccess", function(evt, current, previous){

			ctrl.data.filialChangeSuccess();
		});

		$scope.$on("filialChangeError", function(evt, current, next){


		});

		//Os propriedades e funções definidas em ctrl.data permitem override
		ctrl.data = {};

		ctrl.data.objectName = objectName;
		ctrl.data.filtros = filtros;
		ctrl.data.selectedItems = [];
		ctrl.showMdMenu = showMdMenu;
		ctrl.data.getSelectedItemsIds = getSelectedItemsIds;
		ctrl.data.resolveDetalheNotify = resolveDetalheNotify;

		//Funções de CRUD
		ctrl.data.getList = getList;
		ctrl.data.saveFunction = saveFunction;
		ctrl.data.openDetail = openDetail;
		ctrl.data.deleteFunction = deleteFunction;
		ctrl.data.editColumn = editColumn;
		ctrl.data.changeAttrValue = changeAttrValue;

		//Resolução do detalhamento do item
		ctrl.data.saveSuccesResolve =  saveSuccessResolve;
		ctrl.data.saveErrorResolve =  saveErrorResolve;
		ctrl.data.deleteSuccessResolve =  deleteSuccessResolve;
		ctrl.data.deleteErrorResolve =  deleteErrorResolve;
		ctrl.data.cancelResolve =  cancelResolve;

		//Alteração de filial
		ctrl.data.filialChangeStart = filialChangeStart;
		ctrl.data.filialChangeSuccess = filialChangeSuccess;
		ctrl.data.filialChangeError = filialChangeError;
		
		function filialChangeStart(){
             
		}

		function filialChangeSuccess(){
			
			 getList();
		}
		
		function filialChangeError(){

		}

		function cancelResolve(obj){

		}

		function saveSuccessResolve(obj){

			stUtil.showMessage("","Salvo com sucesso!");
			obj.$mdDialog.hide();
			
			if(obj.itemAnt.id){
				ctrl.data.getList();
			}
			
			else{
			    $route.reload();
			}

		}

		function saveErrorResolve(obj){
			stUtil.showMessage("","Ocorreu um erro ao salvar o item", "danger");
		}

		function deleteSuccessResolve(obj){

			stUtil.showMessage("","Item deletado com sucesso");
			obj.$mdDialog.hide();
			ctrl.data.getList();
		}

		function deleteErrorResolve(obj){
			stUtil.showMessage("","Ocorreu um erro ao deletar o item", "danger");
		}

		function resolveDetalheNotify(obj){

			var preMsg = "";

			if(obj.event == stCrudTools.CANCEL){

				ctrl.data.cancelResolve(obj);
			}

			else if(obj.event == stCrudTools.SAVE_SUCCESS){

				ctrl.data.saveSuccesResolve(obj);
			}

			else if(obj.event == stCrudTools.SAVE_ERROR){

				ctrl.data.saveErrorResolve(obj);

			}
			else if(obj.event == stCrudTools.DELETE_SUCCESS){

				ctrl.data.deleteSuccessResolve(obj);
			}
			else if(obj.event == stCrudTools.DELETE_ERROR){

				ctrl.data.deleteErrorResolve(obj);

			}

		}

		function getSelectedItemsIds(){

			var ids = [];
			ctrl.data.selectedItems.filter(function(item){

				ids.push(item.id);
			});

			return ids;
		}

		function showMdMenu($mdMenu, ev){

			$mdMenu.open(ev);
		}

		function editColumn (event, options) {
			event.stopPropagation(); // in case autoselect is enabled

			var editDialog = {
					modelValue:  stUtil.getValue(options.item, options.column),
					placeholder: options.placeholder,
					save: function (input) {

						stUtil.setValue(options.item, options.column, input.$modelValue);
						changeAttrValue(options.item.id, options.column, input.$modelValue);

					},
					targetEvent: event,
					title: options.title || "",
					validators: options.validators || {}
			};

			return  $mdEditDialog.small(editDialog);

		};

		function changeAttrValue(idItem, column, value){

			stService.changeAttrValue(objectName, idItem, column, value);
		}

		function saveFunction(_item){

			stService.save(objectName, _item).then(function(){

			});

		}

		function deleteFunction(ids){

			stService.delete(objectName, ids).then(function(){

				stUtil.showMessage("","Os itens foram deletados com sucesso!");
				getList();

			}).catch(function(){

				stUtil.showMessage("","Ocorreu um erro ao deletar os itens!","md-error");

			});

		}

		function openDetail(item, parent){
			

			if(typeof item === 'number'){

				stService.getById(objectName, item).then(function(data){

					var item =  data.item;
					showDetailDialog(item, parent);

				}).catch(function(){

					stUtil.showMessage("","Ocorreu um erro ao recuperar o item","danger");
				});

			}else {
			
				item = item || {};
				item = angular.copy(item);
				showDetailDialog(item, parent);
			}

		}
		
		

		function showDetailDialog(item, parent){

			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
			$mdDialog.show({
				controllerAs: detalheControllerAs,
				controller: detalheController,
				resolve:{
					item: function(){return  item},
					objectName: function(){ return objectName},
					functionToDetailNotify: function(){ return ctrl.data.resolveDetalheNotify},

				},
				templateUrl: detalheTemplateUrl,

				parent: parent || angular.element(document.body),
				clickOutsideToClose: false,
				multiple: true,
				fullscreen: config.fullScreenItemDetail || true,
				autoWrap: true
			})
			.then(function(res) {

			}, function() {

				stCrudTools.cancelAndNotify(ctrl.data.resolveDetalheNotify);

			});

		}

		function getList(){

			var deferred = $q.defer();
			ctrl.data.loading = true;
			ctrl.data.requestListParams.querys =  ctrl.data.requestListParams.querys || [];
			
			stService.getList(ctrl.data.requestListParams).then(function(data){
				
				if(ctrl.data.requestListParams.pagina!=0 && data.itens.length==0){
					ctrl.data.requestListParams.pagina = 0;
					getList();
					return;
				}

				ctrl.data.loading = false;
				deferred.resolve(data);
				ctrl.data.totalItens = data.countAll;
				ctrl.data.objetos = data.itens;
				ctrl.data.selectedItems = [];

			}).catch(function(){
				ctrl.data.loading = false;
				deferred.reject();
			});
			
			return deferred.promise;

		}

	}


})();

"use strict";
(function(){

	angular.module("stapiApp")

	.factory("ioUtil",function($mdDialog){
           
		var _openItem = function(item, callback){
			
			$mdDialog.show({
				animation: true,
				templateUrl:"app/io/html/detalhe.html",
				size:'lg',
				controllerAs:"vm",
				controller: function(stService, stUtil, $modalInstance, $route){
					
					var vm = this;
					vm.item = item || {};
					vm.salvandoItem  =  false;
					
					vm.salvarItem = function(){
						
						var _item = vm.item;
						vm.salvandoItem = true;
						stService.executePost("io/add/", _item).then(function(data){
							
							vm.item = data.item;
							vm.salvandoItem = false;
							stUtil.showMessage("","Salvo com sucesso","info");	
							callback("add", $modalInstance);
							
							
						}).catch(function(){
							
							vm.salvandoItem = false;
							stUtil.showMessage("","Ocorreu um erro","danger");	
							callback("add-error", $modalInstance);
						});
						
					}
					
					vm.deletarItem = function(){
						
						stService.executePost("io/delete/", [vm.item.id]).then(function(){
							
							stUtil.showMessage("","Item deletado com sucesso","info");	
							callback("delete", $modalInstance);
							
						}).catch(function(){
							
							stUtil.showMessage("","Ocorreu um erro ao deletar","danger");	
							callback("delete-error", $modalInstance);
						});
					}
					
					
				}
			});
			
		}

		return {
			openItem :_openItem
		
		};

	})

})();

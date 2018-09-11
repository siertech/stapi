"use strict";
(function(){

	angular.module("stapiApp")
    .controller("detalhetesteController", function(stService, stUtil, $modalInstance, item, callback){
    	
				var vm = this;
				vm.item = item || {};
				vm.salvandoItem  =  false;
				
				vm.salvarItem = function(){
					
					var _item = vm.item;
					vm.salvandoItem = true;
					stService.save("teste", _item).then(function(data){
						
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
					
					stService.delete("teste", [vm.item.id]).then(function(){
						
						stUtil.showMessage("","Item deletado com sucesso","info");	
						callback("delete", $modalInstance);
						
					}).catch(function(){
						
						stUtil.showMessage("","Ocorreu um erro ao deletar","danger");	
						callback("delete-error", $modalInstance);
					});
				}
				
			
    })
    
    .controller("listtesteController", function(testeUtil, stService, $route, stUtil, $scope){

    	var vm = this;
    	
		 //Editar item ou cadastrar novo
		 vm.openItem = function(item){
			
			testeUtil.openItem(item, function(event, modal){
				
				/*
				 Poss�veis valores para event
				 
				 * add - O item foi salvo
				 * add-error - erro ao salvar o item
				 * delete - O item foi deletado
				 * delete-error -  Erro ao deletar o objeto
				
				 */
				
				 modal.close();
				 $route.reload();
				
				
			});

		}

		//Deletar item
		vm.deletarItem = function(item){
					
			stService.delete("teste", [item.id]).then(function(){
				
				stUtil.showMessage("","Item deletado com sucesso","info");	
				$route.reload();
				
			}).catch(function(){
				
				stUtil.showMessage("","Ocorreu um erro ao deletar","danger");	
			});

		}
    })
	
})();

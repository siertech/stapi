"use strict";

(function(){

	angular.module("stapi")

	.directive('buttonTutorial', buttonTutorial);
	
	function buttonTutorial ($mdDialog, tutorialUtil){
		return {
			restrict: 'AE',
			
			link: function(scope, element, attrs) {
			
				element.bind('click', function(){
					
					$mdDialog.show({
						animation: true,
						templateUrl:"global/st-api/st-tutorial/html/tutorialList.html",
						size:'lg',
						controllerAs:"vm",
						bindToController:true,
						controller:function($scope){
							
							var vm = this;
							vm.tutoriais = [
							    {
								  titulo: "Vendas",
								  descricao:"Como realizar uma venda, listagem de vendas",
								  linkMobile:"https://www.youtube.com/watch?v=sOdiWXFF9Ms",
								  linkDesktop:"https://www.youtube.com/watch?v=93RTB0PXAU0&feature=youtu.be"
							   },
							   {
									  titulo: "Estoque",
									  descricao:"Cadastro e listagem de produtos",
									  linkMobile:"",
									  linkDesktop:""
								   }      
							 ];
							
							vm.openTutorial = function(item){
								
								tutorialUtil.openDetalheTutorial(item);
							}
							
						}
					});
					
				});
			}
		}
	}

})();


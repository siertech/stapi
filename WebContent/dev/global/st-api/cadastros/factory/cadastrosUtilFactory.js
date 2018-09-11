
"use strict";
(function(){

	angular.module("stapi") 

	.factory('cadastrosUtil', function($rootScope,$filter, stUtil,$mdDialog){

		var	_openCadastro = function(cadastro,callback){

			var _modalInstance =   $mdDialog.show({
				animation: true,
				templateUrl:"global/st-api/cadastros/template-module/detalheCadastro.html",
				size:'lg',
				controller:function($scope,stService,stUtil){

					$scope.cadastro = cadastro;

					$scope.fechar = function(modal){

						modal.$dismiss("");

					}

					$scope.salvar = function(cadastro,modal){

						stService.save("opcao",cadastro).then(function(data){

							stUtil.showMessage("","Opção adicionada com sucesso!","info");
							modal.$dismiss("");
							callback(data.item);

						});

					}

				}

			});

		}

		return {

			openCadastro:_openCadastro

		}

	})

})();

"use strict";

(function(){

	angular.module("stapi")

	.factory("filialUtil", filialUtil)
	
	function filialUtil(stService,$rootScope,$localStorage,stUtil,st,$mdDialog,$http,config){

		//Abre os detalhes da filial para edição
		var _openDetalheCurrentFilial= function(filial,callback){

			$mdDialog.show({
				animation: true,
				templateUrl:'global/st-api/st-filial/html/modalDetalheFilial.html',
				size:'lg',
				controller:function($scope,$rootScope){

					$scope.filial = $rootScope.currentFilial;

					$scope.fechar = function(ele){

						ele.$dismiss('cancel');
						callback($scope.filial);

					}

					//Envio do certificado digital
					$scope.enviarCertificado = function(file,senha) {

						var fd = new FormData();
						fd.append('file', file);
						fd.append('senha',senha);
						$http.post(stService.getBaseUrl()+"filial/upload-certificado/", fd, {
							transformRequest : angular.identity,
							headers : {
								'Content-Type' : undefined
							}
						}).then(function(data) {

							$rootScope.currentFilial.nomeCertificado = data.item;
							$scope.filial.nomeCertificado = data.item;
						}).catch(function() {

						});
					}

					$scope.salvar = function(filial){

						stService.save("filial",filial).then(function(data){

							stUtil.showMessage("","Salvo com sucesso","info");	

							if(callback)
								callback(data.item);
						});

					}

				}
			});
		}

		var _getAllFiliais = function(callback){

			stService.getAll("filial").then(function(data){

				var filiais = data.itens;

				//Empresa com mais de uma filial
				if(filiais.length>0){

					$rootScope.filiais = filiais;
					$rootScope.filiais.unshift({id:0,xNome:"Todas"});
					$rootScope.currentFilial = 	$localStorage.currentFilial || data.itens[0];

				}

				//Empresa sem filiais
				else{
					$rootScope.filiais  = [{id:1,xNome:"Matriz"}];
					$rootScope.currentFilial = {id:1,xNome:"Matriz"};
				}

				if(callback)
					callback(data.itens);

			}).catch(function(){
				
				callback();
			});

		}

		var _getFilialById = function(id){

			var filial ={};

			var index = stUtil.buscaOb($rootScope.filiais, id, "id");

			if(index!=-1)
				filial = $rootScope.filiais[index];

			return filial;

		}

		return {

			getFilialById:_getFilialById,
			getAllFiliais:_getAllFiliais,
			openDetalheCurrentFilial: _openDetalheCurrentFilial
		}

	}

})();


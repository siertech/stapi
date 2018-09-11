"use strict";
(function(){
	angular.module("stBlog") 
	.config(function($routeProvider, $httpProvider){

		//Rota para listagem dos objetos
		$routeProvider.when("/artigo/:url",{

			templateUrl:"app/artigo/html/artigoList.html",
			controllerAs:"vm",
			resolve:{
				urlArtigo: function($route){
					return $route.current.params.url
				}
			},
			controller: listArtigoController

		}); 

		//Rota para listagem dos objetos
		$routeProvider.when("/artigo",{

			templateUrl:"app/artigo/html/artigoList.html",
			controllerAs:"vm",
			resolve:{
				urlArtigo: function($route){
					return null
				}
			},
			controller: listArtigoController

		}); 

		function listArtigoController(stService, urlArtigo){
			var vm = this;

			vm.getArtigoByUrl = function(urlArtigo){

				stService.executeQuery("from Artigo where url ='"+urlArtigo+"'").then(function(res){

					vm.artigoSelected  = res.itens[0];
				});

			}

			stService.executeQuery("select id, titulo, url, dataCadastro from Artigo where disable=0 order by dataCadastro desc ignoreFilial").then(function(res){

				var its = res.itens;
				vm.artigos =  [];

				for(var i in its){

					vm.artigos.push({id: its[i][0], titulo: its[i][1], url: its[i][2], dataCadastro: its[i][3]});

				}
                
		        vm.getArtigoByUrl(urlArtigo || "intro");

			});

		}

	})

})();

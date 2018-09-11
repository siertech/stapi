
"use strict";
(function(){
angular.module("stapi").controller("cadastrosController",function($scope,stService,$rootScope,stUtil,$filter,cadastrosUtil){


	$scope.apagar = function(op,index){


		stService.apagar("opcao",[op.id]).then(function(){
			$scope.opcoes.splice(index,1);
		});
	}

	$scope.openCadastro = function(cadastro){
		cadastrosUtil.openCadastro(cadastro,function(item){

			$scope.getOpcoes($scope.descricao,$scope.label);

		});

	}

	$scope.getOpcoes = function(descricao,label){

		$scope.label = label;//Label a ser exibido ex: "Categorias de conta a pagar"
		$scope.descricao = descricao;//descricao usada na tabela correspondente do banco de dados, ex: 'categoria_conta_pagar'

		stService.getLikeMap("opcao",["descricao='"+descricao+"'"],0,0,'').then(function(data){

			$scope.opcoes = data.itens;
		});

	}

});
})();

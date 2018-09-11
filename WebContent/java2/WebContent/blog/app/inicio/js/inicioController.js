
"use strict";
(function(){
angular.module("stBlog").controller("inicioController",function($scope, stService){

	
	//auto complete
	stService.executeQuery("from DemoComponent where _string['categoria']='auto complete' ").success(function(res){
		
		$scope.autocomplete = res.itens;
		
	});
	
	
	//input
	stService.executeQuery("from DemoComponent where _string['categoria']='input' ").success(function(res){
		
		$scope.input= res.itens;
		
	});
	
	
	//botões
	stService.executeQuery("from DemoComponent where _string['categoria']='button' ").success(function(res){
		
		$scope.botao= res.itens;
		
	});
	
	//outros
	stService.executeQuery("from DemoComponent where _string['categoria']='outros' ").success(function(res){
		
		$scope.outros= res.itens;
		
	});
	


})

})();
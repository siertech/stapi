"use strict";

(function(){

	angular.module("stapiApp")

	.controller("menuCtrl", menuCtrl);

	function menuCtrl($scope, $controller){

		var ctrl = this;
		ctrl.scope = $scope;

		var menuItems =  [

			{path: "inicio", icon:"home", label:"Início"},
			{path: "cliente", icon:"person", label:"Crud Demo"},
			{path: "artigo", icon:"text_format", label:"Artigos"},
			{path: "democomponent", icon:"code", label:"Componentes"}
			];

		angular.extend(ctrl, $controller('stMenuController', {
			$scope: $scope,
			menuItems: menuItems,
			sidenavId:  "side-nav-principal"
		}));


	}	

})();


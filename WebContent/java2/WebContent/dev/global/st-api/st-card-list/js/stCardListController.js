"use strict";
(function(){
	angular.module("stapi") 

	.controller("stCardListController",stCardList);

	function stCardList(stUtil){

		var vm = this;

		if(vm.ob && vm.pivo)
			vm.labelPivo = stUtil.getValueOfNivel(vm.ob,vm.pivo);

	}

})();

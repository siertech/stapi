"use strict";
(function(){

	angular.module("stapi") 

	.directive('stAutoComplete', stAutoComplete)
	.directive('autoComplete', stAutoComplete);


	/**
	 * @ngdoc  directive
	 * @name stapi.directive: st-auto-complete
	 * @param {String@}  label  Texto que aparecerá acima da caixa de texto, ex: Nome do cliente
	 * @param {String@}  objectName  Nome do objeto que será utilizado na pesquisa (Em camel case), ex: Cliente
	 * @param {String@}  attr  Atributo do objeto que será utilizado na pesquisa , ex: nome
	 * @param {Object=}  ng-model  Objeto no escopo a qual o elemento está relacionado , ex: empresa
	 * @param {String@}  initialBusca  Expressão padrão para busca de objeto, ex: Paulo
	 * @param {String@}  extraClass  Classe css extra a ser adicionada ao elemento input da diretiva
	 * @param {String@}  labelCad  Texto a ser exibido no botão de cadastro de novo item
	 * @param {String@}  placeHolderBusca  place-holder do input de busca
	 * @param {Boolean=}  valueOnly  se true, não seta o objeto inteiro no model, apenas o valor(objjeto[attr])
	 * @example
	 * <p>Exemplo utilizando Um Objeto</p>
	 * <pre>
	 * <auto-complete 
	        label="Nome do cliente"
	        object-name="Cliente"
	        attr="nome",
	        ng-model="empresa" 
            initial-busca="João"  
		    extra-class="input-lg"  
		    label-cad="Cadastrar novo Cliente" 
		    place-holder="Primeiro, digite o nome do cliente"  
		    >
		 </auto-complete>
	 *</pre>
	 *<p>Exemplo utilizando com.siertech.stapi.opcao</p>
	 *<pre>
	 * <st-auto-complete     
		    label-cad="Cadastrar categoria teste" 
		    place-holder="placeHolderCategoria"  
		    object-name="Opcao"  
		    attr="valor" label="Descrição"
		    fix-properties="{descricao:'categoria_teste'}" 
		    ng-model="categoria" 
		    value-only="true"
		    initial-busca=""
		  </st-auto-complete>
		  </pre>
	 **/
	function stAutoComplete() {
		return {
			restrict: 'E',
			require:'ngModel, objectName',

			scope:{

				placeholder:"@",
				label:"@",
				listItemIcon:"@",
				idInput:"@",
				objectName:"@",//nome do objeto Objeto (Em camel case)
				getCompleteObject:"<", // se true o objeto completo é definido no model e não apenas attr e id, se o atributo for do tipo genérico, o objeto e setado por completo de qualquer maneira
				attr:"@",
				ngModel: "<",
				initialBusca:"@",//String a ser setada no campo de busca (input)
				fixProperties:"<",//Propriedades fixas do objeto, usada tanto para cadastros tanto para buscas
				valueOnly:"<",//se true, não seta o objeto inteiro no model, apenas o valor(objjeto[attr])
				resultadoBusca:"=",//Bind para resultados da busca
				useCache:"<",//cacheGet
				autoShowBusca:"<"//Mostra a tela de busca automaticamente
			},
			
			templateUrl:"global/st-api/st-autocomplete/html/stAutoComplete.html",
			controller: "stAutoCompleteController",
			bindToController:true,
			controllerAs:"$stAutoCompleteCtrl"
			
		}

	}


})();

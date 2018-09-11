
describe('<st-autocomplete>', function() {
    
	//Expressões regulares para utilização em $httpBackend
	var URL_PROJECOES = /projecao\/get-projecoes/;
	var URL_BUSCA_MAP = /busca\/map/;
	var URL_ADD_OBJETO = /add/;
	var URL_GET_BY_ID = /get/;

	var listaObjetosMock = [
		{id: 1, nome: "Thomaz Reis Damasceno do Carmo"},
		{id: 2, nome: "Talita Taiane do Carmo Damasceno"},
		{id: 3, nome: "Magda Maria Reis Damasceno"},
		{id: 4, nome: "Carlos Roberto de Moura Damasceno"}
		];

	var objetoMock = {
			id: 89,
			nome: "Talita Taiane do Carmo Damasceno"
	};

	var scope, element, $httpBackend, $cookieStore, cacheGet;

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	beforeEach(inject(function(_$httpBackend_, _$cookieStore_, _cacheGet_){

		$httpBackend = _$httpBackend_;
		$cookieStore = _$cookieStore_;
		cacheGet = _cacheGet_;
		$cookieStore.put("usuarioSistema", {originalLogin: "thomaz@ceasaplus"});
	

	}));

	function getResponseListaObjetosMock(objetos){

		var response = {
				itens: objetos || listaObjetosMock
		}
		return response;

	}

	afterEach(function() {
		scope && scope.$destroy();
	});


	function getTemplate(attrs){

		attrs  = attrs || {};

		var template = 
			'<st-auto-complete '+
			' use-cache= "'+ (attrs.useCache || false)+'"'+
			' auto-show-busca= "'+ (attrs.autoShowBusca || false)+'"'+
			' value-only= "'+ (attrs.valueOnly || false)+'"'+
			' id-input= "'+ (attrs.idInput || "asdas")+'"'+
			' list-item-icon= "'+ (attrs.listItemIcon || undefined)+'"'+
			' placeholder = "'+ (attrs.placeholder || 'Nome do cliente')+'"'+
			' get-complete-object = "'+ (attrs.getCompleteObject || false)+'"'+
			' object-name = "'+ (attrs.objectName || 'Cliente')+'"'+
			' attr = "'+ (attrs.attr || 'nome')+'"'+
			' fix-properties = "'+(attrs.fixProperties || 'fixProperties')+'"'+
			' ng-model = "'+ (attrs.ngModel || 'objeto')+'"'+
			' initial-busca ="'+(attrs.initialBusca)+'"'+
			' label-cad="'+ (attrs.labelCad || 'Cadastrar novo cliente')+'"'+
			' place-holder-busca="'+ (attrs.placeHolderBusca || 'Digite um nome para buscar')+'"'+
			' > '+
			' </st-auto-complete>';
		return template;

	}

	function createScope(objeto, scopeData){

		inject(function(_$rootScope_){

			scope = _$rootScope_.$new();
		});   

		//Objeto que representa o ngModel do elemento
		scope.objeto = objeto || objetoMock;

		angular.forEach(scopeData, function(value, key) {
			scope[key] = value;

		});

		return scope;

	}

	function compile(template, scope) {

		inject(function($compile) {
			element = $compile(template)(scope);
			scope.$apply();
		});

		return element;
	}


	describe("Funcionalidades báscias", function(){

		it('Renderização báscia do template', function() {

			var scope = createScope();
			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			expect(element.html()).toContain(ctrl.placeholder);

		});
		
		it('O atributo id-input deve setado no elemento input do componente', function() {

			var scope = createScope();
			var idInput = "@123";
			var template = getTemplate({
				idInput: idInput
			});
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			expect(element.html()).toContain(idInput);

		});

		it('caso o ng-model do elemento esteja definido, o label deve ser exibido', function() {

			var scope = createScope();
			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			ctrl.scope.$apply();
			expect(element.find("input")[0].value).toEqual(scope.objeto.nome);

		});

		it("Caso inital-busca seja definido, a lista de resultados deve conter o objeto buscado ", function(){

			scope = createScope();

			var initialBusca = "Th"
				var template = getTemplate({
					initialBusca: initialBusca
				});
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");

			$httpBackend.expectPOST( URL_PROJECOES ).respond( getResponseListaObjetosMock() );
			ctrl.openBusca(parentElement);
			$httpBackend.flush();
			ctrl.scope.$digest();
			expect(parentElement.html()).toContain(initialBusca);

		});

		it("O placeholder definido deve aparecer no campo input do dialog de buscas", function(){

			scope = createScope();
			var placeholder = "Digite um item par buscar";
			var template = getTemplate({
				placeholder: placeholder
			});
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");

			$httpBackend.expectPOST( URL_PROJECOES ).respond( getResponseListaObjetosMock() );
			ctrl.openBusca(parentElement);
			$httpBackend.flush();
			ctrl.scope.$digest();
			var placeholderInDialog = parentElement.find("input").attr("placeholder");
			expect(placeholderInDialog).toContain(placeholder);

		});


		it("Ao selecionar um item o texto do input deve correponder ao item selecionado", function(){

			scope = createScope();
			var objeto = listaObjetosMock[0];
			var template = getTemplate({
				initialBusca :  objeto.nome
			});
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");

			$httpBackend.expectPOST( URL_PROJECOES ).respond( getResponseListaObjetosMock() );
			ctrl.openBusca(parentElement);
			$httpBackend.flush();
			ctrl.scope.$digest();
			ctrl.selecionarItem(objeto);
			ctrl.scope.$digest();
			var inputElement= element.find("input");
			expect(inputElement.val()).toBe(objeto.nome);

		});
		
		
		it("Ao selecionar um item o ngModel deve corresponder ao item selecionado", function(){

			scope = createScope();
			var objeto = listaObjetosMock[0];
			var template = getTemplate({
				initialBusca :  objeto.nome
			});
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");

			$httpBackend.expectPOST( URL_PROJECOES ).respond( getResponseListaObjetosMock() );
			ctrl.openBusca(parentElement);
			$httpBackend.flush();
			ctrl.scope.$digest();
			ctrl.selecionarItem(objeto);
			ctrl.scope.$digest();
			expect(ctrl.ngModel.nome).toBe(objeto.nome);

		});

		it("Ao selecionar um item o input do campo de busca deve ser limpo", function(){

			scope = createScope();
			var objeto = listaObjetosMock[0];
			var template = getTemplate({
				initialBusca :  objeto.nome
			});
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");

			$httpBackend.expectPOST( URL_PROJECOES ).respond( getResponseListaObjetosMock() );
			ctrl.openBusca(parentElement);
			$httpBackend.flush();
			ctrl.scope.$digest();
			var inputInDialog= parentElement.find("input");
			inputInDialog.val("test");
			ctrl.selecionarItem(objeto);
			ctrl.scope.$digest();
			expect(inputInDialog.val()).toBe("");

		});

	});


	describe("Atributos genéricos (_string.nome)", function(){

		it('O model deve ser exibido corretamente', function() {

			var objeto = {
					_string: {nome: "Thomaz Reis Damasceno"}
			}
			var scope = createScope(objeto);
			var template = getTemplate({attr:"_string.nome"});
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			ctrl.scope.$digest();
			expect(element.find("input").val()).toBe(scope.objeto._string.nome);
		});


	});


	describe("Atributo useCache", function(){

		it('Caso seja definido como true a lista de ojetos deve ser recuperada do cache', inject(function(){

			var objectName = "Cliente";

			var itensToCache = [
				{id: 1, nome: "Thomaz Reis Damasceno"},
				{id: 2, nome: "Thomaz Reis Damasceno"}
				];

			cacheGet.cleanAll(objectName.toLowerCase());
			cacheGet.add(objectName.toLowerCase(), itensToCache);

			scope = createScope();
			var template = getTemplate({  
				initialBusca :  "",
				useCache: true,
				objectName: objectName
			});

			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");
			ctrl.openBusca(parentElement);
			ctrl.scope.$digest();
			expect(parentElement.find("md-list-item").length).toBe(itensToCache.length);

		}));
		
		it('O objeto salvo deve ser atualizado no cache', inject(function(){

			var objectName = "Cliente";

			var itensToCache = [
				{id: 1, nome: "Thomaz Reis Damasceno"},
				{id: 2, nome: "Thomaz Reis Damasceno"}
				];

			cacheGet.cleanAll(objectName.toLowerCase());
			cacheGet.add(objectName.toLowerCase(), itensToCache);

			scope = createScope();
			var template = getTemplate({  
				initialBusca :  "",
				useCache: true,
				objectName: objectName
			});

			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");
			var labelToCad = "Talita Taiane do Carmo Damasceno";
			var objetoToSave = {nome: labelToCad};
			$httpBackend.expectGET(URL_BUSCA_MAP).respond({itens: []});
			$httpBackend.expectPOST(URL_ADD_OBJETO).respond({item: objetoToSave});
			ctrl.cadastrarItem(labelToCad);
			$httpBackend.flush();
			ctrl.scope.$digest();
			expect(cacheGet.getAll(objectName.toLowerCase()).length).toBe(itensToCache.length+1);

		}));

	});

	describe("Atributo autoShowBusca", function(){

		it('Caso seja true,  o dialog de busca deve ser exibido automaticamente', function() {

			scope = createScope();
			var attr = "descricao;"
				var template = getTemplate({
					initialBusca :  "",
					autoShowBusca: true
				});

			$httpBackend.expectPOST( URL_PROJECOES ).respond( getResponseListaObjetosMock() );
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");
			$httpBackend.flush();
			ctrl.scope.$digest();

		});

	});

	describe("Atributo valueOnly", function(){

		it('Caso seja true, ao selecionar um item, o ngModel deve ser um valor literal e não um objeto', function() {

			var objeto = {id: 23, descricao: "Descrição teste"};
			scope = createScope(objeto);
			var attr = "descricao;"
				var template = getTemplate({
					initialBusca :  objeto.nome,
					valueOnly: true,
					attr: attr
				});

			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");

			$httpBackend.expectPOST( URL_PROJECOES ).respond( getResponseListaObjetosMock() );
			ctrl.openBusca(parentElement);
			$httpBackend.flush();
			ctrl.scope.$digest();
			ctrl.selecionarItem(objeto);
			ctrl.scope.$digest();
			//O 
			expect(ctrl.ngModel).toBe(objeto[attr]);
		});


	});

	describe("Atributo getCompleteObject", function(){

		it('Caso seja true, deve-se recuperar o objeto completo ao selecionar um item', function() {

			scope = createScope();
			var objeto = listaObjetosMock[0];
			var template = getTemplate({
				initialBusca :  objeto.nome,
				getCompleteObject: true
			});
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");

			$httpBackend.expectPOST( URL_PROJECOES ).respond( getResponseListaObjetosMock() );
			ctrl.openBusca(parentElement);
			$httpBackend.flush();
			ctrl.scope.$digest();
			//Verifica se recuperou o objeto completo
			$httpBackend.expectGET( URL_GET_BY_ID ).respond({});
			ctrl.selecionarItem(objeto);
			ctrl.scope.$digest();
		});

	});

	describe("Parâmetro inital-busca", function(){

		it("Quando inital-busca estiver definido, o resultado deve correponder ao initial-busca", function(){

			scope = createScope();
			var listaObjetos = angular.copy(listaObjetosMock);
			var objetoToMatcherTest = {nome: "Thomaz Reis Damasceno do Carmo e Talita Taiane do Carmo Damasceno"};
			listaObjetos.push(objetoToMatcherTest);
			var resultBusca = listaObjetos.filter(function(value){

				if(value.nome.indexOf(objetoToMatcherTest.nome)!=-1){

					return value;
				}
			});
			var template = getTemplate({
				initialBusca :  objetoToMatcherTest.nome
			});
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");

			$httpBackend.expectPOST( URL_PROJECOES ).respond({ itens: resultBusca});
			ctrl.openBusca(parentElement);
			$httpBackend.flush();
			ctrl.scope.$digest();

			//Apenas u resultado na listagem
			expect(parentElement.find("md-list-item").length).toBe(1);

		});

		it('caso inital-busca seja uma string vazia ao clicar no elemento deve mostrar todos os itens', function() {

			scope = createScope();
			var placeholder = "Digite um item par buscar";
			var template = getTemplate({
				initalBusca:""
			});
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			var parentElement = angular.element("<div></div>");

			$httpBackend.expectPOST( URL_PROJECOES ).respond( getResponseListaObjetosMock() );
			ctrl.openBusca(parentElement);
			$httpBackend.flush();
			ctrl.scope.$digest();

			expect(parentElement.find("md-list-item").length).toBe(listaObjetosMock.length);

		});

	});

	describe("Parâmetro fix-properties", function(){

		it("As propriedades fixas devem ser incluidas na requisição ao executar uma busca", function(){


			var scope = createScope(null,
					{
				initalBusca: "",
				fixProperties: {tipoUsuario: "_admin_user_"}
					}	
			);

			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			$httpBackend.expectPOST(URL_PROJECOES, /_admin_user_/).respond(getResponseListaObjetosMock());
			ctrl.openBusca();
			$httpBackend.flush();
			scope.$digest();

		});


		it("As propriedades fixas devem ser incluidas no objeto ao salvar um item", function(){

			var fixProperties = {tipoUsuario: "_admin_user_"};
			var scope = createScope(null,
					{
				initalBusca: "",
				fixProperties: fixProperties 
					}	
			);

			var labelItemToCad = "Thomaz Reis Damasceno do Carmo";
			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stAutoComplete");
			$httpBackend.expectGET(URL_BUSCA_MAP).respond({itens: []});
			$httpBackend.expectPOST(URL_ADD_OBJETO, /_admin_user_/).respond({item:{}});
			ctrl.cadastrarItem(labelItemToCad);
			$httpBackend.flush();
			ctrl.scope.$digest();

		});


	});

});



describe('stMenu', function() {

	var URL_SAVE_CONFIG = /config\/add/;
	
	var configMock = {
			confs: {
                    notFoundPath:"/notfound"
			}
	};
	var usuarioSistemaMock = {originalLogin: "thomaz@ceasaplus"};
	
	var listaFiliaisMock = [
		{id: 1, nome: "Filial 1"},
		{id:2, nome: "Filial 2"}
	];

	var scope, element, $httpBackend, $cookieStore, cacheGet, $location, $rootScope;

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	beforeEach(inject(function(_$httpBackend_, _$cookieStore_, _cacheGet_, _$location_, _$rootScope_){

		$httpBackend = _$httpBackend_;
		$location = _$location_;
		$cookieStore = _$cookieStore_;
		cacheGet = _cacheGet_;
		$cookieStore.put("usuarioSistema", usuarioSistemaMock);
		$rootScope = _$rootScope_;
		$rootScope.config = configMock;
		$rootScope.usuarioSistema  = usuarioSistemaMock;
		
	}));


	afterEach(function() {
		scope && scope.$destroy();
	});

	function compile(template, scope) {

		inject(function($compile) {
			element = $compile(template)(scope);
			scope.$apply();
		});

		return element;
	}

	function createScope(objeto, scopeData){

		inject(function(_$rootScope_){

			scope = _$rootScope_.$new();
		});   

		angular.forEach(scopeData, function(value, key) {
			scope[key] = value;

		});

		return scope;

	}

	describe("Funcionalidades básicas", function(){


		it("Deve mostrar no label o nome da filial atual", function(){

			var currentFilial =  listaFiliaisMock[0];
			$rootScope.currentFilial = currentFilial;
			scope = createScope();
			var element = compile("<button-filial></button-filial>", scope);
			expect(element.html()).toContain(currentFilial.nome);
		
		});
		
		it("Ao clicar no botão, todas as filiais devem ser exibidas", function(){

			var currentFilial =  listaFiliaisMock[0];
			$rootScope.currentFilial = currentFilial;
			$rootScope.filiais = listaFiliaisMock;
			scope = createScope();
			var element = compile("<button-filial></button-filial>", scope);
			var buttonCurrentFilial = element.find(".button-filial-current-filial");
			buttonCurrentFilial.click();
			scope.$apply();
			var listaFiliais = $(".button-filial-filiais");
			expect(listaFiliais[1].innerHTML).toContain(listaFiliaisMock[1].nome);
			
		});
		
		
		it("Ao clicar em uma filial disponível, a filial atual deve ser modificada", function(){

			$rootScope.filiais = listaFiliaisMock;
			scope = createScope();
			var filialIndex = 1;
			var element = compile("<button-filial></button-filial>", scope);
			var ctrl = element.controller("buttonFilial");
			var buttonCurrentFilial = element.find(".button-filial-current-filial");
			buttonCurrentFilial.triggerHandler("click");
			scope.$digest();
			var listaFiliais = $(".button-filial-filiais");
			var filialToChange = angular.element(listaFiliais.find("#filial-index-"+filialIndex));
			filialToChange.click();
			ctrl.scope.$digest();
			expect(buttonCurrentFilial.html()).toContain(listaFiliaisMock[filialIndex].nome);
			
		});
		
		it("Ao modificar a filial, seu id deve ser incluido em todas as requisições", inject(function(stService){
			
			
			$rootScope.filiais = listaFiliaisMock;
			scope = createScope();
			var filialIndex = 1;
			var element = compile("<button-filial></button-filial>", scope);
			var ctrl = element.controller("buttonFilial");
			var buttonCurrentFilial = element.find(".button-filial-current-filial");
			buttonCurrentFilial.triggerHandler("click");
			scope.$digest();
			var listaFiliais = $(".button-filial-filiais");
			var filialToChange = angular.element(listaFiliais.find("#filial-index-"+filialIndex));
			filialToChange.click();
			ctrl.scope.$digest();
			expect(buttonCurrentFilial.html()).toContain(listaFiliaisMock[filialIndex].nome);
			var cliente = {id:1, nome: "Thomaz"};
			$httpBackend.expect("POST", /filialId=2/).respond({});
			stService.executePost("cliente/add/");
			$httpBackend.flush();
			
			
		}));
		
	
		
	});
		

});



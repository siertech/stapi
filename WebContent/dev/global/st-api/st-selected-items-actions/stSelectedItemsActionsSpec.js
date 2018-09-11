
describe('stCrudTools', function() {

	var scope, element, $httpBackend, $cookieStore, cacheGet;

	var selectedItemsMock = [

		{id: 1, nome: "Thomaz Reis Damasceno do Carmo"},
		{id: 2, nome: "Talita Taine do Carmo"}
		];

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	afterEach(function() {
		scope && scope.$destroy();
	});

	function createScope(scopeData){

		inject(function(_$rootScope_){

			scope = _$rootScope_.$new();
		});   

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


	function getTranscludeContent(buttonText){

		var template = '<md-menu-item>'+
		'			          <md-button confirm>'+
		'			            <ng-md-icon icon="delete"></ng-md-icon>'+
		buttonText+
		'			          </md-button>'+
		'			        </md-menu-item>';

		return template;

	}

	function getTemplate(attrs, transcludeContent){

		attrs  = attrs || {};

		var template = 
			'<st-selected-items-actions '+
			' delete-function="'+ (attrs.deleteFunction || 'deleteFunction()')+'"'+
			' selected-items="'+ (attrs.selectedItems || 'selectedItems')+'"'+
			' > '+ (transcludeContent ||  '<p>Parágrafo trasncluido</p>') +
			' </st-selected-items-actions>';
		return template;

	}

	describe("Funcionalidades básicas", function(){

		it("Itens selecionados for maior que 1", function(){

			scope = createScope({
				selectedItems: selectedItemsMock 
			});

			var template  = getTemplate();
			var element = compile(template, scope);
			var text = selectedItemsMock.length+" itens selecionados";
			scope.$apply();
			expect(element.html()).toContain(text);

		})

		it("Itens selecionados for igual a 1", function(){

			scope = createScope({
				selectedItems: [{nome: "Thomaz Reis Damasceno do Carmo"}]
			});

			var template  = getTemplate();
			var element = compile(template, scope);
			var text = "1 item selecionado";
			scope.$apply();
			expect(element.html()).toContain(text);

		})

	});
	
	describe("Alteração de items selecionados em outro scopo", function(){

		it("O texto exibido no componente deve alterar ao modificar os itens selecionados", function(){

			scope = createScope({
				selectedItems: selectedItemsMock 
			});

            var template  = getTemplate();
			var element = compile(template, scope);
			scope.$apply();
			expect(element.html()).toContain(scope.selectedItems.length+" itens selecionados");
			scope.selectedItems.push({nome: "Thomaz Reis Damasceno do Carmo"});
			scope.$apply();
			expect(element.html()).toContain(scope.selectedItems.length+" itens selecionados");

		})

	});

	describe("Transclusão", function(){

		it("O componenete deve aceitar transclusão", function(){

			scope = createScope({
				selectedItems: selectedItemsMock 
			});

			var buttonText = "Texto do botão";
			var transcludeContent = getTranscludeContent(buttonText);

			var template  = getTemplate({},transcludeContent);
			var element = compile(template, scope);
			scope.$apply();
			expect(element.html()).toContain(buttonText);

		})

	});
	
	describe("Atributo deleteFunction", function(){

		it("O componente deve executar a função deleteFunction definida em seu escopo", function(){

            var deleteFunction = jasmine.createSpy("deleteFunction");   
			scope = createScope({
				selectedItems: selectedItemsMock,
				deleteFunction: deleteFunction
			});

			var template  = getTemplate({
				deleteFunction: "deleteFunction(selectedItems)"
			});
			var element = compile(template, scope);
			scope.deleteFunction();
		    scope.$apply();
		    expect(deleteFunction).toHaveBeenCalled();
		   
		})

	});

});


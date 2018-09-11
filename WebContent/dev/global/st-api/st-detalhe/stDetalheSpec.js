
describe('stCrudTools', function() {

	var scope, element, $httpBackend, $cookieStore, cacheGet;

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

	function getTemplate(attrs, transcludeContent){

		attrs  = attrs || {};

		var template = 
			'<st-detalhe '+
			' title="'+ (attrs.title || 'title')+'"'+
			' loading="'+ (attrs.loading || 'loading')+'"'+
			' item="'+ (attrs.item|| 'item')+'"'+
			' save-function="'+ (attrs.saveFunction || 'saveFunction')+'"'+
			' delete-function="'+ (attrs.deleteFunction || 'deleteFunction')+'"'+
			' > '+(transcludeContent|| '')+
			' </st-detalhe>';
		return template;

	}

	function compile(template, scope) {

		inject(function($compile) {
			element = $compile(template)(scope);
			scope.$apply();
		});

		return element;
	}
	
	describe("Atributo title", function(){
		
		it("O título deve ser exibido corretamente", function(){

			var item = {id: 1, nome: "Thomaz Reis Damasceno do Carmo"};
			var title = "Titulo do detalhamento";
			scope = createScope({
				item: item,
				title: title
			});
			var template = getTemplate({
				title: "{{title}}"
			});
			var element = compile(template, scope);
			expect(element.html()).toContain(scope.title);
		});
		
		it("O título deve ser modificado no template ao ser modificado no escopo", function(){

			var item = {id: 1, nome: "Thomaz Reis Damasceno do Carmo"};
			var title = "Titulo do detalhamento";
			scope = createScope({
				item: item,
				title: title
			});
			var template = getTemplate({
				title: "{{title}}"
			});
			var element = compile(template, scope);
			scope.title = "Titulo do detalhamento modificado";
			scope.$apply();
			expect(element.html()).toContain(scope.title);
		});
	});

	describe("Rendereização báscia do template", function(){
		
		it("Os botãosave deve ser definido no template", function(){

			scope = createScope();
			var template = getTemplate();
			var element = compile(template, scope);
			expect(element.find(".st-detalhe-save-button").html()).toBeDefined();
		});

	});
	
	describe("Atributo item", function(){
		
		it("Caso o item tenha um id, o botão de deletar deve ser exibido", function(){

			var item = {id: 1, nome: "Thomaz Reis Damasceno do Carmo"};
			scope = createScope({
				item: item
			});
			var template = getTemplate();
			var element = compile(template, scope);
			expect(element.find(".st-detalhe-delete-button").html()).toBeDefined();
		});
	});
	
	describe("loading", function(){

		it("Os botões devem ser desabilitados quando loading==true", function(){

			scope = createScope({
				item: {id: 1, nome: "Thomaz Reis Damasceno"}
			});
			var template = getTemplate();
			var element = compile(template, scope);
			scope.loading = true;
			scope.$apply();
			expect(element.find(".st-detalhe-delete-button").attr("disabled")).toBeDefined();
			expect(element.find(".st-detalhe-save-button").attr("disabled")).toBeDefined();
		});

	});
	
	describe("Transclusão", function(){

		it("O elemento deve aceitar transclusão", function(){

			var item = {id: 1, nome: "Thomaz Reis Damasceno"};
			scope = createScope({
				item: item
			});
			var transcludeContent = "<input ng-model='item.nome' />"
			var template = getTemplate({}, transcludeContent);
			var element = compile(template, scope);
			scope.loading = true;
			scope.$apply();
			expect(element.find("input").val()).toBe(item.nome);
		});

	});

});
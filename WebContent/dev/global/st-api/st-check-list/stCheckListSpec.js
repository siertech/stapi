
describe('<st-autocomplete>', function() {

	var listaObjetosMock = [
		{id: 1, descricao: "Fazer caminhada", ok:"true"},
		{id: 2, descricao: "Tomar café da manhã"},
		{id: 3, descricao: "Tomar banho"}

		];

	var scope, element, $httpBackend, $cookieStore, cacheGet;

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	beforeEach(inject(function(_$httpBackend_){

		$httpBackend = _$httpBackend_;

	}));

	afterEach(function() {
		scope && scope.$destroy();
	});


	function getTemplate(attrs){

		attrs  = attrs || {};

		var template = 
			'<st-check-list '+
			' crud-options= "'+ (attrs.crudOptions || "crudOptions")+'"'+
			' true-value= "'+ (attrs.trueValue || "'true'")+'"'+
			' on-change= "'+ (attrs.onChange || "onChange")+'"'+
			' false-value= "'+ (attrs.falseValue || "'false'")+'"'+
			' order-by= "'+ (attrs.orderBy || 'orderIndex')+'"'+
			' objetos= "'+ (attrs.objetos ||  'objetos')+'"'+
			' attr= "'+ (attrs.attr || 'ok')+'"'+
			' attr-label= "'+ (attrs.attrLabel || 'descricao')+'"'+
			' > '+
			' </st-check-list>';
		return template;

	}

	function createScope(listaAtividades, scopeData){

		inject(function(_$rootScope_){

			scope = _$rootScope_.$new();
		});   

		//Objeto que representa o ngModel do elemento
		scope.objetos = listaAtividades ||  listaObjetosMock;

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

	describe("Funcionalidades básicas", function(){

		it("Renderização básica do template", function(){
	
			var tarefas = [
				{
					id: 1,
					descricao: "Fazer caminhada", 
					ok:"true",
					entidadeRelacionada: {}
					
				},
				
				];
			
			var crudOptions = {
					objectName: "Tarefa"
			};
			scope = createScope();
			scope.crudOptions = crudOptions;
			scope.objetos = tarefas;
		
			var template = getTemplate();
			$httpBackend.expectGET(/tarefa/).respond({itens: tarefas});
			var element = compile(template, scope);
			$httpBackend.flush();
			var ctrl = element.controller("stCheckList");
			ctrl.scope.$digest();
			expect(element.html()).toContain(listaObjetosMock[0].descricao);
		})

	});
	
	
	describe("Entidade relacionada ao objeto", function(){

		it("A entidade relacionada ao objeto deve permanecer ao alterar seu estado", function(){

			var tarefas = [
				{
					id: 1,
					descricao: "Fazer caminhada", 
					ok:"true",
					entidadeRelacionada: {}
					
				},
				
				];
			
			var crudOptions = {
					objectName: "Tarefa"
			};
			scope = createScope();
			scope.crudOptions = crudOptions;
			scope.objetos = tarefas;
		
			var template = getTemplate();
			$httpBackend.expectGET(/tarefa/).respond({itens: tarefas});
			var element = compile(template, scope);
			var ctrl = element.controller("stCheckList");
			$httpBackend.flush();
			var itemToChange = element.find("#item-index-0");
			$httpBackend.expectGET(/tarefa\/change-attr-value/).respond({});
			itemToChange.find(".st-check-list-check").click();
			$httpBackend.flush();
			ctrl.scope.$digest();

		})

	});


	describe("Método editLabel ", function(){

		it("Ao clicar duas vezes no label o template para edição deve ser exibido", function(){

			scope = createScope();

			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stCheckList");
			var itemToChange = element.find("#item-index-0");
			itemToChange.find(".st-check-list-label").triggerHandler("dblclick");
			ctrl.scope.$digest();

		})
	});

	describe("crud-options", function(){

		it("A lista de itens deve ser recuperada através do parametro objectName informado", function(){

			var crudOptions = {
					objectName: "Cliente"
			};

			scope = createScope();
			scope.crudOptions  =  crudOptions;
			scope.$apply();

			$httpBackend.expectGET(/cliente/).respond({
				itens: listaObjetosMock 
			});
			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stCheckList");
			$httpBackend.flush();
			ctrl.scope.$digest();
			var firstItem = element.find("#item-index-0");
			expect(firstItem.html()).toContain( listaObjetosMock[0].descricao);

		});

		it("Caso o parametro fixProperties seja definido, as propriedades devem ser incluídas na query de listagem", function(){

			var crudOptions = {
					objectName: "Cliente",
					fixProperties: {fix: "Teste"}
			};

			scope = createScope();
			scope.crudOptions  =  crudOptions;
			scope.$apply();

			$httpBackend.expectGET(/fix/).respond({
				itens: listaObjetosMock 
			});
			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stCheckList");
			$httpBackend.flush();
			ctrl.scope.$digest();
			var firstItem = element.find("#item-index-0");
			expect(firstItem.html()).toContain( listaObjetosMock[0].descricao);

		});
		
		it("Caso o parametro fixProperties seja definido, as propriedades devem ser incluídas ao salvar um item", function(){

			var crudOptions = {
					objectName: "Cliente",
					fixProperties: {fix: "Teste"}
			};

			scope = createScope();
			scope.crudOptions  =  crudOptions;
			scope.$apply();

			$httpBackend.expectGET(/fix/).respond({
				itens: listaObjetosMock 
			});
			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stCheckList");
			$httpBackend.flush();
			ctrl.scope.$digest();
			
			$httpBackend.expectPOST(/cliente/,/fix/).respond({
				item: {id: 1}
			});
			ctrl.addItem("Tarefa teste");
            $httpBackend.flush();
			ctrl.scope.$digest();
			var firstItem = element.find("#item-index-0");
			expect(firstItem.html()).toContain( listaObjetosMock[0].descricao);

		});
		

	});

	describe("ng-true-value ng-false-value", function(){

		it("ng-true-value e ng-false-value deve ter como padrão o literal 'true' e 'false'", function(){
			
			
			var crudOptions = {
					objectName: "Tarefa"
			};

			scope = createScope();
			scope.crudOptions  =  crudOptions;
			scope.$apply();

			$httpBackend.expectGET(/tarefa/).respond({
				itens: listaObjetosMock 
			});
			
			var template = getTemplate({

			});
			var element = compile(template, scope);
			$httpBackend.flush();
			var ctrl = element.controller("stCheckList");
			var itens = element.find(".st-check-list-item");

			var firstItem = angular.element(itens[0]);
			var secondItem = angular.element(itens[1]);

			expect(firstItem.find(".md-checked").html()).toBeDefined();
			expect(secondItem.find(".md-checked").html()).toBeUndefined();

		})

		it("ng-true-value e ng-false-value devem aceitar  string's personalizada'", function(){
			
			var crudOptions = {
					objectName: "Tarefa"
			};

			scope = createScope();
			scope.crudOptions  =  crudOptions;
			scope.$apply();

			$httpBackend.expectGET(/tarefa/).respond({
				itens:  [
					{descricao: "Tarefa 1", ok: "ok", orderIndex: "1"},
					{descricao: "Tarefa 2", ok: "nao_ok", orderIndex: "2"}

					]
			});
		
			var template = getTemplate({
				ok: "ok",
				trueValue: "'ok'",
				falseValue: "'nao_ok'",
			});
			var element = compile(template, scope);
			$httpBackend.flush();
			var ctrl = element.controller("stCheckList");
			var itens = element.find(".st-check-list-item");

			var firstItem = angular.element(itens[0]);
			var secondItem = angular.element(itens[1]);

			expect(firstItem.find(".md-checked").html()).toBeDefined();
			expect(secondItem.find(".md-checked").html()).toBeUndefined();

		});

		it("ng-true-value e ng-false-value devem aceitar  integer personalizado'", function(){
			
			var crudOptions = {
					objectName: "Tarefa"
			};

			scope = createScope();
			scope.crudOptions  =  crudOptions;
			scope.$apply();

			$httpBackend.expectGET(/tarefa/).respond({
				itens: [
					{descricao: "Tarefa 1", ok: 1, orderIndex: "1"},
					{descricao: "Tarefa 2", ok: 0, orderIndex: "2"}

					]
			});
		
			var template = getTemplate({
				ok: "ok",
				trueValue: "1",
				falseValue: "0",
			});
			var element = compile(template, scope);
			$httpBackend.flush();
			var ctrl = element.controller("stCheckList");
			var itens = element.find(".st-check-list-item");

			var firstItem = angular.element(itens[0]);
			var secondItem = angular.element(itens[1]);

			expect(firstItem.find(".md-checked").html()).toBeDefined();
			expect(secondItem.find(".md-checked").html()).toBeUndefined();

		})

	});

	describe("Ordenação de itens", function(){


		it("Ao cadastrar um novo item, o atributo orderIndex deve ser setado corretamente", function(){
			
			
			var crudOptions = {
					objectName: "Cliente"
			};
			
			var objetos= [
				{id: 1, descricao: "Fazer caminhada", ok:"true"},
				{id: 2, descricao: "Tomar café da manhã"},
				{id: 3, descricao: "Tomar banho"}

				];

			scope = createScope();
			scope.crudOptions  =  crudOptions;
			scope.objetos = objetos;
			scope.$apply();

			$httpBackend.expectGET(/cliente/).respond({
				itens: listaObjetosMock 
			});
			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stCheckList");
			$httpBackend.flush();
			ctrl.scope.$digest();
			
			var lastOrderIndex = ctrl.objetos[ctrl.objetos.length-1].orderIndex;
			
			var nextOrderIndex  = lastOrderIndex+1;
			
			$httpBackend.expectPOST(/cliente/,/\"orderIndex\"\:3/).respond({
				item: {id: 1}
			});
			ctrl.addItem("Tarefa teste");
            $httpBackend.flush();
			ctrl.scope.$digest();
			var firstItem = element.find("#item-index-0");
			expect(firstItem.html()).toContain( listaObjetosMock[0].descricao);
			
		});
		
	});
	

	

});


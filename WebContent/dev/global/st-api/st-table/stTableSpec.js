
describe('<st-grid-item>', function() {

	var scope, element, $httpBackend, $cookieStore, cacheGet;

	var columnsMock = [

		{label: "Nome", attr: "_string.nome", orderBy: true, labelIcon: "person", editable: true},
		{label: "Endereço", attr: "_string.endereco", orderBy: true, labelIcon: "list", editable: true},

		];

	var itemsMock = [

		{
			_string: {nome: "Thomaz Reis Damasceno do Carmo", endereco: "Roças Novas"}
		},
		{
			_string: {nome: "Talita Taiane no Carmo Damasceno", endereco: "Roças Novas"}
		},
		];

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	beforeEach(inject(function(_$httpBackend_, _$cookieStore_, _cacheGet_, _$filter_){

		$httpBackend = _$httpBackend_;
		$cookieStore = _$cookieStore_;
		$filter = _$filter_;
		cacheGet = _cacheGet_;
		$cookieStore.put("usuarioSistema", {originalLogin: "thomaz@ceasaplus"});

	}));

	afterEach(function() {
		scope && scope.$destroy();
	});

	function getTemplate(attrs, transcludeContent){

		attrs  = attrs || {};
		var template = 
			'<st-table '+
			' items="'+ (attrs.items || 'items')+'"'+
			' columns="'+ (attrs.columns || 'columns')+'"'+
			' > '+
			' </st-table>';
		return template;

	}

	function createScope(scopeData){

		inject(function(_$rootScope_){

			scope = _$rootScope_.$new();
		});   

		scope.items = itemsMock;
		scope.columns = columnsMock;

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

	describe("Atributo columns", function(){

		it("Os títulos das columnas devem ser exibidos corretamente", function(){

			scope = createScope();
			var template = getTemplate();
			var element = compile(template, scope);
			for(var i in  columnsMock){
				expect(element.html()).toContain(columnsMock[i].label);
			}

		});
		

		it("Caso seja definido um icone para a coluna, ele deve ser renderizado no template", function(){

			var columns =  angular.copy(columnsMock);
			var icon ="person";
			columns.push({label: "Teste", icon: icon});
			scope = createScope({
				columns: columns
			});
			var template = getTemplate();
			var element = compile(template, scope);
			var headElement = element.find("thead");
			var iconElement = headElement.find("ng-md-icon");
			expect(iconElement[0].outerHTML).toContain(icon);
			
		});
		

		it("A coluna deve aceitar friltros", function(){

			var columns =  [
				{label: "Thomaz Reis Damasceno", attr:"nome"},
				{label: "Preço por hora", attr:"precoHora", filter: "number:2"}
				];
			var preco = 35;
			var items = [
				{nome: "Thomaz Reis Damasceno", precoHora: preco}
			];
			var icon ="person";
			scope = createScope({
				columns: columns,
				items: items
			});
			var template = getTemplate();
			var element = compile(template, scope);
			var bodyElement = element.find("tbody");
			var secondTd= bodyElement.find("td").find("span")[1];
			var precoFiltrado = $filter("number")(preco,"2");
			expect(secondTd.innerHTML).toBe(precoFiltrado);
			
		});
		
	});
	
	describe("Atributos items", function(){
		
		it("Os items devem ser renderizados corretamente no template", function(){
			
			var firstElement = itemsMock[0];
			scope = createScope();
			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stTable");
			ctrl.scope.$digest();
			var bodyElement = element.find("tbody");
			var firstTd= bodyElement.find("td")[0];
			expect(firstTd.innerHTML).toContain(firstElement._string.nome);

		});
		
	});
	
	describe("Atributo editColumn", function(){
		
		
	});

});
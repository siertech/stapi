
describe('stBreadcumb', function() {

	var routeHistoryMock = [
		{path: "inicio", icon:"home",label:"Início"},
		{path: "cliente", icon:"person",label:"Clientes"},

		];

	var configMock = {
			confs: {
				notFoundPath:"/notfound"
			}
	};
	var usuarioSistemaMock = {originalLogin: "thomaz@ceasaplus"};

	var scope, element, $httpBackend, $cookieStore, cacheGet, $location, $rootScope, $location;

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	beforeEach(inject(function(_$httpBackend_, _$cookieStore_, _cacheGet_, _$location_, _$rootScope_, _$location_){

		$httpBackend = _$httpBackend_;
		$location = _$location_;
		$cookieStore = _$cookieStore_;
		cacheGet = _cacheGet_;
		$location = _$location_;
		$cookieStore.put("usuarioSistema", usuarioSistemaMock);
		$rootScope = _$rootScope_;
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

	function getTemplate(attrs){

		attrs  = attrs || {};

		var template = 
			'<st-breadcumb '+
			' param="'+ (attrs.param || 'param')+'"'+
			' > '+
			' </st-breadcumb>';
		return template;

	}

	describe("Funcionalidades básicas", function(){

		it("O texto deve mostrar a rota atual do sistema", function(){

			var routeHistory = angular.copy(routeHistoryMock);
			$rootScope.routeHistory =  routeHistory;
			scope = createScope();
			var template = getTemplate();
			var element= compile(template, scope);
			var ctrl = element.controller("stBreadcumb");
			var pathToChange = routeHistory[1];
			ctrl.data.changePath(pathToChange);
			scope.$apply();
			expect(element.find(".st-breadcumb-atual-page").html()).toContain(pathToChange.label);

		});

		it("O template deve ser renderizado corretamente", function(){

			var routeHistory = angular.copy(routeHistoryMock);
			$rootScope.routeHistory =  routeHistory;
			scope = createScope();
			var template = getTemplate();
			var element= compile(template, scope);
			var ctrl = element.controller("stBreadCumb");

			for(var i in routeHistory ){
				expect(element.html()).toContain(routeHistory[i].label);
			}

		});

		it("Ao clicar em um item do breadcumb, a rota deve ser modificada", function(){

			var routeHistory = angular.copy(routeHistoryMock);
			$rootScope.routeHistory =  routeHistory;
			scope = createScope();
			var template = getTemplate();
			var element= compile(template, scope);
			var ctrl = element.controller("stBreadcumb");
			var pathToChange = routeHistory[1];
			ctrl.data.changePath(pathToChange);
			scope.$apply();
			expect($location.path()).toBe("/"+pathToChange.path);

		});

		it("A lista de históricos não deve exibir o path atual", function(){

			var routeHistory = angular.copy(routeHistoryMock);
			$rootScope.routeHistory =  routeHistory;
			scope = createScope();
			var template = getTemplate();
			var element= compile(template, scope);
			var ctrl = element.controller("stBreadcumb");
			var pathToChange = routeHistory[1];
			ctrl.data.changePath(pathToChange);
			scope.$apply();
			var elementRouteHistory = element.find(".st-breadcumb-route-history");
			expect(elementRouteHistory.html()).not.toContain(pathToChange.label);

		});

	});

});



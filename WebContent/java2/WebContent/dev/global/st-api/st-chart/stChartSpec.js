
describe("stChart", function() {
	
	var URL_PROJECAO = /projecao/;

	var infoMock = {
			qs: [],
			periodColumn:"dataCadastro",
			labelColumn:"dayofweek(dataCadastro)",
			valueColumn:"count(*)",
			objeto:"Cliente"
	}

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
			'<st-chart'+
			' info = "'+ (attrs.info || "info")+'"'+
			' de = "'+ (attrs.de || "de")+'"'+
			' ate = "'+ (attrs.ate || "ate")+'"'+

			' > '+
			' </st-chart>';
		return template;

	}

	function createScope(listaAtividades, scopeData){

		inject(function(_$rootScope_){

			scope = _$rootScope_.$new();
		});   

		scope.info = infoMock;

		angular.forEach(scopeData, function(value, key) {
			scope[key] = value;

		});

		return scope;

	}

	function compile(template, scope) {

		inject(function($compile) {
			element = $compile(template)(scope);
			
		});

		return element;
	}

	describe("Funcionalidades básicas", function(){

		it("O filtro definido deve ser setado corretamente", function(){

			
			/*
			scope = createScope();
			$httpBackend.expectPOST(/projecao/).respond({});
			var template = getTemplate();
			var element = compile(template, scope);
			var ctrl = element.controller("stChart");
			$httpBackend.flush();
			scope.$digest();
			
			*/

		})

	});


});


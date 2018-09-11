describe('stInput', function() {

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	var scope, $controller, $compile, $rootScope, $httpBackend, element, $templateCache;

	beforeEach(inject(function(_$httpBackend_, _$rootScope_, _$controller_, _$compile_, _$templateCache_){

		$rootScope  = _$rootScope_;
		$templateCache = _$templateCache_;
		$compile = _$compile_;
		$httpBackend = _$httpBackend_;
		$controller =  _$controller_;

	}));

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

		element = $compile(template)(scope);
		scope.$apply();
		return element;
	}

	
	describe("st-input-date", function(){

		it("A data deve ser formatado corretamente", function(){
			
			scope = createScope();
			scope.data = "2018-05-25";
			var template = "<st-input-date ng-model='data'></st-input-date>";
			var element = compile(template, scope);
			var ctrl = element.controller("ngModel");
			scope.$apply();
		
			expect(element.find("input").val()).toBe("25/05/2018");
			
		});
		
	});
	
	

	describe("st-input-double", function(){

		it("O valor deve ser formatado corretamente", function(){
			
			scope = createScope();
			scope.valor = 90;
			var template = "<st-input-double ng-model='valor'></st-input-double>";
			var element = compile(template, scope);
			scope.$apply();
		    expect(element.find("input").val()).toBe("90,00");
			
		});
		
	});

});
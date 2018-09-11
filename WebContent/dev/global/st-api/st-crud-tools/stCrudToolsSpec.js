
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

	function compile(template, scope) {

		inject(function($compile) {
			element = $compile(template)(scope);
			scope.$apply();
		});

		return element;
	}

	describe("Funcionalidades básicas", function(){

		it("Renderização básica do template", function(){

			
		})

	});


});


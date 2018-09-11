describe('Testes unitários Request', function() {

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

	function compile(template, scope) {

		element = $compile(template)(scope);
		scope.$apply();
		return element;
	}

	describe("", function(){

		it("", function(){

		});

	});

});

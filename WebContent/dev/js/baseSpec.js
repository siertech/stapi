
describe('<st-autocomplete>', function() {

	var URL_LOGIN= /user\/login/;

	var scope, element, $httpBackend, $cookieStore, $rootScope;

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	beforeEach(inject(function(_$httpBackend_, _$cookieStore_, _loginUtil_, _$rootScope_){

		$httpBackend = _$httpBackend_;
		$cookieStore = _$cookieStore_;
		loginUtil = _loginUtil_;
		$rootScope = _$rootScope_;
		

	}));


	afterEach(function() {
		scope && scope.$destroy();
		loginUtil.logOut();
	});

	
	describe("Alteração de rota", function(){

		
	});
	
	
});


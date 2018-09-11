
describe('<st-grid-item>', function() {

	var scope, element, $httpBackend, $cookieStore, cacheGet;

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));

	beforeEach(inject(function(_$httpBackend_, _$cookieStore_, _cacheGet_){

		$httpBackend = _$httpBackend_;
		$cookieStore = _$cookieStore_;
		cacheGet = _cacheGet_;
		$cookieStore.put("usuarioSistema", {originalLogin: "thomaz@ceasaplus"});


	}));

	afterEach(function() {
		scope && scope.$destroy();
	});

	function getTemplate(attrs, transcludeContent){

		attrs  = attrs || {};
		var template = 
			'<st-grid-item '+
			' icon="'+ (attrs.icon || '')+'"'+
			' label="'+ (attrs.label || '')+'"'+
			' > '+
			(transcludeContent || '')+
			' </st-grid-item>';
		return template;

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

	function compile(template, scope) {

		inject(function($compile) {
			element = $compile(template)(scope);
			scope.$apply();
		});

		return element;
	}


	describe("Funcionalidades báscias", function(){

		it("O label deve aparecer no template", function(){

			scope = createScope();
			var label =  "Talita Taiane do Carmo Damasceno";
			var template = getTemplate({
				label: label
			});

			var element = compile(template, scope);
			expect(element.html()).toContain(label);

		});

		it("O Icone escolhido deve aparecer no template", function(){

			scope = createScope();
			var label =  "Talita Taiane do Carmo Damasceno";
			var icon = "person";
			var template = getTemplate({
				label: label,
				icon: icon
			});
			
			var element = compile(template, scope);
			var iconElement = element.find("ng-md-icon");
			expect(iconElement[0].outerHTML).toContain(icon);

		});
		
		it("O componenete st-crud-tools deve estar presente no template", function(){

			scope = createScope();
			var label =  "Talita Taiane do Carmo Damasceno";
		
			var template = getTemplate({
				label: label
				
			});
			
			var element = compile(template, scope);
			var stCrudTools = element.find("st-crud-tools");
			expect(stCrudTools.html()).toBeDefined()

		});
		
		it("O item deve aceitar transclusão", function(){

			scope = createScope();
			var label =  "Talita Taiane do Carmo Damasceno";
		    var htmlToTransclude = "conteudo do transclusao";
			var template = getTemplate({
				label: label
				
			}, htmlToTransclude);
		    
			var element = compile(template, scope);
			expect(element.html()).toContain(htmlToTransclude);
		});

	});

});
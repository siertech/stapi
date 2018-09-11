
describe('cacheGet', function() {

	var nomeObjeto = "Cliente";
	var listaObjetosMock = [
		{id: 1, nome: "Thomaz Reis Damasceno do Carmo"},
		{id: 2, nome: "Talita Taiane do Carmo Damasceno"},
		{id: 3, nome: "Magda Maria Reis Damasceno"},
		{id: 4, nome: "Carlos Roberto de Moura Damasceno"}
		];

	var  $cookieStore, cacheGet;

	beforeEach(module('stapi'));
	beforeEach(module('stapi.templates'));


	beforeEach(inject(function(_cacheGet_, _$cookieStore_){

		cacheGet = _cacheGet_;
		$cookieStore = _$cookieStore_;
		$cookieStore.put("usuarioSistema", {originalLogin: "thomaz@ceasaplus"});
		cacheGet.cleanAll(nomeObjeto);

	}));


	describe("funçao add", function(){


		it("cacheGet.add deve aceitar a adição de um unico objeto", function(){

			var objeto = {id: 1, nome: "Thomaz Reis Damasceno"};

			cacheGet.add(nomeObjeto, objeto);
			expect(cacheGet.getAll(nomeObjeto).length).toBe(1);
			var obInCache = cacheGet.getObjectById(nomeObjeto, objeto.id);
			expect(obInCache.nome).toBe(objeto.nome);

		});

		it("cacheGet.add deve aceitar a adição de um array de objetos", function(){

			var objetos = [{id: 1, nome: "Thomaz Reis Damasceno"}];

			cacheGet.add(nomeObjeto, objetos);
			expect(cacheGet.getAll(nomeObjeto).length).toBe(1);
			var obInCache = cacheGet.getObjectById(nomeObjeto, objetos[0].id);
			expect(obInCache.nome).toBe(objetos[0].nome);

		});

		it("Caso exista um objeto com de mesmo id para a url, o item deve ser apenas atualizado", function(){

			var objeto = {id: 1, nome: "Thomaz Reis Damasceno"};
			cacheGet.add(nomeObjeto, objeto);
			var objetoUpdated = {id: 1, nome: "Thomaz Reis Damasceno do Carmo"};
			//Adiciona o item novamente
			cacheGet.add(nomeObjeto, objetoUpdated);

			expect(cacheGet.getAll(nomeObjeto).length).toBe(1);
			var obInCache = cacheGet.getObjectById(nomeObjeto, objeto.id);
			expect(obInCache.nome).toBe(objetoUpdated.nome);

		});

	});

});


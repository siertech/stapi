"use strict";
(function(){

	angular.module("stapi") 

	.factory("loginUtil", loginUtil);

	function loginUtil(cacheGet,$localStorage,$rootScope,$cookieStore,stService,filialUtil, $location, dateUtil, $mdDialog, st, config){

		var _openModalDateErro = function(){

			$mdDialog.show({
				animation: true,
				templateUrl:"global/st-api/app-login/template-module/modalDateErro.html",
				size:'lg',
				controller:function($scope){

				}
			});

		}

		var _openLembrarSenha = function(){

			$mdDialog.show({
				animation: true,
				templateUrl:"global/st-api/app-login/template-module/modalLembrarSenha.html",
				size:'lg',
				bindToController:"true",
				controllerAs:"vm",
				controller:function(stService, stUtil, $modalInstance){

					var vm = this;
					vm.step=1;
					vm.numero = $localStorage.usuario;
					vm.fechar = function(){
						$modalInstance.close();
					}
					vm.lembrarSenha = function(_numero){

						stService.executeGet("/lembrar-senha-sms", {numero: _numero}).then(function(res){

							if(res==true)
								vm.step=2;
							else{
								stUtil.showMessage("","Usuário inexistente no sistema","danger");
							}

						});
					}
				}
			});

		}

		var _logOut = function() {
			delete $rootScope.currentFilial;
			delete $rootScope.user;
			delete $rootScope.authToken;
			delete $rootScope.usuarioSistema;
			delete $localStorage.senha;
			$cookieStore.remove('authToken');
			$cookieStore.remove('usuarioSistema')
			var confs = config.confs || {};
			$location.path(confs.loginPath || "login");
		};

		var _configureSystemForUser = function(loginData){
			
			var filiais = loginData.filiais;
			$rootScope.filiais = filiais;

			//Token de acesso gerado pelo back-end
			var authToken = loginData.token;
			$rootScope.authToken = authToken;
			$cookieStore.put('authToken', authToken);

			//Informações do usuário logado
			var usuarioSistema = loginData.usuarioSistema;
			usuarioSistema.originalLogin = usuarioSistema.login;
			usuarioSistema.login = usuarioSistema.login.split('@')[0];
			$rootScope.usuarioSistema = usuarioSistema;
			$rootScope.config = loginData.config;
			var tenantConfs =  loginData.config.confs;
			var staticConfs = config.confs;
			console.log("Configurações estáticas !!!!!!");
			console.log(staticConfs);
			var confsToApply = staticConfs;
			for(var key in tenantConfs ){
				
				confsToApply[key] = tenantConfs[key];
			}
			//Aplica as configurções em config
			
		
			config.confs = confsToApply;
			
			$cookieStore.put('usuarioSistema', usuarioSistema);

			var idFilialInConfig = parseInt($rootScope.config.confs.currentFilialId);
			
			var filiaisPermitidas = [];
			
			if(usuarioSistema.filiaisPermitidas && usuarioSistema.filiaisPermitidas.length>0)
				filiaisPermitidas = $rootScope.usuarioSistema.filiaisPermitidas.split(",");
			
			//Filial salva nas configuraçõs e  (está na lista de permitidas ou a lista de permitidas está vazia)
			if(idFilialInConfig>0 && ( filiaisPermitidas.indexOf(idFilialInConfig+"")!=-1 || filiaisPermitidas.length==0 )){
				$rootScope.currentFilial = filialUtil.getFilialById(idFilialInConfig);
			}
			
			else  {
			var filteredFiliais = filiais.filter(function(filial){
				
				if(filiaisPermitidas.indexOf(filial.id+"")!=-1)
					return filial;
			});
			
			//Seta a primeira filial permitida como current
			$rootScope.currentFilial = filteredFiliais[0];
			}
			
			//Caso a filial não seja definida em nenhuma condição, a filial Matriz é setada
			if(!$rootScope.currentFilial || !$rootScope.currentFilial.id)
				$rootScope.currentFilial = {id: 1, nome: "Matriz"};
			
		}

		var _logar = function(login, lembrarSenha, callback){
			
			if(!login.empresa){
				callback();
			}

			$localStorage.empresa = login.empresa;
			$localStorage.usuario = login.usuario;

			if(lembrarSenha==true)
				$localStorage.senha = login.senha;
			else{

				delete  $localStorage.senha;
			}

			//remove o token antigo
			$cookieStore.remove('authToken');

			stService.executePost("/user/login/", login).then(function(data){

				//Verifica se a data do computador é a mesma do backend
				var dataFrontEnd  = dateUtil.getDate(new Date());
				var dataBackEnd = dateUtil.getDate(data.dataBackEnd);

				if(dataFrontEnd.getTime() != dataBackEnd.getTime()){
			           $mdDialog.show(
						      $mdDialog.alert()
						        .parent(angular.element(document.body))
						        .clickOutsideToClose(true)
						        .title('Data incorreta')
						        .htmlContent('<p>A data do seu dispositivo está incorreta. Isso pode ocasionar erros no uso do sistema.</p>')
						        .ok('OK')
						  
						    );
					
				}

				_configureSystemForUser(data);
				callback(data);

			}).catch(function(data,erro){

				callback();

			});

		}

		var _isLogado = function(){

			if($rootScope.usuarioSistema)
				return true;
			else
				return false;
		}

		return{
			logar: _logar,
			logOut:_logOut,
			isLogado: _isLogado,
			openLembrarSenha: _openLembrarSenha

		}
	}

})();

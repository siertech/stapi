"use strict";
(function(){
	angular.module("stapiApp").controller("loginController",function($scope, $location, $rootScope, $localStorage, $cookieStore, loginUtil, stUtil, config, $route){

		var ctrl = this;
		init();

		ctrl.lembrarSenhaUsuario = function(){
			loginUtil.openLembrarSenha();
		}

		ctrl.logar = function(login,lembrarSenha){

			if(!login.usuario){

				stUtil.showMessage("","Informe o Usuário","danger");
				return;
			}

			if(!login.senha){

				stUtil.showMessage("","Informe a senha","danger");
				return;
			}

			ctrl.loading=true;
			loginUtil.logar(login,lembrarSenha,function(loginData){

				ctrl.loading=false;

				if(loginData){

					var pathPostLogin = angular.copy($rootScope.pathPosLogin);
					delete $rootScope.pathPosLogin;
					$location.path(config.defaultRoute || "/inicio");

				}
				else{
					ctrl.login.senha = "";
					delete $localStorage.senha;
					stUtil.showMessage("","Ocorreu um erro ao realizar login, tente novamente","danger");
				}

			});
		}

		ctrl.logOut = function() {
			loginUtil.logOut();
			$location.path(config.confs.loginPath || "login");
		};

		function init(){

			ctrl.login = {
					empresa: $localStorage.empresa,
					usuario: $localStorage.usuario,
					senha: $localStorage.senha
			};
			ctrl.loading = false;
			ctrl.lembrarSenha = true;

			if(!$rootScope.usuarioSistema)
				$rootScope.usuarioSistema = $cookieStore.get("usuarioSistema");
		}

		if($localStorage.usuario && $localStorage.senha){
			ctrl.logar(ctrl.login, true);
		}

	})

})();
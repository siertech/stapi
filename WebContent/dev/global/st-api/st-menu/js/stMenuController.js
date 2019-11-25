"use strict";
(function(){

	angular.module("stapi")

	.controller("stMenuController", stMenuController);

	function stMenuController($scope, $rootScope, $timeout, $route, loginUtil, $location, stUtil , config, $mdSidenav, menuItems, sidenavId, stMenuUtil){

		var ctrl = this;
		ctrl.data = {};
		ctrl.data.showMenu = true;
		ctrl.data.toggleSideNav = toggleSideNav;
		ctrl.data.logOut = logOut;
		ctrl.data.changePath = changePath;
		ctrl.data.menuItems = menuItems;
		ctrl.data.sidenavId = sidenavId;
		$rootScope.menuItems = menuItems;

		$rootScope.$on('$routeChangeSuccess', function() {

			var path;

			if($route.current)
				path = 	$route.current.$$route.originalPath;

			else {
				$location.path(config.confs.notFoundPath|| "inicio");
				return;
			}

			if(config.confs.pathsToHideMenu && config.confs.pathsToHideMenu.indexOf(path)!=-1){

				ctrl.data.showMenu = false;
			}

			else
				ctrl.data.showMenu = true;

			if(path!=config.confs.loginPath)
				changePath(path);
		});

		function changePath(path){
			
			$timeout($mdSidenav(ctrl.data.sidenavId).close, 500);
			stMenuUtil.changePath(path);
		}

		function toggleSideNav(){
			$mdSidenav(ctrl.data.sidenavId).toggle();
		}

		function logOut(){

			$timeout($mdSidenav(ctrl.data.sidenavId).close, 500);
			loginUtil.logOut();

		}

	}	

})();


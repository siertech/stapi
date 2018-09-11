"use strict";!function(){function artigoDetalheCtrl($scope,$controller,item,functionToDetailNotify,objectName,stUtil){var ctrl=this;angular.extend(ctrl,$controller("genericDetalheController",{$scope:$scope,functionToDetailNotify:functionToDetailNotify,objectName:objectName,item:item}))}function artigoListCtrl($scope,$controller,config,stCrudTools,stUtil,$route){function saveSuccessResolve(obj){stUtil.showMessage("","Salvo com sucesso!"),obj.$mdDialog.hide(),$route.reload()}function cancelResolve(){}var ctrl=this;angular.extend(ctrl,$controller("genericListController",{$scope:$scope,objectName:objectName,detalheTemplateUrl:"app/artigo/html/artigoDetalhe.html",detalheController:"artigoDetalheCtrl",detalheControllerAs:"$artigoDetalheCtrl",filtros:[{attr:"titulo",label:"Título do artigo"}]})),ctrl.data.tableColumns=[{label:"Título do artigo",attr:"titulo",orderBy:!0,labelIcon:"text_format"}],ctrl.data.orderBy="titulo",ctrl.data.requestListParams={objectName:objectName,maxItensPerPage:config.confs.maxItemsPerPage||9},ctrl.data.saveSuccesResolve=saveSuccessResolve,ctrl.data.cancelResolve=cancelResolve,ctrl.data.getList()}angular.module("stapiApp").controller("artigoDetalheCtrl",artigoDetalheCtrl).controller("artigoListCtrl",artigoListCtrl);var objectName="Artigo"}(),function(){function artigoList(){return{restrict:"E",templateUrl:"app/artigo/html/artigoList.html",controller:"artigoListCtrl",controllerAs:"$artigoListCtrl"}}function artigoGridView(){return{restrict:"E",templateUrl:"app/artigo/html/artigoGridView.html"}}function artigoTableView(){return{restrict:"E",templateUrl:"app/artigo/html/artigoTableView.html"}}function artigoForm(){return{restrict:"E",templateUrl:"app/artigo/html/artigoForm.html"}}angular.module("stapiApp").directive("artigoGridView",artigoGridView).directive("artigoTableView",artigoTableView).directive("artigoList",artigoList).directive("artigoDetalhe",artigoList).directive("artigoForm",artigoForm)}(),function(){function artigoUtil($mdDialogstService,$q,$mdDialog,$mdMedia,stCrudToolsUtils){}angular.module("stapiApp").factory("artigoUtil",artigoUtil)}(),function(){angular.module("stapiApp").config(function($routeProvider,$httpProvider){$routeProvider.when("/artigo",{template:"<artigo-list></artigo-list>"})})}(),function(){function democomponentDetalheCtrl($scope,$controller,item,functionToDetailNotify,objectName,stUtil){var ctrl=this;angular.extend(ctrl,$controller("genericDetalheController",{$scope:$scope,functionToDetailNotify:functionToDetailNotify,objectName:objectName,item:item}))}function democomponentListCtrl($scope,$controller,config,stCrudTools,stUtil,$route){function saveSuccessResolve(obj){stUtil.showMessage("","O objeto foi salvo com sucesso no override!"),obj.$mdDialog.hide(),$route.reload()}function cancelResolve(){stUtil.showMessage("","Fechado pelo usuário")}var ctrl=this;angular.extend(ctrl,$controller("genericListController",{$scope:$scope,objectName:objectName,detalheTemplateUrl:"app/democomponent/html/democomponentDetalhe.html",detalheController:"democomponentDetalheCtrl",detalheControllerAs:"$democomponentDetalheCtrl",filtros:[{attr:"_string.nome",label:"Buscar pelo nome do democomponent"},{attr:"id",operator:"=",label:"Buscar pelo id"}]})),ctrl.data.orderBy="_string.nome",ctrl.data.requestListParams={objectName:objectName,maxItensPerPage:config.maxItensPerPage||50},ctrl.data.saveSuccesResolve=saveSuccessResolve,ctrl.data.cancelResolve=cancelResolve,ctrl.data.getList()}angular.module("stapiApp").controller("democomponentDetalheCtrl",democomponentDetalheCtrl).controller("democomponentListCtrl",democomponentListCtrl);var objectName="DemoComponent"}(),function(){function democomponentList(){return{restrict:"E",templateUrl:"app/democomponent/html/democomponentList.html",controller:"democomponentListCtrl",controllerAs:"$democomponentListCtrl"}}function democomponentGridView(){return{restrict:"E",templateUrl:"app/democomponent/html/democomponentGridView.html"}}function democomponentTableView(){return{restrict:"E",templateUrl:"app/democomponent/html/democomponentTableView.html"}}function democomponentForm(){return{restrict:"E",templateUrl:"app/democomponent/html/democomponentForm.html"}}angular.module("stapiApp").directive("democomponentGridView",democomponentGridView).directive("democomponentTableView",democomponentTableView).directive("democomponentList",democomponentList).directive("democomponentDetalhe",democomponentList).directive("democomponentForm",democomponentForm)}(),function(){function democomponentUtil($mdDialogstService,$q,$mdDialog,$mdMedia,stCrudToolsUtils){var _deletar=function(_item,callback){stService["delete"]("democomponent",[_item.id]).then(function(){callback(_item)})["catch"](function(){callback()})},_mostrarDetalhe=function(item,functionToNotify){var useFullScreen=$mdMedia("sm")||$mdMedia("xs");$mdDialog.show({controllerAs:"$detalheCtrl",controller:"democomponentDetalheCtrl",resolve:{item:function(){return item},functionToNotify:function(){return functionToNotify},deferred:function(){return{}}},templateUrl:"app/democomponent/html/democomponentDetalhe.html",parent:angular.element(document.body),clickOutsideToClose:!0,fullscreen:useFullScreen}).then(function(res){console.log("res: "),console.log(res)},function(){console.log("Cancelou!"),stCrudToolsUtils.cancelAndNotify(functionToNotify)})};return{deletar:_deletar,mostrarDetalhe:_mostrarDetalhe}}angular.module("stapiApp").factory("democomponentUtil",democomponentUtil)}(),function(){angular.module("stapiApp").config(function($routeProvider,$httpProvider){$routeProvider.when("/democomponent",{template:"<democomponent-list></democomponent-list>"})})}(),function(){function menuCtrl($scope,$controller){var ctrl=this;ctrl.scope=$scope;var menuItems=[{path:"inicio",icon:"home",label:"Início"},{path:"cliente",icon:"person",label:"Crud Demo"},{path:"artigo",icon:"text_format",label:"Artigos"},{path:"democomponent",icon:"code",label:"Componentes"}];angular.extend(ctrl,$controller("stMenuController",{$scope:$scope,menuItems:menuItems,sidenavId:"side-nav-principal"}))}angular.module("stapiApp").controller("menuCtrl",menuCtrl)}(),function(){function clienteDetalheCtrl($scope,$controller,item,functionToDetailNotify,objectName,stUtil){var ctrl=this;angular.extend(ctrl,$controller("genericDetalheController",{$scope:$scope,functionToDetailNotify:functionToDetailNotify,objectName:objectName,item:item}))}function clienteListCtrl($scope,$controller,config,stCrudTools,stUtil,$route){var ctrl=this;angular.extend(ctrl,$controller("genericListController",{$scope:$scope,objectName:objectName,detalheTemplateUrl:"app/cliente/html/clienteDetalhe.html",detalheController:"clienteDetalheCtrl",detalheControllerAs:"$clienteDetalheCtrl",filtros:[{attr:"principalAttr",label:"principalLabel"}]})),ctrl.data.tableColumns=[{label:"principalLabel",attr:"principalAttr",orderBy:!0,labelIcon:"principalIcon"}],ctrl.data.orderBy="principalAttr",ctrl.data.requestListParams={objectName:objectName,maxItensPerPage:config.confs.maxItemsPerPage||9},ctrl.data.getList()}angular.module("stapiApp").controller("clienteDetalheCtrl",clienteDetalheCtrl).controller("clienteListCtrl",clienteListCtrl);var objectName="Cliente"}(),function(){function clienteList(){return{restrict:"E",templateUrl:"app/cliente/html/clienteList.html",controller:"clienteListCtrl",controllerAs:"$clienteListCtrl"}}function clienteGridView(){return{restrict:"E",templateUrl:"app/cliente/html/clienteGridView.html"}}function clienteTableView(){return{restrict:"E",templateUrl:"app/cliente/html/clienteTableView.html"}}function clienteForm(){return{restrict:"E",templateUrl:"app/cliente/html/clienteForm.html"}}angular.module("stapiApp").directive("clienteGridView",clienteGridView).directive("clienteTableView",clienteTableView).directive("clienteList",clienteList).directive("clienteDetalhe",clienteList).directive("clienteForm",clienteForm)}(),function(){function clienteUtil($mdDialogstService,$q,$mdDialog,$mdMedia,stCrudToolsUtils){}angular.module("stapiApp").factory("clienteUtil",clienteUtil)}(),function(){angular.module("stapiApp").config(function($routeProvider,$httpProvider){$routeProvider.when("/cliente",{template:"<cliente-list></cliente-list>"})})}(),function(){angular.module("stapiApp").controller("detalhetesteController",function(stService,stUtil,$modalInstance,item,callback){var vm=this;vm.item=item||{},vm.salvandoItem=!1,vm.salvarItem=function(){var _item=vm.item;vm.salvandoItem=!0,stService.save("teste",_item).then(function(data){vm.item=data.item,vm.salvandoItem=!1,stUtil.showMessage("","Salvo com sucesso","info"),callback("add",$modalInstance)})["catch"](function(){vm.salvandoItem=!1,stUtil.showMessage("","Ocorreu um erro","danger"),callback("add-error",$modalInstance)})},vm.deletarItem=function(){stService["delete"]("teste",[vm.item.id]).then(function(){stUtil.showMessage("","Item deletado com sucesso","info"),callback("delete",$modalInstance)})["catch"](function(){stUtil.showMessage("","Ocorreu um erro ao deletar","danger"),callback("delete-error",$modalInstance)})}}).controller("listtesteController",function(testeUtil,stService,$route,stUtil,$scope){var vm=this;vm.openItem=function(item){testeUtil.openItem(item,function(event,modal){modal.close(),$route.reload()})},vm.deletarItem=function(item){stService["delete"]("teste",[item.id]).then(function(){stUtil.showMessage("","Item deletado com sucesso","info"),$route.reload()})["catch"](function(){stUtil.showMessage("","Ocorreu um erro ao deletar","danger")})}})}(),function(){angular.module("stapiApp").directive("testeGridView",function(){return{restrict:"E",templateUrl:"app/teste/html/gridView.html",scope:{objetos:"=",editFunction:"=",deleteFunction:"="},controllerAs:"vm",bindToController:!0,controller:function(){}}}).directive("testeTableView",function(){return{restrict:"E",templateUrl:"app/teste/html/tableView.html",scope:{objetos:"=",editFunction:"=",deleteFunction:"="},controllerAs:"vm",bindToController:!0,controller:function(){}}}).directive("testeForm",function(){return{restrict:"E",templateUrl:"app/teste/html/form.html",scope:{item:"="},controllerAs:"vm",bindToController:!0,controller:function(){}}})}(),function(){angular.module("stapiApp").factory("testeUtil",function($mdDialog){var _openItem=function(item,callback){$mdDialog.show({animation:!0,backdrop:"static",templateUrl:"app/teste/html/detalhe.html",size:"lg",controllerAs:"vm",controller:"detalhetesteController",resolve:{item:function(){return item},callback:function(){return callback}}})};return{openItem:_openItem}})}(),function(){angular.module("stapiApp").config(function($routeProvider,$httpProvider){$routeProvider.when("/teste",{templateUrl:"app/teste/html/list.html",controller:"listtesteController",controllerAs:"vm"})})}(),function(){angular.module("stapiApp").controller("changePasswordController",function($rootScope,$scope,stService,$cookieStore,$location,st,$localStorage,stUtil,configUtil){$scope.usuarioSistema=$cookieStore.get("usuarioSistema"),$scope.lembrarSenha=!0,$scope.alterarSenha=function(usuarioSistema){return!usuarioSistema.senha||usuarioSistema.senha.length<4?void stUtil.showMessage("","A senha deve ter pelo menos 4 caracteres.","danger"):void stService.save("operadorsistema",usuarioSistema).then(function(){st.leadEvt({descricao:"usuario_mudou_senha"}),configUtil.setConfig("mudouSenha","true",function(){$localStorage.senha=usuarioSistema.senha,$location.path("/inicio")})})["catch"](function(){st.evt({evento:"erro_mudar_senha"}),stUtil.showMessage("","Ocorreu um erro, tente novamente","danger")})}})}(),function(){angular.module("stapiApp").config(function($routeProvider,$httpProvider){$routeProvider.when("/login",{templateUrl:"app/login/html/login.html",controller:"loginController",controllerAs:"$loginCtrl"}),$routeProvider.when("/notfound",{template:"<p>Página não encontrada</p>"})})}(),function(){angular.module("stapiApp").controller("loginController",function($scope,$location,$rootScope,$localStorage,$cookieStore,loginUtil,stUtil,config){function init(){ctrl.login={empresa:$localStorage.empresa,usuario:$localStorage.usuario,senha:$localStorage.senha},ctrl.loading=!1,ctrl.lembrarSenha=!0,$rootScope.usuarioSistema||($rootScope.usuarioSistema=$cookieStore.get("usuarioSistema"))}var ctrl=this;init(),ctrl.lembrarSenhaUsuario=function(){loginUtil.openLembrarSenha()},ctrl.logar=function(login,lembrarSenha){return login.usuario?login.senha?(ctrl.loading=!0,void loginUtil.logar(login,lembrarSenha,function(loginData){ctrl.loading=!1,loginData?$location.path(config.confs.initialPath||"/inicio"):(ctrl.login.senha="",delete $localStorage.senha,stUtil.showMessage("","Ocorreu um erro ao realizar login, tente novamente","danger"))})):void stUtil.showMessage("","Informe a senha","danger"):void stUtil.showMessage("","Informe o Usuário","danger")},ctrl.logOut=function(){loginUtil.logOut(),$location.path(config.confs.loginPath||"login")},$localStorage.usuario&&$localStorage.senha&&ctrl.logar(ctrl.login,!0)})}(),function(){angular.module("stapiApp").controller("inicioController",function($scope,dateUtil,$timeout,stService,$compile,config,$http,$templateCache,$controller,$mdColorUtil,$mdColors,ChartJs,$mdColorPalette){var obj={objectName:"Cliente",items:[{id:"3",orderIndex:"4"}]};stService.executePost("/reorder-items/",obj)})}(),function(){angular.module("stapiApp").config(function($routeProvider,$httpProvider){$routeProvider.when("/inicio",{templateUrl:"app/inicio/html/inicio.html",controller:"inicioController",controllerAs:"$inicioCtrl"})})}();
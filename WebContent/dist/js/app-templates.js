angular.module('stapi').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/artigo/html/artigoDetalhe.html',
    "<meta charset=\"UTF-8\"><st-detalhe save-function=\"$artigoDetalheCtrl.data.saveFunction($artigoDetalheCtrl.data.item)\" delete-function=\"$artigoDetalheCtrl.data.deleteFunction($artigoDetalheCtrl.data.item)\" item=\"$artigoDetalheCtrl.data.item\" cancel-function=\"$artigoDetalheCtrl.data.cancelFunction()\" loading=\"$artigoDetalheCtrl.data.loading\" title=\"{{$artigoDetalheCtrl.data.item.titulo || 'Cadastro de novo Item'}}\"><div layout=\"row\" layout-wrap><div flex=\"100\" layout=\"row\"><st-nav flex=\"30\" active-tab=\"$artigoDetalheCtrl.activeTab\" tabs=\"[{label:'Informações', icon:'info'}, {icon:'eye',label:'Conteúdo'} ]\"></st-nav></div><div flex=\"100\"><md-card ng-show=\"$artigoDetalheCtrl.activeTab==0\"><md-card-content><artigo-form></artigo-form></md-card-content></md-card><div ng-show=\"$artigoDetalheCtrl.activeTab==1\"><div simditor ng-model=\"$artigoDetalheCtrl.data.item.content\"></div></div></div></div></st-detalhe>"
  );


  $templateCache.put('app/artigo/html/artigoForm.html',
    "<meta charset=\"UTF-8\"><div layout=\"row\" class=\"md-block\" layout-wrap><st-input-string flex=\"50\" flex-xs=\"100\" label=\"Título do artigo\" ng-model=\"$artigoDetalheCtrl.data.item.titulo\"></st-input-string></div>"
  );


  $templateCache.put('app/artigo/html/artigoGridView.html',
    "<meta charset=\"UTF-8\"><div layout=\"row\" layout-wrap flex><div flex=\"25\" flex-xs=\"100\" flex-sm=\"50\" ng-repeat=\"item in $artigoListCtrl.data.objetos\"><st-grid-item icon=\"text_format\" item=\"item\" label=\"{{item.titulo}}\" delete-function=\"$artigoListCtrl.data.deleteFunction([item.id])\" open-detail=\"$artigoListCtrl.data.openDetail(item)\"></st-grid-item></div></div>"
  );


  $templateCache.put('app/artigo/html/artigoList.html',
    "<meta charset=\"UTF-8\"><md-card style=\"padding-top: 15px\"><md-toolbar class=\"md-table-toolbar md-default\"><div layout=\"row\" class=\"md-toolbar-tools\" layout-wrap><div flex=\"20\" hide-xs md-hide-xs><md-button class=\"add-button md-raised\" ng-click=\"$artigoListCtrl.data.openDetail()\"><ng-md-icon icon=\"add\"></ng-md-icon>Cadastrar</md-button></div><st-filter flex-xs=\"80\" flex=\"60\" query-options=\"$artigoListCtrl.data.requestListParams\" get-list=\"$artigoListCtrl.data.getList\" filtros=\"$artigoListCtrl.data.filtros\"></st-filter><view-chose flex=\"10\" view-type=\"config.confs.viewType\"></view-chose></div></md-toolbar></md-card><float-button-add class=\"float-add-button\" tooltip-label=\"Cadastrar novo artigo\" ng-click=\"$artigoListCtrl.data.openDetail()\"></float-button-add><div layout=\"row\" style=\"margin:8px\"><md-progress-linear flex ng-if=\"$artigoListCtrl.data.loading===true\" md-mode=\"indeterminate\"></md-progress-linear></div><st-selected-items-actions delete-function=\"$artigoListCtrl.data.deleteFunction($artigoListCtrl.data.getSelectedItemsIds())\" selected-items=\"$artigoListCtrl.data.selectedItems\"></st-selected-items-actions><artigo-grid-view ng-show=\"config.confs.viewType=='grid'\"></artigo-grid-view><artigo-table-view ng-show=\"config.confs.viewType=='table'\"></artigo-table-view><div ng-if=\"$artigoListCtrl.data.objetos.length==0\"><p class=\"text-muted\">Nenhum item encontrado</p></div><st-filter-pagination total-itens=\"$artigoListCtrl.data.totalItens\" itens-in-page=\"$artigoListCtrl.data.objetos.length\" get-list=\"$artigoListCtrl.data.getList\" query-options=\"$artigoListCtrl.data.requestListParams\"></st-filter-pagination>"
  );


  $templateCache.put('app/artigo/html/artigoTableView.html',
    "<meta charset=\"UTF-8\"><st-table columns=\"$artigoListCtrl.data.tableColumns\" open-detail=\"$artigoListCtrl.data.openDetail\" order-by=\"$artigoListCtrl.data.orderBy\" delete-function=\"$artigoListCtrl.data.deleteFunction\" selected-items=\"$artigoListCtrl.data.selectedItems\" items=\"$artigoListCtrl.data.objetos\" edit-column=\"$artigoListCtrl.data.editColumn\"></st-table>"
  );


  $templateCache.put('app/cliente/html/clienteDetalhe.html',
    "<meta charset=\"UTF-8\"><st-detalhe save-function=\"$clienteDetalheCtrl.data.saveFunction($clienteDetalheCtrl.data.item)\" delete-function=\"$clienteDetalheCtrl.data.deleteFunction($clienteDetalheCtrl.data.item)\" item=\"$clienteDetalheCtrl.data.item\" cancel-function=\"$clienteDetalheCtrl.data.cancelFunction()\" loading=\"$clienteDetalheCtrl.data.loading\" title=\"{{$clienteDetalheCtrl.data.item.principalAttr || 'Cadastro de novo Item'}}\"><cliente-form></cliente-form></st-detalhe>"
  );


  $templateCache.put('app/cliente/html/clienteForm.html',
    "<meta charset=\"UTF-8\"><div layout=\"row\" class=\"md-block\" layout-wrap><st-input-string flex=\"50\" flex-xs=\"100\" label=\"principalLabel\" ng-model=\"$clienteDetalheCtrl.data.item.principalAttr\"></st-input-string></div>"
  );


  $templateCache.put('app/cliente/html/clienteGridView.html',
    "<meta charset=\"UTF-8\"><div layout=\"row\" layout-wrap flex><div flex=\"25\" flex-xs=\"100\" flex-sm=\"50\" ng-repeat=\"item in $clienteListCtrl.data.objetos\"><st-grid-item icon=\"principalIcon\" item=\"item\" label=\"{{item.principalAttr}}\" delete-function=\"$clienteListCtrl.data.deleteFunction([item.id])\" open-detail=\"$clienteListCtrl.data.openDetail(item)\"></st-grid-item></div></div>"
  );


  $templateCache.put('app/cliente/html/clienteList.html',
    "<meta charset=\"UTF-8\"><md-card style=\"padding-top: 15px\" ng-hide=\"$clienteListCtrl.hideFilter==true\"><md-toolbar class=\"md-table-toolbar md-default\"><div layout=\"row\" class=\"md-toolbar-tools\" layout-wrap><div flex=\"20\" hide-xs md-hide-xs><md-button class=\"add-button md-raised\" ng-click=\"$clienteListCtrl.data.openDetail()\"><ng-md-icon icon=\"add\"></ng-md-icon>Cadastrar</md-button></div><st-filter flex-xs=\"80\" flex=\"60\" query-options=\"$clienteListCtrl.data.requestListParams\" get-list=\"$clienteListCtrl.data.getList\" filtros=\"$clienteListCtrl.data.filtros\"></st-filter><view-chose flex=\"10\" view-type=\"config.confs.viewType\"></view-chose></div></md-toolbar></md-card><float-button-add ng-hide=\"$clienteListCtrl.hideButtonAdd==true\" class=\"float-add-button\" tooltip-label=\"Cadastrar novo cliente\" ng-click=\"$clienteListCtrl.data.openDetail()\"></float-button-add><div layout=\"row\" style=\"margin:8px\"><md-progress-linear flex ng-if=\"$clienteListCtrl.data.loading===true\" md-mode=\"indeterminate\"></md-progress-linear></div><st-selected-items-actions delete-function=\"$clienteListCtrl.data.deleteFunction($clienteListCtrl.data.getSelectedItemsIds())\" selected-items=\"$clienteListCtrl.data.selectedItems\"></st-selected-items-actions><cliente-grid-view ng-show=\"config.confs.viewType=='grid'\"></cliente-grid-view><cliente-table-view ng-show=\"config.confs.viewType=='table'\"></cliente-table-view><div ng-if=\"$clienteListCtrl.data.objetos.length==0\"><p class=\"text-muted\">Nenhum item encontrado</p></div><st-filter-pagination ng-hide=\"$clienteListCtrl.hidePagination==true\" total-itens=\"$clienteListCtrl.data.totalItens\" itens-in-page=\"$clienteListCtrl.data.objetos.length\" get-list=\"$clienteListCtrl.data.getList\" query-options=\"$clienteListCtrl.data.requestListParams\"></st-filter-pagination>"
  );


  $templateCache.put('app/cliente/html/clienteTableView.html',
    "<meta charset=\"UTF-8\"><st-table columns=\"$clienteListCtrl.data.tableColumns\" open-detail=\"$clienteListCtrl.data.openDetail\" order-by=\"$clienteListCtrl.data.orderBy\" delete-function=\"$clienteListCtrl.data.deleteFunction\" selected-items=\"$clienteListCtrl.data.selectedItems\" items=\"$clienteListCtrl.data.objetos\" edit-column=\"$clienteListCtrl.data.editColumn\"></st-table>"
  );


  $templateCache.put('app/democomponent/html/democomponentDetalhe.html',
    "<form ng-cloak class=\"st-detalhe-content\"><md-toolbar><div class=\"md-toolbar-tools\"><h2>{{$democomponentDetalheCtrl.data.item._string.nome || 'Cadastrar novo democomponent'}}</h2><span flex></span><md-button class=\"md-icon-button\" ng-click=\"$democomponentDetalheCtrl.data.cancelFunction()\"><ng-md-icon icon=\"close\"></ng-md-icon></md-button></div></md-toolbar><md-dialog-content><div class=\"md-dialog-content\"><democomponent-form></democomponent-form><md-divider></md-divider></div></md-dialog-content><md-dialog-actions layout=\"row\"><md-button ng-show=\"$democomponentDetalheCtrl.data.item.id\" confirm ng-disabled=\"$democomponentDetalheCtrl.data.loading==true\" ng-click=\"$democomponentDetalheCtrl.data.deleteFunction($democomponentDetalheCtrl.data.item)\" class=\"md-raised md-warn\"><ng-md-icon icon=\"delete\"></ng-md-icon>Deletar</md-button><md-button ng-disabled=\"$democomponentDetalheCtrl.data.loading==true\" ng-click=\"$democomponentDetalheCtrl.data.saveFunction($democomponentDetalheCtrl.data.item)\" class=\"md-raised md-primary\"><ng-md-icon icon=\"check_circle\"></ng-md-icon>Salvar</md-button></md-dialog-actions></form>"
  );


  $templateCache.put('app/democomponent/html/democomponentForm.html',
    "<meta charset=\"UTF-8\"><!-- \r" +
    "\n" +
    "Exemplos\r" +
    "\n" +
    "<input-check class=\"col-lg-3\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"col-lg-3\" label=\"Titulo\" ng-model=\"vm.item.attrCheck\"></input-check>\r" +
    "\n" +
    "<input-double class=\"col-lg-3\" label=\"Valor\" ng-model=\"vm.item.attrDouble\" ></input-double>\r" +
    "\n" +
    "<input-date class=\"col-lg-3\" label=\"Data\" ng-model=\"vm.item.data\" ></input-date>\r" +
    "\n" +
    "<input-string class=\"col-lg-3\" label=\"Digite o nome\" ng-model=\"vm.item.nome\" ></input-string>\r" +
    "\n" +
    "<input-int class=\"col-lg-3\" label=\"Quantidade\" ng-model=\"vm.item.quantidade\" ></input-int>\r" +
    "\n" +
    "--><div layout=\"row\"><input-string flex=\"25\" label=\"Título do componente\" ng-model=\"$democomponentDetalheCtrl.data.item._string.titulo\"></input-string><input-string flex=\"25\" label=\"Prioridade\" ng-model=\"$democomponentDetalheCtrl.data.item._string.priority\"></input-string><input-string flex=\"25\" label=\"Classe\" ng-model=\"$democomponentDetalheCtrl.data.item._string.class\"></input-string><input-string flex=\"25\" label=\"Categoria\" ng-model=\"$democomponentDetalheCtrl.data.item._string.categoria\"></input-string></div><md-divider></md-divider><div class=\"row\"><panel><div html-view titulo=\"$democomponentDetalheCtrl.data.item._string.titulo\" content=\"$democomponentDetalheCtrl.data.item.content\"></div></panel></div>"
  );


  $templateCache.put('app/democomponent/html/democomponentGridView.html',
    "<meta charset=\"UTF-8\"><div layout=\"column\" layout-wrap><div flex=\"50\" flex-xs=\"100\" flex-sm=\"50\" ng-repeat=\"item in $democomponentListCtrl.data.objetos\"><st-grid-item icon=\"code\" item=\"item\" label=\"{{item._string.titulo}}\" delete-function=\"$democomponentListCtrl.data.deleteFunction([item.id])\" open-detail=\"$democomponentListCtrl.data.openDetail(item)\"><div flex><html-compile html=\"item.content\"></html-compile></div></st-grid-item></div></div>"
  );


  $templateCache.put('app/democomponent/html/democomponentList.html',
    "<meta charset=\"UTF-8\"><app-menu></app-menu><md-card style=\"padding-top: 15px\"><md-toolbar class=\"md-table-toolbar md-default\"><div layout=\"row\" class=\"md-toolbar-tools\" layout-wrap><div flex=\"20\" hide-xs md-hide-xs><md-button class=\"add-button md-raised\" ng-click=\"$democomponentListCtrl.data.openDetail()\"><ng-md-icon icon=\"add\"></ng-md-icon>Cadastrar</md-button></div><st-filter flex-xs=\"80\" flex=\"60\" query-options=\"$democomponentListCtrl.data.requestListParams\" get-list=\"$democomponentListCtrl.data.getList\" filtros=\"$democomponentListCtrl.data.filtros\"></st-filter><view-chose flex=\"10\" view-type=\"config.confs.viewType\"></view-chose></div></md-toolbar></md-card><float-button-add class=\"float-add-button\" tooltip-label=\"Cadastrar novo democomponent\" ng-click=\"$democomponentListCtrl.data.openDetail()\"></float-button-add><div layout=\"row\" style=\"margin:8px\"><md-progress-linear flex ng-if=\"$democomponentListCtrl.data.loading===true\" md-mode=\"indeterminate\"></md-progress-linear></div><democomponent-grid-view></democomponent-grid-view><div ng-if=\"$democomponentListCtrl.data.objetos.length==0\" class=\"col-lg-12\"><p class=\"text-muted\">Nenhum item encontrado</p></div><st-filter-pagination total-itens=\"$democomponentListCtrl.data.totalItens\" itens-in-page=\"$democomponentListCtrl.data.objetos.length\" get-list=\"$democomponentListCtrl.data.getList\" query-options=\"$democomponentListCtrl.data.requestListParams\"></st-filter-pagination>"
  );


  $templateCache.put('app/democomponent/html/democomponentTableView.html',
    "<meta charset=\"UTF-8\"><body layout=\"column\"><md-content layout=\"column\" flex><md-card><md-toolbar layout=\"row\" class=\"md-table-toolbar alternate md-default\" ng-show=\"$democomponentListCtrl.data.selectedRows.length\"><md-menu flex><md-button aria-label=\"Open phone interactions menu\" class=\"md-default md-raised\" ng-click=\"$democomponentListCtrl.showMdMenu($mdMenu, $event)\"><span>{{$democomponentListCtrl.data.selectedRows.length}} items selecionados</span><ng-md-icon icon=\"arrow_drop_down\"></ng-md-icon></md-button><md-menu-content width=\"4\"><md-menu-item><md-button confirm ng-click=\"$democomponentListCtrl.data.deleteFunction($democomponentListCtrl.data.getSelectedRowsIds())\"><ng-md-icon icon=\"delete\"></ng-md-icon>Deletar</md-button></md-menu-item></md-menu-content></md-menu></md-toolbar><md-table-container><table md-table md-row-select=\"true\" multiple ng-model=\"$democomponentListCtrl.data.selectedRows\"><thead md-head md-order=\"$democomponentListCtrl.data.orderBy\"><tr md-row><th md-column md-column md-order-by=\"_string.nome\"><span>Nome</span></th><th md-column><span>Tipo</span></th><th md-column><span>Cidade</span></th><th md-column><span>Estado</span></th><th md-column md-order-by=\"comentarios\"><ng-md-icon icon=\"comment\"></ng-md-icon><span>Comentários</span></th><th md-column></th></tr></thead><tbody md-body><tr ng-click=\"$democomponentListCtrl.data.openDetail(democomponent)\" md-select-id=\"id\" md-row md-select=\"democomponent\" ng-repeat=\"democomponent in $democomponentListCtrl.data.objetos | orderBy: $democomponentListCtrl.data.orderBy\"><td md-cell><strong>{{democomponent._string.titulo}}</strong></td><td md-cell><md-select ng-change=\"$democomponentListCtrl.data.changeAttrValue(democomponent.id, 'tipoPessoa', democomponent.tipoPessoa)\" ng-model=\"democomponent.tipoPessoa\" placeholder=\"Selecione um tipo\"><md-option ng-value=\"'Pessoa física'\">Pessoa física</md-option><md-option ng-value=\"'Pessoa jurídica'\">Pessoa jurídica</md-option></md-select></td><td md-cell>{{democomponent._string.cidade}}</td><td md-cell>{{democomponent._string.estado}}</td><td id=\"colmun-edit-comentario\" md-cell ng-click=\"$democomponentListCtrl.data.editColumn($event, {item: democomponent, column: 'comentarios', placeholder: 'Digite um comentário'})\" ng-class=\"{'md-placeholder': !democomponent.comentarios}\">{{democomponent.comentarios || 'Adicionar comentário'}}</td><td md-cell><md-menu flex><md-button aria-label=\"Opções\" class=\"md-icon-button\" ng-click=\"$democomponentListCtrl.showMdMenu($mdMenu, $event)\"><ng-md-icon icon=\"more_vert\"></ng-md-icon></md-button><md-menu-content width=\"4\"><md-menu-item><md-button ng-click=\"$democomponentListCtrl.data.openDetail(democomponent)\"><ng-md-icon icon=\"mode_edit\"></ng-md-icon>Editar</md-button></md-menu-item><md-menu-item><md-button confirm ng-click=\"$democomponentListCtrl.data.deleteFunction([democomponent.id])\"><ng-md-icon icon=\"delete\"></ng-md-icon>Deletar</md-button></md-menu-item><md-menu-item><md-button button-info-ob objeto=\"{{democomponent}}\"><ng-md-icon icon=\"access_time\"></ng-md-icon>Histórico do item</md-button></md-menu-item></md-menu-content></md-menu></td></tr></tbody></table></md-table-container></md-card></md-content></body>"
  );


  $templateCache.put('app/inicio/html/inicio.html',
    "<meta charset=\"UTF-8\">{{data}}<st-input-date ng-model=\"data\" label=\"'data'\"></st-input-date><cliente-list fix-properties='{principalAttr:\"Thomaz\"}'></cliente-list><div ng-controller=\"moduloTestController\">nome: {{nome}}</div>"
  );


  $templateCache.put('app/io/html/detalhe.html',
    "<!-- \r" +
    "\n" +
    "---- Detalhamento do objeto ----\r" +
    "\n" +
    "Neste escopo o objeto é controlado aravés de vm.item\r" +
    "\n" +
    "\r" +
    "\n" +
    " --><meta charset=\"UTF-8\"><modal-content item=\"vm.item\" modal-instance=\"this\" loading-ok-action=\"vm.salvandoItem\" ok-action=\"vm.salvarItem\" delete-action=\"vm.deletarItem\" icone-titulo=\"'list'\" titulo=\"'  '\"></modal-content>"
  );


  $templateCache.put('app/io/html/list.html',
    "<meta charset=\"UTF-8\"><vertical-space></vertical-space><div ng-controller=\"stControl\"><div class=\"col-lg-6\"><st-filter-map filter-map-instace=\"filterMapInstance\" busca-especial=\"buscaEspecial\" filtros=\"[\r" +
    "\n" +
    "	 	        \r" +
    "\n" +
    "	 	        {attr:'atrr',placeholder:'Buscar pelo ...'},\r" +
    "\n" +
    "	 	        {attr:'attr',placeholder:'Buscar pela ...'}\r" +
    "\n" +
    "				\r" +
    "\n" +
    "				]\r" +
    "\n" +
    "				\"></st-filter-map></div><vertical-space class=\"only-desktop\"></vertical-space><vertical-space class=\"only-desktop\"></vertical-space><div class=\"col-lg-4 only-desktop\"><button ng-click=\"openItem()\" class=\"btn btn-default\"><i class=\"fa fa-plus\"></i> <strong>Cadastrar</strong></button></div><button-add ng-click=\"openItem()\"></button-add><vertical-space></vertical-space><vertical-space></vertical-space><div ng-repeat=\"ob in objetos\" class=\"col-lg-4 generic-transition\"><card-list index=\"{{$index}}\" ob=\"ob\" pivo=\"''\" edit-function=\"openItem\" delete-function=\"deletarItem\"></card-list></div><div ng-if=\"objetos.length==0\" class=\"col-lg-12\"><st-no-itens label=\"'Nenhum item econtrado.'\"></st-no-itens></div><vertical-space></vertical-space><st-pagination filter-map-instance=\"filterMapInstance\"></st-pagination></div>"
  );


  $templateCache.put('app/login/html/cadastroUsuario.html',
    "<meta charset=\"UTF-8\"><vertical-space></vertical-space><div><div class=\"col-lg-2 only-desktop\"></div><div class=\"panel panel-body col-lg-8\"><h2 class=\"text-center text-muted\">Parabéns <strong>{{lead.nome}}</strong> <i class=\"fa fa-smile-o\" aria-hidden=\"true\"></i></h2><p class=\"text-center\"><img ng-src=\"ceasaplus-onboard.png\"></p><h4 class=\"text-center\"><i class=\"fa fa-refresh faa-spin animated\" aria-hidden=\"true\"></i> Aguarde enquanto seu banco de dados na nuvem é configurado.</h4></div><div class=\"col-lg-2 only-desktop\"></div></div>"
  );


  $templateCache.put('app/login/html/login.html',
    "<meta charset=\"UTF-8\"><section layout=\"row\" flex layout-align-md=\"center center\"><span flex></span><md-card flex-gt-md=\"35\" flex-xs=\"100\"><div layout=\"row\" layout-align=\"center center\"><div><img style=\"width: 399px\" src=\"images/logo-login.png\"></div></div><md-card-content><form name=\"login\"><md-input-container class=\"md-block\"><label for=\"empresa\">Empresa</label><input name=\"empresa\" ng-model=\"$loginCtrl.login.empresa\" required></md-input-container><md-input-container class=\"md-block\"><label for=\"usuario\">Usuário</label><input name=\"usuario\" ng-model=\"$loginCtrl.login.usuario\" required></md-input-container><md-input-container class=\"md-block\"><label for=\"password\">Senha</label><input type=\"password\" name=\"password\" ng-model=\"$loginCtrl.login.senha\" required></md-input-container><md-input-container class=\"md-block\"><div layout=\"row\" layout-align=\"center center\"><md-button flex=\"50\" g-login type=\"button\" class=\"md-raised md-warn\"><ng-md-icon icon=\"google-plus-box\"></ng-md-icon>Google Login</md-button><md-button ng-disabled=\"$loginCtrl.loading==true\" ng-click=\"$loginCtrl.logar($loginCtrl.login,$loginCtrl.lembrarSenha)\" class=\"md-raised md-primary\" flex=\"50\">Entrar no sistema</md-button></div></md-input-container></form></md-card-content></md-card><span flex></span></section>"
  );


  $templateCache.put('app/menu/html/menu.html',
    "<meta charset=\"UTF-8\"><div ng-show=\"$menuCtrl.data.showMenu\" ng-controller=\"menuCtrl as $menuCtrl\"><md-toolbar md-truncate layout=\"row\" class=\"md-toolbar-tools\"><div class=\"md-toolbar-tools\"><md-button ng-click=\"$menuCtrl.data.toggleSideNav()\" class=\"md-icon-button\" aria-label=\"Settings\"><ng-md-icon icon=\"menu\"></ng-md-icon></md-button><md-divider></md-divider><img src=\"images/logo-menu2.png\"><md-divider></md-divider><span flex=\"10\"></span><st-breadcumb hide show-gt-xs></st-breadcumb><button-filial></button-filial><md-button class=\"md-raised md-primary\"><ng-md-icon md-colors=\"{color: 'orange'}\" icon=\"code\"></ng-md-icon>Componentes</md-button><span flex></span><md-button class=\"md-icon-button\"><img style=\"width: 29px\" src=\"images/logo-avatar.png\"></md-button></div></md-toolbar><md-sidenav class=\"md-sidenav\" md-component-id=\"side-nav-principal\" md-disable-backdrop md-whiteframe=\"4\"><md-toolbar layout=\"row\"><div class=\"md-toolbar-tools\"><div><img src=\"images/logo-menu.png\"></div><span flex></span><md-button class=\"md-icon-button\" aria-label=\"Close Side Panel\" ng-click=\"$menuCtrl.data.toggleSideNav()\"><md-tooltip>Fechar</md-tooltip><ng-md-icon icon=\"close\"></ng-md-icon></md-button></div></md-toolbar><md-list class=\"menu-items\"><md-list-item ng-repeat=\"item in $menuCtrl.data.menuItems\" ng-click=\"$menuCtrl.data.changePath(item.path)\"><div class=\"inset\"><ng-md-icon md-colors=\"{color: 'warn'}\" icon=\"{{item.icon}}\"></ng-md-icon></div><div class=\"inset\">{{item.label}}</div><md-divider style=\"width:90%\"></md-divider></md-list-item><md-list-item ng-click=\"$menuCtrl.data.openConfig()\"><div class=\"inset\"><ng-md-icon icon=\"settings\"></ng-md-icon></div><div class=\"inset\">Configurações</div></md-list-item><md-list-item class=\"button-logout\" ng-click=\"$menuCtrl.data.logOut()\"><div class=\"inset\"><ng-md-icon icon=\"logout\"></ng-md-icon></div><div class=\"inset\">Sair</div></md-list-item></md-list></md-sidenav></div>"
  );


  $templateCache.put('app/op/html/detalhe.html',
    "<!-- \r" +
    "\n" +
    "---- Detalhamento do objeto ----\r" +
    "\n" +
    "Neste escopo o objeto é controlado aravés de vm.item\r" +
    "\n" +
    "\r" +
    "\n" +
    " --><meta charset=\"UTF-8\"><modal-content item=\"vm.item\" modal-instance=\"this\" loading-ok-action=\"vm.salvandoItem\" ok-action=\"vm.salvarItem\" delete-action=\"vm.deletarItem\" icone-titulo=\"'list'\" titulo=\"'  '\"></modal-content>"
  );


  $templateCache.put('app/op/html/list.html',
    "<meta charset=\"UTF-8\"><vertical-space></vertical-space><div ng-controller=\"stControl\"><div class=\"col-lg-6\"><st-filter-map filter-map-instace=\"filterMapInstance\" busca-especial=\"buscaEspecial\" filtros=\"[\r" +
    "\n" +
    "	 	        \r" +
    "\n" +
    "	 	        {attr:'atrr',placeholder:'Buscar pelo ...'},\r" +
    "\n" +
    "	 	        {attr:'attr',placeholder:'Buscar pela ...'}\r" +
    "\n" +
    "				\r" +
    "\n" +
    "				]\r" +
    "\n" +
    "				\"></st-filter-map></div><vertical-space class=\"only-desktop\"></vertical-space><vertical-space class=\"only-desktop\"></vertical-space><div class=\"col-lg-4 only-desktop\"><button ng-click=\"openItem()\" class=\"btn btn-default\"><i class=\"fa fa-plus\"></i> <strong>Cadastrar</strong></button></div><button-add ng-click=\"openItem()\"></button-add><vertical-space></vertical-space><vertical-space></vertical-space><div ng-repeat=\"ob in objetos\" class=\"col-lg-4 generic-transition\"><card-list index=\"{{$index}}\" ob=\"ob\" pivo=\"''\" edit-function=\"openItem\" delete-function=\"deletarItem\"></card-list></div><div ng-if=\"objetos.length==0\" class=\"col-lg-12\"><st-no-itens label=\"'Nenhum item econtrado.'\"></st-no-itens></div><vertical-space></vertical-space><st-pagination filter-map-instance=\"filterMapInstance\"></st-pagination></div>"
  );


  $templateCache.put('app/request/html/requestDetalhe.html',
    "<meta charset=\"UTF-8\"><form ng-cloak class=\"st-detalhe-content\"><md-toolbar><div class=\"md-toolbar-tools\"><h2 md-truncate>{{$requestDetalheCtrl.data.item.descricao || 'Requisição'}}</h2><span flex></span><md-button class=\"st-detallhe-cancel-button md-icon-button\" ng-click=\"$requestDetalheCtrl.data.cancelFunction()\"><ng-md-icon icon=\"close\"></ng-md-icon></md-button></div></md-toolbar><md-dialog-content><div class=\"md-dialog-content\"><md-content><md-card><md-card-content layout=\"row\" layout-wrap><div layout=\"row\" flex=\"100\"><st-input-string flex=\"100\" label=\"Descrição da requisição\" ng-model=\"$requestDetalheCtrl.data.item.descricao\"></st-input-string><span flex></span></div><md-input-container flex=\"30\"><label>Tipo</label><md-select ng-model=\"$requestDetalheCtrl.data.item.tipo\"><md-option ng-value=\"'GET'\">GET</md-option><md-option ng-value=\"'POST'\">POST</md-option></md-select></md-input-container><md-divider></md-divider><st-input-string flex=\"30\" label=\"URL Base (Ex: localhost:8080/Protosaat/)\" ng-model=\"$requestDetalheCtrl.data.item.urlBase\"></st-input-string><md-divider></md-divider><st-input-string flex=\"30\" label=\"URL \" ng-model=\"$requestDetalheCtrl.data.item.url\"></st-input-string><md-input-container flex=\"100\"><label>Parametros</label><st-string-chip placeholder=\"Inserir parametro.\" ng-model=\"$requestDetalheCtrl.data.item.parametros\"></st-string-chip></md-input-container><div flex=\"45\"><p>Body (Formato JSON)</p><textarea ui-codemirror=\"{\r" +
    "\n" +
    "					      lineNumbers: true,\r" +
    "\n" +
    "					\r" +
    "\n" +
    "					      mode: 'xml',\r" +
    "\n" +
    "					     \r" +
    "\n" +
    "					    }\" ng-model=\"$requestDetalheCtrl.data.item.body\">\r" +
    "\n" +
    "				    </textarea></div><div flex=\"50\"><p>Resposta</p><md-card><md-card-content><json-tree ng-if=\"$requestDetalheCtrl.data.response\" object=\"$requestDetalheCtrl.data.response\" start-expanded=\"true\" root-name=\"'Response'\"></json-tree></md-card-content></md-card></div></md-card-content></md-card></md-content></div></md-dialog-content><md-dialog-actions layout=\"row\"><md-button class=\"md-raised md-warn st-detalhe-delete-button\" ng-if=\"$requestDetalheCtrl.data.item.id\" confirm ng-disabled=\"$requestDetalheCtrl.data.loading==true\" ng-click=\"$requestDetalheCtrl.data.deleteFunction($requestDetalheCtrl.data.item)\"><ng-md-icon icon=\"delete\"></ng-md-icon>Deletar</md-button><md-button class=\"md-raised md-accent st-detalhe-save-button\" ng-disabled=\"$requestDetalheCtrl.data.loading==true\" ng-click=\"$requestDetalheCtrl.executar($requestDetalheCtrl.data.item)\"><ng-md-icon icon=\"send\"></ng-md-icon>Executar</md-button><md-button class=\"md-raised md-primary st-detalhe-save-button\" ng-disabled=\"$requestDetalheCtrl.data.loading==true\" ng-click=\"$requestDetalheCtrl.data.saveFunction($requestDetalheCtrl.data.item)\"><ng-md-icon icon=\"check_circle\"></ng-md-icon>Salvar</md-button></md-dialog-actions></form>"
  );


  $templateCache.put('app/request/html/requestForm.html',
    "<meta charset=\"UTF-8\"><md-content><md-card><md-card-content layout=\"row\" layout-wrap><div layout=\"row\" flex=\"100\"><h2><ng-md-icon md-colors=\"{color: 'green'}\" icon=\"compare_arrows\"></ng-md-icon>Teste de requisição</h2><span flex></span><md-button class=\"md-raised md-primary\"><ng-md-icon icon=\"send\"></ng-md-icon>Executar</md-button></div><md-input-container flex=\"30\"><label>Tipo</label><md-select ng-model=\"someModel\"><md-option ng-value=\"'get'\">GET</md-option><md-option ng-value=\"'post'\">POST</md-option></md-select></md-input-container><md-divider></md-divider><st-input-string flex=\"30\" label=\"URL Base (Ex: localhost:8080/Protosaat/)\" ng-model=\"url\"></st-input-string><md-divider></md-divider><st-input-string flex=\"30\" label=\"URL \" ng-model=\"url\"></st-input-string><md-input-container flex=\"100\"><label>Parametros</label><st-string-chip placeholder=\"Inserir parametro.\" ng-model=\"$metaDetalheCtrl.data.item.evidencias\"></st-string-chip></md-input-container><div flex=\"45\"><p>Body (Formato JSON)</p><textarea ui-codemirror=\"{\r" +
    "\n" +
    "					      lineNumbers: true,\r" +
    "\n" +
    "					\r" +
    "\n" +
    "					      mode: 'xml',\r" +
    "\n" +
    "					     \r" +
    "\n" +
    "					    }\" ng-model=\"asdas\">\r" +
    "\n" +
    "				    </textarea></div><div flex=\"50\"><p>Resposta</p><md-card><md-card-content></md-card-content></md-card></div></md-card-content></md-card></md-content>"
  );


  $templateCache.put('app/request/html/requestGridView.html',
    "<meta charset=\"UTF-8\"><div layout=\"row\" layout-wrap flex><div flex=\"25\" flex-xs=\"100\" flex-sm=\"50\" ng-repeat=\"item in $requestListCtrl.data.objetos\"><st-grid-item icon=\"list\" item=\"item\" label=\"{{item.descricao}}\" delete-function=\"$requestListCtrl.data.deleteFunction([item.id])\" open-detail=\"$requestListCtrl.data.openDetail(item)\"></st-grid-item></div></div>"
  );


  $templateCache.put('app/request/html/requestList.html',
    "<meta charset=\"UTF-8\"><md-card style=\"padding-top: 15px\"><md-toolbar class=\"md-table-toolbar md-default\"><div layout=\"row\" class=\"md-toolbar-tools\" layout-wrap><div flex=\"20\" hide-xs md-hide-xs><md-button class=\"add-button md-raised\" ng-click=\"$requestListCtrl.data.openDetail()\" class=\"md-raised\">Cadastrar</md-button></div><st-filter flex-xs=\"80\" flex=\"60\" query-options=\"$requestListCtrl.data.requestListParams\" get-list=\"$requestListCtrl.data.getList\" filtros=\"$requestListCtrl.data.filtros\"></st-filter><view-chose flex=\"10\" view-type=\"config.confs.viewType\"></view-chose></div></md-toolbar></md-card><float-button-add class=\"float-add-button\" tooltip-label=\"Cadastrar novo request\" ng-click=\"$requestListCtrl.data.openDetail()\"></float-button-add><div layout=\"row\" style=\"margin:8px\"><md-progress-linear flex ng-if=\"$requestListCtrl.data.loading===true\" md-mode=\"indeterminate\"></md-progress-linear></div><st-selected-items-actions delete-function=\"$requestListCtrl.data.deleteFunction($requestListCtrl.data.getSelectedItemsIds())\" selected-items=\"$requestListCtrl.data.selectedItems\"></st-selected-items-actions><request-grid-view ng-show=\"config.confs.viewType=='grid'\"></request-grid-view><request-table-view ng-show=\"config.confs.viewType=='table'\"></request-table-view><div ng-if=\"$requestListCtrl.data.objetos.length==0\"><p class=\"text-muted\">Nenhum item encontrado</p></div><st-filter-pagination total-itens=\"$requestListCtrl.data.totalItens\" itens-in-page=\"$requestListCtrl.data.objetos.length\" get-list=\"$requestListCtrl.data.getList\" query-options=\"$requestListCtrl.data.requestListParams\"></st-filter-pagination>"
  );


  $templateCache.put('app/request/html/requestTableView.html',
    "<meta charset=\"UTF-8\"><st-table columns=\"$requestListCtrl.data.tableColumns\" open-detail=\"$requestListCtrl.data.openDetail\" order-by=\"$requestListCtrl.data.orderBy\" delete-function=\"$requestListCtrl.data.deleteFunction\" selected-items=\"$requestListCtrl.data.selectedItems\" items=\"$requestListCtrl.data.objetos\" edit-column=\"$requestListCtrl.data.editColumn\"></st-table>"
  );


  $templateCache.put('app/teste/html/detalhe.html',
    "<!-- \r" +
    "\n" +
    "---- Detalhamento do objeto \"teste\" ----\r" +
    "\n" +
    "Neste escopo o objeto é controlado atravésde vm.item\r" +
    "\n" +
    " --><meta charset=\"UTF-8\"><modal-content item=\"vm.item\" modal-instance=\"this\" loading-ok-action=\"vm.salvandoItem\" ok-action=\"vm.salvarItem\" delete-action=\"vm.deletarItem\" icone-titulo=\"'list'\" titulo=\"'  '\"><teste-form item=\"vm.item\"></teste-form></modal-content>"
  );


  $templateCache.put('app/teste/html/form.html',
    "<meta charset=\"UTF-8\"><!-- \r" +
    "\n" +
    "Exemplos\r" +
    "\n" +
    "<input-check class=\"col-lg-3\" ng-true-value=\"true\" ng-false-value=\"false\" class=\"col-lg-3\" label=\"Titulo\" ng-model=\"vm.item.attrCheck\"></input-check>\r" +
    "\n" +
    "<input-double class=\"col-lg-3\" label=\"Valor\" ng-model=\"vm.item.attrDouble\" ></input-double>\r" +
    "\n" +
    "<input-date class=\"col-lg-3\" label=\"Data\" ng-model=\"vm.item.data\" ></input-date>\r" +
    "\n" +
    "<input-string class=\"col-lg-3\" label=\"Digite o nome\" ng-model=\"vm.item.nome\" ></input-string>\r" +
    "\n" +
    "<input-int class=\"col-lg-3\" label=\"Quantidade\" ng-model=\"vm.item.quantidade\" ></input-int>\r" +
    "\n" +
    "-->"
  );


  $templateCache.put('app/teste/html/gridView.html',
    "<meta charset=\"UTF-8\"><div ng-repeat=\"ob in vm.objetos\" class=\"col-lg-4 generic-transition\"><card-list index=\"{{$index}}\" ob=\"ob\" pivo=\"''\" edit-function=\"vm.editFunction\" delete-function=\"vm.deleteFunction\"></card-list></div>"
  );


  $templateCache.put('app/teste/html/list.html',
    "<meta charset=\"UTF-8\"><vertical-space></vertical-space><div ng-controller=\"stControl\"><div class=\"col-lg-6\"><st-filter-map filter-map-instace=\"filterMapInstance\" busca-especial=\"buscaEspecial\" filtros=\"[\r" +
    "\n" +
    "	 	        \r" +
    "\n" +
    "	 	        {attr:'_string.nome',placeholder:'Buscar pelo ...'},\r" +
    "\n" +
    "	 	        {attr:'_string.endereco',placeholder:'Buscar pelo ....'}\r" +
    "\n" +
    "				\r" +
    "\n" +
    "				]\r" +
    "\n" +
    "				\"></st-filter-map></div><view-chose class=\"col-lg-2\" view-type=\"config.confs.viewType\"></view-chose><vertical-space class=\"only-desktop\"></vertical-space><vertical-space class=\"only-desktop\"></vertical-space><div class=\"col-lg-4 only-desktop\"><button ng-click=\"vm.openItem()\" class=\"btn btn-default\"><i class=\"fa fa-plus\"></i> <strong>Cadastrar</strong></button></div><button-add ng-click=\"vm.openItem()\"></button-add><vertical-space></vertical-space><vertical-space></vertical-space><teste-grid-view ng-if=\"config.confs.viewType=='grid'\" class=\"generic-transition\" objetos=\"objetos\" edit-function=\"vm.openItem\" delete-function=\"vm.deletarItem\"></teste-grid-view><teste-table-view ng-if=\"config.confs.viewType=='table' && objetos.length>0\" class=\"col-lg-12 generic-transition\" objetos=\"objetos\" edit-function=\"vm.openItem\" delete-function=\"vm.deletarItem\"></teste-table-view><div ng-if=\"objetos.length==0\" class=\"col-lg-12\"><st-no-itens label=\"'Nenhum item econtrado.'\"></st-no-itens></div><vertical-space></vertical-space><st-pagination filter-map-instance=\"filterMapInstance\"></st-pagination></div>"
  );


  $templateCache.put('app/teste/html/tableView.html',
    "<meta charset=\"UTF-8\"><panel><table class=\"table table-hover\"><thead><tr><th></th></tr></thead><tbody><tr ng-repeat=\"ob in vm.objetos\" class=\"generic-transition\"><!-- <td>{{ob._string.}}</td> --><td><crud-tools ob=\"ob\" delete-function=\"vm.deleteFunction\" edit-function=\"vm.editFunction\"></crud-tools></td></tr></tbody></table></panel>"
  );

}]);

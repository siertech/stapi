(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simditor-i18n', ["jquery","simditor"], function (a0,b1) {
      return (root['Simditor.i18n'] = factory(a0,b1));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simditor"));
  } else {
    root['Simditor.i18n'] = factory(root["jQuery"],root["Simditor"]);
  }
}(this, function ($, Simditor) {

Simditor.i18n['pt-BR'] = {
  'blockquote': 'Bloco de citação',
  'bold': 'Negrito',
  'code': 'Código',
  'color': 'Cor do Texto',
  'coloredText': 'Texto Colorido',
  'hr': 'Linha Horizontal',
  'image': 'Inserir Imagem',
  'externalImage': 'Imagem Externa',
  'uploadImage': 'Upload Imagem',
  'uploadFailed': 'Upload Falhou',
  'uploadError': 'Error ocorreu durante Upload',
  'imageUrl': 'Url',
  'imageSize': 'Tamanho',
  'imageAlt': 'Alt',
  'restoreImageSize': 'Tamanho original',
  'uploading': 'Uploading',
  'indent': 'Indentar',
  'outdent': 'Outdent',
  'italic': 'Italic',
  'link': 'Inserir link',
  'linkText': 'Texto',
  'linkUrl': 'Url',
  'linkTarget': 'Target',
  'openLinkInCurrentWindow': 'Abrir link na janela atual',
  'openLinkInNewWindow': 'Abrir link em uma nova janela',
  'removeLink': 'Remover link',
  'ol': 'Lista ordenada',
  'ul': 'Lista não ordenada',
  'strikethrough': 'Tachado',
  'table': 'Tabela',
  'deleteRow': 'Remover linha',
  'insertRowAbove': 'Inserir linha acima',
  'insertRowBelow': 'Inserir linha abaixo',
  'deleteColumn': 'Remover coluna',
  'insertColumnLeft': 'Inserir coluna a esquerda',
  'insertColumnRight': 'Inserir coluna a direita',
  'deleteTable': 'Remover tabela',
  'title': 'Titulo',
  'normalText': 'Texto',
  'underline': 'Sublinhado',
  'alignment': 'Alinhamento',
  'alignCenter': 'Alinha ao centro',
  'alignLeft': 'Alinha a esquerda',
  'alignRight': 'Alinha a direita',
  'alignJustify': 'Justificar',
  'selectLanguage': 'Selecionar linguagem',
  'fontScale': 'Tamnaho da fonte',
  'fontScaleXLarge': 'X Tamanho grande',
  'fontScaleLarge': 'Tamanho grande',
  'fontScaleNormal': 'Tamanho normal',
  'fontScaleSmall': 'Tamanho pequeno',
  'fontScaleXSmall': 'X Tamanho pequeno'
};

return Simditor.i18n;

}));

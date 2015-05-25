/**
 * @namespace Tolomeo
 */
Ext.namespace('Tolomeo');

/**
 * @namespace TolomeoExt.Composer
 */
Ext.namespace('TolomeoExt.Composer');

/*
Ext.namespace('TolomeoExt.Vars');
TolomeoExt.Vars.TOLOMEOServer = 'http://dvptolomeo.comune.prato.it';
TolomeoExt.Vars.TOLOMEOStaticRoot = "/";
TolomeoExt.Vars.TOLOMEOContext = '/tolomeobinj';
*/

/**
* @member TolomeoExt.Vars
* @property {String} [TOLOMEOMapServerCGI]
* URL del servizio per la restituzione mappe 
*/
// TolomeoExt.Vars.TOLOMEOMapServerCGI = TolomeoExt.Vars.TOLOMEOServer + '/cgi-bin/mapserv';
/**
* @member TolomeoExt.Vars
* @property {String} [TOLOMEOMapRepository]
* Percorso delle mappe
*/
// TolomeoExt.Vars.TOLOMEOMapRepository = '/usr1/test/vh/tolomeo/mapfiles';

/**
* @namespace Tolomeo
*/


/**
* @member Tolomeo
* @property {String} [Server]
* URL del server Tolomeo
*/
Tolomeo.Server = TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOContext;
/**
* @member Tolomeo
* @property {String} XsdServlet
* Percorso della servlet per la navigazione dello schema XSD dei preset  
*/
Tolomeo.XsdServlet = Tolomeo.Server + '/XsdServlet';
/**
* @member Tolomeo
* @property {String} [XsdValidation]
* Percorso della servlet per la validazione dei preset
*/
Tolomeo.XsdValidation = Tolomeo.Server + '/XsdValidation';
/**
* @member Tolomeo
* @property {String} [TolomeoTPNServlet]
* Percorso della servlet per la lista dei codici TPN disponibili
*/
Tolomeo.TolomeoTPNServlet = Tolomeo.Server + '/TolomeoTPNServlet';
/**
* @member Tolomeo
* @property {String} [TolomeoParamsJSServlet]
* Percorso della servlet per la generazione della rappresentazione JSON di un preset
*/
//Tolomeo.TolomeoParamsJSServlet = Tolomeo.Server + '/TolomeoParamsJSServlet';
Tolomeo.TolomeoParamsJSServlet = Tolomeo.Server + '/ToloExtParamsJSServlet';

/**
* @member Tolomeo
* @property {String} [ExportFileServlet]
* Percorso della servlet per lo scaricamento di un file sul server
*/
Tolomeo.ExportFileServlet = Tolomeo.Server + '/ExportFileServlet';
/**
* @member Tolomeo
* @property {String} [ImportFileServlet]
* Percorso della servlet per il caricamento di un file sul server
*/
Tolomeo.ImportFileServlet = Tolomeo.Server + '/ImportFileServlet';
/**
* @member Tolomeo
* @property {String} [ParametersXSD]
* Percorso dello schema XSD dei preset
*/
//TolomeoExt.Vars.TOLOMEOServer +
Tolomeo.ParametersXSD = Tolomeo.Server + '/tolomeoparametri.xsd';

// Server di DEPLOY che per adesso sta in Tolomeo.
//Tolomeo.DeployServer = TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOContext;
Tolomeo.DeployServer = 'http://192.168.100.18:8080/TolomeoApplicationDeployProxy-0.1.0';

/**
* @member Tolomeo
* @property {String} ServerListServlet
* Percorso della servlet per la lista dei server del Deployer
*/
Tolomeo.ServerListServlet = Tolomeo.DeployServer + '/ServerListServlet';
/**
* @member Tolomeo
* @property {String} ProxyServlet
* Percorso della servlet del proxy del Deployer
*/
Tolomeo.ProxyServlet = Tolomeo.DeployServer + '/ProxyServlet';

Tolomeo.StaticServer = TolomeoExt.Vars.TOLOMEOServer;

TolomeoExt.Composer.StaticRoot = TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'js/tolomeoExt/composer/';

/**
* @member Tolomeo
* @property {String} [JS_PATHS]
* Percorsi dei sorgenti JS
*/
TolomeoExt.Composer.JS_PATHS = new Array();

TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Container.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Viewport.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Panel.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Border.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'HBox.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'VBox.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Tab.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TabPanel.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Toolbar.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Accordion.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Button.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'ListView.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'PropertyGrid.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TolomeoMap.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TolomeoToolbar.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TolomeoTOCPanel.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TolomeoButtonTOCPanel.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TolomeoTreeTOCPanel.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TolomeoSearchPanel.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TolomeoInternetLayout.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TolomeoIntranetLayout.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TolomeoIntranetTabLayout.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'TolomeoStreetGuideLayout.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'js/tolomeoExt/layout/ToloPanelInter.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'js/tolomeoExt/layout/ToloPanelIntra.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'js/tolomeoExt/layout/ToloPanelIntraTab.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'js/tolomeoExt/layout/ToloPanelStradario.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Project.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'CrossDomainRequest.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'LoadProjectDialog.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'SaveDialog.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Composer.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Preview.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Deployer.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Editor/3p_lib/headjs/head.min.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Editor/TolomeoTreeView.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Editor/xmleditor.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Editor/3p_lib/codemirror/lib/codemirror.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Editor/3p_lib/codemirror/mode/xml/foldcode.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Editor/3p_lib/codemirror/mode/xml/xml.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Editor/xmleditor_util.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Editor/filesave/SaveFileDialog.js');
TolomeoExt.Composer.JS_PATHS.push(TolomeoExt.Composer.StaticRoot + 'Editor/fileupload/UploadFileDialog.js');
Tolomeo.onReady = function(handler) {
	Ext.Loader.load(TolomeoExt.Composer.JS_PATHS, handler, null, true);
}

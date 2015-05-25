/**
* Contenitore di tipo "Anteprima".
* Questo contenitore consente la visualizzazione dell'anteprima di un'applicazione Tolomeo.
* Richiede la definizione del file XML di un preset e la definizione del progetto di un layout.
* @xtype tolomeo_preview
*/
Tolomeo.Preview = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.Preview
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.Preview.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.Preview
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'preview_' + Tolomeo.Preview.id_count;
		Tolomeo.Preview.id_count ++;
		/**
		* @cfg
		* @member Tolomeo.Preview
		* Titolo del pannello associato all'oggetto.
		*/
		this.title = 'Preview';
		this.iconCls = 'preview';
		this.layout = 'border';
		this.add(new Tolomeo.Toolbar(
			{
				itemId: 'tools-bar',
				region: 'north',
				height: 42,
				margins: '5 5 5 5',
				items: [
					{
	        			xtype: 'button',
	        			button_id: 'save-preview',
	        			scale: 'large',
	        			iconAlign: 'top',
	        			iconCls: 'save-preview',
	        			tooltip: 'Salva Anteprima'
					}
	        	]
			}
		));
		this.add(new Tolomeo.Panel(
			{
				itemId: 'preview',
				region: 'center'
			}
		));
		/**
		* @cfg
		* @member Tolomeo.Preview
		* Pannello della barra degli strumenti.
		*/
		this.tools_bar = this.getComponent('tools-bar');
		/**
		* @cfg
		* @member Tolomeo.Preview
		* Pannello dell'anteprima.
		*/
		this.preview = this.getComponent('preview');
		/**
		* @cfg
		* @member Tolomeo.Preview
		* Preset dell'anteprima.
		*/
		this.preset = null;
		/**
		* @cfg
		* @member Tolomeo.Preview
		* Progetto dell'anteprima.
		*/
		this.project = null;
		this.tools_bar.getButton('save-preview').on('click', this.savePreview, this);
	},
	/**
	* @method
	* @member Tolomeo.Preview
	* Richiede la rappresentazione JSON di un preset data la sua rappresentazione XML e il suo nome.
	* @param {String} preset_XML Rappresentazione XML del preset.
	* @param {String} preset_name Nome del preset.
	* @param {Object} handler Funzione da richiamare in caso di successo.
	*/
	requestPreset: function(preset_XML, preset_name, handler) {
		var request = new CrossDomainRequest(Tolomeo.TolomeoParamsJSServlet, 'POST');
		// request.addParameter('MapServerCGI', TolomeoExt.Vars.TOLOMEOMapServerCGI);
		// request.addParameter('MapRepository', TolomeoExt.Vars.TOLOMEOMapRepository);
		// request.addParameter('PresetXML', preset_XML);
		// request.addParameter('PresetName', preset_name);
		
		request.addParameter('paramPresetString', preset_XML);
		request.addParameter('presetName', preset_name);
		request.addParameter('ajaxCall', 'true');
		
		request.onSuccess = function(response) {
			handler(Ext.util.JSON.decode(response.responseText));
		};
		request.onFailure = function(response) {
			handler(null);
		};
		request.send();
	},
	/**
	* @method
	* @member Tolomeo.Preview
	* Imposta il preset dell'anteprima.
	* @param {Object} handler Preset dell'anteprima.
	*/
	setPreset: function(preset) {
		this.preset = preset;
	},
	/**
	* @method
	* @member Tolomeo.Preview
	* Imposta il progetto dell'anteprima.
	* @param {Object} handler Progetto dell'anteprima.
	*/
	setProject: function(project) {
		this.project = project;
		this.preview.removeAll(true);
		this.preview.add(this.project);
	},
	/**
	* @method
	* @member Tolomeo.Preview
	* Salva l'anteprima in formato HTML.
	*/
	savePreview: function() {
		var HTML = "";
		HTML += '<html>\n';
		HTML += '\t<head>\n';
		HTML += '\t\t<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n'; 
		HTML += '\t\t<title>' + this.project.title + '</title>\n';
		HTML += '\t\t<link rel="stylesheet" type="text/css" href="' + TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'js/ext/extJS/resources/css/ext-all.css" />\n';
		HTML += '\t\t<link rel="stylesheet" type="text/css" href="' + TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'css/toloExt-intra.css" />\n';
		HTML += '\t\t<script type="text/javascript" charset="utf-8" src="' + TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'js/tolomeoExt/build/toloExt-all.js"></script>\n';
		HTML += '\t\t<script type="text/javascript" charset="utf-8">\n';
		HTML += '\t\t\tExt.namespace(\'TolomeoExt.Vars\');\n';
		HTML += '\t\t\tTolomeoExt.Vars.TOLOMEOServer = \'' + TolomeoExt.Vars.TOLOMEOServer + '\';\n';
		HTML += '\t\t\tTolomeoExt.Vars.TOLOMEOContext = \'' + TolomeoExt.Vars.TOLOMEOContext + '\';\n';
		HTML += '\t\t\tTolomeoExt.Vars.TOLOMEOStaticRoot = \'' + TolomeoExt.Vars.TOLOMEOStaticRoot + '\';\n';
		HTML += '\t\t</script>\n';
		HTML += '\t\t<script type="text/javascript" charset="utf-8" src="' + TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'js/tolomeoExt/composer/Tolomeo.js"></script>\n';
		HTML += '\t\t<script type="text/javascript" charset="utf-8">\n';							
		HTML += '\t\t\tTolomeoExt.Composer.presetXML = Ext.fly("presetXML").dom.value;\n';
		HTML += '\t\t\tExt.onReady(function() {\n';
		HTML += '\t\t\t\tTolomeo.onReady(function() {\n';
		HTML += '\t\t\t\t\tTolomeoExt.Vars.paramsJS = new ToloParamsJS(' + Ext.util.JSON.encode(this.preset) + ');\n';
		var project_JSON = this.project.getJSON();
		project_JSON = project_JSON.replace(/\t\"id\":\s.*\n/g, '');
		HTML += '\t\t\t\t\tvar project = new Tolomeo.Project(' + project_JSON + ');\n';
		HTML += '\t\t\t\t\tproject.buildTolomeoAPI();\n';
		HTML += '\t\t\t\t\tnew Tolomeo.Viewport(\n';
		HTML += '\t\t\t\t\t\t{\n';
		HTML += '\t\t\t\t\t\t\tlayout: \'fit\',\n';
		HTML += '\t\t\t\t\t\t\titems: [\n';
		HTML += '\t\t\t\t\t\t\t\tproject\n';
		HTML += '\t\t\t\t\t\t\t]\n';
		HTML += '\t\t\t\t\t\t}\n';
		HTML += '\t\t\t\t\t);\n';
		HTML += '\t\t\t\t});\n';
		HTML += '\t\t\t});\n';
		HTML += '\t\t</script>\n';
		HTML += '\t</head>\n';
		HTML += '\t<body oncontextmenu="return false;">\n';
		HTML += '\t\t<form id="presetForm" style="display:none">\n';
		HTML += '\t\t\t<textarea id="presetXML">\n';
		HTML += TolomeoExt.Composer.presetXML;
		HTML += '\t\t\t</textarea>\n';
		HTML += '\t\t</form>\n';
		HTML += '\t</body>\n';
		HTML += '</html>\n';
		HTML = Ext.util.Format.htmlEncode(HTML);
		var save_dialog = new Tolomeo.SaveDialog(Tolomeo.ExportFileServlet, HTML, this.project.title, 'html');
		save_dialog.show();
	}
}); 
/**
* @member Tolomeo.Preview
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Preview.
* @static
*/    
Tolomeo.Preview.id_count = 0;
Ext.reg('tolomeo_preview', Tolomeo.Preview);

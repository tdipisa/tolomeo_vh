/** 
* Estensione del TabPanel
* Questo componente consente di gestire l'editing di file in formato xml tramite l'ausilio di uno schema di definizione xsd.
*/
Ext.namespace('tolomeo', 'tolomeo.editor');

tolomeo.editor._RELATIVE_PATH_ROOT="./js/Tolomeo/Editor";

tolomeo.XmlEditorPanel = Ext.extend(Ext.TabPanel,{
	/**
	* @cfg 
	* @member tolomeo.XmlEditorPanel
	*/	
	scope: this,
	/**
	* @cfg  
	* @member tolomeo.XmlEditorPanel
	* nome assegnato al div per la crezione dell'oggetto di editing del codice xml
	*/	
	renderTxt: 'content',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel 
	* classe icone
	*/	
	iconCls: 'editor',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* titolo
	*/
	title: 'Editor',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* tab attivo all'avvio
	*/
	activeTab: 0,
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* variabile contente l'oggetto editor
	*/
	textEditor: null,
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	*/
	foldFunc: null,
	/**
	* @cfg 
	* @member tolomeo.XmlEditorPanel 
	* Variabile per salvataggio posizione ricerca
	*/
	lastPos: null,
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Variabile per salvataggio parola ricerca
	*/
	lastQuery: null,
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Variabile per salvataggio parole trovate
	*/
	marked: [],
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	*  Stile di default
	*/
	theme: 'rubyblue',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Url di default servlet salvataggio
	*/
	url_save_xml: 'ExportFileServlet',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Url di default servlet di caricamento xml
	*/
	url_load_xml: 'ImportFileServlet',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Url di default servlet di richieste xsd
	*/	
	url_xsd: 'XsdServlet',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Url di default servlet di validazione
	*/	
	url_xsd_validation: 'XsdValidation',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Schema xsd di default
	*/	
	tolomeo_schema: '',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Schema language di default
	*/
	schema_language: 'http://www.w3.org/2001/XMLSchema',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Array con l'associazione codici e servlet da invocare
	*/
	codiciServlet: '',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Pefisso di default per id della sezione di dettaglio del nodo
	*/
	renderNodeDetail: 'detail',
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	* Listeners associati ai tab di editor
	*/
	listeners: {
		tabchange: function(tp,newTab){
			if(newTab == this.items.itemAt(1)){
				if(this.textEditor==null){
					var obj_xml = document.getElementById("txt_"+this.renderTxt);
					this.textEditor = CodeMirror.fromTextArea(obj_xml, {
						mode: {name: "xml", htmlMode: false},
						lineNumbers: true,
						lineWrapping: true,
						onGutterClick: this.foldFunc,
						onChange: function(from, to, text, next) {
							tolomeo.editor.globalConfig.textEditor=from.getValue();
							//Setto a da modificato l'editing del tree view
							tolomeo.editor.globalConfig.isModified=true;
							//Setto a da validare l'editing del tree view
							tolomeo.editor.globalConfig.isValidated=false;
						}
						//onKeyEvent: keyEvent
					});
					this.textEditor.setOption("theme", this.theme);
				}

				if (tolomeo.editor.globalConfig.isModified==true){
					tolomeo.editor.globalConfig.nodeSelected=null;
					tolomeo.editor.globalConfig.editor.treeView.setNodeDetailUI();
					var rootNode = this.items.itemAt(0).items.items[0].root;
					var xml = this.getXml(rootNode,0);
					this.textEditor.setValue(xml);
					//tolomeo.editor.globalConfig.textEditor=this.textEditor.getValue();
				}
			}else{
				if(this.textEditor!=null){
					var panelRef =this;
					var textEditorContent = this.textEditor.getValue();
					if (tolomeo.editor.globalConfig.isModified==true){
						var xmlstr=Ext.util.Format.htmlDecode(textEditorContent);
						//Controllo se non viene passata la parserizzazione del testo xml ripristino
						if (this.loadXml(xmlstr)==false){
							Ext.Msg.show({
								title:'Xml parser',
								msg: "Errore di parserizzazione xml.\n Premendo 'Yes' le modifiche apportate all'xml verrano perse.\n Continuare?",
								buttons: Ext.Msg.YESNO,
								icon: Ext.MessageBox.ERROR,
								fn: function(btn, text){
									if (btn == 'no'){
										tolomeo.editor.globalConfig.isModified=false;
										panelRef.setActiveTab(panelRef.items.itemAt(1));
									}else{
										tolomeo.editor.globalConfig.isModified=true;
									}
								}
							});
						}else{
							//tolomeo.editor.globalConfig.textEditor=this.textEditor.getValue();
							var rootNode = this.items.itemAt(0).items.items[0].root;
							this.popoulateTreeNodeXsd(tolomeo.editor.globalConfig.editor.treeView,rootNode);
						}
					}
				}else{
					//Inzializzazione root
					this.ajaxRequestRoot("/", this);
					tolomeo.editor.globalConfig.isModified=true;
					return;
				}
			}
			tolomeo.editor.globalConfig.isModified=false;
		}	
	},
	/**
	* @cfg
	* @member tolomeo.XmlEditorPanel
	*/
	switchTab: function(res) {
		if (res){
			tolomeo.editor.globalConfig.isModified=false;
			this.setActiveTab(this.items.itemAt(1));
		}
	},
	/**
	* @constructor
	* @member tolomeo.XmlEditorPanel
	* Costruttore.
	* @param {Object} [configuration] Configuratione iniziale.
	*/
	initComponent: function() {
		tolomeo.editor.editorConfig = XsdConfigEditor;
		tolomeo.editor.editorConfig.url_xsd=this.url_xsd;
		tolomeo.editor.editorConfig.tolomeo_schema=this.tolomeo_schema;
		tolomeo.editor.editorConfig.schema_language=this.schema_language;
		tolomeo.editor.editorConfig.url_xsd_validation=this.url_xsd_validation;
		tolomeo.editor.editorConfig.url_save_xml = this.url_save_xml;
		tolomeo.editor.editorConfig.url_load_xml = this.url_load_xml;
		tolomeo.editor.editorConfig.codiciServlet = Ext.util.JSON.decode(this.codiciServlet) ;
		tolomeo.editor.editorConfig.renderNodeDetail=this.renderNodeDetail
		tolomeo.editor.globalConfig = XsdGlobalEditor;
		tolomeo.editor.menuConfig = MenuGlobalEditor;

		Ext.applyIf(this, {
			scope: this,
			parent: this,
			menu: undefined,
			items:[
			       new tolomeo.editor.TolomeoTreeView(),
			       {
			    	   xtype: 'panel',
			    	   layout: 'fit',
			    	   title: 'Source',
			    	   tbar: {
			    		   xtype: 'toolbar',
			    		   items: [
			    		           {
			    		        	   xtype: 'button',
			    		        	   iconCls: 'icon-button-undo',
			    		        	   tooltip: 'undo',
			    		        	   listeners: {
			    		        		   scope: this,
			    		        		   click: function(){
			    		        			   this.textEditor.undo();
			    		        		   }
			    		        	   }
			    		           },{
			    		        	   xtype: 'button',
			    		        	   iconCls: 'icon-button-redo',
			    		        	   tooltip: 'redo',
			    		        	   listeners: {
			    		        		   scope: this,
			    		        		   click: function(){
			    		        			   this.textEditor.redo();
			    		        		   }
			    		        	   }
			    		           },{
			    		        	   xtype: 'tbseparator'
			    		           },{
			    		        	   xtype: 'box',
			    		        	   height: 16,
			    		        	   width: 16,
			    		        	   cls: 'icon-button-search'
			    		           },{
			    		        	   xtype: 'textfield',
			    		        	   listeners: {
			    		        		   scope: this,
			    		        		   specialkey: function(f,e){
			    		        			   if (e.getKey() == e.ENTER) {
			    		        				   this.search(f.getValue());
			    		        			   }
			    		        		   }
			    		        	   }
			    		           },{
			    		        	   xtype: 'button',
			    		        	   iconCls: 'icon-button-save',
			    		        	   tooltip: 'save',
			    		        	   scope: this,
			    		        	   listeners: {
			    		        		   scope: this,
			    		        		   click: function(){
			    		        			   var fileDlg=new tolomeo.editor.SaveFileDialog({textFileName : tolomeo.editor.globalConfig.xmlFileName});
			    		        			   fileDlg.parent=this;
			    		        			   fileDlg.show();
			    		        		   }
			    		        	   }				                        
			    		           },{
			    		        	   xtype: 'button',
			    		        	   iconCls: 'icon-button-load',
			    		        	   tooltip: 'load',
			    		        	   listeners: {
			    		        		   scope: this,
			    		        		   click: function(){
			    		        			   var fileDlg=new tolomeo.editor.UploadFileDialog({url_import_xml:tolomeo.editor.editorConfig.url_load_xml, key:tolomeo.editor.globalConfig.uid});
			    		        			   fileDlg.parent=this;
			    		        			   fileDlg.show();
			    		        		   }
			    		        	   }
			    		           },{
			    		        	   xtype: 'button',
			    		        	   iconCls: 'icon-button-validation',
			    		        	   tooltip: 'validation',
			    		        	   listeners: {
			    		        		   scope: this,
			    		        		   click: function(){
			    		        			   var xml = tolomeo.editor.globalConfig.textEditor;
			    		        			   this.validate(function(jsonResult){
		    		        						switch (jsonResult.status){
		    		        							case 1:
		    		        								Ext.Msg.alert('Xml validation', jsonResult.message);
		    		        								break;
		    		        							case 2:
		    		        								Ext.Msg.show({
		    		        									title:'Xml validation',
		    		        									msg: jsonResult.message,
		    		        									buttons: Ext.Msg.OK,
		    		        									icon: Ext.MessageBox.WARNING
		    		        								});
		    		        								break;
		    		        							case 3:
		    		        								Ext.Msg.show({
		    		        									title:'Xml validation',
		    		        									msg: jsonResult.message,
		    		        									buttons: Ext.Msg.OK,
		    		        									icon: Ext.MessageBox.ERROR
		    		        								});
		    		        								break;
		    		        							default:
		    		        								break;
		    		        						}
			    		        			   });
			    		        		   }
			    		        	   }
			    		           }
			    		           ]
			    	   },
			    	   items:[
			    	          {
			    	        	  html: "<div id='txt_"+this.renderTxt+"'></div>"
			    	          }
			    	          ]
			       },
			       new Tolomeo.Deployer()
			       ],
					/**
					* @method
					* Aggiunge alla cache interna la risposta alla servlet per un elemento specifico
					* @member tolomeo.XmlEditorPanel
					* @param {Object} request - percorso completo dell'oggetto richiesto
					* @param {String} JSONString - stringa jseon da inserire nella cache
					*/
			       addCacheJsonRequest: function (request,JSONString){
			    	   if (JSONString==null || JSONString==""){
			    		   var nullXsd;
			    		   tolomeo.editor.globalConfig.cacheJsonRequest[request]="";
			    		   return;
			    	   }
			    	   JSONString = JSONString.replace(/\n/g,"");
			    	   var JSONObject = Ext.util.JSON.decode(JSONString);

			    	   if (JSONObject.xsd!=undefined){
			    		   JSONObject.xsd = JSONObject.xsd[0];
			    		   var JSONObjectExt = new Array(); 

			    		   for(var el in JSONObject.xsd.childrens){
			    			   if ((JSONObject.xsd.childrens[el].handler!=undefined) && (JSONObject.xsd.childrens[el].text != "")){
			    				   elExt=new Ext.menu.Item();
			    				   Ext.apply(elExt,JSONObject.xsd.childrens[el]);

			    				   var cmd_hdl="elExt.setHandler(" + JSONObject.xsd.childrens[el].handler.replace(/\/'/g,"\\'") + ")";
			    				   eval(cmd_hdl);
			    				   JSONObjectExt.push(elExt);
			    			   }
			    		   }

			    		   JSONObject.xsd.childrens=JSONObjectExt;
			    		   tolomeo.editor.globalConfig.cacheJsonRequest[request]=JSONObject;
			    	   }else{
			    		   //console.log(JSONObject);
			    		   tolomeo.editor.globalConfig.cacheJsonRequest[request]=null;
			    	   }
			       },
					/**
					* @method
					* Funzione per chiamare la servlet in fase di inizializzazione dell'editor
					* @member tolomeo.XmlEditorPanel
					* @param {String} path - percorso completo dell'oggetto richiesto
					* @param {Object} panel - pannello editor
					*/
			       ajaxRequestRoot: function (path, panel) { 
			    	   var req=new CrossDomainRequest(tolomeo.editor.editorConfig.url_xsd, "POST");
			    	   req.addParameter("el", path);
			    	   req.addParameter("schema",tolomeo.editor.editorConfig.tolomeo_schema);
			    	   req.onSuccess=function(response){
			    		   panel.addCacheJsonRequest(path,response.responseText);
			    		   //Inizializzazione nodo root
			    		   var newNode = new Ext.tree.TreeNode({
			    			   text:tolomeo.editor.globalConfig.cacheJsonRequest["/"].text,
			    			   draggable:false,
			    			   allowChildren:false
			    		   });
			    		   panel.items.itemAt(0).items.itemAt(0).setRootNode(newNode);
			    	   }
			    	   req.onFailure=function(response){
			    		   panel.addCacheJsonRequest(path,null);
			    	   }
			    	   req.send();    
			       },
					/**
					* @method
					* Funzione per istanziare l'oggetto xsd
					* @member tolomeo.XmlEditorPanel
					* @param {Object} xsdElement - oggetto xsd da istanziare
					*/			       
			       xsd: function (xsdElement){
			    	   this.xsd=xsdElement
			       },
					/**
					* @method
					* Funzione per validazione testo xml
					* @member tolomeo.XmlEditorPanel
					* @param {String} handler - funzione da eseguire in risposta alla validazione
					*/
			       validate: function(handler){

			    	   if (tolomeo.editor.globalConfig.isValidated==false){
			    		   var validationMask = new Ext.LoadMask(Ext.getBody(),
			    				   {
			    			   msg: "Validazione preset in corso..."
			    				   }
			    		   );
			    		   validationMask.show();
			    		   var req=new CrossDomainRequest(tolomeo.editor.editorConfig.url_xsd_validation, "POST");
			    		   req.addParameter("xmlString", tolomeo.editor.globalConfig.textEditor);
			    		   req.addParameter("xsdFile",tolomeo.editor.editorConfig.tolomeo_schema);
			    		   req.addParameter("xsdLanguage",tolomeo.editor.editorConfig.schema_language);
			    		   req.onSuccess=function(response){
			    			   validationMask.hide();
			    			   tolomeo.editor.globalConfig.isValidated=true;
			    			   tolomeo.editor.globalConfig.validateResponse=Ext.util.JSON.decode(response.responseText);
			    			   handler(tolomeo.editor.globalConfig.validateResponse);
			    		   }
			    		   req.onFailure=function(response){
			    			   validationMask.hide();
			    			   tolomeo.editor.globalConfig.isValidated=false;
			    			   tolomeo.editor.globalConfig.validateResponse = undefined;
			    			   Ext.Msg.show({
			    				   title:'Xml validation',
			    				   msg: 'Xml validation servlet error',
			    				   buttons: Ext.Msg.OK,
			    				   icon: Ext.MessageBox.ERROR
			    			   });
			    		   }
			    		   req.send();					
			    	   }else{
			    		   handler(tolomeo.editor.globalConfig.validateResponse);
			    	   }
			       },		
					/**
					* @method
					* Generazione del treenode tremite una stringa xml
					* @member tolomeo.XmlEditorPanel
					* @param {Object} panel - pannello editor
					* @param {String} XmlEl - stringa xml
					*/
			       treeNodeFromXml: function(panel,XmlEl){
			    	   //	Text is nodeValue to text node, otherwise it's the tag name
			    	   var t = ((XmlEl.nodeType == 3) ? XmlEl.nodeValue : XmlEl.tagName);
			    	   //	No text, no node.
			    	   if (t.replace(/\s/g,'').length == 0){ return null; }
			    	   var result = new Ext.tree.TreeNode({
			    		   text : tolomeo.trim(t),
			    		   allowChildren:false,
			    		   draggable:false
			    	   });
			    	   //	For Elements, process attributes and children
			    	   if (XmlEl.nodeType == 1){
			    		   Ext.each(XmlEl.attributes, function(a){

			    			   a.nodeName = tolomeo.trim(a.nodeName);

			    			   var c = new Ext.tree.TreeNode({
			    				   text: a.nodeName,
			    				   allowChildren:false,
			    				   draggable:false
			    			   });
			    			   c.appendChild(new Ext.tree.TreeNode({
			    				   text: a.nodeValue,
			    				   type: a.nodeValue,
			    				   item: a.nodeValue,
			    				   allowChildren:false,
			    				   draggable:false
			    			   })
			    			   );
			    			   result.appendChild(c);
			    		   });
			    		   Ext.each(XmlEl.childNodes, function(el){
			    			   //Only process Elements and TextNodes
			    			   if ((el.nodeType == 1) || (el.nodeType == 3)){
			    				   var c = panel.treeNodeFromXml(panel,el);
			    				   if (c){
			    					   c.text=tolomeo.trim(c.text);
			    					   result.appendChild(c);
			    				   }
			    			   }
			    		   });
			    	   }
			    	   return result;
			       },
					/**
					* @method
					* Caricamento della finestra di editor
					* @member tolomeo.XmlEditorPanel
					* @param {String} xmlstr - stringa xml
					*/
			       loadXml: function (xmlstr){
			    	   try{
			    		   var docx;
			    		   if (window.ActiveXObject) {         //IE
			    			   docx = new ActiveXObject("Microsoft.XMLDOM");
			    			   docx.async = "false";
			    			   docx.loadXML(xmlstr);
			    		   } else {                             //Mozilla
			    			   docx = new DOMParser().parseFromString(xmlstr, "text/xml");
			    		   }
			    		   try{
			    			   if (this.checkParse(docx)==false){
			    				   return false;
			    			   } 
			    			   if((docx.innerHTML!=undefined) && (docx.innerHTML.indexOf("<parsererror") || docx.documentElement.innerHTML.indexOf("<parsererror"))){
			    				   return false;
			    			   }
			    		   }catch(e){
			    			   alert(e);
			    			   return false;					
			    		   }

			    		   var rnode=this.treeNodeFromXml(this, docx.documentElement || docx);
			    		   this.items.itemAt(0).items.itemAt(0).setRootNode(rnode);	
			    		   //this.items.itemAt(0).items.itemAt(0).root.expanded=true;
			    		   return true;
			    	   } catch(e) {
			    		   alert(e);
			    		   return false;
			    	   }
			       },
					/**
					* @method
					* Ripulisce selezioni nella ricerca stringhe
					* @member tolomeo.XmlEditorPanel
					*/
			       unmark: function(){
			    	   for (var i = 0; i < this.marked.length; ++i) this.marked[i].clear();
			    	   this.marked.length = 0;
			       },
					/**
					* @method
					* Funzione ricerca stringhe
					* @member tolomeo.XmlEditorPanel
					* @param {String} text - testo da cercare
					*/
			       search : function(text) {
			    	   this.unmark();                     
			    	   if (!text) return;
			    	   for (var cursor = this.textEditor.getSearchCursor(text); cursor.findNext();)
			    		   this.marked.push(this.textEditor.markText(cursor.from(), cursor.to(), "searched"));
			    	   if (this.lastQuery != text) this.lastPos = null;
			    	   var cursor = this.textEditor.getSearchCursor(text, this.lastPos || this.textEditor.getCursor());
			    	   if (!cursor.findNext()) {
			    		   cursor = this.textEditor.getSearchCursor(text);
			    		   if (!cursor.findNext()) return;
			    	   }
			    	   this.textEditor.setSelection(cursor.from(), cursor.to());
			    	   this.lastQuery = text; this.lastPos = cursor.to();
			       },
					/**
					* @method
					* Funzione ricorsiva per il popolamento dei nodi dell'albero al passaggio da editor di testo a treeView
					* @member tolomeo.XmlEditorPanel
					* @param {String} text - testo da cercare
					*/
			       popoulateTreeNodeXsd : function(scope, treeNode) {
			    	   if (treeNode.xsd==null){
			    		   var xsdObj=tolomeo.editor.globalConfig.cacheJsonRequest[treeNode.getPath("text")];
			    		   if (xsdObj==null){
			    			   scope.ajaxRequestTreeNode(scope, treeNode)
			    		   }else{
			    			   treeNode.xsd=xsdObj.xsd;
			    			   //imposto la possibilita' per drag and drop dei nodi
			    			   if (treeNode.xsd.maxOccurs>-1){
			    				   treeNode.draggable=false;
			    				   treeNode.allowChildren=false;
			    			   }else{
			    				   treeNode.draggable=true;
			    				   treeNode.allowChildren=false;
			    				   treeNode.parentNode.allowChildren=true;
			    			   }
			    		   }

			    		   for (var i=0; i < treeNode.childNodes.length; i++) {
			    			   this.popoulateTreeNodeXsd(scope,treeNode.childNodes[i]);
			    		   }
			    	   }
			       },
					/**
					* @method
					* Funzione ricorsiva per formattare il codice xml dato un treenode di orgine
					* @member tolomeo.XmlEditorPanel
					* @param {Object} treeNode - nodo iniziale
					* * @param {integer} numTab - numero di tab per la formattazione del testo xml
					*/
			       getXml : function(treeNode, numTab) {
			    	   var xml="";
			    	   if((treeNode.xsd!=undefined) && (treeNode.xsd.isValue=="false")|| (treeNode.parentNode==undefined)){
			    		   xml += "\n" + this.getTabs(numTab) + "<" + treeNode.text+">";
			    		   numTab++;
			    		   for (var i=0; i < treeNode.childNodes.length; i++) {
			    			   xml += this.getXml(treeNode.childNodes[i],numTab);
			    		   }
			    		   numTab--;

			    		   if (xml.substring(xml.length-1,xml.length)==">"){
			    			   xml += "\n" + this.getTabs(numTab) + "</" + treeNode.text+">";	
			    		   }else{
			    			   xml += "</" + treeNode.text+">";	
			    		   }			        					        
			    	   }else{
			    		   //Tolgo i tab aggiunti in precedenza
			    		   xml = xml.substring(0,(xml.length - (numTab*2)));

			    		   numTab++;
			    		   xml += treeNode.text;
			    		   numTab--;
			    	   }

			    	   return xml;
			       },
					/**
					* @method
					* Numero di tab per la formattazione
					* @member tolomeo.XmlEditorPanel
					* @param {integer} numTab - numero di tab precedenti
					*/
			       getTabs : function(numTab) {
			    	   var ret="";
			    	   for(var i = 0; i<numTab;i++){
			    		   ret += "\t";
			    	   }
			    	   return ret;
			       },
					/**
					* @method
					* Verifica eventuali errori di parserizzazione xml
					* @member tolomeo.XmlEditorPanel
					* @param {Object} docx
					*/
			       checkParse : function(docx) {
			    	   for (var i=0; i < docx.childNodes.length; i++) {
			    		   if (docx.childNodes[i].nodeName!="#comment"){
			    			   if (docx.childNodes[i].nodeName == "parsererror"){
			    				   return false;
			    			   }else{
			    				   return this.checkParse(docx.childNodes[i]); 
			    			   }
			    		   }
			    	   }
			}
		});
		tolomeo.XmlEditorPanel.superclass.initComponent.call(this);
	},
	/**
	* @constructor
	* Costruttore.
	* @member tolomeo.XmlEditorPanel
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(config){
		tolomeo.XmlEditorPanel.superclass.constructor.call(this, config);
		for(var key in config) eval("this."+key+"=config."+key+";");
		this.foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
		tolomeo.editor.globalConfig.xmlFileName = fileName + "." + fileExt;
		tolomeo.editor.globalConfig.uid=uid;
		tolomeo.editor.globalConfig.editor=this;
		tolomeo.editor.globalConfig.editor.treeView=tolomeo.editor.globalConfig.editor.items.items[0].items.items[0];
		tolomeo.editor.globalConfig.editor.detail=tolomeo.editor.globalConfig.editor.items.items[0].items.items[1];
		tolomeo.editor.globalConfig.editor.source=tolomeo.editor.globalConfig.editor.items.items[1].items.items[0];
	}
});


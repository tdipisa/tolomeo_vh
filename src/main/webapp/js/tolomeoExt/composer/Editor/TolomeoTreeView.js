
/** 
* Questo componente consente di gestire l'editing di file in formato xml tramite l'interfaccia ad albero
*/
Ext.namespace('tolomeo', 'tolomeo.editor');

tolomeo.editor.TolomeoTreeView = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member tolomeo.editor.TolomeoTreeView
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		tolomeo.editor.TolomeoTreeView.superclass.constructor.apply(this, arguments);
//		/**
//		* @cfg
//		* @member tolomeo.editor.TolomeoTreeView
//		* Tipo di layout
//		*/
//		this.layout='vbox';
		/**
		* @cfg
		* @member tolomeo.editor.TolomeoTreeView
		* Titolo della finestra
		*/
		this.title='Tree view';
		/**
		* @cfg
		* @member tolomeo.editor.TolomeoTreeView
		* Tipo di layout
		*/
		this.layout='anchor';
		/**
		* @method
		* @member Tolomeo.Deployer
		* Esegue l'aggiunta del componente treeView
		*/
		this.add(new Ext.tree.TreePanel({
				/**
				* @cfg
				* @member tolomeo.editor.TolomeoTreeView
				* scroll attivo
				*/
				autoScroll: true,
				/**
				* @cfg
				* @member tolomeo.editor.TolomeoTreeView
				* nodo primcipale
				*/
				root:{},
				/**
				* @cfg
				* @member tolomeo.editor.TolomeoTreeView
				* percentuale di ingombro
				*/
				anchor:'100% 70%',
				/**
				* @cfg
				* @member tolomeo.editor.TolomeoTreeView
				* abilitazione drag and drop
				*/
				enableDD:true,
				/**
				* @cfg
				* @member tolomeo.editor.TolomeoTreeView
				* gruppo per la gestione del drag and drop
				*/
				ddGroup: 'tree_dd_group',

				listeners: {
					/**
					* @event 
					* @member tolomeo.editor.TolomeoTreeView
					* click tasto sinistro sul nodo
					*/
					click:function  (obj, index){
						if (obj.firstChild!=null){
							//Refresh dei children
							obj.collapse();
							obj.expand();
						}
						var path = obj.getPath("text") 
						if(tolomeo.editor.globalConfig.cacheJsonRequest[path] == undefined ) {
							this.ajaxRequestXsd(this, tolomeo.editor.editorConfig.tolomeo_schema, path, tolomeo.editor.editorConfig.url_xsd);
						}else{
							this.setXsd(obj);
						}

						//Valorizzo la variabile globale del nodo selezionato
						tolomeo.editor.globalConfig.nodeSelected=obj;
						if(typeof(obj.xsd) != 'undefined'){
							this.setNodeDetailUI();
						}else{
							if (tolomeo.editor.globalConfig.nodeContainer != null)
								tolomeo.editor.globalConfig.nodeContainer.removeAll();
						}

						//espande il nodo cliccato
						obj.expand();
					},
					/**
					* @event 
					* @member tolomeo.editor.TolomeoTreeView
					* click tasto destro sul nodo
					*/
					contextMenu: function  (obj, index){
//						if (obj.firstChild!=null){
//						//Refresh dei children
//						obj.collapse();
//						obj.expand();
//						}
						var path = obj.getPath("text") 
						//Valorizzo la variabile globale del nodo selezionato
						tolomeo.editor.globalConfig.nodeSelected=obj;

						//Creazione menu
						tolomeo.editor.menuConfig.x = index.xy[0];
						tolomeo.editor.menuConfig.y = index.xy[1];
						this.sendRequest(this,tolomeo.editor.editorConfig.tolomeo_schema, path,tolomeo.editor.editorConfig.url_xsd);
					},	
					/**
					* @event 
					* @member tolomeo.editor.TolomeoTreeView
					* prima del doppio click
					*/
					beforedblclick:function (e){
						return false;
					},
					/**
					* @event 
					* @member tolomeo.editor.TolomeoTreeView
					* inizio operazione di trascinamento
					*/
					startdrag:function(a, b, c) {
						if ((b.xsd!=undefined) && (b.parentNode!=undefined)){
							b.xsd.parentDropText=b.parentNode.text;
						}
					}		                            
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Definisce la sezione di dettaglio del nodo
				*/
				setNodeDetailUI: function (){

					tolomeo.editor.globalConfig.nodeContainer = tolomeo.editor.globalConfig.editor.detail;

					tolomeo.editor.globalConfig.nodeContainer.removeAll();

					//Crezione pannello dettaglio
					var panelDetail = new Ext.Panel({
						title: 'Dettaglio',
						layout: 'fit'
					});

					tolomeo.editor.globalConfig.nodeContainer.add(panelDetail);

					//Se non ho selezionato nessun nodo e se il nodo selezionato non ha dettagli disponibili esco
					if ((tolomeo.editor.globalConfig.nodeSelected==null) ||
							(tolomeo.editor.globalConfig.nodeSelected.xsd==undefined) ||
							(tolomeo.editor.globalConfig.nodeSelected.xsd.allowChildren=='true')){
						return;
					}

					//recupero eventuale valore del nodo figlio
					var childValue = "";
					var el=tolomeo.editor.globalConfig.nodeSelected.firstChild;
					if (el!=null) childValue = el.text;

					//Creazione pannello per valore nodo
					var nodeDetail = new Ext.Panel({
						layout: 'hbox',   
						bodyCssClass: 'DetailClass' ,
						buttonAlign :'right'
					});

					//Creo label per il valore
					var lblDescrizione = new Ext.form.Label({
						margins:{
							top: (13),
							right: (0),
							bottom: (10),
							left: (20)
						}
					});

					//Creo l'oggetto valore che puo' essere o di tipo text o di tipo lista in base al nodo selezionato
					var valore;
					if (tolomeo.editor.globalConfig.nodeSelected.xsd.enumerators.length>0) {
						var enums=new Array();
						for (var i = 0; i < tolomeo.editor.globalConfig.nodeSelected.xsd.enumerators.length; ++i){
							enums[i] = new Array();
							if (tolomeo.editor.globalConfig.nodeSelected.xsd.enumerators[i].cod!=undefined){
								enums[i][0]=tolomeo.editor.globalConfig.nodeSelected.xsd.enumerators[i].cod;
							}else{
								enums[i][0]=tolomeo.editor.globalConfig.nodeSelected.xsd.enumerators[i].text;
							}
							enums[i][1]=tolomeo.editor.globalConfig.nodeSelected.xsd.enumerators[i].text;
						} 

						valore = new Ext.form.ComboBox({
							margins:{
								top: (10),
								right: (0),
								bottom: (10),
								left: (10)
							},
							typeAhead: true,
							triggerAction: 'all',
							lazyRender:true,
							mode: 'local',
							store: new Ext.data.ArrayStore({
								fields: [
								         'cod',
								         'text'
								         ],
								         data: enums
							}),
							valueField: 'cod',
							displayField: 'text',
							width: 500, 
							value: childValue
						});
					}else {
						valore = new Ext.form.TextField({
							margins:{
								top: (10),
								right: (0),
								bottom: (10),
								left: (10)
							},
							width: 500, 
							value:childValue
						});
					}

					//Creo bottone di inserimento/aggiornamento valore nodo
					var btnInsert = new Ext.Button({
						margins:{
							top: (10),
							right: (0),
							bottom: (10),
							left: (5)
						},
						text: 'Inserisci',
						minWidth: 75, 
						handler: function() {tolomeo.editor.globalConfig.editor.treeView.addValueNode(valore.getValue(), "");}
					});

					//Aggiungo oggetti alla sezione dettaglio
					nodeDetail.add(lblDescrizione);
					nodeDetail.add(valore);
					nodeDetail.add(btnInsert);


					var nodeComment = new Ext.Panel({
						title: 'Commento',
						layout: 'hbox',   
						bodyCssClass: 'DetailClass' ,
						buttonAlign :'right'
					});

					var lblCommento = new Ext.form.Label({
						margins:{
							top: (13),
							right: (0),
							bottom: (10),
							left: (20)
						}
					});
					nodeComment.add(lblCommento);

					//Valorizzazione oggetti
					if (lblDescrizione!="null")lblDescrizione.text=tolomeo.editor.globalConfig.nodeSelected.text + ": ";
					if (tolomeo.editor.globalConfig.nodeSelected.xsd.comment=="null") tolomeo.editor.globalConfig.nodeSelected.xsd.comment="";
					if (lblCommento!=null)lblCommento.text = " " + tolomeo.editor.globalConfig.nodeSelected.xsd.comment;

					panelDetail.add(nodeDetail);
					panelDetail.add(nodeComment);
					panelDetail.doLayout();	

					nodeComment.doLayout();	

					tolomeo.editor.globalConfig.nodeContainer.doLayout();	

				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Gestisce le richieste tra gli invii alla servlet e le richieste alla struttura in memoria
				* @param obj - oggetto editor
				* @param schema - schema xsd verso il quale effettuare la richiesta
				* @param path - percorso completo dell'oggetto cercato
				* @param url - ulr alla servlet
				*/
				sendRequest: function (obj, schema, path,url){
					if( tolomeo.editor.globalConfig.cacheJsonRequest[path] == undefined ) {
						this.ajaxRequestMenu(obj, schema, path,url,schema, path,url);
					}else{
						this.createMenu(obj, path);
					}
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Invia la richiesta alla servlet per la generazione del menu
				* @param obj - oggetto editor
				* @param schema - schema xsd verso il quale effettuare la richiesta
				* @param path - percorso completo dell'oggetto cercato
				* @param url - ulr alla servlet
				*/
				ajaxRequestMenu: function (obj, schema, path, url) {
					var req=new CrossDomainRequest(url, "POST");
					req.addParameter("el", path);
					req.addParameter("schema",schema);
					req.onSuccess=function(response){
						obj.addCacheJsonRequest(path,response.responseText);
						obj.createMenu(obj, path);
					}
					req.onFailure=function(response){
						obj.addCacheJsonRequest(path,null);
					}
					req.send();
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Aggiunge la risposta della servlet alla struttura in memoria
				* @param request - percorso completo all'oggetto cercato
				* @param JSONString - stringa json
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
				* @member tolomeo.editor.TolomeoTreeView
				* Invia la richiesta alla servlet
				* @param obj - oggetto editor
				* @param schema - schema xsd verso il quale effettuare la richiesta
				* @param path - percorso completo dell'oggetto cercato
				* @param url - ulr alla servlet
				*/
				ajaxRequestXsd: function (obj, schema, path, url) {
					var req=new CrossDomainRequest(url, "POST");
					req.addParameter("el", path);
					req.addParameter("schema",schema);
					req.onSuccess=function(response){
						obj.addCacheJsonRequest(path,response.responseText);
						obj.setXsd(tolomeo.editor.globalConfig.nodeSelected);
						obj.setNodeDetailUI();
					}
					req.onFailure=function(response){
						obj.addCacheJsonRequest(path,null);
					}
					req.send();
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Invia la richiesta alla servlet corrispondente al parametro cercato
				* @param obj - oggetto editor
				* @param treeNode - nodo per il quale effettuare la richiesta
				* @param servletCode - servlet corrispondente
				*/
				ajaxRequestCodeServlet: function (obj, treeNode, servletCode) {
					var path=treeNode.getPath("text");
					var req=new CrossDomainRequest(tolomeo.editor.editorConfig.url_xsd, "POST");
					req.addParameter("el", path);
					req.addParameter("schema",tolomeo.editor.editorConfig.tolomeo_schema);
					req.onSuccess=function(response){
						obj.addCacheJsonRequest(path ,response.responseText);
						obj.setXsd(treeNode);
						var reqCode=new CrossDomainRequest(servletCode, "POST");
						reqCode.onSuccess=function(response){
							obj.loadXsdEnums(treeNode,response.responseText);
						}
						reqCode.onFailure=function(response){
							obj.addCacheJsonRequest(path,null);
						}
						reqCode.send();				
					}
					req.onFailure=function(response){
						scope.addCacheJsonRequest(path,null);
					}
					req.send();    
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Invia la richiesta per il nodo passato
				* @param obj - oggetto editor
				* @param treeNode - nodo per il quale effettuare la richiesta
				*/
				ajaxRequestTreeNode: function (obj, treeNode) { 
					var path=treeNode.getPath("text");
					var req=new CrossDomainRequest(tolomeo.editor.editorConfig.url_xsd, "POST");
					req.addParameter("el", path);
					req.addParameter("schema",tolomeo.editor.editorConfig.tolomeo_schema);
					req.onSuccess=function(response){
						obj.addCacheJsonRequest(path ,response.responseText);
						obj.setXsd(treeNode);
						if (treeNode.xsd!=undefined){
							//imposto la possibilita per drag and drop dei nodi
							if (treeNode.xsd.maxOccurs>-1){
								treeNode.draggable=false;
								treeNode.allowChildren=false;
							}else{
								treeNode.draggable=true;
								treeNode.allowChildren=false;
								treeNode.parentNode.allowChildren=true;
							}
						}
					}
					req.onFailure=function(response){
						obj.addCacheJsonRequest(path,null);
					}
					req.send();
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Metodo per la creazione del menu
				* @param editor - oggetto editor
				* @param path - percorso completo al nodo
				*/
				createMenu: function (obj, path){
					if ((tolomeo.editor.globalConfig.cacheJsonRequest[path]!=null)&& (tolomeo.editor.globalConfig.cacheJsonRequest[path].xsd.childrens!=null)){
						this.menu = new Ext.menu.Menu({
							items: tolomeo.editor.globalConfig.cacheJsonRequest[path].xsd.childrens
						});
						//disabilita voci di menu per i nodi gia' presenti e imposta lo stile bold per le voci che sono obbligatorie
						obj.setStyleMenuItems(this.menu, tolomeo.editor.globalConfig.nodeSelected);
					}else{
						this.menu = new Ext.menu.Menu();
					}

					//aggiunge le voci di default
					obj.addDefaultMenuItems(this.menu);
					//Mostra menu
					this.menu.showAt([tolomeo.editor.menuConfig.x, tolomeo.editor.menuConfig.y]);
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Agigunge le voci di defulat al menu
				* @param menu
				*/				
				addDefaultMenuItems: function (menu){
					//Seperatore
					var itemMenuSeparator=new Ext.menu.Separator();
					menu.add(itemMenuSeparator);
					if (tolomeo.editor.globalConfig.nodeSelected.childNodes.length>0){
						//Espandi tutto
						var itemMenuExp=new Ext.menu.Item();
						itemMenuExp.setText("Espandi tutto");
						itemMenuExp.setHandler(function () {tolomeo.editor.globalConfig.nodeSelected.expand(true,true);})
						menu.add(itemMenuExp);
					}
					//Elimina
					var itemMenuDelete=new Ext.menu.Item();
					itemMenuDelete.setText("Elimina");
					itemMenuDelete.setHandler(function () {tolomeo.editor.globalConfig.editor.treeView.removeNode(tolomeo.editor.globalConfig.nodeSelected);})
					menu.add(itemMenuDelete);
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Rimuove il nodo
				* @param nodeToRemove - nodo da rimuovere
				*/
				removeNode: function (nodeToRemove){
					nodeParent=nodeToRemove.parentNode;
					if (nodeParent!=null){
						nodeParent.removeChild(nodeToRemove);
						//Setto a modificato l'editing del tree view
						tolomeo.editor.globalConfig.isModified=true;
						//Setto a da validare l'editing del tree view
						tolomeo.editor.globalConfig.isValidated=false;
					}
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Imposta il corretto stile agli elementi del menu
				* @param menu - menu
				* @param node - nodo sul quale e' stato generato il menu
				*/
				setStyleMenuItems: function (menu, node){
					//Seperatore
					var itemsMenu = menu.items;
					if (itemsMenu!=null){
						for (var item in itemsMenu.items){
							var currItem=itemsMenu.items[item];
							if ((currItem!=null)&& (typeof(currItem)=="object") && (currItem.name!="")){
								//var currNode = node.findChild("text", currItem.text)
								var minOccurs = 0;
								var maxOccurs = 0;
								if (currItem.xsd!=null){
									var xsd = currItem.xsd[0];
									if(xsd.minOccurs!=null){
										minOccurs = xsd.minOccurs;
									}
									if(xsd.maxOccurs!=null){
										maxOccurs = xsd.maxOccurs;
									}
								}


								if (minOccurs>0){
									currItem.addClass("contextMenuBold");
								}

								var totFinded=0;
								Ext.each(node.childNodes, function(el){if (el.text == currItem.text) totFinded++;});

								if ((maxOccurs > 0) && (totFinded>=maxOccurs)){
									currItem.setDisabled(true);
								}else{
									currItem.setDisabled(false);
								}
							}
						}
					}
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Aggiunge il nodo all'albero
				* @param newText - testo del nuovo nodo
				* @param comment - commento
				* @param minOccurs - occorrenze minime per l'oggetto
				* @param maxOccurs - occorrenze massime per l'oggetto
				* @param type - tipo
				* @param text - testo
				* @param use - uso
				* @param defaultValue - valore di default
				* @param allowChildren - consenti inserimento figli
				*/
				addNode: function (newText, comment, minOccurs, maxOccurs, type, text, use, defaultValue, allowChildren){
					//xsd = new xsdElement(newText, minOccurs, maxOccurs, type, text, use, defaultValue, comment, allowChildren, "false");
					var newNode = new Ext.tree.TreeNode({
						text:newText,
						listeners:{
							beforeappend: function(tree, thisNode, node) {
								if ((node.xsd!=undefined) && (node.xsd.parentDropText!=thisNode.text)) return false;
							},
							beforemove: function(tree, thisNode, oldParent, newParent,index) {
								if (oldParent!=newParent) return false;
							}
						}
					});
					newNode.expandable=false;
					tolomeo.editor.globalConfig.nodeSelected.appendChild(newNode);
					tolomeo.editor.globalConfig.nodeSelected.expandible=true;

					if (newNode.parentNode!=null){

						//Richiesta servlet per info xsd
						this.ajaxRequestTreeNode(this, newNode);

						//recupero eventuale servlet per il caricamento della lista di enumeratori
						var codeServletObj = tolomeo.editor.editorConfig.codiciServlet.filter( function(value) {
							return value.codice == newText;
						});

						//Richiesta servlet per caricare enumeratori
						if (codeServletObj.length>0){
							this.ajaxRequestCodeServlet(this, newNode, codeServletObj[0].servlet)
						}

						//Setto a modificato l'editing del tree view
						tolomeo.editor.globalConfig.isModified=true;
						//Setto a da validare l'editing del tree view
						tolomeo.editor.globalConfig.isValidated=false;
					}
					this.menu.hide();
					//nodeSelected.expand(true);
				},				
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Aggiunge un nodo di tipo foglia al nodo
				* @param newText - testo del nuovo nodo
				* @param comment - commento
				*/	
				addValueNode: function (newText, comment){
					var childNode=tolomeo.editor.globalConfig.nodeSelected.firstChild;
					if (childNode!=null){
						childNode.remove();
					}

					var newNode = new Ext.tree.TreeNode({
						text:newText,
						allowChildren:false
					});
					//setto a true per evitare che si presenti la detail del nodo
					xsdEl = new xsdElement(newText, 0, 0, "", newText, "", "", comment, 'true', 'true');
					tolomeo.editor.globalConfig.nodeSelected.appendChild(newNode);
					tolomeo.editor.globalConfig.cacheJsonRequest[newNode.getPath("text")]=new xsd(xsdEl);
					this.setXsd(newNode);

					tolomeo.editor.globalConfig.nodeSelected.expand(true);

					//Setto a modificato l'editing del tree view
					tolomeo.editor.globalConfig.isModified=true;
					//Setto a da validare l'editing del tree view
					tolomeo.editor.globalConfig.isValidated=false;
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Setta la propieta' xsd relativa al nodo
				* @param treeNode - nodo sul quale impostare le informazioni derivate dal file xsd
				*/	
				setXsd: function (treeNode){
					var path=treeNode.getPath("text");
					if (tolomeo.editor.globalConfig.cacheJsonRequest[path]!=null){
						if (tolomeo.editor.globalConfig.cacheJsonRequest[path].xsd!=null){
							if (treeNode.xsd==null){
								treeNode.xsd=tolomeo.editor.globalConfig.cacheJsonRequest[path].xsd;
							}
						}
					}
				},
				/**
				* @method
				* @member tolomeo.editor.TolomeoTreeView
				* Carica gli eventuali valori enumeratore associati al nodo
				* @param treeNode - nodo sul quale effettuare la ricerca
				* @param jsonEmums - stringa json
				*/
				loadXsdEnums: function (treeNode, jsonEmums){
					var JSONEnumsObject = Ext.util.JSON.decode(jsonEmums);
					if (JSONEnumsObject!=null){
						Ext.each(JSONEnumsObject, function(item){treeNode.xsd.enumerators.push(item);});
						tolomeo.editor.globalConfig.cacheJsonRequest[treeNode.getPath("text")].xsd=treeNode.xsd;
					}
				}
		})
		);
		/**
		* @method
		* @member tolomeo.editor.TolomeoTreeView
		*/
		this.add(new Ext.Panel({
			id: this.renderNodeDetail + '_nodeContainer',
			xtype: 'panel',
			layout:'anchor',
			anchor:'100% 30%'
		})
		);
	}
})
			       
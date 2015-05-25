/**
* @method
* @member tolomeo
* Utility caricamento css
*/
tolomeo.loadCss=function(fileCss){
	if(document.createStyleSheet){
		document.createStyleSheet(fileCss);	
	}else{
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		head.appendChild(link);
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = fileCss;
		link.media = 'all';		
	}
}
/**
* @method
* @member tolomeo
* Utility per togliere eventuali spazi della stringa
* @param str - stirnga da eleborare
* @param chars - caratteri aggiunti agli spazi
*/
tolomeo.trim=function (str, chars) {
	   return tolomeo.ltrim(tolomeo.rtrim(str, chars), chars);
}

/**
* @method
* @member tolomeo
* Utility per togliere eventuali spazi a sinistra della stringa
* @param str - stirnga da eleborare
* @param chars - caratteri aggiunti agli spazi
*/
tolomeo.ltrim=function (str, chars) {
	   chars = chars || "\\s";
	   return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
/**
* @method
* @member tolomeo
* Utility per togliere eventuali spazi a destra della stringa
* @param str - stirnga da eleborare
* @param chars - caratteri aggiunti agli spazi
*/
tolomeo.rtrim=function (str, chars) {
	   chars = chars || "\\s";
	   return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}


var date = new Date();
var components = [
                  date.getYear(),
                  date.getMonth(),
                  date.getDate(),
                  date.getHours(),
                  date.getMinutes(),
                  date.getSeconds()
                  ];

var fullDateTime = components.join("");
var fileName = "tolomeo_" + fullDateTime;
var fileExt = "xml";

/**
* @method
* Generazione di un identificativo univoco
*/
function generateGuid(){
	var result, i, j;
	result = '';
	for(j=0; j<32; j++){
		if( j == 8 || j == 12|| j == 16|| j == 20) result = result + '-';
		i = Math.floor(Math.random()*16).toString(16).toUpperCase();
		result = result + i;
	}
	return result
}
var uid = generateGuid();

/**
* @property {Object} [XsdConfigEditor]
* Struttura per la configurazione dell'editor
*/
XsdConfigEditor={
	url_xsd: "",
	url_xsd_validation: "",
	url_save_xml: "",
	url_load_xml: "",
	tolomeo_schema: "",
	schema_language: "",
	renderNodeDetail: "",
	codiciServlet: null
}
/**
* @property {Object} [XsdGlobalEditor]
* Struttura per la gestione dei puntamenti globali
*/
XsdGlobalEditor={
	panel: null,
	nodeContainer: null,
	cacheJsonRequest: new Array(),
	nodeSelected: null,
	textEditor: "",
	isModified: false,
	xmlFileName: "",
	globalConfig: "",
	validateResponse:undefined,
	isValidated:false
}

/**
* @property {Object} [MenuGlobalEditor]
* Struttura per la gestione del posizionamento del menu
*/
MenuGlobalEditor={
	x:null,
	y:null
}

/**
* @method xsdElement
* Struttura per la gestione delle informazioni xsd
* @param {String}[name] nome elemento
* @param {String}[minOccurs] occorrenze minime
* @param {String}[maxOccurs] occorrenze massime
* @param {String}[type] tipo di elemento
* @param {String}[text] testo
* @param {String}[use] uso
* @param {String}[defaultValue] valore di default
* @param {String}[comment] commento
* @param {String}[allowChildren] figli consentiti
* @param {String}[isValue] se e' il valore di un elemento
*/
function xsdElement(name, minOccurs, maxOccurs, type, text, use, defaultValue, comment, allowChildren, isValue){
	this.name = name;
	this.minOccurs = minOccurs;
	this.maxOccurs = maxOccurs;
	this.type = type;
	this.text = text;
	this.use = use;
	this.defaultValue = defaultValue;
	this.comment = comment;
	this.allowChildren = allowChildren;
	this.isValue = isValue;
	this.childrens=new Array();
	this.enumerators=new Array();
	this.parentDropText="";
}

/**
* @method xsd
* Metodo per l'impostazione dell'xsd passato
* @param {Object} [xsdElement] oggetto xsd
*/
function xsd(xsdElement){
	this.xsd=xsdElement
}

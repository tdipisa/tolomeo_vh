/*******************************************************************************
 * Tolomeo is a developing framework for visualization, editing,  
 * geoprocessing and decisional support application based on cartography.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * This file is part of Tolomeo.
 * 
 * Tolomeo is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License 
 * as published by the Free Software Foundation; either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * Tolomeo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 * if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 * 
 * Developers Information:
 * 
 * Tolomeo is developed by Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it 
 * 
 * 
 * Versione in Italiano LGPL
 * 
 * Tolomeo è un framework per lo sviluppo di applicazioni per
 * visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * Questo file fa parte di Tolomeo.
 * 
 * Tolomeo è un software libero; è possibile redistribuirlo e / o 
 * modificarlo sotto i termini della GNU Lesser General Public License, 
 * come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 *  
 * Tolomeo è distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 * IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 * si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
 *   
 * 
 * Informazioni Sviluppatori:
 * 
 * Tolomeo è sviluppato dal Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 ******************************************************************************/
/**
 * Servlet che gestisce la richiesta per il sito del sit
 */
package it.prato.comune.tolomeo.web;

import it.prato.comune.sit.JSGeometry;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.SITPunto;
import it.prato.comune.tolomeo.configuration.ConfigurationManager;
import it.prato.comune.tolomeo.utility.HelpInfoConfig;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.utility.TolomeoHttpServletRequest;
import it.prato.comune.tolomeo.web.beans.AfterForwardBean;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.tolomeo.web.parametri.ParametriAzioniApertura;
import it.prato.comune.tolomeo.web.parametri.ParametriEventiLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoCondizione;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerCanc;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerCustom;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerIns;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerUpdateAlpha;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerUpdateGeom;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerVis;
import it.prato.comune.tolomeo.web.parametri.ParametriHelpInfo;
import it.prato.comune.tolomeo.web.parametri.ParametriHelpInfoDetail;
import it.prato.comune.tolomeo.web.parametri.ParametriLayout;
import it.prato.comune.tolomeo.web.parametri.ParametriLegenda;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaCategoria;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaLayerAutoLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriMappa;
import it.prato.comune.tolomeo.web.parametri.ParametriServer;
import it.prato.comune.utilita.logging.PratoLogger;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;


/**
 * @author Federico Nieri
 * 
 */
public abstract class TolomeoServlet extends HttpServlet {	

	private static final long serialVersionUID = 1L;

	protected static final String PARAM__UNIQUEID     = "IDTPN";
	protected static final String PARAM__CODTPN_LAYER = "codTPN";
	protected static final String PARAM__GEOOP        = "geoOp";
	protected static final String PARAM__GEOCOORD     = "geoCoord";
	private static final String PARAM__FORWARD        = "forward";
	private static final String PARAM__COMMAND        = "command";
	private static final String PARAM__CHARSET        = "charset";

	private static final String REQ_ATTR__LOGGER          = "requestLogger";    

	private static final String DEFAULT_ERROR_DESTINATION = "/jsp/errore.jsp";
	public static final String ERROR_PAGE                 = "/jsp/errore.jsp";
	public static final String ERROR_PAGE_PANNELLO        = "/jsp/errorePannello.jsp";
	public static final String ERROR_PAGE_INTER           = "/jsp/erroreInter.jsp";
	public static final String ERROR_PAGE_INTER_PANNELLO  = "/jsp/erroreInterPannello.jsp";
	private String connectorUriEncoding = null; 
	
	private ConfigurationManager configManager;

	public void init(ServletConfig config) throws ServletException{
		this.connectorUriEncoding = config.getServletContext().getInitParameter("connectorUriEncoding");
		super.init(config);	      
		
		// ///////////////////////////////////////////////////
		// Get the configurationManager through Spring WAC
		// ///////////////////////////////////////////////////
        ServletContext servletContext = this.getServletContext();
        WebApplicationContext wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);        
        configManager = (ConfigurationManager)wac.getBean("configurationManager");		
	}	

	/**
	 * NON SOVRASCRIVERE MAI
	 */
	public void service(HttpServletRequest request, HttpServletResponse response) 
	throws ServletException, IOException {

		//Lista messaggi informativi, di errore e di warning
		List<Messaggio> messaggi = getMessaggioAttribute(request);
		if (messaggi == null) { 
			messaggi = new ArrayList<Messaggio>();
			setMessaggioAttribute(messaggi,request);
		}

		//Lista bottoni
		List<Input> button = getButtonAttribute(request);
		if (button == null) {
			button = new ArrayList<Input>();
			setButtonAttribute(button,request);
		}

		//AfterForward: operazioni che andranno eseguide dopo un forward
		AfterForwardBean afterForward = getAfterForwardAttribute(request);
		if(afterForward == null){
			afterForward = new AfterForwardBean();		    
			setAfterForwardAttribute(afterForward, request);
		}

		//		System.out.println("TolomeoServlet");
		//		TolomeoHttpServletRequest requestWrapper;
		//		 if(TolomeoHttpServletRequest.class.isAssignableFrom(request.getClass())){
		//		     
		//		     requestWrapper = new TolomeoHttpServletRequest((HttpServletRequest)((HttpServletRequestWrapper)request).getRequest(),"ISO-8859-1",null);
		//	            System.out.println("LA RICHIESTA E' UNA TolomeoHttpServletRequest");
		//	        }else{
		//	            requestWrapper = new TolomeoHttpServletRequest(((HttpServletRequest)request),"UTF-8",null);
		//	        }

		TolomeoHttpServletRequest requestWrapper = new TolomeoHttpServletRequest(((HttpServletRequest)request),this.connectorUriEncoding,null);


		super.service(requestWrapper,response);

	}

	/**
	 * Aggiunge un messaggio in request
	 * 
	 * @param request
	 * @param tipo
	 * @param messaggio
	 */
	protected void addMessaggio(HttpServletRequest request, String tipo, String messaggio){
		getMessaggioAttribute(request).add(new Messaggio(tipo,messaggio));
	}

	/**
	 * Aggiunge un messaggio di ERRORE in request
	 * 
	 * @param request
	 * @param tipo
	 * @param messaggio
	 */
	protected void addErrore(HttpServletRequest request, String messaggio){
		addMessaggio(request,Messaggio.ERRORE,messaggio);
	}

	/**
	 * Aggiunge un messaggio dI INFORMAZIONE in request
	 * 
	 * @param request
	 * @param tipo
	 * @param messaggio
	 */
	protected void addInformazione(HttpServletRequest request, String messaggio){
		addMessaggio(request,Messaggio.INFORMAZIONE,messaggio);
	}

	/**
	 * Aggiunge un messaggio dI WARNING in request
	 * 
	 * @param request
	 * @param tipo
	 * @param messaggio
	 */
	protected void addWarning(HttpServletRequest request, String messaggio){
		addMessaggio(request,Messaggio.WARNING,messaggio);
	}

	/**
	 * Resituisce true se nella lista dei messaggi è presente almeno uno di tipo ERRORE
	 * @return
	 */
	public boolean isThereMessaggioErrore(HttpServletRequest request){
		List<Messaggio> messaggi = getMessaggioAttribute(request);
		for(Messaggio messaggio: messaggi){
			if(messaggio.getTipo() == Messaggio.ERRORE){
				return true;
			}
		}
		return false;
	}

	/**
	 * Aggiunge un button in request
	 * 
	 * @param request
	 * @param input
	 */
	protected void addButton (HttpServletRequest request, Input input){
		getButtonAttribute(request).add(input);
	}

	/**
	 * Aggiunge un button in request settando gli attributi
	 * 
	 * @param request
	 * @param type
	 * @param cssclass
	 * @param name
	 * @param value
	 * @param title
	 */
	protected void addButton (HttpServletRequest request, String type, String cssclass, String name, String value, String title){
		getButtonAttribute(request).add(new Input(type, cssclass, name, value, title));
	}

	/**
	 * Setta le operazione che andranno eseguite dopo un forward sulla mappa
	 * 
	 * @param request
	 * @param refreshMap se <code>true</code> verrà eseguito il refresh della mappa
	 * @param jsonGeometryToExtent se non nulla viene eseguito lo zoom su l'oggetto cartografico
	 */
	protected void setAfterForward(HttpServletRequest request, Boolean refreshMap, String jsonGeometryToExtent){
		getAfterForwardAttribute(request).setRefreshMap(refreshMap);
		getAfterForwardAttribute(request).setJsonGeometryToExtent(jsonGeometryToExtent);
	}

	/**
	 * Restituisce il logger settato per questa richiesta.
	 * 
	 * @param request
	 * @return
	 */
	protected PratoLogger getLogger(HttpServletRequest request){

		// Se per questa richiesta è già stato creato non lo ricreo
		PratoLogger logger = (PratoLogger)request.getAttribute(REQ_ATTR__LOGGER);

		if(logger == null){
			TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();       
			String loggerName = (String)context.getProperty(TolomeoApplicationContext.PROPERTY_NAME__LOGGER_NAME);
			logger = new PratoLogger(loggerName,request.getRemoteUser(),request.getRemoteAddr());
			request.setAttribute(REQ_ATTR__LOGGER,logger);
		}

		return logger; 
	}	

	/**
	 * Restituisce la chiave univoca come stringa.
	 * Per chiave univoca si intende l'identificativo univoco del poligono selezionato.
	 * 
	 * @param request
	 * @param keyName nome del parametro che rappresenta la chiave. "key" di default.
	 * @return
	 */
	protected String getKey(HttpServletRequest request, String keyName){
		String paramName = keyName;
		if(StringUtils.isEmpty(paramName)){
			paramName = PARAM__UNIQUEID;
		}
		return request.getParameter(paramName);
	}

	/**
	 * Restituisce il parametro che contiene l'operazione geometrica da eseguire
	 * 
	 * @param request
	 * @return
	 */
	protected String getGeoOp(HttpServletRequest request){
		return (String)request.getParameter(PARAM__GEOOP);
	}

	/**
	 * Restituisce il parametro che contiene il JSON della geometria
	 * 
	 * @param request
	 * @param keyName
	 * @return
	 */
	protected String getGeoCoord(HttpServletRequest request){
		return (String)request.getParameter(PARAM__GEOCOORD);
	}

	/**
	 * Metodo che restituisce il cocTPN del layer interrogato o null se non trovato
	 * @param request
	 * @return
	 */
	protected Integer getCodTPN(HttpServletRequest request){
		try {

			String codTPNStr = request.getParameter(PARAM__CODTPN_LAYER);

			if(StringUtils.isEmpty(codTPNStr)){
				getLogger(request).error("codTPN non valorizzato");
				return null;
			}

			return Integer.parseInt(codTPNStr);

		} catch (NumberFormatException e){

			getLogger(request).error("codTPN non numerico");
			return null;

		}
	}    

	/**
	 * Metodo che restituisce il path del forward a cui inoltrare la richiesta
	 * @param request
	 * @return
	 */
	protected String getForward(HttpServletRequest request){

		String forward = request.getParameter(PARAM__FORWARD);
		if(StringUtils.isEmpty(forward)){
			return getDefaultForward();
		}
		return forward;

	}

	/**
	 * Metodo da implementare e che deve restituire il forward di default
	 * @return
	 */
	protected abstract String getDefaultForward();

	/**
	 * Restituisce il parametro "command" se passato nel request o null altrimenti
	 * @param request
	 * @return
	 */
	protected String getCommand(HttpServletRequest request){        
		return request.getParameter(PARAM__COMMAND);
	}

	/**
	 * Restituisce il valore del parametro "key"
	 * 
	 * @param request
	 * @return
	 */
	protected String getKey(HttpServletRequest request){
		return getKey(request,null);
	}

	/**
	 * Restituisce il path del file di configurazione
	 * 
	 * @return
	 */
	protected String getConfigPath(){
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
		return context.getConfigFileName();
	}

	/**
	 * Restituisce il path del file di configurazione degli shape
	 * 
	 * @return
	 */
	protected String getShapePath(){
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
		return context.getShapePath();
	}

	/**
	 * Restituisce cssDebug
	 * 
	 * @return
	 */
	protected Boolean getCSSDebug(){
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
		return context.getCSSDebug();
	}


	/**
	 * Restituisce JSDebug
	 * 
	 * @return
	 */
	protected Boolean getJSDebug(){
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
		return context.getJSDebug();
	}
	
	/**
	 * Restituisce GoogleAPIStato
	 * 
	 * @return
	 */
	protected Boolean getGoogleAPIStato(){
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
		return context.getGoogleAPIStato();
	}
	
	/**
	 * Restituisce GoogleAPIClientID
	 * 
	 * @return
	 */
	protected String getGoogleAPIClientID(){
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
		return context.getGoogleAPIClientID();
	}

	
	
	/**
	 * Restituisce GoogleAPIStato
	 * 
	 * @return
	 */
	protected String getTolomeoStaticRoot(String contextname){
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
		return context.getTolomeoStaticRoot(contextname);
	}
	
	/**
	 * Restituisce SelectModeDefault
	 * 
	 * @return
	 */
	protected String getSelectModeDefault(){
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
		return context.getSelectModeDefault();
	}
	
	/**
     * Restituisce l'url base di tolomeo, composto di protocollo, host e porta.
     * 
     * @return String
     */
    protected String getTolomeoServer(HttpServletRequest request){
        
        String pr = (request.getRequestURL().toString().substring(0, 5).equalsIgnoreCase(("HTTPS"))) ? "https" : "http";
        String host = request.getServerName();
        int port = request.getServerPort();
              
        return pr + "://" + host + ":" + port;
    }


	/**
	 * URL di base per il caricamento di layer con caricaLayerSeparato = true
	 * 
	 * @return
	 */
	protected String getURLBaseLayerSeparato(){
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
		return context.getURLBaseLayerSeparato();
	}

	protected SITLayersManager getTerritorio(LogInterface logger) throws IOException
	{
	    try {
	        return new SITLayersManager(getShapePath(),logger, "Comune di Prato");
	    }catch(SITException site){
	        logger.error("Errore nel recupero del layers manager",site);
	        throw new IOException(site);
	    }
	}

	/**
	 * Imposta l'attributo di default che riporta le operazioni di afterForward
	 * @param afterForward
	 * @param request
	 */
	protected void setAfterForwardAttribute(AfterForwardBean afterForward, HttpServletRequest request){
		request.setAttribute("afterForward",afterForward); 
	}

	/**
	 * Restituisce il valore dell'attributo di afterForward del request
	 * 
	 * @param request
	 * @return
	 */
	protected AfterForwardBean getAfterForwardAttribute(HttpServletRequest request){
		return (AfterForwardBean)request.getAttribute("afterForward"); 
	}

	/**
	 * Imposta l'attributo di default che riporta i messaggi
	 * @param errorMsg
	 * @param request
	 */
	protected void setMessaggioAttribute(List<Messaggio> messaggi, HttpServletRequest request){
		request.setAttribute("messaggi",messaggi); 
	}

	/**
	 * Restituisce il valore dell'attributo di messaggi del request
	 * 
	 * @param request
	 * @return
	 */
	protected List<Messaggio> getMessaggioAttribute(HttpServletRequest request){
		return (List<Messaggio>)request.getAttribute("messaggi"); 
	}

	/**
	 * Imposta l'attributo di default che riporta i button
	 * @param errorMsg
	 * @param request
	 */
	protected void setButtonAttribute(List<Input> button, HttpServletRequest request){
		request.setAttribute("button",button); 
	}

	/**
	 * Restituisce il valore dell'attributo di button del request
	 * 
	 * @param request
	 * @return
	 */
	protected List<Input> getButtonAttribute(HttpServletRequest request){
		return (List<Input>)request.getAttribute("button"); 
	}

	/**
	 * Restituisce true se è stato valorizzato il valore dell'attributo di errore
	 * 
	 * @param request
	 * @return
	 */
	protected boolean isMessaggiAttributeValued(HttpServletRequest request){
		return request.getAttribute("messaggi") != null;
	}

	/**
	 * Forwarda la richiesta alla risorsa impostata
	 * E' necessario fare un return dopo questa istruzione nella servlet chiamante,
	 * per impedire che continui l'esecuzione della stessa
	 * 
	 * @param where String dove forwardare la richiesta. Es. "/jsp/miaJsp.jsp"
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	protected void forward(String where, HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException{

		HttpServletRequest requestWrapper = request;

		if(TolomeoHttpServletRequest.class.isAssignableFrom(request.getClass())){
			requestWrapper = (HttpServletRequest)((TolomeoHttpServletRequest)request).getRequest();
		}

		getServletContext().getRequestDispatcher(where).forward(requestWrapper,response);
	}

	/**
	 * Inoltra la richiesta alla risorsa passata come parametro o a quella definita come default
	 */
	protected void forward(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException{
		forward(getForward(request), request, response);
	}

	/**
	 * Ritorna il valore del paremetro cercandolo prima come getAttribute e, se non trovato, con getParameter (in GET o POST)
	 * 
	 * @param request request su cui cercare il parametro
	 * @param name nome del parametro
	 * @return il valore del parametro se presente altrimenti null
	 */
	protected Object getAttributeOrParameter(HttpServletRequest request, String name) {
		Object retVal = null;


		retVal = request.getAttribute(name);
		if (retVal==null) {
			retVal = request.getParameter(name);
		}

		return retVal;
	}
	
	/**
	 * 
	 * Istanzia l'oggetto parametri a partire da una stringa ed invoca il metodo che fa sostituzioni completamenti necessari
	 * 
	 * @param request
	 * @param terr
	 * @param bSetZoomToObj  flag che controlla se deve essere inserito in params anche l'oggetto zoomToObj 
	 * (introdotto perchè in alcuni casi come nella PrintServlet non serve completare questa parte, che viene gestita in maniera diversa)
	 * @return l'oggetto istanziato
	 * @throws IOException
	 */
	protected Parametri getParametriFromString(HttpServletRequest request, SITLayersManager terr, boolean bSetZoomToObj) throws IOException {
		// Recupero il logger
		LogInterface logger = getLogger(request);

		// Recupero il parametro che contiene il nome del file xml da utilizzare
		String paramPresetString = request.getParameter("paramPresetString");
		logger.debug("paramPresetString = " + paramPresetString);


		// Creo l'oggetto parametri a partire dal file xml indicato
		Parametri params = Parametri.createParametriFromString(paramPresetString, terr);
		params.setNomePreset("Preset caricato da stringa");
		
		return elaboraParametri(params, request, terr, bSetZoomToObj);
	}

	/**
	 * 
	 * Istanzia l'oggetto parametri a partire da file XML e fa sostituzioni completamenti necessari
	 * 
	 * @param request
	 * @param terr
	 * @param bSetZoomToObj  flag che controlla se deve essere inserito in params anche l'oggetto zoomToObj 
	 * (introdotto perchè in alcuni casi come nella PrintServlet non serve completare questa parte, che viene gestita in maniera diversa)
	 * @return l'oggetto istanziato
	 * @throws IOException
	 */
	protected Parametri getParametri(HttpServletRequest request, SITLayersManager terr, boolean bSetZoomToObj) throws IOException {
		// Recupero il logger
		LogInterface logger = getLogger(request);
		Parametri params = null;
		
		// Recupero il parametro che contiene il nome del file xml da utilizzare
		String paramPreset = request.getParameter("paramPreset");
		String paramPresetString = request.getParameter("paramPresetString");
		
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();
		//logger.debug("paramPreset = " + paramPreset);

		// Se il parametro non e' presente allora setto default Demo se no è passato direttamente un preset in forma xml
		if (StringUtils.isEmpty(paramPreset)) {
		    if(StringUtils.isEmpty(paramPresetString) || !context.isPresetSendingAllowed()){		        
		        logger.error("paramPreset non valorizzato! Uso il preset demo!");
		        paramPreset = "Demo";
		    } else {		        
                File presetDirectory = context.getPresetDirectory(); 
                if(presetDirectory != null) {
                    try {
                        paramPresetString = Parametri.loadIncludeEProperties(paramPresetString, presetDirectory);
                    } catch(Exception e){
                        logger.error("Impossibile ricostruire correttamente il file di preset", e);
                        throw new IOException("Preset di parametri non istanziabile",e);
                    }
                }
                
                if (paramPresetString != null) {
                    params = Parametri.createParametriFromString(paramPresetString, terr);
                    String presetName = request.getParameter("presetName");
                    presetName = presetName == null ? "Preset caricato da stringa" : presetName;              
                    params.setNomePreset(presetName);                                       
                } 
		    }
		}
		
		if(!StringUtils.isEmpty(paramPreset)){
		    // Creo l'oggetto parametri a partire dal file xml indicato
	        //params = Parametri.createParametri(paramPreset, terr);
	        params = configManager.get(terr, paramPreset, null);
	        params.setNomePreset(paramPreset);
		}
				
		return elaboraParametri(params, request, terr, bSetZoomToObj);
		
	}
	
	/**
	 * Metodo che imposta nei parametri, gli eventuali valori di default definiti nel file di configurazione del contesto.
	 * @param request
	 * @param params
	 * @param logger
	 */
	private void loadContextDefaultParams(HttpServletRequest request, Parametri params, LogInterface logger){
        
        TolomeoApplicationContext context = TolomeoApplicationContext.getInstance(); 
        
        String helpUrl         = (String)context.getProperty(TolomeoApplicationContext.PROPERTY_NAME__HELP_GUIDE_URL);          
        String faqUrl          = (String)context.getProperty(TolomeoApplicationContext.PROPERTY_NAME__HELP_FAQ_URL);
        String helpMailTo      = (String)context.getProperty(TolomeoApplicationContext.PROPERTY_NAME__HELP_MAIL_TO);
        String helpMailSubject = (String)context.getProperty(TolomeoApplicationContext.PROPERTY_NAME__HELP_MAIL_SUBJECT);
        
        ParametriLayout layout = params.getLayOut();
        
        // //////////////////////////////////////////////////////////////////////////
        // INIZIO Sovrascrittura con i valori di default per parametri non valorizzati
        // //////////////////////////////////////////////////////////////////////////
        if(layout.getHelpUrl() == null && helpUrl != null){
            layout.setHelpUrl(helpUrl);
        }
        
        if(layout.getFaqUrl() == null && faqUrl != null){
            layout.setFaqUrl(faqUrl);
        }
        
        if(layout.getHelpMailTo() == null && helpMailTo != null){
            layout.setHelpMailTo(helpMailTo);
        }
        
        if(layout.getHelpMailSubject() == null && helpMailSubject != null){
            layout.setHelpMailSubject(helpMailSubject);
        }
        
        String helpInfoMainTitle = (String)context.getProperty(TolomeoApplicationContext.PROPERTY_NAME__HELP_INFO_MAIN_TITLE);
        
        ParametriHelpInfo helpInfo = layout.getHelpInfo();
        // se sono configurate sul preset dell info aggiungo solo quelle marcate come IMPORTANT 
        boolean addOnlyImportant = (helpInfo != null);
        
        List<HelpInfoConfig> helpConfigList = context.getHelpInfoConfigList(addOnlyImportant);                                    
        
        if(helpInfo == null && !helpConfigList.isEmpty()){              
            helpInfo = new ParametriHelpInfo();
            layout.setHelpInfo(helpInfo);  
            if(helpInfoMainTitle != null){
                helpInfo.setMainTitle(helpInfoMainTitle);                       
            }
        }
        
        if(helpInfo != null){
                                            
            for (HelpInfoConfig helpInfoConfig : helpConfigList) {                    
                ParametriHelpInfoDetail phid = new ParametriHelpInfoDetail();
                phid.setTitle(helpInfoConfig.getTitle());
                phid.setUrl(helpInfoConfig.getUrl());
                phid.setFramed(helpInfoConfig.isFramed());
                helpInfo.addInfo(phid);
            }
            
            layout.setHelpInfo(helpInfo);                   
        }
	}
	
	/**
	 * 
	 * Metodo che fa sostituzioni completamenti necessari sull'oggetto parametri
	 * 
	 * @param params Oggetto su cui fare completamenti e sistituzioni
	 * @param request
	 * @param terr
	 * @param bSetZoomToObj  flag che controlla se deve essere inserito in params anche l'oggetto zoomToObj 
	 * (introdotto perchè in alcuni casi come nella PrintServlet non serve completare questa parte, che viene gestita in maniera diversa)
	 * @return l'oggetto istanziato
	 * @throws IOException
	 */
	protected Parametri elaboraParametri(Parametri params, HttpServletRequest request, SITLayersManager terr, boolean bSetZoomToObj) throws IOException 
	{
		// Recupero il logger
		LogInterface logger = getLogger(request);

		// Gestione aggiunta WMS da url
		int i=1;
		ParametriMappa pm = params.getMappe().getMappaList().get(0);
        ParametriLegenda pl = pm.getLegenda();
        
        if (pl != null) {
	        // Aggiunge alla prima categoria
	    	ParametriLegendaCategoria pc = pl.getCategoryList().get(0); // new ParametriLegendaCategoria();
	    	List<ParametriEventiLayer> ell = params.getAzioniEventi().getEventiLayerList();
	    	
			String urlwms = (String) getAttributeOrParameter(request, "url"+i);
			while (urlwms!=null) {
				params.addUrlAdditionalParams("url"+i, urlwms);
				
				// layers
				String[] lays = request.getParameterValues("lay"+i);
				// 
				String scString = ((String) getAttributeOrParameter(request, "sc"+i));
				boolean sc = true;
				if (scString!=null && scString.equals("0")) sc=false;
				
				if (lays!=null && lays.length!=0) {
					params.addUrlAdditionalParams("lay"+i, lays);
					int newCodTPN = params.getNewCodTPN();	
					// Aggiunta tra i server
		            ParametriServer ps = new ParametriServer();
	
		            ps.setId("WMSDAURLPARAMS"+i);
		            ps.setUrl(urlwms);
		            ps.setTypeDescription("WMS");
		            ps.setAllowServerConnection(sc);
		            params.getServerPool().getServerList().add(ps);
		            
		            for (String lay: lays) {
		            	
		            	ParametriLegendaLayer pll = new ParametriLegendaLayer();
		            	pll.setServerID(ps.getId());
		            	pll.setName(lay);
		            	pll.setCodTPN(newCodTPN);
		            	pc.getLayerList().add(pll);
		            	
		            	ParametriEventiLayer pel = new ParametriEventiLayer();
		            	pel.setCodTPN(newCodTPN);
		            	pel.setCopertura(false);
		            	pel.setTipoGeometria(3);
		            	
		            	
		            	ParametriEventoLayerVis p = new ParametriEventoLayerVis();
		            	
		            	p.setAjaxCall(false);
		            	p.setTarget("pannello");
		            	p.setUseWMSGetFeatureInfo(true);
		            	
		            	pel.getAzioniEventiVis().setAutoVisOnSelect(true);
		            	pel.getAzioniEventiVis().addAzione(p);
		            	
		            	ell.add(pel);
		            	
		            }	
				}
				i++;
				urlwms = (String) getAttributeOrParameter(request, "url"+i);
			}
        }
		
		params.updateCatIdxs();
		
		// Sostituisce azioniApertura eventualmente presenti nella request 
		String xmlAzioniApertura = (String) getAttributeOrParameter(request, "azioniApertura");

		if (xmlAzioniApertura!=null) {

			logger.debug("Parametro azioniApertura presente in request: " + xmlAzioniApertura);
			try {
				params.newAzioniApertura(xmlAzioniApertura);
			} catch (TolomeoWebException e) {
				// In caso di problemi con il parametro logga ma prosegue comunque
				logger.warn("Errore nel parametro azioniApertura letto nella request. Valore: " + xmlAzioniApertura, e);
			}
		} else {
			logger.debug("Parametro azioniApertura in request non presente" );
		}

		// Sostituisce layOut eventualmente presenti nella request 
		String xmlLayOut = (String) getAttributeOrParameter(request, "layOut");

		if (xmlLayOut!=null) {
			logger.debug("Parametro layOut presente in request: " + xmlLayOut);
			try {
				params.newLayOut(xmlLayOut);
			} catch (TolomeoWebException e1) {
				// In caso di problemi con il parametro logga ma prosegue comunque
				logger.warn("Errore nel parametro layOut letto nella request. Valore - " + xmlLayOut, e1 );
			}
		} else {
			logger.debug("Parametro layOut in request non presente" );
		}

		// Per ogni layer presente in AzioniEventi e per il quale flag caricaLayerSeparato = true e che non ha mappaLayerSeparato 
		// provvede a creare un nuovo mappaLayerSeparato con il seguente nome
		// map<CODTPN>_<SRID con : sostituiti con _>.map quindi per esempio map-200_EPSG_26591.map
		for (ParametriEventiLayer evLayer : params.getAzioniEventi().getEventiLayerList()) {
			if (evLayer.getCaricaLayerSeparato() && evLayer.getMappaLayerSeparato()== null) {
				ParametriMappa mappaLayer = new ParametriMappa();
				mappaLayer.setNome(evLayer.getDescrizioneLayer());
				mappaLayer.setOverlay(true);
				mappaLayer.setMostraInLegenda(true);
				mappaLayer.setTypeDescription("Mapserver");

				mappaLayer.setUrl(getURLBaseLayerSeparato()+"map" + evLayer.getCodTPN() + "_" + params.getMappe().getSRID().replaceAll(":", "_") + ".map");

				evLayer.setMappaLayerSeparato(mappaLayer);
			}
		} 

		// Sostituisce valori parametri customQuery
		String szParamCustomQuery =  request.getParameter("customQuery");
		// Se definito
		if ((szParamCustomQuery!=null) && (!szParamCustomQuery.equals(""))) {
			try {
				params.modifyCustomQuery(szParamCustomQuery);
			} catch (TolomeoWebException e) {
				// In caso di problemi con il parametro logga ma prosegue comunque
				logger.warn("Errore nel parametro customQuery letto nella request. Valore: " + szParamCustomQuery + " ...proseguo comunque", e);
			}
		}

		if ((params.getAzioniApertura().getModoEditingSingolo()!=null) ){
			// Recupero codTPN del layer di appartenenza dell'oggetto al quale fare zoom
			int codTPN = params.getAzioniApertura().getModoEditingSingolo().getLayerCODTPN().intValue();

			// Recupero il layer
			LayerTerritorio layer = terr.getLayerByCodTPN(codTPN);

			if (layer == null) {
				logger.warn("Layer con codice " + codTPN + " non presente durante l'azione di apertura AzioneZoomToOgg");
			} else {
				// Cerco l'oggetto 
				OggettoTerritorio ogg = layer.cercaIDTPN(params.getAzioniApertura().getModoEditingSingolo().getValoreChiave());   

				if (ogg!=null) {
					// Lo inserisco in un arraylist perchè deve essere passato un JSGeometryArray
					ArrayList<OggettoTerritorio> oggs = new ArrayList<OggettoTerritorio>();
					oggs.add(ogg);

					// Ricavo la stringa JSON corrispondente per aggiornare l'oggetto parametri
					JSONObject jsogg;
					try {
						jsogg = JSGeometry.oggettoTerritorioToJSGeometryArray(oggs, params.getMappe().getSRID(),  logger);
						// Aggiorno l'oggetto parametri
						params.getAzioniApertura().getModoEditingSingolo().setEditingJSGeometry(jsogg);
					} catch (SITException e) {
						logger.warn("SITException cercando si convertire la geometria cercata", e);
						// In caso di errore non fa azioni particolari
					}
				} else {
					params.getAzioniApertura().getModoEditingSingolo().setEditingJSGeometry(null);
				}
			}

		}

		// aggiunta nomi dei layer in condizioneList
		if (params.getAzioniEventi().getEventiLayerList()!=null) {
			for (ParametriEventiLayer pev: params.getAzioniEventi().getEventiLayerList() ) {
				if (pev.getAzioniEventiCanc().getCondizioneList()!=null) {
					for (ParametriEventoCondizione pec: pev.getAzioniEventiCanc().getCondizioneList()) {
						pec.setNomeLayer(terr.getLayerByCodTPN (pec.getCodTPN()).getNome());
					}
				}
				if (pev.getAzioniEventiIns().getCondizioneList()!=null) {
					for (ParametriEventoCondizione pec: pev.getAzioniEventiIns().getCondizioneList()) {
						pec.setNomeLayer(terr.getLayerByCodTPN (pec.getCodTPN()).getNome());
					}
				}
				if (pev.getAzioniEventiUpdateAlpha().getCondizioneList()!=null) {
					for (ParametriEventoCondizione pec: pev.getAzioniEventiUpdateAlpha().getCondizioneList()) {
						pec.setNomeLayer(terr.getLayerByCodTPN (pec.getCodTPN()).getNome());
					}
				}
				if (pev.getAzioniEventiUpdateGeom().getCondizioneList()!=null) {
					for (ParametriEventoCondizione pec: pev.getAzioniEventiUpdateGeom().getCondizioneList()) {
						pec.setNomeLayer(terr.getLayerByCodTPN (pec.getCodTPN()).getNome());
					}
				}
				if (pev.getAzioniEventiVis().getCondizioneList()!=null) {
					for (ParametriEventoCondizione pec: pev.getAzioniEventiVis().getCondizioneList()) {
						pec.setNomeLayer(terr.getLayerByCodTPN (pec.getCodTPN()).getNome());
					}
				}

				for (ParametriEventoLayerCustom ev: pev.getAzioniEventiCustomButtonList().getCustomButtonList()) {
					if (ev.getCondizioneList()!=null) {
						for (ParametriEventoCondizione pec: ev.getCondizioneList()) {
							pec.setNomeLayer(terr.getLayerByCodTPN (pec.getCodTPN()).getNome());
						}
					}                   
				}

			}
		}


		if (bSetZoomToObj)  {
			if (params.getAzioniApertura().getAction().equals(ParametriAzioniApertura.AzioneZoomToOgg)){

				OggettoTerritorio zoomToOgg = getZoomToOggObj(request, params, terr);
				setParamsZoomToObj ( request,  zoomToOgg,  params,  terr);    

			} else {
				if (params.getAzioniApertura().getAction().equals(ParametriAzioniApertura.AzioneZoomTo)){
					// Se necessario converte le coordinate nel sistema di riferimento della prima mappa
					String targetSRID = params.getMappe().getSRID();
					String sourceSRID = params.getAzioniApertura().getSRID();

					if (targetSRID!=sourceSRID) {
						SITPunto pt = new SITPunto(logger, params.getAzioniApertura().getCoordX(), params.getAzioniApertura().getCoordY(),sourceSRID);

						try {
							pt.trasforma(targetSRID);
							params.getAzioniApertura().setCoordX(pt.getX());
							params.getAzioniApertura().setCoordY(pt.getY());
							params.getAzioniApertura().setSRID(targetSRID);
							logger.debug("Convertito coordinate ZoomTo da " +sourceSRID + " a " + targetSRID );
							logger.debug("Nuove coordinate: " +pt.getX() + " - " + pt.getY() );
						} catch (SITException e) {
							logger.warn("Errore durante la conversione di coordinate azione zoomTo - proseguo lo stesso", e);
						}

					}
				}
			}
		}

		String pr = (request.getRequestURL().toString().substring(0, 5).equalsIgnoreCase(("HTTPS"))) ? "https" : "http";
		int localPort = request.getLocalPort();

		// Sostituisco l'url alla mappa col protocollo corretto
		for(ParametriMappa parametriMappa: params.getMappe().getMappaList()){

			String urlS = parametriMappa.getUrl();
			if (urlS!=null && !urlS.equals("")) {
				String regExp = "^([a-zA-Z])+\\:\\/\\/";                
				Pattern pattern = Pattern.compile(regExp);        
				Matcher m = pattern.matcher(urlS);
				if(!m.find()){
					logger.debug("Protocollo non impostato. Impongo " + pr);
					urlS = pr + "://" + urlS;
				}
	
				URL url = new URL(urlS);
	
				int portN = url.getPort();        	        	
				if(portN == -1){        	
					if(localPort != -1){
						logger.debug("Porta non impostata. Impongo " + localPort);
						portN = localPort;  
					}
				}
	
				URI uriMappa = null;
				try {
					String host = url.getHost();
					logger.debug("Valore host in url: " + host);
					host = (host==null || host.equals("")) ? request.getServerName() : host;
					logger.debug("Valore host dopo trasformazione: " + host);
					
					uriMappa = new URI(url.getProtocol(),null,host,portN,url.getPath(),url.getQuery(),null);
					logger.info("URI MAPPA: " + uriMappa);
				} catch (URISyntaxException e) {
					logger.error("URI errore di sintassi", e);
					throw new IOException(e.getMessage());
				}
	
				parametriMappa.setUrl(uriMappa.toString());
			}
		}

		String host = request.getServerName();
		int port = request.getServerPort();

		// Sostituisco nelle url di default il protocollo e l'host corretto
		for (ParametriEventiLayer evlay: params.getAzioniEventi().getEventiLayerList()) {

			if (evlay.getAzioniEventiCanc().getAzioneList()!=null) {
				for (ParametriEventoLayerCanc ev: evlay.getAzioniEventiCanc().getAzioneList() ){
					try {
						ev.changeHostIfDefaultUrl(pr, host, port);
					} catch (URISyntaxException e) {
						logger.warn("URISyntaxException in ToloExtParamsJSServlet", e);
					}
				}
			}

			if (evlay.getAzioniEventiIns().getAzioneList()!=null) {
				for (ParametriEventoLayerIns ev: evlay.getAzioniEventiIns().getAzioneList() ){
					try {
						ev.changeHostIfDefaultUrl(pr, host, port);
					} catch (URISyntaxException e) {
						logger.warn("URISyntaxException in ToloExtParamsJSServlet", e);
					}
				}
			}

			if (evlay.getAzioniEventiUpdateGeom().getAzioneList()!=null) {
				for (ParametriEventoLayerUpdateGeom ev: evlay.getAzioniEventiUpdateGeom().getAzioneList() ){
					try {
						ev.changeHostIfDefaultUrl(pr, host, port);
					} catch (URISyntaxException e) {
						logger.warn("URISyntaxException in ToloExtParamsJSServlet", e);
					}
				}
			}

			if (evlay.getAzioniEventiUpdateAlpha().getAzioneList()!=null) {
				for (ParametriEventoLayerUpdateAlpha ev: evlay.getAzioniEventiUpdateAlpha().getAzioneList() ){
					try {
						ev.changeHostIfDefaultUrl(pr, host, port);
					} catch (URISyntaxException e) {
						logger.warn("URISyntaxException in ToloExtParamsJSServlet", e);
					}
				}
			}   
		}

		int autoLayerCodTpn = Parametri.CODTPNAUTOLAYERBASE;
		for (ParametriMappa mappa: params.getMappe().getMappaList()) {
			/* Scorre la legenda per vedere se ci sono autoLayer  */
			 List<ParametriLegendaLayer> layers = mappa.getLegenda().allLayersList();
			 for (ParametriLegendaLayer layer: layers) {
				 ParametriLegendaLayerAutoLayer paramAutoLayer = layer.getAutoLayer();
				 if (paramAutoLayer != null) {
					 /* se autoLayer definisce azioneEventiLayer */
					 ParametriEventiLayer pel = new ParametriEventiLayer();
					 autoLayerCodTpn++;
					 pel.setCodTPN(autoLayerCodTpn);
					 layer.setCodTPN(autoLayerCodTpn);
					 String desc = layer.getDescrizione();
					 if (desc==null || desc=="") {
						 desc = layer.getName();
					 }
					 pel.setDescrizioneLayer(desc);
					 
					 if (paramAutoLayer.getIdentifyAllowed()) {
						 /* Se da abilitare identify */
						ParametriEventoLayerVis pev = new ParametriEventoLayerVis();
						pev.setUseWMSGetFeatureInfo(true);
						pev.setAjaxCall(false);
						pev.setTarget(paramAutoLayer.getTarget());
						pev.setMethod(paramAutoLayer.getMethod());
						pev.setNoTolomeoDefaultParams(paramAutoLayer.getNoTolomeoDefaultParams());
						pel.getAzioniEventiVis().addAzione(pev);
					 }
					 
					 // Imposta autoVisOnSelect 
					 pel.getAzioniEventiVis().setAutoVisOnSelect(paramAutoLayer.getAutoVisOnSelect());
					 
					 // Imposta autoidentify
					 pel.setAutoIdentifyAllowed(paramAutoLayer.getAutoIdentifyAllowed());
					 pel.setAutoIdentifyWithHighlight(paramAutoLayer.getAutoIdentifyWithHighlight());
					 
					 params.getAzioniEventi().addEventiLayer(pel);
				 }
			}
		}
		
		loadContextDefaultParams(request,params,logger);
		return params;
	}

	protected void setParamsZoomToObj (HttpServletRequest request, OggettoTerritorio zoomToOgg, Parametri params, SITLayersManager terr) {
		// Recupero il logger
		LogInterface logger = getLogger(request);

		if (zoomToOgg != null) {
			// Lo inserisco in un arraylist perchè deve essere passato un JSGeometryArray
			ArrayList<OggettoTerritorio> oggs = new ArrayList<OggettoTerritorio>();
			oggs.add(zoomToOgg);

			// Ricavo la stringa JSON corrispondente per aggiornare l'oggetto parametri
			JSONObject jsogg;
			try {
				jsogg = JSGeometry.oggettoTerritorioToJSGeometryArray(oggs, params.getMappe().getSRID(),  logger);
				logger.debug("setZoomToJSGeometry - " + jsogg.toString());
				// Aggiorno l'oggetto parametri
				params.getAzioniApertura().setZoomToJSGeometry(jsogg);
			} catch (SITException e) {
				logger.warn("SITException cercando si convertire la geometria cercata", e);
				// In caso di errore non fa azioni particolari
			}
		}
	}

	protected OggettoTerritorio getZoomToOggObj(HttpServletRequest request, Parametri params, SITLayersManager terr) {

		// Recupero il logger
		LogInterface logger = getLogger(request);

		// Controlla se azione apertura richiede pre-elaborazione
		if (params.getAzioniApertura().getAction().equals(ParametriAzioniApertura.AzioneZoomToOgg)){
			// Azione zoomToOgg -> Zoom to oggetto

			// Recupero codTPN del layer di appartenenza dell'oggetto al quale fare zoom
			int codTPN = params.getAzioniApertura().getZoomToCodTPN().intValue();

			// Recupero il layer
			LayerTerritorio layer = terr.getLayerByCodTPN(codTPN);
			if (layer == null) {
				logger.warn("Layer con codice " + codTPN + " non e' presente durante l'azione di apertura AzioneZoomToOgg");
				// Prosegue ugualmente
			} else {
				// Cerco l'oggetto al quale deve essere fatto lo zoom
				OggettoTerritorio ogg = layer.cercaIDTPN(params.getAzioniApertura().getZoomToIdTPN());
				if (ogg == null) {
					String msg = "Oggetto " + params.getAzioniApertura().getZoomToIdTPN() + " non presente nel layer " + layer.getNome() + " durante l'azione di apertura AzioneZoomToOgg";
					logger.warn(msg);
					// Prosegue ugualmente
					return null;
				} else {
					return ogg;
				}
			}
		} 
		return null;
	}


	/**
	 * Restituisce un parametro della request preoccupandosi dei charset
	 * @param request
	 * @param paramName
	 * @return
	 */
	protected String getParameter(HttpServletRequest request, String paramName){

		String param = request.getParameter(paramName);

		//////////// PER ADESSO EVITO IL RESTO /////////
		if(true) return param;
		////////////////////////////////////////////////

		if(param == null){
			return null;
		}
		String method = request.getMethod();
		String connectorUriEncoding = getServletContext().getInitParameter("connectorUriEncoding");
		// se non specifico diversamente con un parametro di contesto presumo che la codifica degli URI fatta dal connettore 
		// sia quella di default ovvero ISO-8859-1
		if(connectorUriEncoding == null){
			connectorUriEncoding = "ISO-8859-1";
		}

		String charset = request.getParameter(PARAM__CHARSET);                     

		getLogger(request).debug("method = " + method);
		getLogger(request).debug("connectorUriEncoding = " + connectorUriEncoding);
		getLogger(request).debug("charset passato = " + charset);
		getLogger(request).debug("param = " + param);
		getLogger(request).debug("request.getCharacterEncoding = " + request.getCharacterEncoding());
		getLogger(request).debug("request.getContentType = " + request.getContentType());

		if(method != null){
			if(method.equals("GET")){
				// se non mi è stato specificato il charset come parametro presumo UTF-8 
				if(charset == null || charset.equals("")){
					charset = "UTF-8";
				} else {
					charset = charset.toUpperCase();
				}

				if(!charset.equals(connectorUriEncoding)){
					try {
						getLogger(request).debug("Ricodifico il parametro da " + connectorUriEncoding + " a " + charset);
						param = URLDecoder.decode(URLEncoder.encode(param,connectorUriEncoding),charset); //new String(param.getBytes(connectorUriEncoding),charset);
						getLogger(request).debug("param = " + param);
					} catch (UnsupportedEncodingException e) {
						getLogger(request).error("Codifica non supportata : " + charset,e);
					}
				}
			}
			/*
           else if(method.equalsIgnoreCase("POST")){
               String characterEncoding = request.getCharacterEncoding().toUpperCase();
               getLogger(request).debug("characterEncoding = " + characterEncoding);
               // se non mi è stato specificato il charset come parametro presumo che il charset sia quello della request
               if(charset != null && !charset.equals("")){
                   charset = charset.toUpperCase();
                   if(!charset.equals(characterEncoding)){
                       try {
                           getLogger(request).debug("Ricodifico il parametro da " + characterEncoding + " a " + charset);
                           param = new String(param.getBytes(characterEncoding),charset);//URLDecoder.decode(URLEncoder.encode(param,request.getCharacterEncoding()),charset);
                           getLogger(request).debug("param = " + param);
                       } catch (UnsupportedEncodingException e) {
                           getLogger(request).error("Codifica non supportata : " + charset,e);
                       }
                   }
               }               
           }
			 */   
		}

		return param;
	}

}

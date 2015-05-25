package it.prato.comune.tolomeo.web.parametri;

/**
 * Bean contenente le informazioni di attivazione di unb layer automatico.
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class ParametriLegendaLayerAutoLayer {

	/** Indica che è attivata la funzionalità di identify. */
	private Boolean identifyAllowed = true;
	/** Indica se attivare la funzionalità di autoIdentify. */
	private Boolean autoIdentifyAllowed = false;
	/** Indica se attivare la funzionalità di autoVisOnSelect (visualizzazione identify 
	 * non appena viene selezionato un oggetto */
	private Boolean autoVisOnSelect = false;
	/** Indica che la funzione di autoidentify evidenzia la geometria. */
	private Boolean autoIdentifyWithHighlight = true;
	/** Target html sul quale aprire la pagina di identify. */
	private String target = "pannello";
	/** Infoformat da utilizzare per la richiesta GetFeatureInfo. */
	private String defaultInfoFormat = "application/vnd.ogc.gml";
	/** Regular expression di cui cercare i match per verificare se si sono incrociate features in caso di defaultInfoFormat  "text/html" o "text/plain". */
	private String regExpToCheckIfDataFound = "";
	/** Testo da cercare per verificare se sono state incrociate features in caso di defaultInfoFormat  "text/html" o "text/plain". */
	private String textToCheckIfDataFound = "";
	/** Espressione BeanShell per calcolare la descrizione dell'oggetto */ 
 	private String espressioneDescrizione = "\"Descrizione \"+attributes.get(\"##FID##\")";
 	/** Espressione BeanShell per calcolare IDTPN dell'oggetto */
	private String espressioneIDTPN = "attributes.get(\"##FID##\")";
	/** Metodo utilizzato per effettuare la richiesta */
	private String method = null;
	/** Flag che indica se devono essere inclusi i parametri default di Tolomeo. True per non includerli */
	private Boolean	   noTolomeoDefaultParams=false;
	
	/**
	 * Restituisce se è attivata la funzionalità di identify.
	 * 
	 * @return true se è attivata
	 */
	public final Boolean getIdentifyAllowed() {
		return identifyAllowed;
	}
	
	/**
	 * Imposta se è attivata la funzionalità di identify.
	 * 
	 * @param true se deve essere attivata
	 */
	public final void setIdentifyAllowed(final Boolean identifyAllowed) {
		this.identifyAllowed = identifyAllowed;
	}
	
	/**
	 * Restituisce se è attivata la funzionalità di autoIdentify.
	 * 
	 * @return true se è attivata
	 */
	public final Boolean getAutoIdentifyAllowed() {
		return autoIdentifyAllowed;
	}
	
	/**
	 * Imposta se è attivata la funzionalità di autoIdentify.
	 * 
	 * @param true se deve essere attivata
	 */
	public final void setAutoIdentifyAllowed(final Boolean autoIdentifyAllowed) {
		this.autoIdentifyAllowed = autoIdentifyAllowed;
	}
	
	/**
	 * Restituisce se la funzione di autoitentify evidenzia la geometria.
	 *  
	 * @return true se la funzione di autoitentify evidenzia la geometria.
	 */
	public final Boolean getAutoIdentifyWithHighlight() {
		return autoIdentifyWithHighlight;
	}
	
	/**
	 * Imposta se la funzione di autoidentify deve evidenziare la geometria.
	 *  
	 * @param autoIdentifyWithHighlight true se deve evidenziare la geometria.
	 */
	public final void setAutoIdentifyWithHighlight(final Boolean autoIdentifyWithHighlight) {
		this.autoIdentifyWithHighlight = autoIdentifyWithHighlight;
	}


	/**
	 * Imposta su quale target html sul quale aprire la pagina di identify.
	 * 
	 * @return il target da impostare
	 */
	public final String getTarget() {
		return target;
	}

	/**
	 *  Restituisce il target html sul quale aprire la pagina di identify.
	 * 
	 * @param target valore di target
	 */
	public final void setTarget(final String target) {
		this.target = target;
	}

	/**
	 * Restituisce infoformat utilizzato per la richiesta GetFeatureInfo.
	 * @return valore di infoformat
	 */
	public final String getDefaultInfoFormat() {
		return defaultInfoFormat;
	}

	/**
	 * Imposta  infoformat da utilizzare per la richiesta GetFeatureInfo.
	 * 
	 * @param defaultInfoFormat informat da impostare
	 */
	public final void setDefaultInfoFormat(final String defaultInfoFormat) {
		this.defaultInfoFormat = defaultInfoFormat;
	}
	
	/**
	 * Restituisce Regular expression di cui cercare i match per verificare se si sono incrociate features in caso di defaultInfoFormat  "text/html" o "text/plain".
	 * 
	 * @return valore di regExpToCheckIfDataFound
	 */
	public final String getRegExpToCheckIfDataFound() {
		return regExpToCheckIfDataFound;
	}

	/**
	 * Imposta la Regular expression di cui cercare i match per verificare se si sono incrociate features in caso di defaultInfoFormat  "text/html" o "text/plain".
	 * 
	 * @param regExpToCheckIfDataFound valore da impostare
	 */
	public final void setRegExpToCheckIfDataFound(final String regExpToCheckIfDataFound) {
		this.regExpToCheckIfDataFound = regExpToCheckIfDataFound;
	}

	/**
	 * Restuituisce il testo da cercare per verificare se sono state incrociate features in caso di defaultInfoFormat  "text/html" o "text/plain".
	 *  
	 * @return valore di textToCheckIfDataFound
	 */
	public final String getTextToCheckIfDataFound() {
		return textToCheckIfDataFound;
	}

	/**
	 * Imposta il testo da cercare per verificare se sono state incrociate features in caso di defaultInfoFormat  "text/html" o "text/plain".
	 * 
	 * @param textToCheckIfDataFound valore da impostare
	 */
	public final void setTextToCheckIfDataFound(final String textToCheckIfDataFound) {
		this.textToCheckIfDataFound = textToCheckIfDataFound;
	}
	
	/**
	 * Restituisce l'espressione BeanShell per calcolare la descrizione dell'oggetto.
	 * 
	 * @return restituisce il valore
	 */
	public final String getEspressioneDescrizione() {
		return espressioneDescrizione;
	}

	/**
	 * Imposta l'spressione BeanShell per calcolare la descrizione dell'oggetto.
	 * 
	 * @param espressioneDescrizione valore da impostare
	 */
	public final void setEspressioneDescrizione(final String espressioneDescrizione) {
		this.espressioneDescrizione = espressioneDescrizione;
	}

	/**
	 * Restituisce l'espressione BeanShell per calcolare IDTPN dell'oggetto.
	 * 
	 * @return restituisce il valore
	 */
	public final String getEspressioneIDTPN() {
		return espressioneIDTPN;
	}

	/**
	 * Imposta l'espressione BeanShell per calcolare IDTPN dell'oggetto.
	 * 
	 * @param espressioneIDTPN espressione da impostare
	 */
	public final void setEspressioneIDTPN(final String espressioneIDTPN) {
		this.espressioneIDTPN = espressioneIDTPN;
	}

	/**
	 * Indica se è attivata la funzionalità di autoVisOnSelect (visualizzazione identify 
	 * non appena viene selezionato un oggetto.
	 * 
	 * @return true se la funzionalità è attiva.
	 */
	public final Boolean getAutoVisOnSelect() {
		return autoVisOnSelect;
	}

	/**
	 * Indica se è attivare  la funzionalità di autoVisOnSelect (visualizzazione identify 
	 * non appena viene selezionato un oggetto.
	 * 
	 * @param autoVisOnSelect valore da impostare
	 */
	public final void setAutoVisOnSelect(final Boolean autoVisOnSelect) {
		this.autoVisOnSelect = autoVisOnSelect;
	}
	

	/**
	 * Indica se devono essere inclusi i parametri default di Tolomeo
	 * @return true se non devono essere inclusi
	 */
	public Boolean getNoTolomeoDefaultParams() {
		return noTolomeoDefaultParams;
	}
	
	/**
	 * Imposta un flag che indica se devono essere inclusi i parametri default di Tolomeo
	 * @param noTolomeoDefaultParams true se non devono essere inclusi
	 */
	public void setNoTolomeoDefaultParams(Boolean noTolomeoDefaultParams) {
		this.noTolomeoDefaultParams = noTolomeoDefaultParams;
	}
	
	/**
	 * Recupera il metodo utilizzato per effettuare la richiesta 
	 * @return GET o POST
	 */
	public String getMethod() {
        return method;
    }

	/**
	 * Imposta il metodo da utilizzare per effettuare la richiesta
	 * @param GET o POST
	 */
    public void setMethod(String method) {
        this.method = method;
    }
    
}

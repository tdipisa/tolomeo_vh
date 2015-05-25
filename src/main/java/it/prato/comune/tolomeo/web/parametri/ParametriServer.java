package it.prato.comune.tolomeo.web.parametri;

import java.util.HashMap;

public class ParametriServer {

	private static final HashMap<String, Integer> mapTypes = new HashMap<String, Integer>();

	public static final int typeMapserver       = 0;
	public static final int typeGoogleStreets   = 1;
	public static final int typeGooglePhysical  = 2;
	public static final int typeGoogleSatellite = 3;
	public static final int typeGoogleHybrid    = 4;
	public static final int typeYahooSat        = 5;
	public static final int typeYahooReg        = 6;
	public static final int typeYahooHyb        = 7;
	public static final int typeBingAerial      = 8;
	public static final int typeBingShaded      = 9;
	public static final int typeBingHybrid      = 10;
	public static final int typeWMS             = 11;
	public static final int typeOSM             = 12;

	static {
		mapTypes.put("Mapserver",        typeMapserver);
		mapTypes.put("Google Streets",   typeGoogleStreets);
		mapTypes.put("Google Physical",  typeGooglePhysical);
		mapTypes.put("Google Satellite", typeGoogleSatellite);
		mapTypes.put("Google Hybrid",    typeGoogleHybrid);
		mapTypes.put("Yahoo Satellite",  typeYahooSat);
		mapTypes.put("Yahoo Reg",        typeYahooReg);
		mapTypes.put("Yahoo Hybrid",     typeYahooHyb);
		mapTypes.put("Bing Aerial",      typeBingAerial);
		mapTypes.put("Bing Shaded",      typeBingShaded);
		mapTypes.put("Bing Hybrid",      typeBingHybrid);
		mapTypes.put("WMS",              typeWMS);
		mapTypes.put("OpenStreetMap",    typeOSM);
	}
	
	private String	id						= null;
	private String 	nome 					= null;
	private String	typeDescription       	= "Mapserver";
	private Integer typeCode             	= 0;
	private String	nomeCredenziale   		= null;
	private Boolean	allowServerConnection 	= false;
	private String	url          		  	= null;
	private String	serverOpts				= null;
	private Boolean	tilesMultiple 			= false;
	private Integer tileStampaAltezza		= null;
	private Integer tileStampaLarghezza		= null;
	private Boolean noTolomeoParams			= false;
	private Float opacity                   = 1.0f;
	private Boolean showInWMSExplorer		= true;
	private Boolean usaProxyPer3D			= true;
	/**
	 Url del proxy da utilizzare per accedere ai WMS per il 3d
	 Se non impostato viene preso un default impostano in javascript, non essendo possibile/pratico 
	 impostare qua un default che tenga conto del contesto tomcat
	 */
	private String  proxyPer3dUrl			= null;
	
	public ParametriServer() {
	
	}

	/**
	 * @return the nome
	 */
	public String getNome() {
		return nome;
	}

	/**
	 * @param nome the nome to set
	 */
	public void setNome(String nome) {
		this.nome = nome;
	}

	/**
	 * @return the typeDescription
	 */
	public String getTypeDescription() {
		return typeDescription;
	}

	/**
	 * @param typeDescription the typeDescription to set
	 */
	public void setTypeDescription(String typeDescription) {
		this.typeDescription = typeDescription;
		this.typeCode = mapTypes.get(typeDescription);
	}

	/**
	 * @return the typeCode
	 */
	public Integer getTypeCode() {
		return typeCode;
	}

	/**
	 * @param typeCode the typeCode to set
	 */
	public void setTypeCode(Integer typeCode) {
		this.typeCode = typeCode;
	}

	/**
	 * @return the nomeCredenzialeREST
	 */
	public String getNomeCredenziale() {
		return nomeCredenziale;
	}

	/**
	 * @param nomeCredenzialeREST the nomeCredenzialeREST to set
	 */
	public void setNomeCredenziale(String nomeCredenziale) {
		this.nomeCredenziale = nomeCredenziale;
	}

	/**
	 * @return the allowServerConnection
	 */
	public Boolean getAllowServerConnection() {
		return allowServerConnection;
	}

	/**
	 * @param allowServerConnection the allowServerConnection to set
	 */
	public void setAllowServerConnection(Boolean allowServerConnection) {
		this.allowServerConnection = allowServerConnection;
	}

	/**
	 * @return the url
	 */
	public String getUrl() {
		return url;
	}

	/**
	 * @param url the url to set
	 */
	public void setUrl(String url) {
		this.url = url;
	}

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the serverOpts
	 */
	public String getServerOpts() {
		return serverOpts;
	}

	/**
	 * @param serverOpts the serverOpts to set
	 */
	public void setServerOpts(String serverOpts) {
		this.serverOpts = serverOpts;
	}

	/**
	 * @return the tilesMultiple
	 */
	public Boolean getTilesMultiple() {
		return tilesMultiple;
	}

	/**
	 * @param tilesMultiple the tilesMultiple to set
	 */
	public void setTilesMultiple(Boolean tilesMultiple) {
		this.tilesMultiple = tilesMultiple;
	}

	/**
	 * @return the tileStampaAltezza
	 */
	public Integer getTileStampaAltezza() {
		return tileStampaAltezza;
	}

	/**
	 * @param tileStampaAltezza the tileStampaAltezza to set
	 */
	public void setTileStampaAltezza(Integer tileStampaAltezza) {
		this.tileStampaAltezza = tileStampaAltezza;
	}

	/**
	 * @return the tileStampaLarghezza
	 */
	public Integer getTileStampaLarghezza() {
		return tileStampaLarghezza;
	}

	/**
	 * @param tileStampaLarghezza the tileStampaLarghezza to set
	 */
	public void setTileStampaLarghezza(Integer tileStampaLarghezza) {
		this.tileStampaLarghezza = tileStampaLarghezza;
	}

	/**
	 * @return the noTolomeoParams
	 */
	public Boolean getNoTolomeoParams() {
		return noTolomeoParams;
	}

	/**
	 * @param noTolomeoParams the noTolomeoParams to set
	 */
	public void setNoTolomeoParams(Boolean noTolomeoParams) {
		this.noTolomeoParams = noTolomeoParams;
	}

	/**
	 * To get opacity value
	 * @return opacity
	 */
    public Float getOpacity() {
        return opacity;
    }

    /**
     * To set opacity (from 0.0 to 1.0)
     * @param opacity
     */
    public void setOpacity(Float opacity) {
        this.opacity = opacity;
    }

	/**
	 * @return the showInWMSExplorer
	 */
	public Boolean getShowInWMSExplorer() {
		return showInWMSExplorer;
	}

	/**
	 * @param showInWMSExplorer the showInWMSExplorer to set
	 */
	public void setShowInWMSExplorer(Boolean showInWMSExplorer) {
		this.showInWMSExplorer = showInWMSExplorer;
	}

	/**
	 * Recupera l'url del proxy da utilizzare per la visualizzazione in 3D per evitare problemi di Cross Domain Ajax Call. 
	 * Il valore di default è il proxy integrato in tolomeo.
	 * L'effettivo utilizzo di un proxy è controllato dal tag usaProxyPer3D nel preset.
	 * 
	 * @return Ritorna il valore impostato
	 */
	public String getProxyPer3dUrl() {
		return proxyPer3dUrl;
	}

	/**
	 * Imposta l'url del proxy da utilizzare per la visualizzazione in 3D per evitare problemi di Cross Domain Ajax Call. 
	 * L'effettivo utilizzo di un proxy è controllato dal tag usaProxyPer3D nel preset.
	 * 
	 * @param proxyPer3dUrl the proxyPer3dUrl to set
	 */
	public void setProxyPer3dUrl(String proxyPer3dUrl) {
		this.proxyPer3dUrl = proxyPer3dUrl;
	}

	/**
	 * Indica se per la visualizzazione in 3D deve essere utilizzato un proxy per evitare problemi di Cross Domain Ajax Call
	 * 
	 * @return true se deve essere utilizzato un proxy, false altrimenti
	 */
	public Boolean getUsaProxyPer3D() {
		return usaProxyPer3D;
	}

	/**
	 * Imposta se per la visualizzazione in 3D deve essere utilizzato un proxy per evitare problemi di Cross Domain Ajax Call
	 * 
	 * @param usaProxyPer3D valore da impostare
	 */
	public void setUsaProxyPer3D(Boolean usaProxyPer3D) {
		this.usaProxyPer3D = usaProxyPer3D;
	}	
	
}

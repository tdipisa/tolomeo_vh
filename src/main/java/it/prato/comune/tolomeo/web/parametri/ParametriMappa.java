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
package it.prato.comune.tolomeo.web.parametri;

import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Classe nella quale viene deserializzato il tag parametriMappa del file di preset. <br/>
 *  Contiene i parametri della mappa <br/>
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class ParametriMappa {

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

	private String 							url            		  = null;
	private Boolean							allowServerConnection = true;
	private Boolean 						mostraInLegenda 	  = true;
	private String 							mapOptions            = ""; //"layers: \"all\"";
	private String 							viewerOptions         = "";
	private Boolean 						overlay               = false;
	private Boolean 						tilesMultiple         = false;
	private Integer 						typeCode              = 0;
	private String  						typeDescription       = "Mapserver";
	private String  						SRID                  = "EPSG:3003"; 
	private String  						units                 = "m";
	private String  	                    nome                  = null;
	private ParametriLegenda                legenda               = null;
	private ParametriSfondo                 sfondo                = null;
	private ArrayList<ParametriCustomQuery> customQueryList       = new ArrayList<ParametriCustomQuery>();
	private String                          printImageType        = "png";
	private String                          printLayers           = "all";
	private String                          printImageSize        = "700+700";
    private Integer                         tileStampaAltezza = null;
    private Integer                         tileStampaLarghezza = null;
    private Float                           opacity = null;
	
//	private ParametriTimeMachine            timeMachine           = null;
	
	private List<ParametriTimeMachine>      timeMachineList       = new ArrayList<ParametriTimeMachine>();
	
	private String                          nomeCredenzialeREST   = null;
	
	/** Parametri di impostazione per la mappa localizzatore.  */
	private ParametriMappaOverview 			overview = null;
	
	/**
	 * Getter parametri Time Machine
	 * 
	 * @return
	 */
//	public ParametriTimeMachine getTimeMachine() {
//		return timeMachine;
//	}

	/**
	 * Setter parametri Time Machine
	 * 
	 * @param timeMachine
	 */
//	public void setTimeMachine(ParametriTimeMachine timeMachine) {
//		this.timeMachine = timeMachine;
//	}

	/**
	 * Getter tipo immagine utilizzata per stampa
	 * 
	 * @return
	 */
	public String getPrintImageType() {
		return printImageType;
	}

	/** 
	 * Setter  tipo immagine utilizzata per stampa
	 * @param printImageType
	 */
	public void setPrintImageType(String printImageType) {
		this.printImageType = printImageType;
	}


	public String getPrintLayers() {
		return printLayers;
	}

	public void setPrintLayers(String printLayers) {
		this.printLayers = printLayers;
	}

	public String getPrintImageSize() {
		return printImageSize;
	}

	public void setPrintImageSize(String printImageSize) {
		this.printImageSize = printImageSize;
	}

	public ArrayList<ParametriCustomQuery> getCustomQueryList() {
		return customQueryList;
	}

	public void addCustomQuery(ParametriCustomQuery a) {
		customQueryList.add(a);        
	}

	public List<ParametriTimeMachine> getTimeMachineList() {
		return timeMachineList;
	}

	public void addTimeMachine(ParametriTimeMachine a) {
		timeMachineList.add(a);        
	}
	
	public String getUrl() {
		return url;
	}
	public String getMapOptions() {
		return mapOptions;
	}
	public String getViewerOptions() {
		return viewerOptions;
	}
	public Boolean getOverlay() {
		return overlay;
	}

	public Boolean getTilesMultiple() {
		return tilesMultiple;
	}

	public void setTilesMultiple(Boolean tilesMultiple) {
		this.tilesMultiple = tilesMultiple;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	public void setMapOptions(String mapOptions) {
		this.mapOptions = mapOptions;
	}
	public void setViewerOptions(String viewerOptions) {
		this.viewerOptions = viewerOptions;
	}
	public void setOverlay(Boolean overlay) {
		this.overlay = overlay;
	}
	public String getTypeDescription() {
		return typeDescription;
	}
	public void setTypeDescription(String typeDescription) {
		this.typeDescription = typeDescription;
		this.typeCode = mapTypes.get(typeDescription);
	}
	public Integer getTypeCode() {
		return typeCode;
	}
	public String getSRID() {
		return SRID;
	}
	public void setSRID(String srid) {
		SRID = srid;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getUnits() {
		return units;
	}
	public void setUnits(String units) {
		this.units = units;
	}
	public Boolean getMostraInLegenda() {
		return mostraInLegenda;
	}
	public void setMostraInLegenda(Boolean mostraInLegenda) {
		this.mostraInLegenda = mostraInLegenda;
	}
	public ParametriLegenda getLegenda() {
		return legenda;
	}
	public void setLegenda(ParametriLegenda legenda) {
		this.legenda = legenda;
	}

	/** 
	 * Getter parametri sfondo
	 * 
	 * @return
	 */
	 public ParametriSfondo getSfondo() {
		return sfondo;
	}

	/**
	 * Setter parametri sfondo
	 * 
	 * @param sfondo
	 */
	 public void setSfondo(ParametriSfondo sfondo) {
		this.sfondo = sfondo;
	}

	/** 
	 * Getter nome credenziale REST. La credenziale è necessaria per esempio per geoserver che consente tramite rest di recuperare parametri per stili e legenda. <br/>
	 * Il nome deve corrispondere a credenziali definite in file di configurazione. vedi {@link TolomeoApplicationContext#getRestCredential}
	 * @return
	 */
	 public String getNomeCredenzialeREST() {
		 return nomeCredenzialeREST;
	 }

	 /**
	  * Setter nome della credenziale REST. vedi {@link TolomeoApplicationContext#getRestCredential}
	  * @param nomeCredenzialeREST
	  */
	 public void setNomeCredenzialeREST(String nomeCredenzialeREST) {
		 this.nomeCredenzialeREST = nomeCredenzialeREST;
	 }

	 /**
	  * Setter del valore allowServerConnection che indica se il server può all'occorrenza interrogare il servizio WMS 
	  * o simili per recuperare per esempio la getCapabilities
	  * 
	  * @param allowServerConnection 
	  */
	 public void setAllowServerConnection(Boolean allowServerConnection) {
		 this.allowServerConnection = allowServerConnection;
	 }

	 /**
	  * Getter del valore allowServerConnection
	  * @return il valore del campo
	  */
	 public Boolean getAllowServerConnection() {
		 return allowServerConnection;
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
    
    public ParametriServer getDefaultServer(){
        ParametriServer ps = new ParametriServer();
        ps.setUrl(this.getUrl());
        
        ps.setTilesMultiple(this.getTilesMultiple());
        
        ps.setAllowServerConnection(allowServerConnection);
        ps.setNome(nome);        
        ps.setNomeCredenziale(nomeCredenzialeREST);        
        ps.setOpacity(opacity);
        ps.setServerOpts(mapOptions);        
        ps.setTilesMultiple(tilesMultiple);
        ps.setTileStampaAltezza(tileStampaAltezza);
        ps.setTileStampaLarghezza(tileStampaLarghezza);
        ps.setTypeDescription(typeDescription);
        ps.setUrl(url);
        return ps;
    }

	/**
	 * @return the overview
	 */
	public ParametriMappaOverview getOverview() {
		return overview;
	}

	/**
	 * @param overview the overview to set
	 */
	public void setOverview(ParametriMappaOverview overview) {
		this.overview = overview;
	}

}

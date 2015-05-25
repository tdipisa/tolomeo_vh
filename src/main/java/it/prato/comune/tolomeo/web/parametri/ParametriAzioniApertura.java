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

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONObject;


public class ParametriAzioniApertura {
    
    // Azione da eseguire all'apertura. Valori possibili
    //  - ZoomTo: centra su coordX, coordY con zoom
    //  - ZoomToOgg:  fa zoomToExtent dell'oggetto identificato da zoomToCodTPN e zoomToIdTPN 
    //             e seleziona l'oggetto stesso. L'oggetto viene trovato dalla servlet 
    //             che poi lo serializza in zoomToJSGeometry
    public static final String AzioneZoomTo = "ZoomTo";
    public static final String AzioneZoomToOgg = "ZoomToOgg";
    
    private String action = "";
	private Double coordX = 0.;
	private Double coordY = 0.;
	private Double distanceFromRef = null;
	
	private Long zoom = 300L;
	private String SRID = "EPSG:3003";
	
	// Parametri per zoom to oggetto (VisOgg) 
	private Integer zoomToCodTPN = null;        // id nel package sit del layer 
	private String  zoomToIdTPN = null;         // valore della chiave (zoomToIdTPN)
	private JSONObject  zoomToJSGeometry=null;     // jsGeometry corrispondente ai 2 parametri sopra
	                                           // determinata dalla servlet a partire dai parametri. 
	                                           // Viene comunque passato un array di oggetti (per maggiore possibilità di estensione futura)
	
	private ParametriAzioniEditingSingolo modoEditingSingolo = null; 
	
	//private String zoomMinMax = "";
	//private DateType dataStor = new DateType();
	private String urlPannello = "";
	private String method = null;
	private Boolean pannelloChiuso = true; 
	private Boolean conFrame = true;
	public String linkRicerca = "";
	
	public boolean parse(HttpServletRequest request) {
		
		action = request.getParameter("paramAction");
		coordX = Double.parseDouble(request.getParameter("paramCordX"));
		coordY = Double.parseDouble(request.getParameter("paramCordY"));
		zoom = Long.parseLong(request.getParameter("paramZoom"));

		//zoomMinMax = request.getParameter("paramActionZoomMinMax"); //TODO to split
		//dataStor = new DateType("paramDataStor");
		urlPannello = request.getParameter("paramURLPannello");
		conFrame = Boolean.parseBoolean(request.getParameter("paramConFrame"));
		
		return true;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public Boolean getConFrame() {
		return conFrame;
	}

	public void setConFrame(Boolean conFrame) {
		this.conFrame = conFrame;
	}

	public Double getCoordX() {
		return coordX;
	}

	public void setCoordX(Double coordX) {
		this.coordX = coordX;
	}

	public Double getCoordY() {
		return coordY;
	}

	public void setCoordY(Double coordY) {
		this.coordY = coordY;
	}	
	
/*
	public DateType getDataStor() {
		return dataStor;
	}

	public void setDataStor(DateType dataStor) {
		this.dataStor = dataStor;
	}
*/

    public String getLinkRicerca() {
		return linkRicerca;
	}

	public void setLinkRicerca(String linkRicerca) {
		this.linkRicerca = linkRicerca;
	}

	public String getUrlPannello() {
		return urlPannello;
	}

	public void setUrlPannello(String urlPannello) {
		this.urlPannello = urlPannello;
	}

	public Boolean getPannelloChiuso() {
		return pannelloChiuso;
	}

	public void setPannelloChiuso(Boolean pannelloChiuso) {
		this.pannelloChiuso = pannelloChiuso;
	}
	
	public Long getZoom() {
		return zoom;
	}

	public void setZoom(Long zoom) {
		this.zoom = zoom;
	}


    public JSONObject getZoomToJSGeometry() {
        return zoomToJSGeometry;
    }

    public void setZoomToJSGeometry(JSONObject zoomToJSGeometry) {
        this.zoomToJSGeometry = zoomToJSGeometry;
    }

    public Integer getZoomToCodTPN() {
        return zoomToCodTPN;
    }

    public void setZoomToCodTPN(Integer zoomToCodTPN) {
        this.zoomToCodTPN = zoomToCodTPN;
    }

    public String getZoomToIdTPN() {
        return zoomToIdTPN;
    }

    public void setZoomToIdTPN(String zoomToIdTPN) {
        this.zoomToIdTPN = zoomToIdTPN;
    }

    public ParametriAzioniEditingSingolo getModoEditingSingolo() {
        return modoEditingSingolo;
    }

    public void setModoEditingSingolo(
            ParametriAzioniEditingSingolo modoEditingSingolo) {
        this.modoEditingSingolo = modoEditingSingolo;
    }

    public String getSRID() {
        return SRID;
    }

    public void setSRID(String srid) {
        SRID = srid;
    }

    public Double getDistanceFromRef() {
        return distanceFromRef;
    }

    public void setDistanceFromRef(Double distanceFromRef) {
        this.distanceFromRef = distanceFromRef;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }        

}

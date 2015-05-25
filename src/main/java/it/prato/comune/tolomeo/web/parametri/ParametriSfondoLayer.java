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

import java.io.Serializable;

/**
 * Classe nella quale viene deserializzata da file di preset la parte che contiene i parametri relativi ad un file di sfondo. <br/>
 * Un layer di sfondo è un layer che non compare in legenda ma che viene ugualmente richiesto al motore di rendering (mapserver o altri) e visualizzato
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class ParametriSfondoLayer  implements Serializable{
    
	private static final long serialVersionUID = -4929961348621865978L;
	private String name="";
    private Integer codTPN=0;
    private String descrizione="";
    private String stile="";
    private String serverID = null;
    private Float opacity;
    
    /**
     * Costruttore
     * 
     */
    public ParametriSfondoLayer() {
    }

    /** 
     * Getter nome del layer
     * 
     * @return
     */
    public String getName() {
        return name;
    }

    /** 
     * Setter del nome
     * 
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Getter codTPN
     * 
     * @return
     */
    public Integer getCodTPN() {
        return codTPN;
    }

    /**
     * Setter codTPN
     * 
     * @param codTPN
     */
    public void setCodTPN(Integer codTPN) {
        this.codTPN = codTPN;
    }

    /**
     * Getter descrizione
     * 
     * @return
     */
	public String getDescrizione() {
		return descrizione;
	}

	/** 
	 * Setter descrizione
	 * 
	 * @param descrizione
	 */
	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

	/** 
	 * Getter stile 
	 * 
	 * @return
	 */
	public String getStile() {
		return stile;
	}

	/**
	 * Setter stile
	 * 
	 * @param stile
	 */
	public void setStile(String stile) {
		this.stile = stile;
	}

	/**
	 * @return the serverID
	 */
	public String getServerID() {
		return serverID;
	}

	/**
	 * @param serverID the serverID to set
	 */
	public void setServerID(String serverID) {
		this.serverID = serverID;
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
		
}

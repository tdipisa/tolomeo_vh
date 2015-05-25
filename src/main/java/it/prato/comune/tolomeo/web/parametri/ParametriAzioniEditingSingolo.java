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

import net.sf.json.JSONObject;




/**
 * 
 * Classe che gestisce i parametri per l'editing singolo. 
 * <br/>
 * L'editing singolo e' una speciale modalità nella quale viene prefissato il layer e l'ID dell'oggetto da editare e le operazioni sono consentite solo su questo
 * <br>
 * Il comportamento e' il seguente:
 * <li>
 *      <ul>se editingJSGeometry==null  -> inserimento completo di oggetto con layerCODTPN e valorechiave. Per effettuare l'inserimento vengono invocate 
 *          le stesse azioni previste per l'inserimento normale</ul>
 *      <ul>se editingJSGeometry!=null ma con geometria nulla      -> viene abilitato l'inserimento della geometria, ma l'azione risultante sarà la stessa di una updateGeom</ul>
 *      <ul>se editingJSGeometry!=null e con geometria non nulla   -> vengono abilitate le azioni di update sulla geometria</ul>
 * </li>
 * 
 * Il valore di editingJSGeometry viene calcolato da TolomeoMainServlet a partire da layerCODTPN e valoreChiave
 * 
 * @author Alessandro Radaelli
 *
 */
public class ParametriAzioniEditingSingolo {
    
    private Integer layerCODTPN = null;
   // private Boolean conInsert = true;
    private String  valoreChiave = null;
    /*private String  urlFine = null;
    private String  targetFine = "_self";
    private Boolean ajaxCall = false;
    */
    private JSONObject  editingJSGeometry=null;     // jsGeometry corrispondente a valoreChiave (quella sulla quale viene fatto l'editing)
                                                // presente solo se conInsert=false
                                                // determinata dalla servlet a partire dai parametri. 
                                                // Viene comunque passato un array di oggetti (per maggiore possibilità di estensione futura)
    
    public Integer getLayerCODTPN() {
        return layerCODTPN;
    }
    public void setLayerCODTPN(Integer layerCODTPN) {
        this.layerCODTPN = layerCODTPN;
    }
    /*
    public Boolean getConInsert() {
        return conInsert;
    }
    public void setConInsert(Boolean conInsert) {
        this.conInsert = conInsert;
    }
    */
    public String getValoreChiave() {
        return valoreChiave;
    }
    public void setValoreChiave(String valoreChiave) {
        this.valoreChiave = valoreChiave;
    }
    /*
    public String getUrlFine() {
        return urlFine;
    }
    public void setUrlFine(String urlFine) {
        this.urlFine = urlFine;
    }
    public String getTargetFine() {
        return targetFine;
    }
    public void setTargetFine(String targetFine) {
        this.targetFine = targetFine;
    }
    public Boolean getAjaxCall() {
        return ajaxCall;
    }
    public void setAjaxCall(Boolean ajaxCall) {
        this.ajaxCall = ajaxCall;
    }
    */
    public JSONObject getEditingJSGeometry() {
        return editingJSGeometry;
    }
    public void setEditingJSGeometry(JSONObject editingJSGeometry) {
        this.editingJSGeometry = editingJSGeometry;
    }
    
       

}

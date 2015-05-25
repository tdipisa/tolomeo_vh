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

public class ParametriCustomButton {

    // controlId, icona, gruppo, pressfn, releasefn, disabledMessage
    
    private String idCustomButton = null;
    private String iconFileName = null;
    private String iconAltMessage = null;
    private String iconTitleMessage = null;
    private String tooltipMessage = null;
    private Integer gruppo=-1;
    private String pressFunction = null;
    private String releaseFunction = null;
    private String disabledMessage = null;
    
    private ParametriEventoLayerCustom azioniEventiCustomButton = null;
    
    public String getIdCustomButton() {
        return idCustomButton;
    }
    public void setIdCustomButton(String idCustomButton) {
        this.idCustomButton = idCustomButton;
    }
    public String getIconFileName() {
        return iconFileName;
    }
    public void setIconFileName(String iconFileName) {
        this.iconFileName = iconFileName;
    }
    public String getIconAltMessage() {
        return iconAltMessage;
    }
    public void setIconAltMessage(String iconAltMessage) {
        this.iconAltMessage = iconAltMessage;
    }
    public Integer getGruppo() {
        return gruppo;
    }
    public void setGruppo(Integer gruppo) {
        this.gruppo = gruppo;
    }
    public String getPressFunction() {
        return pressFunction;
    }
    public void setPressFunction(String pressFunction) {
        this.pressFunction = pressFunction;
    }
    public String getReleaseFunction() {
        return releaseFunction;
    }
    public void setReleaseFunction(String releaseFunction) {
        this.releaseFunction = releaseFunction;
    }
    public String getDisabledMessage() {
        return disabledMessage;
    }
    public void setDisabledMessage(String disabledMessage) {
        this.disabledMessage = disabledMessage;
    }

    public String getIconTitleMessage() {
        return iconTitleMessage;
    }
    public void setIconTitleMessage(String iconTitleMessage) {
        this.iconTitleMessage = iconTitleMessage;
    }
    public ParametriEventoLayerCustom getAzioniEventiCustomButton() {
        return azioniEventiCustomButton;
    }
    public void setAzioniEventiCustomButton(
            ParametriEventoLayerCustom azioniEventiCustomButton) {
        this.azioniEventiCustomButton = azioniEventiCustomButton;
    }
    public String getTooltipMessage() {
        return tooltipMessage;
    }
    public void setTooltipMessage(String tooltipMessage) {
        this.tooltipMessage = tooltipMessage;
    }

    
    
    

}

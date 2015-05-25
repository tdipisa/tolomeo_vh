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
package it.prato.comune.tolomeo.servizi.telefoniaMobile.reports;

import it.prato.comune.sit.beans.telefoniaMobile.GestoreBean;
import it.prato.comune.sit.toponomastica.PoligonoViaToponomastica;
import it.prato.comune.tolomeo.servizi.telefoniaMobile.beans.StatisticaImpianto;

import java.net.URL;
import java.util.List;

public class ReportImpiantoBean {
    
	private String codImpianto = null;
	private String dataInstallazione = null;
	private String rilevatore = null;
	private PoligonoViaToponomastica via = null;
	private String numAutorizzazione = null;
	private String tipoAutorizzazione = null;
	private String descLocalizzazione = null;
	private String suolo = null;
	private String note = null;
	private List<GestoreBean> gestori = null;
	private StatisticaImpianto statisticaImpianto = null;
	private URL urlMappa = null;
	private String pathImg = null;
	
	public String getCodImpianto() {
		return codImpianto;
	}
	public void setCodImpianto(String codImpianto) {
		this.codImpianto = codImpianto;
	}
	public String getDataInstallazione() {
		return dataInstallazione;
	}
	public void setDataInstallazione(String dataInstallazione) {
		this.dataInstallazione = dataInstallazione;
	}
	public String getRilevatore() {
		return rilevatore;
	}
	public void setRilevatore(String rilevatore) {
		this.rilevatore = rilevatore;
	}
	public PoligonoViaToponomastica getVia() {
		return via;
	}
	public String getDescrizioneVia() {
		return via.getNome();
	}
	public void setVia(PoligonoViaToponomastica via) {
		this.via = via;
	}
	public String getNumAutorizzazione() {
		return numAutorizzazione;
	}
	public void setNumAutorizzazione(String numAutorizzazione) {
		this.numAutorizzazione = numAutorizzazione;
	}
	public String getTipoAutorizzazione() {
		return tipoAutorizzazione;
	}
	public void setTipoAutorizzazione(String tipoAutorizzazione) {
		this.tipoAutorizzazione = tipoAutorizzazione;
	}
	public String getDescLocalizzazione() {
		return descLocalizzazione;
	}
	public void setDescLocalizzazione(String descLocalizzazione) {
		this.descLocalizzazione = descLocalizzazione;
	}
	public String getSuolo() {
		return suolo;
	}
	public void setSuolo(String suolo) {
		this.suolo = suolo;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public List<GestoreBean> getGestori() {
		return gestori;
	}
	public String getGestoriAsString() {
		StringBuffer gS = new StringBuffer();
		for (int i=0; i<gestori.size(); i++) {
			gS.append(gestori.get(i).getDescrizione());
			if (i != gestori.size()-1)
				gS.append(", ");
		}
		return gS.toString();
	}
	public void setGestori(List<GestoreBean> gestori) {
		this.gestori = gestori;
	}
	public StatisticaImpianto getStatisticaImpianto() {
		return statisticaImpianto;
	}
	public void setStatisticaImpianto(StatisticaImpianto statisticaImpianto) {
		this.statisticaImpianto = statisticaImpianto;
	}
	public URL getUrlMappa() {
		return urlMappa;
	}
	public void setUrlMappa(URL urlMappa) {
		this.urlMappa = urlMappa;
	}
	public String getPathImg() {
		return pathImg;
	}
	public void setPathImg(String pathImg) {
		this.pathImg = pathImg;
	}
}

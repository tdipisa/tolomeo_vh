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
package it.prato.comune.tolomeo.servizi.telefoniaMobile.beans;

import java.util.HashMap;
import java.util.List;

public class StatisticaImpianto {

	private int x = 0;
	private int y = 0;
	private String circoscrizione = null;
	private Integer foglio = null;
	private String particella = null;
	private List<String> pericolositaIdraulica = null;
	private String impiantoProssimo = null;
	private List<String> vincoli = null;
	private List<String> zonaOmogenea = null;
	private List<String> subSistema = null;
	private List<String> destinazioneUso = null;
	private List<String> tipoIntervento = null;
	private List<String> progettoSuolo = null;
	private HashMap<Integer, StatisticaRaggio> statisticheRaggio =  new HashMap<Integer, StatisticaRaggio>();
	
	/**
	 * Metodo che recupera il bean <code>StatisticaRaggio</code> di un raggio specifico
	 * @param raggio
	 * @return
	 */
	public StatisticaRaggio getStatisticaRaggio(int raggio){
		
		Integer r = new Integer(raggio);
		
		if(!statisticheRaggio.containsKey(r)){
			StatisticaRaggio statisticaRaggio = new StatisticaRaggio();
			this.statisticheRaggio.put(r, statisticaRaggio);
		}
		
		return (StatisticaRaggio)statisticheRaggio.get(r);
	}

	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public String getCircoscrizione() {
		return circoscrizione;
	}

	public void setCircoscrizione(String circoscrizione) {
		this.circoscrizione = circoscrizione;
	}

	public Integer getFoglio() {
		return foglio;
	}

	public void setFoglio(Integer foglio) {
		this.foglio = foglio;
	}

	public String getParticella() {
		return particella;
	}

	public void setParticella(String particella) {
		this.particella = particella;
	}

	public List<String> getPericolositaIdraulica() {
		return pericolositaIdraulica;
	}
	
	public String getPericolositaIdraulicaAsString() {
		String piS = pericolositaIdraulica.toString();
		return piS.substring(1, piS.length()-1);
	}

	public void setPericolositaIdraulica(List<String> pericolositaIdraulica) {
		this.pericolositaIdraulica = pericolositaIdraulica;
	}

	public String getImpiantoProssimo() {
		return impiantoProssimo;
	}

	public void setImpiantoProssimo(String impiantoProssimo) {
		this.impiantoProssimo = impiantoProssimo;
	}
	
	public List<String> getVincoli() {
		return vincoli;
	}
	
	public String getVincoliFormatted() {
		StringBuffer vF = new StringBuffer();
		for (int i=0; i<vincoli.size(); i++) {
			vF.append(vincoli.get(i));
			if (i != vincoli.size()-1) vF.append(", ");
		}
		return vF.toString();
	}

	public void setVincoli(List<String> vincoli) {
		this.vincoli = vincoli;
	}
	
	public List<String> getZonaOmogenea() {
		return zonaOmogenea;
	}
	
	public String getZonaOmogeneaAsString() {
		String zoS = zonaOmogenea.toString();
		return zoS.substring(1, zoS.length()-1);
	}

	public void setZonaOmogenea(List<String> zonaOmogenea) {
		this.zonaOmogenea = zonaOmogenea;
	}

	public List<String> getSubSistema() {
		return subSistema;
	}
	
	public String getSubSistemaAsString() {
		String subS = subSistema.toString();
		return subS.substring(1, subS.length()-1);
	}

	public void setSubSistema(List<String> subSistema) {
		this.subSistema = subSistema;
	}

	public List<String> getDestinazioneUso() {
		return destinazioneUso;
	}
	
	public String getDestinazioneUsoAsString() {
		String duS = destinazioneUso.toString();
		return duS.substring(1, duS.length()-1);
	}

	public void setDestinazioneUso(List<String> destinazioneUso) {
		this.destinazioneUso = destinazioneUso;
	}

	public List<String> getTipoIntervento() {
		return tipoIntervento;
	}
	
	public String getTipoInterventoAsString() {
		String tiS = tipoIntervento.toString();
		return tiS.substring(1, tiS.length()-1);
	}

	public void setTipoIntervento(List<String> tipoIntervento) {
		this.tipoIntervento = tipoIntervento;
	}

	public List<String> getProgettoSuolo() {
		return progettoSuolo;
	}
	
	public String getProgettoSuoloAsString() {
		String psS = progettoSuolo.toString();
		return psS.substring(1, psS.length()-1);
	}

	public void setProgettoSuolo(List<String> progettoSuolo) {
		this.progettoSuolo = progettoSuolo;
	}

	public HashMap<Integer, StatisticaRaggio> getStatisticheRaggio() {
		return statisticheRaggio;
	}

	public void setStatisticheRaggio(
			HashMap<Integer, StatisticaRaggio> statisticheRaggio) {
		this.statisticheRaggio = statisticheRaggio;
	}
}

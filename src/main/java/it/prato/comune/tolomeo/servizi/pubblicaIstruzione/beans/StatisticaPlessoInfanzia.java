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
package it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

/**
 * 
 * @author Mattia Gennari
 *
 */
public class StatisticaPlessoInfanzia {

	private String codice;
	private String nomePlesso;
	private String nomeLayer;
	private String jsonGeometry;
	private HashMap<Integer,Infanzia> materne = new HashMap<Integer,Infanzia>();
	
	/**
	 * Incementa il numero di bambini italiani dello specifico anno di nascita
	 * 
	 * @param annoNascita
	 */
	public void addItaliano(int annoNascita) {
		getInfanzia(annoNascita).addItaliano();
	}
	
	/**
	 * Incementa il numero di bambini stranieri dello specifico anno di nascita
	 * 
	 * @param annoNascita
	 */
	public void addStraniero(int annoNascita) {
		getInfanzia(annoNascita).addStraniero();
	}
	
	/**
	 * Incementa il numero di bambini anticipatari italiani dello specifico anno di nascita
	 * 
	 * @param annoNascita
	 */
	public void addAnticipatarioItaliano(int annoNascita) {
		getInfanzia(annoNascita).addAnticipatarioItaliano();
	}
	
	/**
	 * Incementa il numero di bambini anticipatari stranieri dello specifico anno di nascita
	 * 
	 * @param annoNascita
	 */
	public void addAnticipatarioStraniero(int annoNascita) {
		getInfanzia(annoNascita).addAnticipatarioStraniero();
	}
	
	/**
	 * Restituisce il bean <code>Infanzia</code> specifico dell'anno di nascita col quale è mappato.
	 * 
	 * @param annoNascita
	 * @return bean <code>Infanzia</code>
	 */
	public Infanzia getInfanzia(int annoNascita){
		
		Integer anno = new Integer(annoNascita);
		
		if(!materne.containsKey(anno)){
			Infanzia infanzia = new Infanzia(annoNascita);       
			this.materne.put(anno, infanzia);
		}
		
		return (Infanzia)materne.get(anno);
	}
	
	/**
	 * Restituisce il totale tra italiani e stranieri dello specifico anno di nascita
	 * 
	 * @param annoNascita
	 * @return il totale tra italiani e stranieri
	 */
	public int getTotale(int annoNascita) {
		return getInfanzia(annoNascita).getTotale();
	}
	
	/**
	 * Restituisce il totale tra italiani e stranieri anticipatari dello specifico anno di nascita
	 * 
	 * @param annoNascita
	 * @return il totale tra italiani e stranieri
	 */
	public int getTotaleAnticipatari(int annoNascita) {
		return getInfanzia(annoNascita).getTotaleAnticipatari();
	}
	
	/**
	 * Restituisce il totale tra il totale nati nell'anno e degli anticipatari dello specifico anno di nascita
	 * 
	 * @param annoNascita
	 * @return il totale tra i nati nell'anno e gli anticipatari
	 */
	public int getTotaleGlobale(int annoNascita) {
		return getInfanzia(annoNascita).getTotaleGlobale();
	}
	
	/**
	 * Restituisce la <code>List</code> del bean <code>Infanzia</code> relativo ad uno specifico range di anni di nascita
	 * 
	 * @param annoNascitaInf
	 * @param annoNascitaSup
	 * @return una <code>List</code> di bean <code>Infanzia</code>
	 */
	public List<Infanzia> getInfanziaRange(int annoNascitaInf, int annoNascitaSup){
	      
		int size = (annoNascitaSup - annoNascitaInf) + 1;
		
		List<Infanzia> materne = new ArrayList<Infanzia>();
		
		for (int i=0; i<size; i++) {
			
			 materne.add(getInfanzia(annoNascitaInf + i));
		}
		
		return materne;
	}
	
	/**
	 * Restituisce il numero degli italiani dello specifico range di anni di nascita
	 * 
	 * @param materne la lista di bean <code>Infanzia</code>
	 * @return il numero degli italiani nel range specifico
	 */
	public int getTotaleItalianiRange(List<Infanzia> materne) {
		
		int totaleItalianiRange = 0;
		
		for (int i=0; i<materne.size(); i++) {
			totaleItalianiRange += materne.get(i).getItaliani();
		}
		
		return totaleItalianiRange;
	}
	
	/**
	 * Restituisce il numero degli stranieri dello specifico range di anni di nascita
	 * 
	 * @param materne la lista di bean <code>Infanzia</code>
	 * @return il numero degli italiani nel range specifico
	 */
	public int getTotaleStranieriRange(List<Infanzia> materne) {
		
		int totaleStanieriRange = 0;
		
		for (int i=0; i<materne.size(); i++) {
			totaleStanieriRange += materne.get(i).getStranieri();
		}
		
		return totaleStanieriRange;
	}
	
	
	/**
	 * Restituisce il totale tra italiani e stranieri dello specifico range di anni di nascita
	 * 
	 * @param materne la lista di bean <code>Infanzia</code>
	 * @return il totale tra italiani e stranieri nel range specifico
	 */
	public int getTotaleRange(List<Infanzia> materne) {
		
		return this.getTotaleItalianiRange(materne) + this.getTotaleStranieriRange(materne);
	}
	
	/**
	 * Restituisce l'array degli anni di nascita in ordine crescente
	 * 
	 * @return un array di <code>Integer</code> contenente gli anni di nascia in ordine crescente
	 */
	public Integer[] getAnniNascita() {
		
		Integer[] anni = new Integer[materne.size()];
		
		Set keys = materne.keySet();
		int i = 0;

		for (Iterator iter = keys.iterator(); iter.hasNext();) {
			anni[i] = (Integer) iter.next();
			i++;
		}

		Arrays.sort(anni);
		
		return anni;
	}
	
	//getter e setter
	public String getCodice() {
		return codice;
	}
	public void setCodice(String codice) {
		this.codice = codice;
	}
	public String getJsonGeometry() {
		return jsonGeometry;
	}
	public void setJsonGeometry(String jsonGeometry) {
		this.jsonGeometry = jsonGeometry;
	}
	public String getNomePlesso() {
		return nomePlesso;
	}
	public void setNomePlesso(String nomePlesso) {
		this.nomePlesso = nomePlesso;
	}
	public String getNomeLayer() {
		return nomeLayer;
	}
	public void setNomeLayer(String nomeLayer) {
		this.nomeLayer = nomeLayer;
	}
}

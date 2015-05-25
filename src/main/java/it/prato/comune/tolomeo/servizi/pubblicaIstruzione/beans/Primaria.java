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

/**
 * 
 * @author Mattia Gennari
 *
 */
public class Primaria {

	private int annoScolasticoInf;
	private int annoScolasticoSup;
	private int iscrizioniObbligatorie;
	private int iscrizioniFacoltative;
	private int totIscrizioni;
	private int iscrizioniObbligatorieClassePrima;
	private int capienzaClassiPrime;
	private int differenza;
	
	/**
	 * Metodo costruttore
	 * 
	 * @param annoScolasticoInf
	 */
	public Primaria(int annoScolasticoInf) {
		this.annoScolasticoInf = annoScolasticoInf;
	}
	
	/**
	 * Metodo che addiziona le iscrizioni obbligatorie
	 */
	public void addIscrizioniObbligatorie() {
		this.iscrizioniObbligatorie++;
	}
	
	/**
	 * Metodo che addiziona le iscrizioni facoltative
	 */
	public void addIscrizioniFacoltative() {
		this.iscrizioniFacoltative++;
	}
	
	/**
	 * Metodo che addiziona le iscrizioni obbligatorie solo della classe prima
	 */
	public void addIscrizioniObbligatorieClassePrima() {
		this.iscrizioniObbligatorieClassePrima++;
	}
	
	//getter e setter
	public int getAnnoScolasticoInf() {
		return annoScolasticoInf;
	}
	public void setAnnoScolasticoInf(int annoScolasticoInf) {
		this.annoScolasticoInf = annoScolasticoInf;
	}
	public int getAnnoScolasticoSup() {
		return annoScolasticoSup;
	}
	public void setAnnoScolasticoSup(int annoScolasticoSup) {
		this.annoScolasticoSup = annoScolasticoSup;
	}
	public int getIscrizioniObbligatorie() {
		return iscrizioniObbligatorie;
	}
	public void setIscrizioniObbligatorie(int iscrizioniObbligatorie) {
		this.iscrizioniObbligatorie = iscrizioniObbligatorie;
	}
	public int getIscrizioniFacoltative() {
		return iscrizioniFacoltative;
	}
	public void setIscrizioniFacoltative(int iscrizioniFacoltative) {
		this.iscrizioniFacoltative = iscrizioniFacoltative;
	}
	/**
	 * Metodo che estrae la somma tra le iscrizione obbligatorie e quelle facoltative
	 * @return la somma tra iscrizioni obbligatorie e facoltative
	 */
	public int getTotIscrizioni() {
		return this.iscrizioniObbligatorie + this.iscrizioniFacoltative;
	}
	public void setTotIscrizioni(int totIscrizioni) {
		this.totIscrizioni = totIscrizioni;
	}
	public int getIscrizioniObbligatorieClassePrima() {
		return iscrizioniObbligatorieClassePrima;
	}
	public void setIscrizioniObbligatorieClassePrima(
			int iscrizioniObbligatorieClassePrima) {
		this.iscrizioniObbligatorieClassePrima = iscrizioniObbligatorieClassePrima;
	}
	public int getCapienzaClassiPrime() {
		return capienzaClassiPrime;
	}
	public void setCapienzaClassiPrime(int capienzaClassiPrime) {
		this.capienzaClassiPrime = capienzaClassiPrime;
	}
	public int getDifferenza() {
		return this.iscrizioniObbligatorieClassePrima - this.getCapienzaClassiPrime();
	}
	public void setDifferenza(int differenza) {
		this.differenza = differenza;
	}
}

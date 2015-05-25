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


public class Infanzia {

	private int annoNascita = 0;
	private int italiani = 0;
	private int stranieri = 0;
	private int anticipatariItaliani = 0;
	private int anticipatariStranieri = 0;
	
	/**
	 * Metodo costruttore
	 * 
	 * @param annoNascita
	 */
	public Infanzia(int annoNascita){
		this.annoNascita = annoNascita;
	}
	
	public void addItaliano() {
		this.italiani++;
	}
	
	public void addStraniero() {
		this.stranieri++;
	}
	
	public void addAnticipatarioItaliano() {
		this.anticipatariItaliani++;
	}
	
	public void addAnticipatarioStraniero() {
		this.anticipatariStranieri++;
	}
	
	public int getItaliani() {
		return italiani;
	}

	public void setItaliani(int italiani) {
		this.italiani = italiani;
	}

	public int getStranieri() {
		return stranieri;
	}

	public void setStranieri(int stranieri) {
		this.stranieri = stranieri;
	}

	public int getTotale() {
		return this.italiani + this.stranieri;
	}
	
	public int getClassi() {
		return (int) Math.ceil(this.getTotale() / 25d);
	}

	public int getAnticipatariItaliani() {
		return anticipatariItaliani;
	}

	public void setAnticipatariItaliani(int anticipatariItaliani) {
		this.anticipatariItaliani = anticipatariItaliani;
	}

	public int getAnticipatariStranieri() {
		return anticipatariStranieri;
	}

	public void setAnticipatariStranieri(int anticipatariStranieri) {
		this.anticipatariStranieri = anticipatariStranieri;
	}

	public int getTotaleAnticipatari() {
		return this.anticipatariItaliani + this.anticipatariStranieri;
	}

	public int getTotaleGlobale() {
		return this.getTotale() + this.getTotaleAnticipatari();
	}
}

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
package it.prato.comune.tolomeo.utility;

public class Input extends FormElement
{
	public final static String TYPE_SUBMIT = "submit";
	public final static String TYPE_HIDDEN = "hidden";
	public final static String TYPE_RESET = "reset";
	public final static String TYPE_BUTTON = "button";
	
	public final static String CSS_STYLE_MODIFICA  = "modifica";
	public final static String CSS_STYLE_CONFERMA  = "conferma";
	public final static String CSS_STYLE_ELIMINA   = "elimina";
	public final static String CSS_STYLE_CERCA     = "cerca";
	public final static String CSS_STYLE_INSERISCI = "inserisci";
	public final static String CSS_STYLE_PULISCI   = "pulisci";
	public final static String CSS_STYLE_TERMINA   = "termina";
	public final static String CSS_STYLE_GENERICO  = "generico";
	public final static String CSS_STYLE_STATISTCIHE  = "statistiche";
	
	public final static String ONCLICK_DEFAULT = "if(this.form.operazione){this.form.operazione.value = this.name;};";
	
	public final static Submit MODIFICA     = new Submit(CSS_STYLE_MODIFICA, "M", "modifica", "Modifica").onClick(ONCLICK_DEFAULT);
	public final static Submit MODIFICA_OK  = new Submit(CSS_STYLE_CONFERMA, "MOK", "conferma", "Conferma").onClick(ONCLICK_DEFAULT);
	public final static Submit CANCELLA     = new Submit(CSS_STYLE_ELIMINA, "C", "elimina", "Elimina").onClick(ONCLICK_DEFAULT);	
	public final static Submit CERCA        = new Submit(CSS_STYLE_CERCA, "R", "cerca", "Cerca").onClick(ONCLICK_DEFAULT);
	public final static Submit INSERISCI    = new Submit(CSS_STYLE_INSERISCI, "I", "inserisci", "Inserisci").onClick(ONCLICK_DEFAULT);
	public final static Reset  PULISCI      = new Reset(CSS_STYLE_PULISCI, "P", "pulisci", "Pulisci").onClick(ONCLICK_DEFAULT);
	public final static Submit INSERISCI_OK = new Submit(CSS_STYLE_CONFERMA, "IOK", "conferma", "Conferma").onClick(ONCLICK_DEFAULT);
	public final static Submit CESSA        = new Submit(CSS_STYLE_ELIMINA, "CE", "cessa", "Cessa").onClick(ONCLICK_DEFAULT);
	public final static Submit TERMINA      = new Submit(CSS_STYLE_TERMINA, "T", "termina", "Termina").onClick(ONCLICK_DEFAULT);	
        	
	protected String type = null;
	private String onclick = null;
	private String onkeypress = null;
	private String value = null;
	
	public Input(String type) {
		super();
		this.type = type;
	}
	
	public Input(String type, String cssclass, String name, String value, String title) 
	{
		this.type = type;
		setCssclass(cssclass);
		setName(name);
		setValue(value);
		setTitle(title);
	}

	public String getOnclick() {
		return onclick;
	}

	public void setOnclick(String onclick) {
		this.onclick = onclick;		
	}
	
	public <T extends Input> T  onClick(String onclick) {	    
	    this.onclick = (getOnclick() != null) ? (getOnclick().endsWith(";")? getOnclick() : getOnclick() +";") + onclick : onclick;  
	    return (T)this;
    }

	public String getOnkeypress() {
		return onkeypress;
	}

	public void setOnkeypress(String onkeypress) {
		this.onkeypress = onkeypress;
	}

	public String getType() {
		return type;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public <T extends Input> T val(String value){
        setValue(value);
        return (T)this;
    }		
	
	public static <T extends Input> T lookLike(T input){
	    
	    Input newInput = null;
	    
	    try {
            newInput = input.getClass().newInstance();
        } catch (Exception e) {
            return null;
        }
    	         
        newInput.type = input.getType();
        newInput.value = input.getValue();
        newInput.setCssclass(input.getCssclass());
        newInput.setName(input.getName());
        newInput.setTitle(input.getTitle());
	    newInput.onclick = input.getOnclick();
	    newInput.onkeypress = input.getOnkeypress();
	    
	    return (T)newInput;
	}
	
	public static void main(String[] args) {
        Submit s = Submit.lookLike(Input.MODIFICA).onClick("alert('dfsd');");        
        System.out.println("tipo = " + s.type);
        System.out.println("onclik = " + s.getOnclick());
        System.out.println("onclik MODIFICA = " + Input.MODIFICA.getOnclick());                
    }
}

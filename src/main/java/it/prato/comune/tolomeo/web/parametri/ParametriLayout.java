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

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

public class ParametriLayout {
	
	private Integer legendaLarg             = 0;
	private Boolean testata                 = true;
	private Boolean conFiltroTemporale      = false;
	private Boolean conStreetView           = false;
	private String  urlTestata              = "testatadefault.jsp";
	private Boolean piepagina               = true;
	private String  urlPiepagina            = "piepaginadefault.jsp";
	private String  urlTemplatePrefisso     = null;
	private String  icoSetup                = "11111011000000";
	private boolean nascondiBottoniInattivi = false;
	private ArrayList<ParametriCustomButton> customButtonList = new ArrayList<ParametriCustomButton>();
	private ParametriCsw csw = null;
	private ParametriWMSExplorer WMSExplorer = null;
	private Boolean conExportQGIS			= true;
	private String  helpUrl                 = null;
	private String  faqUrl                  = null;
	private String  helpMailTo              = null;
	private String  helpMailSubject         = null;
	private ParametriHelpInfo      helpInfo = null;
	private ParametriVisualizzazione3D visualizzazione3D = null; 
	/** Indica se includere la funzionalità di apertura con servizi di mapping esterni */
 	private ParametriWithVisWith   withVisWith = new ParametriWithVisWith();
	
	private ParametriOls			ols		= null;
	
	public void parse(HttpServletRequest request) {
		legendaLarg = Integer.parseInt(request.getParameter("paramLegendaLarg"));
		//testata = Boolean.parseBoolean(request.getParameter("paramTestata"));
		//piepagina = Boolean.parseBoolean(request.getParameter("param?")); //TODO
		icoSetup = request.getParameter("paramIcoSetup");
	}
	
	public ParametriCsw getCsw() {
        return csw;
    }

    public void setCsw(ParametriCsw csw) {
        this.csw = csw;
    }


    public String getIcoSetup() {
		return icoSetup;
	}

	public void setIcoSetup(String icoSetup) {
		this.icoSetup = icoSetup;
	}

	public Integer getLegendaLarg() {
		return legendaLarg;
	}

	public void setLegendaLarg(Integer legendaLarg) {
		this.legendaLarg = legendaLarg;
	}

    public String getUrlTestata() {
        return urlTestata;
    }

    public void setUrlTestata(String urlTestata) {
        this.urlTestata = urlTestata;
    }

    public String getUrlPiepagina() {
        return urlPiepagina;
    }

    public void setUrlPiepagina(String urlPiepagina) {
        this.urlPiepagina = urlPiepagina;
    }

    public Boolean getTestata() {
        return testata;
    }

    public void setTestata(Boolean testata) {
        this.testata = testata;
    }

    public Boolean getPiepagina() {
        return piepagina;
    }

    public void setPiepagina(Boolean piepagina) {
        this.piepagina = piepagina;
    }

    public String getUrlTemplatePrefisso() {
        return urlTemplatePrefisso;
    }

    public void setUrlTemplatePrefisso(String urlTemplatePrefisso) {
        this.urlTemplatePrefisso = urlTemplatePrefisso;
    }

    public boolean isNascondiBottoniInattivi() {
        return nascondiBottoniInattivi;
    }

    public void setNascondiBottoniInattivi(boolean nascondiBottoniInattivi) {
        this.nascondiBottoniInattivi = nascondiBottoniInattivi;
    }

    public ArrayList<ParametriCustomButton> getCustomButtonList() {
        return customButtonList;
    }

    public void addCustomButton(ParametriCustomButton customButton) {
        this.customButtonList.add(customButton);
    }

    public void setCustomButtonList(
            ArrayList<ParametriCustomButton> customButtonList) {
        this.customButtonList = customButtonList;
    }

    public Boolean getConFiltroTemporale() {
        return conFiltroTemporale;
    }

    public void setConFiltroTemporale(Boolean conFiltroTemporale) {
        this.conFiltroTemporale = conFiltroTemporale;
    }
    
    public Boolean getConStreetView() {
        return conStreetView;
    }

    public void setConStreetView(Boolean conStreetView) {
        this.conStreetView = conStreetView;
    }

	/**
	 * @return the wMSExplorer
	 */
	public ParametriWMSExplorer getWMSExplorer() {
		return WMSExplorer;
	}

	/**
	 * @param wMSExplorer the wMSExplorer to set
	 */
	public void setWMSExplorer(ParametriWMSExplorer wMSExplorer) {
		WMSExplorer = wMSExplorer;
	}

	/**
	 * @return the conExportQGIS
	 */
	public Boolean getConExportQGIS() {
		return conExportQGIS;
	}

	/**
	 * @param conExportQGIS the conExportQGIS to set
	 */
	public void setConExportQGIS(Boolean conExportQGIS) {
		this.conExportQGIS = conExportQGIS;
	}    

    public String getHelpUrl() {
        return helpUrl;
    }

    public void setHelpUrl(String helpUrl) {
        this.helpUrl = helpUrl;
    }

    public String getFaqUrl() {
        return faqUrl;
    }

    public void setFaqUrl(String faqUrl) {
        this.faqUrl = faqUrl;
    }

    public String getHelpMailTo() {
        return helpMailTo;
    }

    public void setHelpMailTo(String helpMailTo) {
        this.helpMailTo = helpMailTo;
    }

    public String getHelpMailSubject() {
        return helpMailSubject;
    }

    public void setHelpMailSubject(String helpMailSubject) {
        this.helpMailSubject = helpMailSubject;
    }

    public ParametriHelpInfo getHelpInfo() {
        return helpInfo;
    }

    public void setHelpInfo(ParametriHelpInfo helpInfo) {
        this.helpInfo = helpInfo;
    }

	/**
	 * Recupera le impostazioni della visualizzazione 3D. Se non presente la visualizzazione è disabilitata.
	 * 
	 * @return recupera le impostazioni
	 */
	public ParametriVisualizzazione3D getVisualizzazione3D() {
		return visualizzazione3D;
	}

	/**
	 * Imposta i parametri per la visualizzazione 3D.
	 * 
	 * @param visualizzazione3d valore da impostare
	 */
	public void setVisualizzazione3D(ParametriVisualizzazione3D visualizzazione3d) {
		visualizzazione3D = visualizzazione3d;
	}

	/**
	 * @return Imposta i parametri per OLS
	 */
	public final ParametriOls getOls() {
		return ols;
	}

	/**
	 * Imposta i parametri per OLS
	 * @param ols Parametri da settare
	 */
	public final void setOls(ParametriOls ols) {
		this.ols = ols;
	}

	/**
	 * Recupera withVisWith.
	 *
	 * @return withVisWith
	 */
	public ParametriWithVisWith getWithVisWith() {
		return withVisWith;
	}

	/**
	 * Imposta il valore di withVisWith.
	 * @param withVisWith valore di withVisWith da impostare
	 */
	public void setWithVisWith(ParametriWithVisWith withVisWith) {
		this.withVisWith = withVisWith;
	}        
	    	    
}

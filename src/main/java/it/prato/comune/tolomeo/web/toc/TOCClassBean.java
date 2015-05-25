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
package it.prato.comune.tolomeo.web.toc;

/**
 * Classe che contiene la descrizione delle classi, è contenuta in {@link TOCLayerBean}  per descrivere la legenda ed inviare i dati al client. 
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
/**
 * @author ale
 *
 */
public class TOCClassBean {

	private String icoUrl=null;  	// Url dell'icona
	private Integer icoW=0;      	// Larghezza incona
	private Integer icoH=0;      	// Altezza icona
	private int 	count=0;       	// numero layer all'interno del gruppo
	private int 	clno=0;        	// numero classe all'interno del layer
	private String 	nome;         	// Nome della classe
	private int 	tipoNome=0;				// Tipo del nome: 
											//		0 - testo
											//		1 - url di immagine
	private String	nomeParamScala = null; 	// nome del parametro scala da aggiungere se tipoNome=1. Se null non è necessario aggiungere parametro scala
	private String id=null;

	/**
	 * Costruttore 
	 */
    public TOCClassBean() {}

    
    /**
     * Getter campo icoUrl (url icona)
     * 
     * @return 
     */
    public String getIcoUrl() {
        return icoUrl;
    }

    /** Setter campo icoUrl
     * 
     * @param icoUrl
     */
    public void setIcoUrl(String icoUrl) {
        this.icoUrl = icoUrl;
    }

    /**
     * Getter campo icoW (larghezza icona)
     * 
     * @return 
     */
    public Integer getIcoW() {
        return icoW;
    }

    /** Setter campo icoW
     * 
     * @param icoW
     */
    public void setIcoW(Integer icoW) {
        this.icoW = icoW;
    }

    /**
     * Getter campo icoH (altezza icona)
     * 
     * @return 
     */
    public Integer getIcoH() {
        return icoH;
    }

    /** 
     * Setter campo icoH
     * 
     * 
     * @param icoH
     */
    public void setIcoH(Integer icoH) {
        this.icoH = icoH;
    }

    /**
     * Getter campo count
     * 
     * @return 
     */
    public int getCount() {
        return count;
    }

    /**
     * Setter campo count
     * 
     * @param count
     */
    public void setCount(int count) {
        this.count = count;
    }

    /**
     * Getter campo clno (numero di classe)
     * 
     * @return 
     */
    public int getClno() {
        return clno;
    }

    /** 
     * Setter campo clno
     * 
     * @param clno
     */
    public void setClno(int clno) {
        this.clno = clno;
    }

    /**
     * Getter nome della classe
     * 
     * @return 
     */
    public String getNome() {
        return nome;
    }

    /**
     * Setter campo nome
     * 
     * @param nome
     */
    public void setNome(String nome) {
        this.nome = nome;
    }

    /**
     * Getter campo id
     * 
     * @return 
     */
    public String getId() {
        return id;
    }
    
    /**
     * Setter campo id
     * 
     * @param id
     */
    public void setId(String id) {
        this.id = id;
    }


	/**
	 * @return the tipoNome
	 */
    public int getTipoNome() {
		return tipoNome;
	}


	/**
	 * @param tipoNome the tipoNome to set
	 */
    public void setTipoNome(int tipoNome) {
		this.tipoNome = tipoNome;
	}


	/**
	 * @return the nomeParamScala
	 */
    public String getNomeParamScala() {
		return nomeParamScala;
	}


	/**
	 * @param nomeParamScala the nomeParamScala to set
	 */
    public void setNomeParamScala(String nomeParamScala) {
		this.nomeParamScala = nomeParamScala;
	}

}

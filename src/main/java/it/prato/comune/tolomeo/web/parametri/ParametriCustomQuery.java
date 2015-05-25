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


/**
 * 
 * Classe per definire query di filtro per i dati della mappa. Sono utilizzate per esempio per visualizzare una mappa che contenga solo un sottoinsieme dei dati totali
 * In realtà non operano un effettivo filtraggio ma consentono di aggiungere parametri alla query string (per esempio di mapserver) che possono essere utilizzati nel file 
 * .map attraverso il meccanismo della "variable substitution". Un parametro con lo stesso nome deve essere utilizzato in una espressione tipo <br/>
 * FILTER "%nome%"<br/>
 * Il valore di default è una condizione sempre vera (nessun filtraggio).
 * Il valore contenuto nel file xml può essere variato aggiungendo alla querystring un parametro come quello riportato in esempio (ovviamente tutto su una riga)<br/>
 * customQuery=<br/>
 * &ltmappaList&gt<br/>
 *  &ltmappa&gt<br/>
 *       &ltcustomQueryList&gt<br/>
 *           &ltcustomQuery&gt<br/>
 *               &ltnome&gtcustomQueryFiltroUbicazioni&lt/nome&gt<br/>
 *               &ltquery&gtID=4&lt/query&gt
 *           &lt/customQuery&gt<br/>
 *       &lt/customQueryList&gt<br/>
 *    &lt/mappa&gt<br/>
 *   &lt/mappaList&gt<br/>
 * 
 * Occorre notare che pur essendo informazioni relative alle sole customQuery viene inserito l'intero tag <mappaList> <strong>senza però che questo TUTTI i tag previsti</strong>.
 * Non vengono quindi riportati i tag <nome> <typeDescription> <overlay> etc., che non sarebbero in questo caso da modificare. <strong>Nel caso che il parametro sa settare 
 * sia relativo alla seconda mappa definita la sintassi da utilizzare sarà la seguente</strong><br/>
 * &ltmappaList&gt<br/>
 *   &ltmappa/&gt<br/>
 *   &ltmappa&gt<br/>
        &ltcustomQueryList&gt<br/>
            &ltcustomQuery&gt<br/>
                &ltnome&gtcustomQueryFiltroUbicazioni&lt/nome&gt<br/>
*               &ltquery&gtID=4&lt/query&gt
            &lt/customQuery&gt<br/>
        &lt/customQueryList&gt<br/>
     &lt/mappa&gt<br/>
    &lt/mappaList&gt<br/>
 * <strong>N.B.</strong>Le sole customQuery presenti saranno modificate, lasciando le altre inalterate    
 * 
 * @author Alessandro Radaelli
 *
 */
public class ParametriCustomQuery {
    
    private String nome=null;
    private String query="1=1";
   
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getQuery() {
        return query;
    }
    public void setQuery(String query) {
        this.query = query;
    }
    
    

}

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
import it.prato.comune.utilita.core.type.DateType;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

public class ExampleImpiantiBeanFactory {
    
    public static Vector<ReportImpiantoBean> createBeanCollection()
    {
         Vector coll = new Vector();
         
         //esempi liste
         List<String> listaStringa = new ArrayList<String>();
         listaStringa.add("primo");
         listaStringa.add("secondo");
         listaStringa.add("terzo");
         
         ReportImpiantoBean myBean = new ReportImpiantoBean();
         myBean.setCodImpianto("01SANGIUSTO");
         myBean.setDataInstallazione(new DateType().getFormatted('/'));
         myBean.setRilevatore("Mario Rossi");
         myBean.setVia(new PoligonoViaToponomastica());
         myBean.setNumAutorizzazione("01ABCD");
         myBean.setTipoAutorizzazione("compatibile");
         myBean.setDescLocalizzazione("Descrizione localizzazione impianto");
         myBean.setSuolo("Privato");
         myBean.setNote("Nessuna");
         
         List<GestoreBean> gestori = new ArrayList<GestoreBean>();
         GestoreBean gestoreBean = new GestoreBean();
         gestoreBean.setDescrizione("TIM");
         gestori.add(gestoreBean);
         myBean.setGestori(gestori);
         
         myBean.setStatisticaImpianto(new StatisticaImpianto());
         myBean.getStatisticaImpianto().setZonaOmogenea(listaStringa);
         myBean.getStatisticaImpianto().setSubSistema(listaStringa);
         myBean.getStatisticaImpianto().setDestinazioneUso(listaStringa);
         
         //TODO Pag 2 PDF non terminata (immagine mappa e stazione radio base)
         try {
        	 URL url = new URL("http://dvptolomeo.comune.prato.it/tolomeobinj/TolomeoPrintServlet?paramPreset=telefoniaMobile&printImageSize=300+300");
        	 myBean.setUrlMappa(url);
         } catch (MalformedURLException e) {
        	 e.printStackTrace();
         }
         
         myBean.setPathImg("/tolomeohtdocs/img/servizi/telefoniaMobile/impianti/"+myBean.getCodImpianto()+".jpg");
         
         coll.add(myBean);
         coll.add(null);

         return coll;
    }
}

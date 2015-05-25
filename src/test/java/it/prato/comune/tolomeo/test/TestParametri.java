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
package it.prato.comune.tolomeo.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.tolomeo.web.parametri.ParametriEventiLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerRicerca;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerVis;
import it.prato.comune.tolomeo.web.parametri.ParametriMappa;
import it.prato.comune.tolomeo.web.parametri.ParametriMappeList;
import it.prato.comune.utilita.logging.PratoLogger;

import java.util.ArrayList;
import java.util.Properties;

import org.apache.log4j.PropertyConfigurator;
import org.junit.Before;
import org.junit.Test;

public class TestParametri {

    private PratoLogger logger;
    private SITLayersManager sitLayersManager;
    
    @Before
    public  void setUpBefore() throws Exception {
    
        //... Acquisizione Logger
        Properties prop = new Properties();
        prop.put("log4j.logger.org.apache","DEBUG,fileout");
        prop.put("log4j.appender.fileout","org.apache.log4j.DailyRollingFileAppender");
        prop.put("log4j.appender.fileout.File","c:/logtestmain.txt");
        prop.put("log4j.appender.fileout.layout","org.apache.log4j.PatternLayout");
        prop.put("log4j.appender.fileout.layout.ConversionPattern","%d{HH:mm:ss} %X{user} %X{address} %-8p %C{1}[%M] %x %m%n");
        prop.put("log4j.appender.fileout.DatePattern",".yyyyMMdd");
        PropertyConfigurator.configure(prop);
        logger = new PratoLogger("org.apache","---.---.---.---","NOUSER");
        System.out.println("*** Logger pronto!");
   
        logger.debug("Inizio log");
        
        this.sitLayersManager = new SITLayersManager("c:\\web\\config\\sit\\Config.txt", logger,  "Comune di Prato");

        TolomeoApplicationContext.getInstance().setConfigFileName("c:\\web\\configvh\\tolomeo\\tolomeo.properties");
    }

    @Test
    public void testCreateParametri() {
        
        Parametri params = Parametri.createParametri("Test", sitLayersManager);

        assertNotNull(params);
        assertEquals(1, params.getAzioniEventi().getEventiLayerList().size());
        ArrayList<ParametriEventiLayer> evl = params.getAzioniEventi().getEventiLayerList();
        ParametriEventiLayer ev = evl.get(0);
        ArrayList<ParametriEventoLayerRicerca> ricercaList = ev.getAzioniEventiRicercaList().getRicercaList();
        assertEquals(1,ricercaList.size());    
        assertNotNull(ricercaList.get(0).getIdRicerca());
        assertNotNull(ricercaList.get(0).getMetadatoRicerca());
        assertNotNull(ricercaList.get(0).getMetadatoRicerca().getDescrizione());
        assertNotNull(ricercaList.get(0).getMetadatoRicerca().getNomiCampi());
        assertNotNull(ricercaList.get(0).getMetadatoRicerca().getTipiCampi());
        assertTrue(ricercaList.get(0).getMetadatoRicerca().getNomiCampi().length!=0);
        assertEquals(ricercaList.get(0).getMetadatoRicerca().getNomiCampi().length, ricercaList.get(0).getMetadatoRicerca().getTipiCampi().length);
        
        ParametriMappeList ml = params.getMappe();
        
        assertNotNull(ml);
        
        ArrayList<ParametriMappa> mll =  ml.getMappaList();
        
        assertNotNull(mll);
        assertEquals(2,  mll.size());
        //assertEquals(0, mll.get(0).getTypeCode());
        assertNotNull(mll.get(0).getUrl());
        //assertEquals(1, mll.get(1).getTypeCode());
        
        ArrayList<ParametriEventoLayerVis> azioneVisList = ev.getAzioniEventiVis().getAzioneList();

        assertNotNull(azioneVisList);
        assertEquals(1, azioneVisList.size());
        assertEquals("http://www.microsoft.com", azioneVisList.get(0).getUrl());
        assertEquals(false, azioneVisList.get(0).isAjaxCall());
        assertEquals("_self", azioneVisList.get(0).getTarget());
        
        
    }
    

}

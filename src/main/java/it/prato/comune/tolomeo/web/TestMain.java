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
package it.prato.comune.tolomeo.web;

import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.tolomeo.web.parametri.ParametriEventiLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoCondizione;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerCanc;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerIns;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerRicerca;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerUpdateAlpha;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerUpdateGeom;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerVis;
import it.prato.comune.tolomeo.web.parametri.ParametriLegenda;
import it.prato.comune.tolomeo.web.parametri.ParametriMappa;
import it.prato.comune.tolomeo.web.parametri.ParametriMappeList;
import it.prato.comune.utilita.logging.PratoLogger;

import java.beans.IntrospectionException;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.apache.commons.betwixt.io.BeanReader;
import org.apache.commons.betwixt.io.BeanWriter;
import org.apache.commons.betwixt.strategy.DecapitalizeNameMapper;
import org.apache.log4j.PropertyConfigurator;
import org.xml.sax.SAXException;

public class TestMain {

    /**
     * @param args
     */
    public static void main(String[] args) {

//      ... Acquisizione Logger
        Properties prop = new Properties();
        prop.put("log4j.logger.org.apache","DEBUG,fileout");
        prop.put("log4j.appender.fileout","org.apache.log4j.DailyRollingFileAppender");
        prop.put("log4j.appender.fileout.File","c:/logtestmain.txt");
        prop.put("log4j.appender.fileout.layout","org.apache.log4j.PatternLayout");
        prop.put("log4j.appender.fileout.layout.ConversionPattern","%d{HH:mm:ss} %X{user} %X{address} %-8p %C{1}[%M] %x %m%n");
        prop.put("log4j.appender.fileout.DatePattern",".yyyyMMdd");
        PropertyConfigurator.configure(prop);
        PratoLogger logger = new PratoLogger("org.apache","---.---.---.---","NOUSER");
        System.out.println("*** Logger pronto!");
   
        logger.debug("Inizio log");
        
        Parametri params = new Parametri();

        ParametriMappeList pml = params.getMappe();
        
        ParametriMappa pm = new ParametriMappa();
        pm.setNome("mappapippo");
        pm.setUrl("pippo");
        pm.setMapOptions("mapOpt");
        ParametriLegenda legenda = new ParametriLegenda();
        //legenda.setAllGroups("aaa,aa");
        List<String> lista = new ArrayList<String>();
        lista.add("layer1Gruppo1");
        lista.add("layer2Gruppo1");
        //legenda.addCategory("gruppo1", "layer1Gruppo1,layer2Gruppo1");
        pm.setLegenda(legenda);
        
        pml.addMappa(pm);
        
        pm = new ParametriMappa();
        pm.setUrl("pippo1");
        pm.setMapOptions("mapOpt1");
        pml.addMappa(pm);
        
        
        //params.setNumeroMappa(1);
        params.getLayOut().setLegendaLarg(150);
        params.getAzioniApertura().setUrlPannello("/tolomeobinj/jsp/frameRicerca.jsp");
        params.getAzioniApertura().setAction("VisZoom");
        params.getAzioniApertura().setCoordX(1668463.);
        params.getAzioniApertura().setCoordY(4860705.);
        params.getAzioniApertura().setZoom(2000L);
        
        
        // Layer Suggerimenti
        ParametriEventiLayer evLayer = new ParametriEventiLayer();
        evLayer.setNomeLayer("Suggerimenti");
        evLayer.setDescrizioneLayer("Suggerimenti");
        evLayer.setCodTPN(-1);
        evLayer.setTipoGeometria(3); // Poligono
        
        // DoppioClick
        ParametriEventoLayerVis lVis = new ParametriEventoLayerVis();
        lVis.setChiudiSuDblClick(false);
        lVis.setTarget("pannello");
        
        lVis.setUrl("http://www.microsoft.com");
        evLayer.getAzioniEventiVis().setCloseAtTheEnd(true);
        evLayer.getAzioniEventiVis().addAzione(lVis);
        ParametriEventoCondizione p = new ParametriEventoCondizione();
        p.setCodTPN(100);
        evLayer.getAzioniEventiVis().addCondizione(p);
        
        // Inserimento
        ParametriEventoLayerIns lIns = new ParametriEventoLayerIns();
        lIns.setTarget("pannello");
        lIns.setUrl("http://www.microsoft.com");
        evLayer.getAzioniEventiIns().setCloseAtTheEnd(true);
        evLayer.getAzioniEventiIns().addAzione(lIns);
        
        
        // UpdateAlfa
        ParametriEventoLayerUpdateAlpha lUpdAlfa = new ParametriEventoLayerUpdateAlpha();
        lUpdAlfa.setTarget("pannello");
        lUpdAlfa.setUrl("http://www.microsoft.com");
        evLayer.getAzioniEventiUpdateAlpha().setCloseAtTheEnd(true);
        evLayer.getAzioniEventiUpdateAlpha().addAzione(lUpdAlfa);
        
        params.getAzioniEventi().addEventiLayer(evLayer);
        
        // Layer 
        evLayer = new ParametriEventiLayer();
        evLayer.setNomeLayer("PoligoniUT1");
        evLayer.setDescrizioneLayer("PoligoniUT1");
        evLayer.setCodTPN(-900);
        evLayer.setTipoGeometria(3); // Poligono
        
        // UpdateGeom
        ParametriEventoLayerUpdateGeom lUpdGeom = new ParametriEventoLayerUpdateGeom();
        lUpdGeom.setTarget("_blank");
        lUpdGeom.setUrl("/tolomeobinj/GeometryUpdateServlet");
        evLayer.getAzioniEventiUpdateGeom().setCloseAtTheEnd(true);
        evLayer.getAzioniEventiUpdateGeom().addAzione(lUpdGeom);
        
        // Delete
        ParametriEventoLayerCanc lCanc = new ParametriEventoLayerCanc();
        lCanc.setTarget("pannello");
        lCanc.setUrl("http://www.comune.prato.it");
        evLayer.getAzioniEventiCanc().setCloseAtTheEnd(true);
        evLayer.getAzioniEventiCanc().addAzione(lCanc);  
        
        params.getAzioniEventi().addEventiLayer(evLayer);
        
        // Layer Circoscrizioni
        evLayer = new ParametriEventiLayer();
        evLayer.setNomeLayer("Circoscrizioni");
        evLayer.setDescrizioneLayer("Circoscrizioni");
        evLayer.setCodTPN(100);
        evLayer.setTipoGeometria(3); // Poligono
//        evLayer.setTipoGeometria1(2);
        
        // DoppioClick
        lVis = new ParametriEventoLayerVis();
        lVis.setChiudiSuDblClick(true);
        lVis.setTarget("pannello");
        lVis.setUrl("http://www.comune.prato.it");
        evLayer.getAzioniEventiVis().setCloseAtTheEnd(true);
        evLayer.getAzioniEventiVis().addAzione(lVis);
        
        // ricerca
        ParametriEventoLayerRicerca lric = new ParametriEventoLayerRicerca();
        lric.setIdRicerca(1);
        
        evLayer.getAzioniEventiRicercaList().addRicerca(lric);
        evLayer.getAzioniEventiVis().addAzione(lVis);
        params.getAzioniEventi().addEventiLayer(evLayer);
        


        
        /*
         * 
        evLayer = new ParametriEventiLayer();
        
        
        paramAzIns.setDescrizioneLayer("Poligono");
        paramAzIns.setNomeLayer("Descrizione layer1");
        paramAzIns.setNomeChiave("chiave");
        paramAzIns.setClasse("0");
        paramAzIns.setTarget("pannello");
        paramAzIns.setTipoGeometria(3);
        paramAzIns.setUrl("http://www.comune.firenze.it");
        
        evLayer.getEventoIns().setTarget(target);
       
        ParametriAzioneLayer paramAzIns = new ParametriAzioneLayer();
       
        

        


        
        paramAzIns = new ParametriAzioneLayer();
        paramAzIns.setDescrizioneLayer("Cerchio");
        paramAzIns.setNomeLayer("Descrizione layer2");
        paramAzIns.setNomeChiave("chiave2");
        paramAzIns.setClasse("0");
        paramAzIns.setTarget("_blank");
        paramAzIns.setTipoGeometria(4);
        paramAzIns.setUrl("http://www.comune.firenze.it");
        paramAzEventi.getLayerInsList().add(paramAzIns);
        
        paramAzIns = new ParametriAzioneLayer();
        paramAzIns.setDescrizioneLayer("Linea");
        paramAzIns.setNomeLayer("Descrizione layer2");
        paramAzIns.setNomeChiave("chiave2");
        paramAzIns.setClasse("0");
        paramAzIns.setTarget("_blank");
        paramAzIns.setTipoGeometria(2);
        paramAzIns.setUrl("http://www.comune.firenze.it");
        paramAzEventi.getLayerInsList().add(paramAzIns);
        
        paramAzIns = new ParametriAzioneLayer();
        paramAzIns.setDescrizioneLayer("Punto");
        paramAzIns.setNomeLayer("Descrizione layer2");
        paramAzIns.setNomeChiave("chiave2");
        paramAzIns.setClasse("0");
        paramAzIns.setTarget("_blank");
        paramAzIns.setTipoGeometria(1);
        paramAzIns.setUrl("http://www.comune.firenze.it");
        paramAzEventi.getLayerInsList().add(paramAzIns);
        
        ParametriAzioneModificaLayer paramAzMod = new ParametriAzioneModificaLayer();
        paramAzMod.setDescrizioneLayer("Suggerimenti");
        paramAzMod.setNomeLayer("SUGGERIMENTI");
        paramAzMod.setNomeChiave("chiave");
        paramAzMod.setClasse("0");
        paramAzMod.setTarget("_blank");
        paramAzMod.setTipoGeometria(3);
        paramAzMod.setUrl("http://www.comune.firenze.it");
        paramAzMod.setMaskOperazioni("1111");
        paramAzMod.setTargetUpdateAlfa("_blank");
        paramAzMod.setUrlUpdateAlfa("http://www.comune.prato.it");
       
        paramAzEventi.getLayerModList().add(paramAzMod);
        
        ParametriAzioneLayer paramAzCanc = new ParametriAzioneLayer();
        paramAzCanc.setDescrizioneLayer("Suggerimenti");
        paramAzCanc.setNomeLayer("SUGGERIMENTI");
        paramAzCanc.setNomeChiave("chiavecanc");
        paramAzCanc.setClasse("0");
        paramAzCanc.setTarget("_blank");
        paramAzCanc.setTipoGeometria(3);
        paramAzCanc.setUrl("http://www.regione.toscana.it");
        
        paramAzEventi.getLayerCancList().add(paramAzCanc);
        
        
        */

        
        
//      create write and set basic properties
        StringWriter wr = new StringWriter();
        wr.write("<?xml version='1.0' ?>\n");
        BeanWriter writer = new BeanWriter(wr);
        
        writer.getXMLIntrospector().getConfiguration().setAttributesForPrimitives(false);
        writer.enablePrettyPrint();
        
        writer.getBindingConfiguration().setMapIDs(false);
            
        // set a custom name mapper for attributes
        //writer.getXMLIntrospector().getConfiguration().setAttributeNameMapper(new HyphenatedNameMapper());
        // set a custom name mapper for elements
        writer.getXMLIntrospector().getConfiguration().setElementNameMapper(new DecapitalizeNameMapper());
            
        // write out the bean
        try {
            writer.write(params);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (SAXException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IntrospectionException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        //wr.write("</pippo>");
        System.out.println(wr.toString());
        

        // First construct the xml which will be read in
        // For this example, read in from a hard coded string
        //StringReader xmlReader = new StringReader("<parametri><numeroMappa>1</numeroMappa><presetName/><urlChiamante/><urlMappa>http://tstsit.comune.prato.it/mapguide/PRATO_SUGGERIMENTI_PS.mwf</urlMappa> </parametri>");
        StringReader xmlReader = new StringReader(wr.toString());
        
        // Now convert this to a bean using betwixt
        // Create BeanReader
        BeanReader beanReader  = new BeanReader();
            
        // Configure the reader
        // If you're round-tripping, make sure that the configurations are compatible!
        beanReader.getXMLIntrospector().getConfiguration().setAttributesForPrimitives(false);
        beanReader.getXMLIntrospector().getConfiguration().setElementNameMapper(new DecapitalizeNameMapper());
        beanReader.getBindingConfiguration().setMapIDs(false);
            
        // Register beans so that betwixt knows what the xml is to be converted to
        // Since the element mapped to a PersonBean isn't called the same 
        // as Betwixt would have guessed, need to register the path as well
        try {
            beanReader.registerBeanClass("parametri",Parametri.class);
           // beanReader.registerBeanClass("pippo/parametri/layOut",ParametriLayout.class);
            //beanReader.registerBeanClass("parametri",Parametri.class);
        } catch (IntrospectionException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
            
        // Now we parse the xml
        Parametri person = null;
        try {
            person = (Parametri) beanReader.parse(xmlReader);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (SAXException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        //System.out.println(person.getUrlMappa());
        
    TolomeoApplicationContext.getInstance().setConfigFileName("c:\\config.properties");
    //TolomeoApplicationContext.getInstance().setJvm(TolomeoApplicationContext.STANDALONE);
    
    
    //Parametri parametri = Parametri.createParametri("pippo");
     

    }
    
    
    
        
        
}



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
package it.prato.comune.tolomeo.servizi.pubblicaIstruzione.model;

import it.prato.comune.sit.Filtro;
import it.prato.comune.sit.LayerAnagrafe;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.PoligonoTerritorio;
import it.prato.comune.sit.PuntoAnagrafe;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoInfanzia;
import it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoPrimaria;
import it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoSecondariaPG;
import it.prato.comune.tolomeo.model.TolomeoService;
import it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans.StatisticaPlessoInfanzia;
import it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans.StatisticaPlessoPrimaria;
import it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans.StatisticaPlessoSecondariaPG;
import it.prato.comune.utilita.core.type.DateType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * Contirene i metodi per recuperare tutte le statistiche per tutti gli ordini di plessi scolastici: infanzia, primarie e secondariePG.
 * Per i plessi primarie e secondariePG vi sono due metodi aggiuntivi nei quali non vengono recuperati a livello statistico i dati riguardanti
 * la capienza delle prime classi.
 * 
 * @author Mattia Gennari
 */
public class PlessiScuoleService extends TolomeoService {

    public PlessiScuoleService(LogInterface logger, LayerTerritorio territorio){
        super(logger,territorio);        
    }
    
    /**
     * Metodo che recupera la staristica dei plessi scuole infanzia per un qualunque poligono.
     * 
     * @param poligono <code>PoligonoTerritorio</code>
     * @return la statistica per i plessi infanzia <code>StatisticaPlessoMaterna</code>
     * @throws SITException
     */
    public StatisticaPlessoInfanzia getStatisticaPlessoInfanzia(PoligonoTerritorio poligono)
    	throws SITException {
    	
    	StatisticaPlessoInfanzia statisticaPlesso = new StatisticaPlessoInfanzia();
    	
    	try {
    		
    	    SITLayersManager comunePO = super.getTerritorio(logger);
//          LayerAnagrafe layerAnagrafe = comunePO.getAnagrafe();
            LayerAnagrafe layerAnagrafe = LayerAnagrafe.getInstance(comunePO);
	    	
	    	DateType dataCorrente = new DateType();
	    	int annoCorrente = dataCorrente.getYear();
	        int annoBase = annoCorrente;
	        
	        if (dataCorrente.getMonth() >= 1 && dataCorrente.getMonth() <= 7) {
	        	annoBase = annoCorrente - 1;
	        } else {
	        	annoBase = annoCorrente;
	        }
	        
	        int annoMin = annoBase - 5;
	        int annoMax = annoBase;
	        
	        //data massima e minima degli anticipatari
	        DateType dataMin = new DateType(annoMin,1,1);
	        DateType dataMax = new DateType(annoMax,3,1);
	        
//	        Filtro filtroAnagrafe = layerAnagrafe.getFiltroVuoto();
//			filtroAnagrafe.AndFiltro(Costanti.NL_ANAGRAFE_DATANASCITA,"to_date('" + dataMin.getYYYYMMDD() + "','YYYYMMDD')",">=");
//			filtroAnagrafe.AndFiltro(Costanti.NL_ANAGRAFE_DATANASCITA,"to_date('" + dataMax.getYYYYMMDD() + "','YYYYMMDD')","<");			
			
	        Filtro filtroAnagrafe = layerAnagrafe.getFiltroVuoto();
            filtroAnagrafe.AndFiltro(LayerAnagrafe.NL_DATANASCITA,dataMin.toSqlDate(),">=");
            filtroAnagrafe.AndFiltro(LayerAnagrafe.NL_DATANASCITA,dataMax.toSqlDate(),"<");
            
			layerAnagrafe.setFiltro(filtroAnagrafe);
		
			ArrayList bambini = layerAnagrafe.chiInterseca(poligono);
			
			for (int i=0; i<bambini.size(); i++) {
			
				PuntoAnagrafe bambino = (PuntoAnagrafe) bambini.get(i);
				
				DateType dataNascita = new DateType(bambino.getDataNascita().getTime());
				int annoNascita = dataNascita.getYear();                        
                
                boolean possibileAnticipatario = dataNascita.getMonth() <= 2;
                boolean registraAnticipatario = possibileAnticipatario && (annoNascita > annoMin);
                
                String nazionalita = bambino.getNazionalita();

                if(bambino.isItaliano()) {
                	if(annoNascita < annoMax){
                		statisticaPlesso.addItaliano(annoNascita);
                	}
                	if(registraAnticipatario){
                		statisticaPlesso.addAnticipatarioItaliano(annoNascita-1);
                	}
                } else {
                	if(annoNascita < annoMax){
                		statisticaPlesso.addStraniero(annoNascita);
                	}
                	if(registraAnticipatario){
                		statisticaPlesso.addAnticipatarioStraniero(annoNascita-1);
                	}
                }
			}
			
			if(PoligonoPlessoInfanzia.class.isAssignableFrom(poligono.getClass())){
				PoligonoPlessoInfanzia plessoInfanzia = (PoligonoPlessoInfanzia) poligono;
				statisticaPlesso.setCodice(plessoInfanzia.getCodice());
				statisticaPlesso.setNomePlesso(plessoInfanzia.getNome());
			}
			
        } catch (IOException e) {
            throw new SITException("Errore accesso risorse",e);
        } catch (Exception e) {
            throw new SITException("Errore accesso risorse",e);
        }
        
    	return statisticaPlesso;
    }
    
    /**
     * Metodo che recupera la staristica dei plessi scuole primarie per un poligono di tipo <code>PoligonoPlessoPrimaria</code>.
     *  
     * @param plessoPrimaria, un poligono <code>PoligonoPlessoPrimaria</code>
     * @return la statistica per i plessi primarie <code>StatisticaPlessoPrimaria</code>
     * @throws SITException
     */
    public StatisticaPlessoPrimaria getStatisticaPlessoPrimaria(PoligonoTerritorio poligono)
		throws SITException { 
		
		StatisticaPlessoPrimaria statisticaPlesso = new StatisticaPlessoPrimaria();
		
		try {
    		
		    SITLayersManager comunePO = super.getTerritorio(logger);
//          LayerAnagrafe layerAnagrafe = comunePO.getAnagrafe();
            LayerAnagrafe layerAnagrafe = LayerAnagrafe.getInstance(comunePO);
			
	        DateType oggi = new DateType();
	        DateType dataMin = new DateType(oggi.getYear() - 10,1,1);
                	
//	        Filtro filtroAnagrafe = layerAnagrafe.getFiltroVuoto();
//	        filtroAnagrafe.AndFiltro(Costanti.NL_ANAGRAFE_DATANASCITA,"to_date('" + dataMin.getYYYYMMDD() + "','YYYYMMDD')",">=");
	        
	        Filtro filtroAnagrafe = layerAnagrafe.getFiltroVuoto();
	        filtroAnagrafe.AndFiltro(LayerAnagrafe.NL_DATANASCITA, dataMin.toSqlDate(), ">=");
	        
	        layerAnagrafe.setFiltro(filtroAnagrafe);
	        ArrayList<PuntoAnagrafe> bambini = layerAnagrafe.chiInterseca(poligono);
	
	        statisticaPlesso.setEtaMin(6);
	        statisticaPlesso.setEtaMax(10);
	        
	        int annoAttuale = oggi.getYear();
	        int meseAttuale = oggi.getMonth();
	        int limiteInfNati, limiteSupNati;
	        int annoBase = annoAttuale;
	        int annoScolasticoInf = annoAttuale;
	        int annoScolasticoSup = annoAttuale+1;
	
	        if (8 <= meseAttuale && meseAttuale <= 12) {
	            annoBase++;
	            annoScolasticoInf++;
	            annoScolasticoSup++;
	        }
	
	        limiteInfNati = annoBase-10;
	        limiteSupNati = annoBase-6;
	        
	        HashMap<Integer, Integer> bambiniPerAnnoSolare = new HashMap<Integer, Integer>(); //chiave anno solare valore numero bambini nati nell'anno
	        
	        for (int i=0; i<bambini.size(); i++) {
	            
	            PuntoAnagrafe bambino = (PuntoAnagrafe) bambini.get(i);
	            DateType dataNascita = new DateType(bambino.getDataNascita().getTime());
	            int annoNascita = dataNascita.getYear();
	            boolean isMale = bambino.isMaschio();
	            boolean isItalian = bambino.isItaliano();
	            				
	            //suddivisione per sesso e per nazionalità dei bambini che hanno tra i 6 e i 10 anni
	            if (annoNascita >= (annoAttuale - 10) && annoNascita <= (annoAttuale - 6)) {
	            	if (isMale)    statisticaPlesso.addMaschi();   else statisticaPlesso.addFemmine();
	                if (isItalian) statisticaPlesso.addItaliani(); else statisticaPlesso.addStranieri();
	            }
	
	            //calcolo degli iscritti nei prossimi 5 anni e di quelli che vanno in prima
	            for (int j=0; j<6; j++) {
	                
	                if ((limiteInfNati + j) <= annoNascita && annoNascita <= (limiteSupNati + j)) {

	                	statisticaPlesso.addIscrizioniObbligatorie(annoScolasticoInf + j);
	                    
	                	//sommo solo quelli che vanno in prima elementare
	                    if ((limiteSupNati + j) == annoNascita) {
	                    	statisticaPlesso.addIscrizioniObbligatorieClassiPrime(annoScolasticoInf + j);
	                    }
	                   
	                } else if (annoNascita == (limiteSupNati + j + 1)) {
	                    //calcolo dei possibili iscritti nei prossimi 5 anni (quelli che fanno la primina)
	                    DateType dataInfPossibileIscrizione = new DateType(limiteSupNati + j, 12, 31); //31 Dicembre
	                    DateType dataSupPossibileIscrizione = new DateType(limiteSupNati + j + 1, 5, 1); //1 Maggio
	                    if (dataNascita.after(dataInfPossibileIscrizione) && dataNascita.before(dataSupPossibileIscrizione)) {
	                    	statisticaPlesso.addIscrizioniFacoltative(annoScolasticoInf + j);
	                    }
	                }
	            }

	            //bambini suddivisi per anno solare di nascita
	            if (annoNascita >= (annoAttuale - 6)  &&  annoNascita <= annoAttuale) {
	                Integer valoreAttuale = ( (Integer)bambiniPerAnnoSolare.get(new Integer(annoNascita)) );
	                int numero = 1;
	                if (valoreAttuale!=null) {
	                    numero = valoreAttuale.intValue();
	                    numero++;						
	                }
	                bambiniPerAnnoSolare.put(new Integer(annoNascita),new Integer(numero));
	            }
	        }
	        
	        //setto l'HashMap bambini per anno solare nel bean
	        statisticaPlesso.setBambiniPerAnnoSolare(bambiniPerAnnoSolare);
	        
	        if(PoligonoPlessoPrimaria.class.isAssignableFrom(poligono.getClass())){
	        	
	        	PoligonoPlessoPrimaria plessoPrimaria = (PoligonoPlessoPrimaria) poligono;
	        	
	        	//inserisco le capienze del plesso nell'anno scolastico specifico
		        int [] capienze = {
		        		plessoPrimaria.getAluMax1(),
		        		plessoPrimaria.getAluMax2(),
		        		plessoPrimaria.getAluMax3(),
		        		plessoPrimaria.getAluMax4(),
		        		plessoPrimaria.getAluMax5(),
		        		plessoPrimaria.getAluMax1()
		        		};
		        for (int i=0; i<6; i++) {
		        	statisticaPlesso.setCapienzaClassiPrime(annoScolasticoInf + i, capienze[i]);
		        }
		        
				statisticaPlesso.setCodice(plessoPrimaria.getCodice());
				statisticaPlesso.setNomePlesso(plessoPrimaria.getNome());
	        }
	        
		} catch (IOException e) {
		    logger.error(e);
            throw new SITException("Errore accesso risorse",e);
        } catch (Exception e) {
            logger.error(e);
            throw new SITException("Errore accesso risorse",e);
        }
        
		return statisticaPlesso;
	}
    
    /**
     * Metodo che recupera la staristica dei plessi scuole primarie per un qualunque poligono escudendo i dati riguardo
     * la capienza delle prime classi.
     * 
     * @param poligono <code>PoligonoTerritorio</code>
     * @return la statistica per i plessi scuole primarie <code>StatisticaPlessoPrimaria</code> senza la capienza delle prime classi
     * @throws SITException
     */
    public StatisticaPlessoPrimaria getStatisticaPlessoPrimariaSenzaCapienze(PoligonoTerritorio poligono)
		throws SITException {

    	StatisticaPlessoPrimaria statisticaPlesso = new StatisticaPlessoPrimaria();
		
		try {
			
		    SITLayersManager comunePO = super.getTerritorio(logger);
//	    	LayerAnagrafe layerAnagrafe = comunePO.getAnagrafe();
	    	LayerAnagrafe layerAnagrafe = LayerAnagrafe.getInstance(comunePO);
	    	
	        DateType oggi = new DateType();			
	        DateType dataMin = new DateType(oggi.getYear() - 10,1,1);
	    	    	
//	        Filtro filtroAnagrafe = layerAnagrafe.getFiltroVuoto();
//	        filtroAnagrafe.AndFiltro(Costanti.NL_ANAGRAFE_DATANASCITA,"to_date('" + dataMin.getYYYYMMDD() + "','YYYYMMDD')",">=");
	        
	        Filtro filtroAnagrafe = layerAnagrafe.getFiltroVuoto();
            filtroAnagrafe.AndFiltro(LayerAnagrafe.NL_DATANASCITA,dataMin.toSqlDate(),">=");
	        
	        layerAnagrafe.setFiltro(filtroAnagrafe);
	        ArrayList<PuntoAnagrafe> bambini = layerAnagrafe.chiInterseca(poligono);
	
	        statisticaPlesso.setEtaMin(6);
	        statisticaPlesso.setEtaMax(10);
	        
	        int annoAttuale = oggi.getYear();
	        int meseAttuale = oggi.getMonth();
	        int limiteInfNati, limiteSupNati;
	        int annoBase = annoAttuale;
	        int annoScolasticoInf = annoAttuale;
	        int annoScolasticoSup = annoAttuale+1;
	
	        if (8 <= meseAttuale && meseAttuale <= 12) {
	            annoBase++;
	            annoScolasticoInf++;
	            annoScolasticoSup++;
	        }
	
	        limiteInfNati = annoBase-10;
	        limiteSupNati = annoBase-6;
	        
	        HashMap<Integer, Integer> bambiniPerAnnoSolare = new HashMap<Integer, Integer>(); //chiave anno solare valore numero bambini nati nell'anno
	        
	        for (int i=0; i<bambini.size(); i++) {
	            
	            PuntoAnagrafe bambino = (PuntoAnagrafe) bambini.get(i);
	            DateType dataNascita = new DateType(bambino.getDataNascita().getTime());
	            int annoNascita = dataNascita.getYear();
	            boolean isMale = bambino.isMaschio();
	            boolean isItalian = bambino.isItaliano();
	            				
	            //suddivisione per sesso e per nazionalità dei bambini che hanno tra i 6 e i 10 anni
	            if (annoNascita >= (annoAttuale - 10) && annoNascita <= (annoAttuale - 6)) {
	            	if (isMale)    statisticaPlesso.addMaschi();   else statisticaPlesso.addFemmine();
	                if (isItalian) statisticaPlesso.addItaliani(); else statisticaPlesso.addStranieri();
	            }
	
	            //calcolo degli iscritti nei prossimi 5 anni e di quelli che vanno in prima
	            for (int j=0; j<6; j++) {
	                
	                if ((limiteInfNati + j) <= annoNascita && annoNascita <= (limiteSupNati + j)) {
	
	                	statisticaPlesso.addIscrizioniObbligatorie(annoScolasticoInf + j);
	                    
	                	//sommo solo quelli che vanno in prima elementare
	                    if ((limiteSupNati + j) == annoNascita) {
	                    	statisticaPlesso.addIscrizioniObbligatorieClassiPrime(annoScolasticoInf + j);
	                    }
	                   
	                } else if (annoNascita == (limiteSupNati + j + 1)) {
	                    //calcolo dei possibili iscritti nei prossimi 5 anni (quelli che fanno la primina)
	                    DateType dataInfPossibileIscrizione = new DateType(limiteSupNati + j, 12, 31); //31 Dicembre
	                    DateType dataSupPossibileIscrizione = new DateType(limiteSupNati + j + 1, 5, 1); //1 Maggio
	                    if (dataNascita.after(dataInfPossibileIscrizione) && dataNascita.before(dataSupPossibileIscrizione)) {
	                    	statisticaPlesso.addIscrizioniFacoltative(annoScolasticoInf + j);
	                    }
	                }
	            }
	
	            //bambini suddivisi per anno solare di nascita
	            if (annoNascita >= (annoAttuale - 6)  &&  annoNascita <= annoAttuale) {
	                Integer valoreAttuale = ( (Integer)bambiniPerAnnoSolare.get(new Integer(annoNascita)) );
	                int numero = 1;
	                if (valoreAttuale!=null) {
	                    numero = valoreAttuale.intValue();
	                    numero++;						
	                }
	                bambiniPerAnnoSolare.put(new Integer(annoNascita),new Integer(numero));
	            }
	        }
	        
	        //setto l'HashMap bambini per anno solare nel bean
	        statisticaPlesso.setBambiniPerAnnoSolare(bambiniPerAnnoSolare);
	        
	        if(PoligonoPlessoPrimaria.class.isAssignableFrom(poligono.getClass())){
	        	PoligonoPlessoPrimaria plessoPrimaria = (PoligonoPlessoPrimaria) poligono;
	        	statisticaPlesso.setCodice(plessoPrimaria.getCodice());
	        	statisticaPlesso.setNomePlesso(plessoPrimaria.getNome());
	        }
	        
		} catch (IOException e) {
	        throw new SITException("Errore accesso risorse",e);
	    } catch (Exception e) {
	        throw new SITException("Errore accesso risorse",e);
	    }
	    
		return statisticaPlesso;
	}

    /**
     * Metodo che recupera la staristica dei plessi scuole secondarie di primo grado per un poligono di tipo <code>PoligonoPlessoSecondariaPG</code>.
     *  
     * @param plessoMedia, un poligono <code>PoligonoPlessoSecondariaPG</code>
     * @return la statistica per i lessi scuole secondarie di primo grado <code>PoligonoPlessoSecondariaPG</code>
     * @throws SITException
     */
	public StatisticaPlessoSecondariaPG getStatisticaPlessoSecondariaPG(PoligonoTerritorio poligono)
		throws SITException {
		
		StatisticaPlessoSecondariaPG statisticaPlesso = new StatisticaPlessoSecondariaPG();
		
		try {
    		
		    SITLayersManager comunePO = super.getTerritorio(logger);
	    	LayerAnagrafe layerAnagrafe = LayerAnagrafe.getInstance(comunePO);
	    	
	        DateType oggi = new DateType();			
	        DateType dataMin = new DateType(oggi.getYear()-13,1,1);
	        DateType dataMax = new DateType(oggi.getYear()-8,12,31);
        
//	        Filtro filtroAnagrafe = layerAnagrafe.getFiltroVuoto();
//	        filtroAnagrafe.AndFiltro(Costanti.NL_ANAGRAFE_DATANASCITA,"to_date('" + dataMin.getYYYYMMDD() + "','YYYYMMDD')",">=");
//          filtroAnagrafe.AndFiltro(Costanti.NL_ANAGRAFE_DATANASCITA,"to_date('" + dataMax.getYYYYMMDD() + "','YYYYMMDD')","<=");
            
            Filtro filtroAnagrafe = layerAnagrafe.getFiltroVuoto();
            filtroAnagrafe.AndFiltro(LayerAnagrafe.NL_DATANASCITA,dataMin.toSqlDate(),">=");
            filtroAnagrafe.AndFiltro(LayerAnagrafe.NL_DATANASCITA,dataMax.toSqlDate(),"<=");
            
	        layerAnagrafe.setFiltro(filtroAnagrafe);
	        ArrayList<PuntoAnagrafe> bambini = layerAnagrafe.chiInterseca(poligono);
	
	        statisticaPlesso.setEtaMin(11);
	        statisticaPlesso.setEtaMax(13);
	        
	        int annoAttuale = oggi.getYear();
	        int meseAttuale = oggi.getMonth();
	        int limiteInfNati, limiteSupNati;
	        int annoBase = annoAttuale;
	        int annoScolasticoInf = annoAttuale;
	        int annoScolasticoSup = annoAttuale+1;
	
	        if (8 <= meseAttuale && meseAttuale <= 12) {
	            annoBase++;
	            annoScolasticoInf++;
	            annoScolasticoSup++;
	        }
	
	        limiteInfNati = annoBase-13;
	        limiteSupNati = annoBase-11;
	        
	        HashMap<Integer, Integer> bambiniPerAnnoSolare = new HashMap<Integer, Integer>(); //chiave anno solare valore numero bambini nati nell'anno
	        
	        for (int i=0; i<bambini.size(); i++) {
	            
	            PuntoAnagrafe bambino = (PuntoAnagrafe) bambini.get(i);
	            DateType dataNascita = new DateType(bambino.getDataNascita().getTime());
	            int annoNascita = dataNascita.getYear();
	            boolean isMale = bambino.isMaschio();
	            boolean isItalian = bambino.isItaliano();
	            				
	            //suddivisione per sesso e per nazionalità dei bambini che hanno tra i 6 e i 10 anni
	            if (annoNascita >= (annoAttuale - 13) && annoNascita <= (annoAttuale - 11)) {
	            	if (isMale)    statisticaPlesso.addMaschi();   else statisticaPlesso.addFemmine();
	                if (isItalian) statisticaPlesso.addItaliani(); else statisticaPlesso.addStranieri();
	            }
	
	            //calcolo degli iscritti nei prossimi 5 anni e di quelli che vanno in prima
	            for (int j=0; j<3; j++) {
	                
	                if ((limiteInfNati + j) <= annoNascita && annoNascita <= (limiteSupNati + j)) {

	                	statisticaPlesso.addIscrizioniObbligatorie(annoScolasticoInf + j);
	                    
	                	//sommo solo quelli che vanno in prima elementare
	                    if ((limiteSupNati + j) == annoNascita) {
	                    	statisticaPlesso.addIscrizioniObbligatorieClassiPrime(annoScolasticoInf + j);
	                    }
	                }
	            }
	            
	            //bambini suddivisi per anno solare di nascita
	            if (annoNascita >= (annoAttuale - 13) && annoNascita <= (annoAttuale - 8)) {
	                Integer valoreAttuale = ( (Integer)bambiniPerAnnoSolare.get(new Integer(annoNascita)) );
	                int numero = 1;
	                if (valoreAttuale!=null) {
	                    numero = valoreAttuale.intValue();
	                    numero++;						
	                }
	                bambiniPerAnnoSolare.put(new Integer(annoNascita),new Integer(numero));
	            }
	        }
	        
	        //setto l'HashMap bambini per anno solare nel bean
	        statisticaPlesso.setBambiniPerAnnoSolare(bambiniPerAnnoSolare);
	        
	        if(PoligonoPlessoSecondariaPG.class.isAssignableFrom(poligono.getClass())){
	        	
	        	PoligonoPlessoSecondariaPG plessoSecondariaPG = (PoligonoPlessoSecondariaPG) poligono;
	        	
	        	//inserisco le capienze del plesso nell'anno scolastico specifico
		        int [] capienze = {
		        		plessoSecondariaPG.getAluMax1(),
		        		plessoSecondariaPG.getAluMax2(),
		        		plessoSecondariaPG.getAluMax3()
		        		};
		        for (int i=0; i<3; i++) {
		        	statisticaPlesso.setCapienzaClassiPrime(annoScolasticoInf + i, capienze[i]);
		        }
		        
		        statisticaPlesso.setCodice(plessoSecondariaPG.getCodice());
		        statisticaPlesso.setNomePlesso(plessoSecondariaPG.getNome());
	        }
	        
		} catch (IOException e) {
            throw new SITException("Errore accesso risorse",e);
        } catch (Exception e) {
            throw new SITException("Errore accesso risorse",e);
        }
        
		return statisticaPlesso;
	}
    
	/**
	 * Metodo che recupera la statistica dei plessi scuole secondarie primo grado per un qualunque poligono escudendo i dati riguardo
     * la capienza delle prime classi.
     * 
	 * @param poligono <code>PoligonoTerritorio</code>
	 * @return la statistica per i plessi scuole secondarie primo grado <code>PoligonoPlessoSecondariaPG</code> senza la capienza delle prime classi
	 * @throws SITException
	 */
    public StatisticaPlessoSecondariaPG getStatisticaPlessoSecondariaPGSenzaCapienze(PoligonoTerritorio poligono)
		throws SITException {
		
		StatisticaPlessoSecondariaPG statisticaPlesso = new StatisticaPlessoSecondariaPG();
		
		try {
			
		    SITLayersManager comunePO = super.getTerritorio(logger);
//          LayerAnagrafe layerAnagrafe = comunePO.getAnagrafe();
            LayerAnagrafe layerAnagrafe = LayerAnagrafe.getInstance(comunePO);
	    	
	        DateType oggi = new DateType();			
	        DateType dataMin = new DateType(oggi.getYear()-13,1,1);
	        DateType dataMax = new DateType(oggi.getYear()-8,12,31);
	    
//	        Filtro filtroAnagrafe = layerAnagrafe.getFiltroVuoto();
//	        filtroAnagrafe.AndFiltro(Costanti.NL_ANAGRAFE_DATANASCITA,"to_date('" + dataMin.getYYYYMMDD() + "','YYYYMMDD')",">=");
//	        filtroAnagrafe.AndFiltro(Costanti.NL_ANAGRAFE_DATANASCITA,"to_date('" + dataMax.getYYYYMMDD() + "','YYYYMMDD')","<=");
	        
	        Filtro filtroAnagrafe = layerAnagrafe.getFiltroVuoto();
            filtroAnagrafe.AndFiltro(LayerAnagrafe.NL_DATANASCITA,dataMin.toSqlDate(),">=");
            filtroAnagrafe.AndFiltro(LayerAnagrafe.NL_DATANASCITA,dataMax.toSqlDate(),"<=");
            
	        layerAnagrafe.setFiltro(filtroAnagrafe);
	        ArrayList<PuntoAnagrafe> bambini = layerAnagrafe.chiInterseca(poligono);
	
	        statisticaPlesso.setEtaMin(11);
	        statisticaPlesso.setEtaMax(13);
	        
	        int annoAttuale = oggi.getYear();
	        int meseAttuale = oggi.getMonth();
	        int limiteInfNati, limiteSupNati;
	        int annoBase = annoAttuale;
	        int annoScolasticoInf = annoAttuale;
	        int annoScolasticoSup = annoAttuale+1;
	
	        if (8 <= meseAttuale && meseAttuale <= 12) {
	            annoBase++;
	            annoScolasticoInf++;
	            annoScolasticoSup++;
	        }
	
	        limiteInfNati = annoBase-13;
	        limiteSupNati = annoBase-11;
	        
	        HashMap<Integer, Integer> bambiniPerAnnoSolare = new HashMap<Integer, Integer>(); //chiave anno solare valore numero bambini nati nell'anno
	        
	        for (int i=0; i<bambini.size(); i++) {
	            
	            PuntoAnagrafe bambino = (PuntoAnagrafe) bambini.get(i);
	            DateType dataNascita = new DateType(bambino.getDataNascita().getTime());
	            int annoNascita = dataNascita.getYear();
	            boolean isMale = bambino.isMaschio();
	            boolean isItalian = bambino.isItaliano();
	            				
	            //suddivisione per sesso e per nazionalità dei bambini che hanno tra i 6 e i 10 anni
	            if (annoNascita >= (annoAttuale - 13) && annoNascita <= (annoAttuale - 11)) {
	            	if (isMale)    statisticaPlesso.addMaschi();   else statisticaPlesso.addFemmine();
	                if (isItalian) statisticaPlesso.addItaliani(); else statisticaPlesso.addStranieri();
	            }
	
	            //calcolo degli iscritti nei prossimi 5 anni e di quelli che vanno in prima
	            for (int j=0; j<3; j++) {
	                
	                if ((limiteInfNati + j) <= annoNascita && annoNascita <= (limiteSupNati + j)) {
	
	                	statisticaPlesso.addIscrizioniObbligatorie(annoScolasticoInf + j);
	                    
	                	//sommo solo quelli che vanno in prima elementare
	                    if ((limiteSupNati + j) == annoNascita) {
	                    	statisticaPlesso.addIscrizioniObbligatorieClassiPrime(annoScolasticoInf + j);
	                    }
	                }
	            }
	            
	            //bambini suddivisi per anno solare di nascita
	            if (annoNascita >= (annoAttuale - 13) && annoNascita <= (annoAttuale - 8)) {
	                Integer valoreAttuale = ( (Integer)bambiniPerAnnoSolare.get(new Integer(annoNascita)) );
	                int numero = 1;
	                if (valoreAttuale!=null) {
	                    numero = valoreAttuale.intValue();
	                    numero++;						
	                }
	                bambiniPerAnnoSolare.put(new Integer(annoNascita),new Integer(numero));
	            }
	        }
	        
	        //setto l'HashMap bambini per anno solare nel bean
	        statisticaPlesso.setBambiniPerAnnoSolare(bambiniPerAnnoSolare);
	        
	        if(PoligonoPlessoSecondariaPG.class.isAssignableFrom(poligono.getClass())){
	        	PoligonoPlessoSecondariaPG plessoSecondariaPG = (PoligonoPlessoSecondariaPG) poligono;
	        	
	        	statisticaPlesso.setCodice(plessoSecondariaPG.getCodice());
	        	statisticaPlesso.setNomePlesso(plessoSecondariaPG.getNome());
	        }
	        
		} catch (IOException e) {
	        throw new SITException("Errore accesso risorse",e);
	    } catch (Exception e) {
	        throw new SITException("Errore accesso risorse",e);
	    }
	    
		return statisticaPlesso;
	}
}

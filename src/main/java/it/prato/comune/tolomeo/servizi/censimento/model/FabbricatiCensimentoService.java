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
package it.prato.comune.tolomeo.servizi.censimento.model;

import it.prato.comune.sit.Filtro;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.plugin.comunePO.censimento.anno2011.LayerFabbricatiCensimento;
import it.prato.comune.tolomeo.model.TolomeoService;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;


public class FabbricatiCensimentoService extends TolomeoService{       
    
    public FabbricatiCensimentoService(LogInterface logger,LayerFabbricatiCensimento layerFabbricati){
        super(logger,layerFabbricati);        
    }
        
    
    /**
     * Restituisce il totale dei fabbricati
     *
     * @return totale fabbricati da elaborare
     * @throws SITException
     */
    public int getTotaleFabbricati() throws SITException {
                  
        LayerFabbricatiCensimento layerFabbricati = getLayer();                               
               
        Filtro filtroGeografico = layerFabbricati.getFiltroVuoto();                            
        layerFabbricati.setFiltro(filtroGeografico);
        
        ResultSet rs = null;   
        int totale = 0;
                
        try {
                        
            rs = layerFabbricati.queryDiretta(conn, 
                     "SELECT COUNT(*) as TOTALE FROM CENSIMENTO_FABBRICATI ", 
                     "", 
                     "", true );
            
            if (rs.next()){
                
                totale = rs.getInt("TOTALE");   
                logger.info("TOTALE Fabbricati = " + totale);
                
            }               
            
            return totale;
            
        } catch (SQLException e) {
            
            throw new SITException("Errore sql" + e.getMessage(),e);
            
        } catch (IOException e) {
            
            throw new SITException("Errore accesso risorse",e);
            
        } finally {
            
            if(rs != null){
                try {
                    
                    layerFabbricati.queryDirettaCloseRs(rs);
                                                    
                } catch (SQLException e) {
                    logger.error("Impossibile chiudere le risorse",e);
                }
            }
                                                    
        }       
    }
    
    
    /**
     * Restituisce il totale dei fabbricati associati in automatico
     *
     * @return totale fabbricati da elaborare
     * @throws SITException
     */
    public int getTotaleFabbricatiAssociatiInAuto() throws SITException {
                  
        LayerFabbricatiCensimento layerFabbricati = getLayer();                               
               
        Filtro filtroGeografico = layerFabbricati.getFiltroVuoto();                            
        layerFabbricati.setFiltro(filtroGeografico);
        
        ResultSet rs = null;   
        int totale = 0;
                
        try {
                        
            rs = layerFabbricati.queryDiretta(conn, 
                     "SELECT COUNT(*) as TOTALE FROM CENSIMENTO_FABBRICATI", 
                     " dtaggiornamento is null and particella is not null", 
                     "", true);
            
            if (rs.next()){
                
                totale = rs.getInt("TOTALE");   
                logger.info("TOTALE Fabbricati = " + totale);
                
            }               
            
            return totale;
            
        } catch (SQLException e) {
            
            throw new SITException("Errore sql" + e.getMessage(),e);
            
        } catch (IOException e) {
            
            throw new SITException("Errore accesso risorse",e);
            
        } finally {
            
            if(rs != null){
                try {
                    
                    layerFabbricati.queryDirettaCloseRs(rs);
                                                    
                } catch (SQLException e) {
                    logger.error("Impossibile chiudere le risorse",e);
                }
            }
                                                    
        }       
    }
    
    /**
     * Restituisce il totale dei fabbricati da elaborare
     *
     * @return totale fabbricati da elaborare
     * @throws SITException
     */
    public int getTotaleFabbricatiDaElaborare() throws SITException {
                  
        LayerFabbricatiCensimento layerFabbricati = getLayer();                               
               
        Filtro filtroGeografico = layerFabbricati.getFiltroVuoto();                            
        layerFabbricati.setFiltro(filtroGeografico);
        
        ResultSet rs = null;   
        int totale = 0;
                
        try {
                        
            rs = layerFabbricati.queryDiretta(conn, 
                     "SELECT COUNT(*) as TOTALE FROM CENSIMENTO_FABBRICATI", 
                     "dtaggiornamento is null and particella is null", 
                     "", true );
            
            if (rs.next()){
                
                totale = rs.getInt("TOTALE");   
                logger.info("TOTALE Fabbricati = " + totale);
                
            }               
            
            return totale;
            
        } catch (SQLException e) {
            
            throw new SITException("Errore sql" + e.getMessage(),e);
            
        } catch (IOException e) {
            
            throw new SITException("Errore accesso risorse",e);
            
        } finally {
            
            if(rs != null){
                try {
                    
                    layerFabbricati.queryDirettaCloseRs(rs);
                                                    
                } catch (SQLException e) {
                    logger.error("Impossibile chiudere le risorse",e);
                }
            }
                                                    
        }       
    }
    
    /**
     * Restituisce il totale dei fabbricati
     *
     * @return totale fabbricati da elaborare
     * @throws SITException
     */
    public int getTotaleFabbricatiElaborati() throws SITException {
                  
        LayerFabbricatiCensimento layerFabbricati = getLayer();                               
               
        Filtro filtroGeografico = layerFabbricati.getFiltroVuoto();                            
        layerFabbricati.setFiltro(filtroGeografico);
        
        ResultSet rs = null;   
        int totale = 0;
                
        try {
                        
            rs = layerFabbricati.queryDiretta(conn, 
                     "SELECT COUNT(*) as TOTALE FROM CENSIMENTO_FABBRICATI ", 
                     "dtaggiornamento is not null", 
                     "", true );
            
            if (rs.next()){
                
                totale = rs.getInt("TOTALE");           
                logger.info("TOTALE Fabbricati elaborati = " + totale);
                
            }               
            
            return totale;
            
        } catch (SQLException e) {
            
            throw new SITException("Errore sql" + e.getMessage(),e);
            
        } catch (IOException e) {
            
            throw new SITException("Errore accesso risorse",e);
            
        } finally {
            
            if(rs != null){
                try {
                    
                    layerFabbricati.queryDirettaCloseRs(rs);
                                                    
                } catch (SQLException e) {
                    logger.error("Impossibile chiudere le risorse",e);
                }
            }
                                                    
        }       
    }
    
    /**
     * Restituisce il totale dei fabbricati
     *
     * @return totale fabbricati da elaborare
     * @throws SITException
     */
    public int getTotaleFabbricatiElaboratiNonAssegnati() throws SITException {
                  
        LayerFabbricatiCensimento layerFabbricati = getLayer();                               
               
        Filtro filtroGeografico = layerFabbricati.getFiltroVuoto();                            
        layerFabbricati.setFiltro(filtroGeografico);
        
        ResultSet rs = null;   
        int totale = 0;
                
        try {
                        
            rs = layerFabbricati.queryDiretta(conn, 
                     "SELECT COUNT(*) TOTALE FROM CENSIMENTO_FABBRICATI ", 
                     "dtaggiornamento is not null  and particella is null", 
                     "", true );
            
            if (rs.next()){
                
                totale = rs.getInt("TOTALE");    
                logger.info("TOTALE Fabbricati elaborati no assegnati = " + totale);
                
            }               
            
            return totale;
            
        } catch (SQLException e) {
            
            throw new SITException("Errore sql" + e.getMessage(),e);
            
        } catch (IOException e) {
            
            throw new SITException("Errore accesso risorse",e);
            
        } finally {
            
            if(rs != null){
                try {
                    
                    layerFabbricati.queryDirettaCloseRs(rs);
                                                    
                } catch (SQLException e) {
                    logger.error("Impossibile chiudere le risorse",e);
                }
            }
                                                    
        }       
    }
    
    
    private LayerFabbricatiCensimento getLayer(){
        return (LayerFabbricatiCensimento)this.layer;
    }

}

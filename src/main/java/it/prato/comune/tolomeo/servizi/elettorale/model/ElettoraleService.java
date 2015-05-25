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
package it.prato.comune.tolomeo.servizi.elettorale.model;

import it.prato.comune.sit.Filtro;
import it.prato.comune.sit.LayerElettori;
import it.prato.comune.sit.PoligonoSezioneElettorale;
import it.prato.comune.sit.PoligonoTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.tolomeo.model.TolomeoService;
import it.prato.comune.tolomeo.servizi.elettorale.beans.Statistica;
import it.prato.comune.utilita.core.type.DateType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;


public class ElettoraleService extends TolomeoService{
        
    private LogInterface logger;         
    
    public ElettoraleService(LogInterface logger,LayerElettori sezioniElettorali){
        super(logger,sezioniElettorali);        
    }
    
    /**
     * Restituisce il bean contenente i dati delle statistiche degli elettori relative al poligono della
     * sezione elettorale
     * 
     * @param sezione PoligoSezioneElettorale di cui si vogliono le statistiche
     * @param dtVoto Data delle votazioni necessaria al calcolo dei votanti al senato
     * @return
     * @throws SITException
     */
    public Statistica getStatisticheSezione(PoligonoSezioneElettorale sezione, DateType dtVoto) 
        throws SITException {
        
        Statistica statistiche = getStatistichePoligono(sezione, dtVoto);
        statistiche.setNumeroSezione(""+sezione.getNumeroSezione());
        return statistiche;
                
    }
    
    /**
     * Restituisce il bean contenente i dati delle statistiche degli elettori relative al poligono selezionato
     * 
     * @param poligono
     * @param dtVoto
     * @return
     * @throws SITException
     */
    public Statistica getStatistichePoligono(PoligonoTerritorio poligono, DateType dtVoto) throws SITException {
        
        Statistica statistiche = new Statistica();               
        
        LayerElettori elettori = getLayer();
                                
        if(dtVoto != null){
            statistiche.setDtVoto(dtVoto);
        } else {            
            statistiche.setDtVoto(new DateType());
            logger.warn("Passata una data di elezioni nulla. Valorizzata alla data di oggi");
        }
        
        DateType dtNascXSenato = new DateType(statistiche.getDtVoto().getYear()-25,statistiche.getDtVoto().getMonth(),statistiche.getDtVoto().getDay());
        
        Filtro filtroGeografico = elettori.getFiltroVuoto();                    
        //filtroGeografico.ResetFiltro();                                        
        filtroGeografico.AndFiltroGeog(poligono,Filtro.GEOMETRY_INTERSECTS);
        
        elettori.setFiltro(filtroGeografico);
        
        ResultSet rsSenato = null;
        ResultSet rsCamera = null;                
                
        try {
                        
            rsSenato = elettori.queryDiretta(conn, 
                     "SELECT SESSO, COUNT(SESSO) NUMERO FROM ELETTORIXY ", 
                     "DT_NASC <= to_date('" + dtNascXSenato.getYYYYMMDD() + "','YYYYMMDD')", 
                     " GROUP BY SESSO ", true );
            
            while (rsSenato.next()){
                
                String sesso = rsSenato.getString("SESSO");
                int votanti  = rsSenato.getInt("NUMERO");
                
                if(sesso.equalsIgnoreCase("M")){
                    statistiche.setVotantiMaschiSenato(votanti);
                }else if(sesso.equalsIgnoreCase("F")){
                    statistiche.setVotantiFemmineSenato(votanti);
                }
                
            }   
                        
            rsCamera = elettori.queryDiretta(conn, 
                     "SELECT SESSO, COUNT(SESSO) NUMERO FROM ELETTORIXY ", 
                     "", 
                     " GROUP BY SESSO ", true);
            
            while (rsCamera.next()){
                
                String sesso = rsCamera.getString("SESSO");
                int votanti  = rsCamera.getInt("NUMERO");
                
                if(sesso.equalsIgnoreCase("M")){
                    statistiche.setVotantiMaschiCamera(votanti);
                }else if(sesso.equalsIgnoreCase("F")){
                    statistiche.setVotantiFemmineCamera(votanti);
                }
                
            }
            
            return statistiche;
            
        } catch (SQLException e) {
            
            throw new SITException("Errore sql" + e.getMessage(),e);
            
        } catch (IOException e) {
            
            throw new SITException("Errore accesso risorse",e);
            
        } finally {
            
            if(rsSenato != null){
                try {
                    
                    elettori.queryDirettaCloseRs(rsSenato);
                                                    
                } catch (SQLException e) {
                    logger.error("Impossibile chiudere le risorse",e);
                }
            }
            
            if(rsCamera != null){
                try {
                    
                    elettori.queryDirettaCloseRs(rsCamera);
                                                    
                } catch (SQLException e) {
                    logger.error("Impossibile chiudere le risorse",e);
                }
            }                                
        }       
    }
    
    private LayerElettori getLayer(){
        return (LayerElettori)this.layer;
    }

}

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
package it.prato.comune.tolomeo.model;

import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.SITDefaultTransaction;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITTransaction; 
import it.prato.comune.sit.Territorio;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

public abstract class TolomeoService {
    
    protected LogInterface logger;
    protected Connection conn = null;
    protected SITTransaction transaction = null;
    protected LayerTerritorio layer = null;
    
    
    public TolomeoService(LogInterface logger, LayerTerritorio layer){
        this.layer = layer;
        this.logger = logger;
    }
    
    /**
     * Metodo da richiamare per aprire la connessione al DB.
     * 
     * @return <code>True<code>: se la connessione riesce. <code>False<code>: se la connessione fallisce.
     */
   public boolean connetti() {
                     
       try {             
           
           logger.info("Connessione al database con i Geotools");            
           transaction = new SITDefaultTransaction();
           conn = layer.getJDBCConnection(transaction);
           conn.setAutoCommit(false);
           logger.info("Connessione a " + layer.getNome() + " riuscita");
                     
        } catch (SQLException e) {            
            logger.error("Errore di connessione al database. " + e.getMessage(), e);
            disconnetti();
            return false;
        } catch (SITException e) {
            logger.error("Errore di connessione al database. " + e.getMessage(), e);
            disconnetti();
            return false;
        }       
        return true;
   }
   
    /**
     * Metodo da richiamare per chiudere le risorse
     * @return true se tutto ok
     */
   public boolean disconnetti() {
        try {
            
            if(transaction != null){
                transaction.rollback();
                transaction.close();
            }
            
            try{
                
                if(conn != null && !conn.isClosed()){
                    conn.rollback();
                    conn.close();
                }
                
            }catch(SQLException sqle){
                logger.error("Problemi in rollback e chiusura della connessione.",sqle);
            }
            
        } catch (IOException ioEx) {
            logger.error("Errore di disconnessione dal database.",ioEx);
            return false;
        }
        
        return true;
    }
            
    @Override
    protected void finalize() throws Throwable {
        // TODO Auto-generated method stub
        try{
            disconnetti();
        }finally{
            super.finalize();
        }
    }
    
     public LogInterface getLogger(){
        return this.logger;
     }
           
    
     public Connection getConnection(){
        return this.conn;
     }      
     
     public void commit() throws IOException{
         if(transaction != null){
             transaction.commit();
         }
     }
     
     public void rollback() throws IOException{
         if(transaction != null){
             transaction.rollback();
         }
     }
     
     public static String getShapePath(){
         TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
         return context.getShapePath();
     }
     
     public static Territorio getTerritorio(LogInterface logger) throws IOException
     {
        return new Territorio(getShapePath(),logger,"Comune di Prato");
     }

}

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
package it.prato.comune.tolomeo.servizi.wifi;

import it.prato.comune.sit.beans.SITBeanContext;
import it.prato.comune.sit.beans.wifi.WifiSingleDetailBean;
import it.prato.comune.sit.dao.wifi.WifiDao;
import it.prato.comune.tolomeo.servizi.TolomeoServicesContext;
import it.prato.comune.utilita.core.type.TsType;
import it.prato.comune.utilita.logging.BasicLogger;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


public class UpdateWifiFilter implements Filter {
		
	//private static final 
	private static Date lastUpdate = null;
	private static Date firstFailureUpdate = null;
	private static int attempts = 0;
	private static boolean inizialized = false;
	private static boolean firstTime = true;
	private static boolean failureStatusWarned = false;
	
	// secondi passati dall'ultima richiesta 
	private static final int DEFAULT_RELOADING_INTERVAL = 300;
	private static final int DEFAULT_MAX_ATTEMPTS       = 5;
	
	private static String statusUpdateUrl   = null;
	private static String mailServer        = null;	
	private static String mittente          = null;
	private static List<String> destinatari = null;
	private static int reloadingInterval;
	private static int maxAttempts;
	private static int connectionTimeout;
				
	public void init(FilterConfig filterCfg) throws ServletException {
	    synchronized (UpdateWifiFilter.class) {       
	        UpdateWifiFilter.lastUpdate      = null;
	    }
	}
	
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain catenaOperazioni) throws IOException, ServletException {	    	    
		
		synchronized (UpdateWifiFilter.class) {			
		    
		    BasicLogger logger =  null;
		    HttpURLConnection huc = null;
		    Connection conn = null;
		    SITBeanContext sitContext = null;
		    TolomeoServicesContext context = TolomeoServicesContext.getInstance();
		    		               
			try {					
				HttpServletRequest req = (HttpServletRequest)request;
				
				// ... Istanziazione Logger 
				logger = new BasicLogger(req.getRemoteAddr(),req.getRemoteUser(),(String)context.getProperty("LOG.name"));
				
				if(! UpdateWifiFilter.inizialized){
    				UpdateWifiFilter.statusUpdateUrl = (String)context.getProperty("SERVIZIO.WIFI.STATUS_UPDATE_URL");
    	            String toProperty = (String)context.getProperty("SERVIZIO.WIFI.ALERT_MAIL.TO");
    	            if(toProperty != null){
    	                UpdateWifiFilter.destinatari = Arrays.asList(toProperty.split(","));
    	            }
    	            UpdateWifiFilter.mailServer        = (String)context.getProperty("SERVIZIO.WIFI.ALERT_MAIL.SERVER");                                                            
    	            UpdateWifiFilter.mittente          = (String)context.getProperty("SERVIZIO.WIFI.ALERT_MAIL.FROM");
    	            String reloadingIntervalProperty   = (String)context.getProperty("SERVIZIO.WIFI.RELOADING_INTERVAL");
    	            UpdateWifiFilter.reloadingInterval = reloadingIntervalProperty == null ? DEFAULT_RELOADING_INTERVAL : Integer.parseInt(reloadingIntervalProperty);
    	            String maxAttemptsProperty         = (String)context.getProperty("SERVIZIO.WIFI.MAX_ATTEMPTS");
    	            UpdateWifiFilter.maxAttempts       = maxAttemptsProperty == null ? DEFAULT_MAX_ATTEMPTS : Integer.parseInt(maxAttemptsProperty);
    	            String connectionTimeoutProperty   = (String)context.getProperty("SERVIZIO.WIFI.STATUS_UPDATE_TIMEOUT");
                    UpdateWifiFilter.connectionTimeout = connectionTimeoutProperty == null ? 0 : Integer.parseInt(connectionTimeoutProperty);
    	            
    	            UpdateWifiFilter.inizialized = true;
				}    				
	            
				Date now = new Date();
				
				if(UpdateWifiFilter.lastUpdate == null || (now.getTime() - UpdateWifiFilter.lastUpdate.getTime()) > UpdateWifiFilter.reloadingInterval*1000){		
				    
				    UpdateWifiFilter.attempts++;
				    UpdateWifiFilter.lastUpdate = new Date(); 
				    
				    if(UpdateWifiFilter.lastUpdate != null){
				        logger.debug("CHIESTO AGGIORNAMENTO WI-FI " + new TsType(UpdateWifiFilter.lastUpdate).getFormattedTimeStamp());
				    }
				    
				    if(UpdateWifiFilter.statusUpdateUrl == null){				        
				        logger.error("Parametro SERVIZIO.WIFI.STATUS_UPDATE_URL non impostato");				        
				    }else{
				        
				        String urlS = UpdateWifiFilter.statusUpdateUrl + (UpdateWifiFilter.firstTime? "?description=1" : "");
    				    logger.info("statusUpdateUrl = " + urlS);
    				    
    				    // Creo la connessione HTTP per il recupero dei dati sullo stato degli access-point wifi
    				    // Se è la prima volta che passo dal filtro aggiorno anche le descrizioni
    				    URL url = new URL(urlS);
    				    huc = (HttpURLConnection) url.openConnection();
    		            huc.setRequestMethod ("GET") ; 
    		            huc.setAllowUserInteraction(false);
    		            huc.setConnectTimeout(connectionTimeout);
    		            
    		            logger.info("WI-FI connection timeout = " + huc.getConnectTimeout());
    		            logger.info("WI-FI connection start   = " + new TsType().getFormatted(':'));
    		            
    		            huc.connect();
    		            
    		            int code = huc.getResponseCode();
    		            
    		            if ((code>=200) && (code<300)){   
    		                BufferedReader is = new BufferedReader(new InputStreamReader(huc.getInputStream())); 
    		                StringBuilder sb = new StringBuilder();
    		                String line = null;
    		                while ((line = is.readLine()) != null) {  
    		                    sb.append(line);        
    		                }
    		                
    		                JSONArray jsArray = JSONArray.fromObject(sb.toString());		                
    		                List<WifiSingleDetailBean> wifiSingleDetailBeans = new ArrayList<WifiSingleDetailBean>();
    		                
    	                    for(int i=0; i<jsArray.size(); i++){
    	                        JSONObject jsObject = jsArray.getJSONObject(i);
    	                        int id = jsObject.getInt("id");
    	                        int status = jsObject.getInt("status");
    	                        //logger.debug("WIFI " + id + " : " + status);
    	                        WifiSingleDetailBean wifiSingleDetailBean = new WifiSingleDetailBean();
    	                        wifiSingleDetailBean.setId(id);
    	                        wifiSingleDetailBean.setStatus(status);
    	                        
    	                        if(UpdateWifiFilter.firstTime){
    	                            String description = jsObject.getString("description");
    	                            wifiSingleDetailBean.setDescription(description);    	                           
    	                        }
    	                        
    	                        wifiSingleDetailBeans.add(wifiSingleDetailBean);
    	                    }
    	                    
    	                    sitContext = SITBeanContext.getInstance();
    	                    conn = sitContext.getConnection(logger);
    	                    WifiDao wifiDao = new WifiDao(logger);
    	                    
    	                    if(UpdateWifiFilter.firstTime){
    	                        logger.info("E' la prima volta che passo dal filtro e quindi aggiorno anche le descrizioni degli Hot Spot");
    	                        wifiDao.updateSingleDetail(wifiSingleDetailBeans, conn);
    	                    }else{
    	                        wifiDao.updateStatus(wifiSingleDetailBeans, conn);
    	                    }
    	                    
    	                    conn.commit();
    	                        	                    
    	                    UpdateWifiFilter.firstFailureUpdate = null;
    	                    UpdateWifiFilter.attempts = 0;
    	                    UpdateWifiFilter.firstTime = false;
    	                    
    	                    if(UpdateWifiFilter.failureStatusWarned){
    	                        UpdateWifiFilter.failureStatusWarned = false;

    	                        String oggetto = "WIFI: Aggiornamento dello stato degli Hot Spot ripreso CORRETTAMENTE!";                    
    	                        String messaggio = "L'aggiornamento dello stato degli Hot Spot è ripreso correttamente il " + new TsType(now).getFormattedTimeStamp();                
    	                                                               
    	                        try {
    	                            inviaMail(UpdateWifiFilter.mailServer, oggetto, messaggio, UpdateWifiFilter.mittente, UpdateWifiFilter.destinatari, logger);
    	                        } catch (Exception e) {
    	                            logger.error("Errore durante l'invio della mail di ALERT per l'aggiornamento dello stato dei WIFI",e);
    	                        }
    	                        
    	                    }
    	                    
    		            } else {
    		                if(UpdateWifiFilter.firstFailureUpdate == null){
    		                    UpdateWifiFilter.firstFailureUpdate = new Date();
    		                }
    		                logger.error("Problemi nella connessione HTTP per il recupero dello stato dei WIFI: (" + huc.getResponseCode()+ ") " + huc.getResponseMessage());
    		            }		            
				    }
				}
								
			} catch (Exception e) {			    
			    if(UpdateWifiFilter.firstFailureUpdate == null){
                    UpdateWifiFilter.firstFailureUpdate = new Date();
                }
			    if(logger != null){
			        logger.error("Errore nell'aggiornamento dati del wifi",e);
			    }			    
			} finally{		
			    			      			    
			    if(conn != null){
			        sitContext.closeConnection(conn, logger);
			    }
			    
			    logger.info("WI-FI connection stop    = " + new TsType().getFormatted(':'));
			    if (huc!=null){ 
	                huc.disconnect();
	            }
			    
			    // Se è un bel po' che fallisce e sono stati fatti diversi tentativi, avverto il SIT
                if( UpdateWifiFilter.firstFailureUpdate != null && 
                    (UpdateWifiFilter.lastUpdate.getTime() - UpdateWifiFilter.firstFailureUpdate.getTime()) > UpdateWifiFilter.maxAttempts*UpdateWifiFilter.reloadingInterval*1000 &&                                        
                     UpdateWifiFilter.attempts >= UpdateWifiFilter.maxAttempts &&
                    !UpdateWifiFilter.failureStatusWarned ){
                    
                    String oggetto = "WIFI: Aggiornamento dello stato degli Hot Spot FALLITO!";                    
                    String messaggio = "Sta fallendo la procedura di aggiornamento dello stato degli Hot Spot.\nIl primo fallimento si è verificato il " + new TsType(UpdateWifiFilter.firstFailureUpdate).getFormattedTimeStamp() + ". Controllare il log " + logger.getLogName()+ "!";
                            
                    try {
                        inviaMail(UpdateWifiFilter.mailServer,oggetto , messaggio, UpdateWifiFilter.mittente, UpdateWifiFilter.destinatari, logger);
                        UpdateWifiFilter.failureStatusWarned = true;
                    } catch (Exception e) {
                        logger.error("Errore durante l'invio della mail di ALERT per l'aggiornamento dello stato dei WIFI",e);
                    }
                    
                }
			}
		}
		
		catenaOperazioni.doFilter(request,response);
	}
	
	private void inviaMail(String mailServer, String soggetto, String messaggio, String mittente, List<String> destinatari, LogInterface logger) throws AddressException,MessagingException
    {                   
        
      Address from = null;
      Address[] to = new Address[destinatari.size()];
      
      Properties mailProps = new Properties();
      mailProps.put("mail.smtp.host", mailServer);
      Session session = Session.getInstance(mailProps, null);
      MimeMessage message = new MimeMessage(session);     
      
      try {
          from = new InternetAddress(mittente);
          for (int i=0; i<destinatari.size(); i++) {
              to[i] = InternetAddress.parse(destinatari.get(i))[0];
          } 
      }catch (AddressException e){
          logger.error("Errore nel formato dell'indirizzo e-mail. " + e);
          throw e;
      }
      
      try {
         message.setFrom(from);
         message.setRecipients(Message.RecipientType.TO, to);        
         message.setSubject(soggetto);         
         message.setText(messaggio);         
      } catch (MessagingException e) {
          logger.error("Errore nel formato della mail.",e);
          throw e;
      }      
      // Send the message
      try {
         Transport.send( message );
      } catch (MessagingException e) {         
         logger.error("Errore nell'invio della mail.",e);
         throw e;
      }
      
    }
	
	public void destroy() {
		// TODO Auto-generated method stub
		
	}
}

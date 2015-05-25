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
package it.prato.comune.tolomeo.servizi;

import it.prato.comune.tolomeo.servizi.elettorale.ElettoraleApplicationProperties;
import it.prato.comune.tolomeo.servizi.shared.SharedApplicationProperties;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.core.beans.ApplicationContextInterface;
import it.prato.comune.utilita.core.beans.BeanContextInterface;
import it.prato.comune.utilita.logging.BasicLogger;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <p>Title: SitContextBean</p>
 * <p>Description: ContextBean dell'applicazione SIT</p>
 * <p>Copyright: Copyright (c) 2006</p>
 * <p>Company: Comune di Prato</p>
 * @author Federico Nieri
 * @version 1.0
 */
public class TolomeoServicesContext implements ApplicationContextInterface {

    // ALCUNI NOMI DELLE PROPRETA'
    public static final String PROPERTY_NAME__LOGGER_NAME             = "LOG.name";
    // Utilizzata sulle VAS perchè il log4j è per singolo contesto
    public static final String PROPERTY_NAME__LOG4J_PROPERTIES        = "LOG4J.properties";

    // SERVIZI
    public static final String SERVIZIO_ELETTORALE = "ELETTORALE";
    public static final String SERVIZIO_SHARED     = "SHARED";   

    // ... Unica istanza del contesto
    private static TolomeoServicesContext instance;

    // ...Proprieta'
    private String        configFileName;
    private Properties    properties; 
    private char          jvm;
    private LogInterface  anonymousLogger;

    private HashMap<String, Properties> servizi;
    
    /**
     * Costruttore privato!
     */
    private TolomeoServicesContext() {
        jvm        = BeanContextInterface.UNDEFINED;
        properties = new Properties();
    }

    /**
     * Restituisce l'unica istanza attiva del contesto.
     * La prima volta che viene invocato deve essere settato subito dopo
     * il ConfigFileName, la JVM e l'utilizzo del Pool di connessione.
     */
    public static synchronized TolomeoServicesContext getInstance() {
        if (instance==null) {
            // ... Prima volta
            instance = new TolomeoServicesContext();

            instance.servizi = new HashMap<String, Properties>();
            instance.servizi.put("SHARED", new SharedApplicationProperties());
            instance.servizi.put("ELETTORALE", new ElettoraleApplicationProperties());                     

        } 
        return instance;
    }      

    public Properties getProperties() {      
        return properties;
    }

    /**
     * Restituisce il valore di una proprieta'.
     * @param key - Nome/Chiave della proprieta' (NULL=Non trovata)
     * @return Object - proprieta'
     */
    public Object getProperty(Object key) {
        return properties.get(key);
    }

    /**
     * Restituisce il valore di una proprieta di tipo stringa
     * @param key - Nome/Chiave della proprieta' (NULL=Non trovata)
     * @return String - proprieta'
     */
    public String getStringProperty(Object key) {
        Object obj = properties.get(key);
        if(obj == null) return null;
        return obj.toString();
    }

    /**
     * Imposta il valore di una proprieta'.
     * @param key - Nome/Chiave della proprieta'
     * @param value - Valore
     */
    public void setProperty(Object key, Object value) {
        properties.put(key,value);
    }

    /**
     * Restituisce il full-name del file di properties.  
     * @return String - Full-name  
     */
    public String getConfigFileName() {
        return configFileName;
    }

    /**
     * Imposta il full-name del file di properties.  
     * @param fileName - Full-name del config file.  
     */
    public void setConfigFileName(String fileName){
        // ... Viene considerato solo se mancava o se diverso
        if (configFileName==null || !configFileName.equals(fileName)) {
            FileInputStream input = null;
            // .... Lettura file
            try {

                File configFile = new File(fileName);
                input = new FileInputStream(configFile);

                properties.load(input);            
                
                //... Se trovo la proprieta' LOG.name istanzio il logger Anonimo altrimento lo recupero dal TolomeoApplicationContext
                String loggerName = (String)properties.get(PROPERTY_NAME__LOGGER_NAME);
                if (loggerName==null) {                    
                    TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();       
                    loggerName = context.getLogName();    
                    this.setProperty(PROPERTY_NAME__LOGGER_NAME,loggerName);
                }      
                if (loggerName != null)
                    anonymousLogger = new BasicLogger("---.---.---.---","NOUSER",loggerName);
                

                // RIPULISCO LE PROPRIETA' DEI SERVIZI SPECIFICI E LE RICARICO CON QUELLE LETTE DAL FILE
                synchronized (servizi) {
                    for (Iterator<String> iter = servizi.keySet().iterator(); iter.hasNext();) {
                        String key = (String) iter.next();
                        servizi.get(key).clear();
                    }

                    for (Iterator<Object> iter = properties.keySet().iterator(); iter.hasNext();) {
                        String key = (String) iter.next();
                        if(key.startsWith("SERVIZIO.")){
                            String[] servizio = key.split("\\.");
                            String nomeServizio = servizio[1];
                            String propServizio = servizio[2]; 
                            Properties servizioProperties = servizi.get(nomeServizio);
                            
                            // Controllo ser per il servizio è stata definita la classe da utilizzare
                            if(servizioProperties == null){
                                String serviceClassName = (String)properties.get("SERVIZIO." + nomeServizio + ".PROP_CLASS");
                                if(serviceClassName != null){
                                   try {
                                       
                                       servizioProperties = (Properties)Class.forName(serviceClassName).newInstance();
                                             
                                   } catch (ClassCastException e) {
                                       if (anonymousLogger!=null) {
                                           anonymousLogger.error("La classe " + serviceClassName + " non è di tipo java.util.Properties");
                                       }
                                   } catch (ClassNotFoundException e) {
                                       if (anonymousLogger!=null) {
                                           anonymousLogger.error("Classe " + serviceClassName + " non trovata",e);
                                       }
                                   } catch (IllegalAccessException e) {
                                       if (anonymousLogger!=null) {
                                           anonymousLogger.error("Il costruttore vuoto della classe " + serviceClassName + " non è visibile.",e);
                                       }
                                   } catch (InstantiationException e) {
                                       if (anonymousLogger!=null) {
                                           anonymousLogger.error("Problemi nell'istanziare la classe " + serviceClassName,e);
                                       }
                                   } 
                                }    
                                
                                if(servizioProperties == null){
                                    servizioProperties = new Properties();
                                }
                                
                                servizi.put(nomeServizio,servizioProperties);
                            } 
                            
                            servizioProperties.put(propServizio, getProperty(key));
                        }
                    }  
                }               

            } catch (FileNotFoundException FNF) {
                System.out.println("File non trovato: "+fileName);
                if (anonymousLogger!=null) {
                    anonymousLogger.error("File non trovato: "+fileName,FNF);
                }
            } catch (IOException IOE) {
                System.out.println("Errore lettura configFile: "+fileName);
                if (anonymousLogger!=null) {
                    anonymousLogger.error("Errore lettura configFile: "+fileName,IOE);
                }
            } finally {
                if(input!=null){
                    try{
                        input.close();
                    }catch(IOException IOE){
                        System.out.println("ERRORE nella chiusura File delle Proprieta' : "+IOE.getMessage());
                        if (anonymousLogger!=null) {
                            anonymousLogger.error("ERRORE nella chiusura File delle Proprieta' : "+fileName,IOE);
                        }
                    }
                }
            }                  
        }
        this.configFileName = fileName;
    }

    /**
     * Restituisce il tipo di virtual machine corrente.
     * @return char - Tipo di virtual machine (vedi costanti)
     */
    public char getJvm() {
        return jvm;
    }

    /**
     * Imposta il tipo di virtual machine.
     * @param jvm - Tipo di virtual machine (vedi costanti)
     */
    public void setJvm(char jvm) {
        this.jvm = jvm;
    }

    public LogInterface getAnonymousLogger() {
        return anonymousLogger;
    }

    public void setAnonymousLogger(LogInterface logger) {
        this.anonymousLogger = logger;
    }

    public String ifRelativeSetAbsolute(String fileName) {

        if ((fileName==null) || fileName.equals("") || (new File(fileName)).isAbsolute()) {
            return fileName;
        } else {
            File cf = new File(configFileName);
            return cf.getAbsoluteFile().getParent() + File.separator + fileName;
        }

    }

    public String getLogName(){
        return (String)this.getProperty(PROPERTY_NAME__LOGGER_NAME);
    }

    public void dumpProperties(LogInterface logger){
        logger.debug("**** PROPRIETA' DEI SERVIZI SIT ****");
        for (Iterator<Object> iter = properties.keySet().iterator(); iter.hasNext();) {
            String key = (String) iter.next();
            logger.debug(key+ " = "+getProperty(key));
        }     
    }

    /**
     * Restituisce la classe di Properties specifica del servizio o null se non c'è
     * 
     * @param nomeServizio
     * @return
     */
    public Properties getServizioProperties(String nomeServizio){
        return servizi.get(nomeServizio);
    }

    /**
     * Restituisce la classe di Properties specifica del servizio elettorale
     * @return
     */
    public ElettoraleApplicationProperties getServizioElettoraleProperties(){
        return (ElettoraleApplicationProperties)getServizioProperties(SERVIZIO_ELETTORALE);
    }

    /**
     * Restituisce la classe di Properties specifica dei servizi condivisi
     * @return
     */
    public SharedApplicationProperties getServizioSharedProperties(){
        return (SharedApplicationProperties)getServizioProperties(SERVIZIO_SHARED);
    }

    public String getLog4JPropertiesFile(){
        return (String)ifRelativeSetAbsolute((String)this.getProperty(PROPERTY_NAME__LOG4J_PROPERTIES));
    }

    public Map<String,String> getConfigOptMapionsThatStartsWith(String prefix) {

        Properties props = getProperties();       
        Map<String,String> filteredProperties = new HashMap<String, String>();

        for(Iterator<Entry<Object,Object>> i = props.entrySet().iterator() ; i.hasNext() ;){

            Map.Entry mapEntry = (Map.Entry)i.next();           
            if(mapEntry.getKey()!=null){                              
                String key = mapEntry.getKey().toString();               
                if(key.startsWith(prefix)){                   
                    filteredProperties.put(key, (String)mapEntry.getValue());                   
                }
            }
        }

        return filteredProperties;
    }

    public Map<String,String> getConfigOptionsByRegExp(String regexp) {

        Properties props = getProperties();   
        Pattern pattern = Pattern.compile(regexp);               

        Map<String,String> filteredProperties = new HashMap<String, String>();

        for(Iterator<Entry<Object,Object>> i = props.entrySet().iterator() ; i.hasNext() ;){           
            Map.Entry mapEntry = (Map.Entry)i.next();           
            if(mapEntry.getKey()!=null){                              
                String key = mapEntry.getKey().toString();   
                Matcher m = pattern.matcher(key);

                if(m.matches()){
                    filteredProperties.put(key, (String)mapEntry.getValue());     
                }
            }
        }

        return filteredProperties;
    }
}

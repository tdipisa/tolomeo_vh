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
package it.prato.comune.tolomeo.utility;

import it.prato.comune.menu.core.Abilitazione;
import it.prato.comune.menu.core.Application;
import it.prato.comune.menu.core.Function;
import it.prato.comune.utilita.core.beans.BeanContextInterface;
import it.prato.comune.utilita.core.context.MixedContext;
import it.prato.comune.utilita.core.type.IdType;
import it.prato.comune.utilita.logging.BasicLogger;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

/**
 * <p>Title: SitContextBean</p>
 * <p>Description: ContextBean dell'applicazione SIT</p>
 * <p>Copyright: Copyright (c) 2006</p>
 * <p>Company: Comune di Prato</p>
 * @author Federico Nieri
 * @version 1.0
 */
public class TolomeoApplicationContext extends MixedContext {

    // ALCUNI NOMI DELLE PROPRETA'
    public static final String PROPERTY_NAME__LOGGER_NAME             = "LOG.name".intern();
    public static final String PROPERTY_NAME__MENU_PROPERTY_FILE      = "MENU.file".intern();
    public static final String PROPERTY_NAME__SHAPEPATH               = "pathShape".intern();
    public static final String PROPERTY_NAME__PRESETFILENAME          = "PRESETFILENAME".intern();
    public static final String PROPERTY_NAME__PRESET_SENDING_ALLOWED  = "PRESET.SENDING_ALLOWED".intern();

    public static final String PROPERTY_NAME__URLBASELAYERSEPARATO    = "URLBASELAYERSEPARATO".intern();

    public static final String OPENLINK_PROPERTY_NAME_PREFIX          = "OPEN_LINK_".intern();
    public static final String FUNZPUB_PROPERTY_NAME_PREFIX           = "FUNZ_PUB_".intern();

    public static final String PROPERTY_NAME__LEGEND_READ_PATH        = "LEGEND_READ_PATH".intern();
    public static final String PROPERTY_NAME__LEGEND_WRITE_PATH       = "LEGEND_WRITE_PATH".intern();
    public static final String PROPERTY_NAME__LEGENDGRAPHIC_EXTRAPARAMS = "LEGENDGRAPHIC.EXTRAPARAMS".intern();

    public static final String PROPERTY_NAME__CSSDEBUG                = "CSSDEBUG".intern();
    public static final String PROPERTY_NAME__JSDEBUG                 = "JSDEBUG".intern();

    public static final String PROPERTY_NAME__GOOGLEAPISTATO          = "GOOGLE.API.STATO".intern();
    public static final String PROPERTY_NAME__GOOGLEAPICLIENTID       = "GOOGLE.API.CLIENTID".intern();
    
    public static final String PROPERTY_NAME__SELECTMODEDEFAULT       = "SELECT.MODE.DEFAULT".intern();

    // Utilizzata sulle VAS perchè il log4j è per singolo contesto
    public static final String PROPERTY_NAME__LOG4J_PROPERTIES        = "LOG4J.properties".intern();
    															
    private static final String PROPERTY_NAME__TOLOMEOSTATICROOT      = "TOLOMEOSTATICROOT".intern();
    
    public static final String PROPERTY_NAME__PRINT_MAX_DPI           = "PRINT.MAX_RESOLUTION.DPI".intern();
    public static final String PROPERTY_NAME__HELP_MAIL_TO            = "HELP.MAIL.TO".intern();
    public static final String PROPERTY_NAME__HELP_MAIL_SUBJECT       = "HELP.MAIL.SUBJECT".intern();
    public static final String PROPERTY_NAME__HELP_GUIDE_URL          = "HELP.GUIDE.URL".intern();
    public static final String PROPERTY_NAME__HELP_FAQ_URL            = "HELP.FAQ.URL".intern();
    public static final String PROPERTY_NAME__HELP_INFO_MAIN_TITLE    = "HELP.INFO.MAIN_TITLE".intern();
    
    public static final String PROPERTY_NAME__MODE           		  = "MODE".intern();   
    
    public static enum MODE {
    		READ_ONLY,
    		READ_WRITE
    };
    
    // SERVIZI
//    public static final String SERVIZIO_ELETTORALE = "ELETTORALE";
//    public static final String SERVIZIO_SHARED     = "SHARED";   

//    private static final String DBALIAS  = "SIT";

    private static final String RESTCREDENTIALPREFIX = "RESTCREDENTIAL";
    private static final String RESTCREDENTIALURL 	= "URL";
    private static final String RESTCREDENTIALUSER 	= "USER";
    private static final String RESTCREDENTIALPWD  	= "PWD";

    private static final String[]  MODEREADONLYFORBIDDENURLS = { "GeometryUpdateServlet" };
    
    private static final String HELP_INFO_PREFIX = "HELP.INFO";
    

    // ... Unica istanza del contesto
    private static TolomeoApplicationContext instance;

    // ...Proprieta'
    private String        configFileName;
    private Properties    properties; 
    private char          jvm;
    private LogInterface  anonymousLogger;
//    private boolean       usePool;
//    private DBPoolManager dbpm;
    private List<FunzionePubblicaBean> funzioniPubbiche;


    /**
     * Costruttore privato!
     */
    private TolomeoApplicationContext() {
        jvm        = BeanContextInterface.UNDEFINED;
        properties = new Properties();
//        usePool    = true;
        funzioniPubbiche = null;
    }

    /**
     * Restituisce l'unica istanza attiva del contesto.
     * La prima volta che viene invocato deve essere settato subito dopo
     * il ConfigFileName, la JVM e l'utilizzo del Pool di connessione.
     */
    public static TolomeoApplicationContext getInstance() {
        if (instance==null) {
            // ... Prima volta
            instance = new TolomeoApplicationContext();
        } else {
            // ... Volte successive
            if (instance.getConfigFileName()==null) {
                //ALE throw new RuntimeException("E' necessario configurare il contesto settando il ConfigFileName!");
            }
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
            funzioniPubbiche = null;
            FileInputStream input = null;
            // .... Lettura file
            try {

                File configFile = new File(fileName);
                input = new FileInputStream(configFile);

                properties.load(input);            

                // RIPULISCO LE PROPRIETA' DEI SERVIZI SPECIFICI E LE RICARICO CON QUELLE LETTE DAL FILE
                /*
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
                            if(servizioProperties != null){
                                servizioProperties.put(propServizio, getProperty(key));
                            }
                        }
                    }  
                }
                */

                //... Se trovo la proprieta' LOG.name istanzio il logger Anonimo
                String logname = (String)properties.get(PROPERTY_NAME__LOGGER_NAME);
                if (logname!=null) {
                    anonymousLogger = new BasicLogger("---.---.---.---","NOUSER",logname);
                }                               

            }catch (FileNotFoundException FNF) {
                System.out.println("File non trovato: "+fileName);
                if (anonymousLogger!=null) {
                    anonymousLogger.error("File non trovato: "+fileName,FNF);
                }
            }catch (IOException IOE) {
                System.out.println("Errore lettura configFile: "+fileName);
                if (anonymousLogger!=null) {
                    anonymousLogger.error("Errore lettura configFile: "+fileName,IOE);
                }
            }finally{
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
     * Restituisce la connessione di Default.
     * @param logger - Logger valido
     * @return Connection - Connessione valida al DB.
     */   
    /*
   public Connection getConnection(LogInterface logger) throws SQLException, BasicException {
      return getConnection(DBALIAS,logger);
   }
     */

    /**
     * Restituisce una connessione ad un DB Specifico.
     * @param alias - Alias del DB richiesto
     * @param logger - Logger valido
     * @return Connection - Connessione valida al DB.
     */
    /*
   public Connection getConnection(String alias, LogInterface logger) throws SQLException, BasicException {
      Connection   conn   = null;

      // ... La connessione tramite Connection-Pool avviene solo in ambito TOMCAT
      // ... e se richesta
      if (usePool && jvm==TOMCAT) {
         try {

            if (dbpm==null) {
               dbpm = DBPoolManager.getInstance();
            }

            CallFeedBack cfb = dbpm.getConnection(alias,DBProperties.getInstance(),logger);

            if (cfb.getRc() != 0) {
               logger.error("Impossibile Connettersi a "+alias+": "+cfb.getMsg());
               throw new BasicException("Impossibile Connettersi a "+alias+": "+cfb.getMsg());
            }

            conn = (Connection)cfb.getReturned(0);

         } catch (ConnPoolException e) {
            if (e.getCause() instanceof SQLException) {
               logger.error("Errore Acquisizione Connessione "+alias+": "+((SQLException)e.getCause()).getMessage());
               throw (SQLException)e.getCause();
            } else {
               logger.error("Errore Acquisizione Connessione "+alias+": "+e.getMessage(),e);
               throw new BasicException(-1,"Errore Acquisizione Connessione "+alias+": "+e.getMessage(),e); 
            }
         }

      } else {
         // ... Connessione tradizionale
         try {
            Class.forName((String)getProperty("JDBC.driver"));
            conn = DriverManager.getConnection((String)getProperty("JDBC.url"),(String)getProperty("JDBC.user"),(String)getProperty("JDBC.password"));
            conn.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
            conn.setAutoCommit(false);
         } catch (SQLException e) {
            logger.error("Errore Acquisizione Connessione "+alias+": "+e.getMessage());
            throw e;
         } catch (Exception e) {
            logger.error("Errore Acquisizione Connessione "+alias+": "+e.getMessage(),e);
            throw new BasicException(-1,"Errore Acquisizione Connessione "+alias+": "+e.getMessage(),e);
         }

      }

      return conn;
   }
     */

    /**
     * Chiude la connessione indicata.
     * @param logger - Logger valido
     * @param connection - Connessione da chiudere.
     */
    /*
   public void closeConnection(Connection connection, LogInterface logger) throws SQLException, BasicException {
      if (dbpm!=null && usePool && jvm==TOMCAT) {
         try {
            dbpm.relConnection(connection,logger);
         } catch (Exception e) {
         }
      } else {
         connection.rollback();
         connection.close();
      }
   }
     */


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

    /**
     * Indica se il contesto e' impostato per utilizzare il Connection-Pool.
     * @return boolean - true = usa ConnPool, false = non lo usare.
     */
    /*
   public boolean isUsePool() {
      return usePool;
   }
     */
    /**
     * Imposta il contesto per usare o meno il Connection-Pool.
     * @param usePool - true = usa ConnPool, false = non lo usare.
     */
    /*
   public void setUsePool(boolean usePool) {
      this.usePool = usePool;
   }
     */
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

    // RECUPERO DELLE PROPRIETA' PRINCIPALI

    /**
     * Recupero delle credenziali REST a partire dal nome delle credenziali. Le credenziali sono definite nel file di configurazione nella forma: <br/>
     * <br/>
     * RESTCREDENTIAL.URL.PIPPO=http://geoserver.comune.prato.it/geoserver <br/>
     * RESTCREDENTIAL.USER.PIPPO=admin <br/>
     * RESTCREDENTIAL.PWD.PIPPO=ppapa <br/>
     * 
     * @param credentialname
     */
    public RESTCredentialsBean getRestCredential(String credentialname) {

        String url = (String)this.getProperty(RESTCREDENTIALPREFIX+"."+RESTCREDENTIALURL + "." + credentialname);
        String user = (String)this.getProperty(RESTCREDENTIALPREFIX+"."+RESTCREDENTIALUSER+ "." + credentialname);
        String pwd = (String)this.getProperty(RESTCREDENTIALPREFIX+"."+RESTCREDENTIALPWD+ "." + credentialname);

        if (url!=null && user!=null && pwd != null) 
            return new RESTCredentialsBean(url, user, pwd);
        else return null;

    }

    /**
     * Restituisce un oggetto HelpInfoConfig recuperando i valori dal file di properties     
     * @param order
     * @return
     */
    private HelpInfoConfig getHelpInfoConfig(int order){
        
        String title = (String)this.getProperty(HELP_INFO_PREFIX + "." + order + ".TITLE");
        String url = (String)this.getProperty(HELP_INFO_PREFIX + "." + order + ".URL");
        String framed = (String)this.getProperty(HELP_INFO_PREFIX + "." + order + ".FRAMED");
        String important = (String)this.getProperty(HELP_INFO_PREFIX + "." + order + ".IMPORTANT");
        
        boolean isFramed = (framed != null && framed.equals("true"));
        boolean isImportant = (important != null && important.equals("true"));
        
        HelpInfoConfig hc =  new HelpInfoConfig();
        hc.setOrder(order);
        hc.setTitle(title);
        hc.setUrl(url);
        hc.setFramed(isFramed);
        hc.setImportant(isImportant);
        return hc;
    }
    
    /**
     * Restituisce la lista delle eventuali informazioni configurate sul file di properties
     * @return
     */
    public List<HelpInfoConfig> getHelpInfoConfigList(boolean onlyImportant){
        
        List<HelpInfoConfig> hicList = new ArrayList<HelpInfoConfig>();
        Set<Object> keys = this.getProperties().keySet();
                
        Pattern pattern = Pattern.compile("^" + HELP_INFO_PREFIX + ".(\\d+).TITLE$");        
        
        for (Iterator<Object> iterator = keys.iterator(); iterator.hasNext();) {
            String key = (String) iterator.next();            
            Matcher m = pattern.matcher(key);
            boolean matched = m.matches();            
            if(matched){
                int order = Integer.parseInt(m.group(1));
                HelpInfoConfig hic = this.getHelpInfoConfig(order);
                if(hic != null && (!onlyImportant || hic.isImportant())){
                    hicList.add(hic);
                }                
            }
        }
        
        Collections.sort(hicList, new Comparator<HelpInfoConfig>(){
            public int compare(HelpInfoConfig hic1, HelpInfoConfig hic2){
                return ((HelpInfoConfig)hic1).getOrder() - ((HelpInfoConfig)hic2).getOrder();
            }
        });
        
        return hicList;
    }

    public String getLogName(){
        return (String)this.getProperty(PROPERTY_NAME__LOGGER_NAME);
    }

    public String getMenuPropertiesFile(){
        return ifRelativeSetAbsolute( (String)this.getProperty(PROPERTY_NAME__MENU_PROPERTY_FILE));
    }

    public String getShapePath(){
        return ifRelativeSetAbsolute( (String)this.getProperty(PROPERTY_NAME__SHAPEPATH));
    }

    public String getLegWritePath(){
        return ifRelativeSetAbsolute( (String)this.getProperty(PROPERTY_NAME__LEGEND_WRITE_PATH));
    }

    public String getLegExtraGraphParams(){
        return (String) this.getProperty(PROPERTY_NAME__LEGENDGRAPHIC_EXTRAPARAMS);
    }

    public String getLegReadPath(){
        return (String)this.getProperty(PROPERTY_NAME__LEGEND_READ_PATH);
    }

    public Boolean getJSDebug(){
        String jsd = (String)this.getProperty(PROPERTY_NAME__JSDEBUG);

        if ((jsd!=null) && jsd.trim().toUpperCase().equals("FALSE")) {
            return false;
        } else {
            return true;
        }
    }

    public Boolean getCSSDebug(){
        String cssd = (String)this.getProperty(PROPERTY_NAME__CSSDEBUG);

        if ((cssd!=null) && cssd.trim().toUpperCase().equals("FALSE")) {
            return false;
        } else {
            return true;
        }

    }

    public Boolean getGoogleAPIStato(){
        String googleAPIStato = (String)this.getProperty(PROPERTY_NAME__GOOGLEAPISTATO);

        if ((googleAPIStato!=null) && googleAPIStato.trim().toUpperCase().equals("FALSE")) {
            return false;
        } else {
            return true;
        }
    }

    public String getGoogleAPIClientID(){
        return (String)this.getProperty(PROPERTY_NAME__GOOGLEAPICLIENTID);
    }

    public String getSelectModeDefault(){
    	String mode = (String)this.getProperty(PROPERTY_NAME__SELECTMODEDEFAULT);
    	
        return (mode==null) ? "FIRSTONTOP" : mode.trim().toUpperCase();
    }
    
    
    
    public String getTolomeoStaticRoot(String contextname){
    	String retVal = (String)this.getProperty(PROPERTY_NAME__TOLOMEOSTATICROOT);
    	
    	if (retVal!=null && !retVal.trim().equals("")) {
    		retVal += (retVal.trim().endsWith("/")) ? "" : "/";
    	} else {
    		retVal = (contextname.trim().endsWith("/")) ? contextname : contextname + "/";
    	}
        return retVal;
    }

    public TolomeoApplicationContext.MODE getMode(){
    	String buff = (String)this.getProperty(PROPERTY_NAME__MODE);
    	
    	if (buff!=null && !buff.equals("") && buff.equalsIgnoreCase("readwrite")) {
    		return TolomeoApplicationContext.MODE.READ_WRITE;
    	} else {
    		return TolomeoApplicationContext.MODE.READ_ONLY;
    	}    	
    }
    
    public boolean isModeForbiddenUrl(String url) {
    	
    	switch (getMode()) {
    		case READ_ONLY:
    			for (String b: MODEREADONLYFORBIDDENURLS) {
    				if (url.contains(b)) return true;
    			}
    			return false;
    		case READ_WRITE:
    			return false;
    		default: 
    			return true;
    	}
    }

    public String getPresetFileName(){
        return ifRelativeSetAbsolute((String)this.getProperty(PROPERTY_NAME__PRESETFILENAME));
    }
    
    /**
     * Restituisce la cartella che contiene i preset
     * @return
     */
    public File getPresetDirectory(){
        String presetFileName = getPresetFileName();
//        int lastIndex = presetFileName.lastIndexOf(File.separator);
        int lastIndex = presetFileName.lastIndexOf("\\");
        lastIndex = lastIndex > presetFileName.lastIndexOf("/") ? lastIndex : presetFileName.lastIndexOf("/");
        if(lastIndex != -1){
            File presetDirectory = new File(presetFileName.substring(0, lastIndex));
            if(presetDirectory.exists()) return presetDirectory;
        }
        return null;
    }
    
    public boolean isPresetSendingAllowed(){
        String psa = (String)this.getProperty(PROPERTY_NAME__PRESET_SENDING_ALLOWED);

        if (psa!=null && psa.trim().equalsIgnoreCase("TRUE")) {
            return true;
        } else {
            return false;
        }
    }

    public String getURLBaseLayerSeparato(){
        return (String)this.getProperty(PROPERTY_NAME__URLBASELAYERSEPARATO);
    }

    public List<UrlBean> getOpenLinks(){
        return getUrls(OPENLINK_PROPERTY_NAME_PREFIX);
    }

    private List<UrlBean> getUrls(String propertyNamePrefix){

        List<UrlBean> urlBeans = new ArrayList<UrlBean>();
        HashMap<Integer, UrlBean> links = new HashMap<Integer, UrlBean>();

        for (Iterator<Object> iter = properties.keySet().iterator(); iter.hasNext();) {

            String propertyName = (String) iter.next();

            UrlBean urlBean = new UrlBean();         

            if(propertyName.startsWith(propertyNamePrefix)){

                Integer key = new Integer(propertyName.substring(propertyNamePrefix.length()));

                urlBean = getUrlBean(propertyNamePrefix + key);            
                urlBean.setOrderNumber(key.intValue());

                links.put(key,urlBean);

            }
        }       

        //Set<Integer> keySet = links.keySet();
        Object[] keys = links.keySet().toArray();

        Arrays.sort(keys);

        for(int i = 0; i < keys.length; i++){
            urlBeans.add((UrlBean)links.get(keys[i]));
        }

        return urlBeans;
    }

    private UrlBean getUrlBean(String propertyName){

        UrlBean urlBean = new UrlBean();

        String href = "";
        String descr = "";
        String target = "";

        String hrefDescrLink = (String)this.getProperty(propertyName);

        if(hrefDescrLink != null){

            String[] hrefDescr = hrefDescrLink.split(",");

            href = hrefDescr[0];

            if(hrefDescr.length > 1){
                descr = hrefDescr[1];
            }

            if(hrefDescr.length > 2){
                target = hrefDescr[2];
            }
        }

        urlBean.setHref(href);
        urlBean.setDescription(descr);
        urlBean.setTarget(target);     

        return urlBean;
    }

    public List<FunzionePubblicaBean> getFunzioniPubbliche(String propertyNamePrefix){

        if(funzioniPubbiche!=null && funzioniPubbiche.size()!=0) return funzioniPubbiche;

        funzioniPubbiche = new ArrayList<FunzionePubblicaBean>();

        List<FunzionePubblicaBean> funzioniPubbliche = new ArrayList<FunzionePubblicaBean>();
        HashMap<Integer, FunzionePubblicaBean> funzioni = new HashMap<Integer, FunzionePubblicaBean>();

        for (Iterator<Object> iter = properties.keySet().iterator(); iter.hasNext();) {

            String propertyName = (String) iter.next();

            FunzionePubblicaBean funzionePubblica = new FunzionePubblicaBean();         

            if(propertyName.startsWith(propertyNamePrefix)){

                Integer key = new Integer(propertyName.substring(propertyNamePrefix.length()));

                funzionePubblica = getFunzioniPubblichelBean(propertyNamePrefix + key);            
                funzionePubblica.setOrderNumber(key.intValue());

                funzioni.put(key,funzionePubblica);
            }
        }       

        Object[] keys = funzioni.keySet().toArray();

        Arrays.sort(keys);

        for(int i = 0; i < keys.length; i++){
            funzioniPubbliche.add((FunzionePubblicaBean)funzioni.get(keys[i]));
        }

        return funzioniPubbliche;
    }

    private FunzionePubblicaBean getFunzioniPubblichelBean(String propertyName){

        FunzionePubblicaBean funzioniPubblicheBean = new FunzionePubblicaBean();

        Function funzione = new Function();
        Abilitazione abilitazione = new Abilitazione();
        String url = "";

        String dsMenu = "";
        String dsTitolo = "";
        char tipo = Function.TP_FUNZ;
        IdType idFunz = new IdType();
        String livello = "";

        String dati = "";
        String help = "";

        String fp = (String)this.getProperty(propertyName);

        if(fp != null) {

            String[] fpSpitted = fp.split(",");

            if (fpSpitted[0].length()>1) dsMenu   = fpSpitted[0];
            if (fpSpitted[1].length()>1) dsTitolo = fpSpitted[1];
            if (fpSpitted[2].length()>1) {
                if (fpSpitted[2].equalsIgnoreCase("FUNZ")) tipo = Function.TP_FUNZ;
                if (fpSpitted[2].equalsIgnoreCase("MENU")) tipo = Function.TP_MENU;
            }
            if (fpSpitted[3].length()>1) idFunz  = new IdType(fpSpitted[3]);
            if (fpSpitted[4].length()>1) livello = fpSpitted[4];
            if (fpSpitted[5].length()>1) {
                url = (StringUtils.equalsIgnoreCase(fpSpitted[5], "none")) ? null : fpSpitted[5];
            }
            if (fpSpitted[6].length()>1) dati    = fpSpitted[6];
            if (fpSpitted[7].length()>1) help    = fpSpitted[7];
        }

        funzione = new Function();
        funzione.setEnte(0);
        funzione.setDsMenu(dsMenu);
        funzione.setDsTitolo(dsTitolo);
        funzione.setTipo(tipo);
        funzione.setIdFunz(idFunz);
        funzione.setLivello(livello);
        funzione.setNrFrame(1);
        funzione.setParam("");
        funzione.setStato(Application.ATTIVA);
        funzione.setUrlHelp(help);

        abilitazione = new Abilitazione();
        abilitazione.setEnte(0);
        abilitazione.setDati(dati);

        funzioniPubblicheBean.setAbilitazione(abilitazione);
        funzioniPubblicheBean.setFunzione(funzione);
        funzioniPubblicheBean.setUrl(url);

        return funzioniPubblicheBean;
    }

    public void dumpProperties(LogInterface logger){
        logger.debug("**** PROPRIETA' DEL CONTESTO SIT ****");
        for (Iterator<Object> iter = properties.keySet().iterator(); iter.hasNext();) {
            String key = (String) iter.next();
            logger.debug(key+ " = "+getProperty(key));
        }     
    }
    
    public String getLog4JPropertiesFile(){
        return (String)ifRelativeSetAbsolute((String)this.getProperty(PROPERTY_NAME__LOG4J_PROPERTIES));
    }

    public Map<String,String> getConfigOptionsThatStartsWith(String prefix) {

        Properties props = getProperties();       
        Map<String,String> filteredProperties = new HashMap<String, String>();

        for(Iterator<Entry<Object,Object>> i = props.entrySet().iterator() ; i.hasNext() ;){

            Map.Entry<Object,Object> mapEntry = i.next();           
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
            Map.Entry<Object,Object> mapEntry = i.next();           
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

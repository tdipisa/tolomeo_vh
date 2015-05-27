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
package it.prato.comune.tolomeo.web.parametri;

import it.prato.comune.sit.IGetFeatureInfoLayer;
import it.prato.comune.sit.ILayersManager;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.MetadatoRicerche;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.runtime.SITCoreVersion;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.TolomeoWebException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.beans.IntrospectionException;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.naming.InvalidNameException;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.betwixt.io.BeanReader;
import org.apache.commons.betwixt.strategy.DecapitalizeNameMapper;
import org.xml.sax.SAXException;

/**
 * Classe che contiene i parametri di definizione del funzionamento del portale.
 * 
 * @author Ing. Alessandro Radaelli.
 *
 */
public class Parametri {
	//private String presetName  ="";
    
    private final static String INCLUDE_SEQUENCE_START = "<!--\\s*#INCLUDE\\s*";
    private final static String INCLUDE_SEQUENCE_END   = "\\s*-->";
    private final static String PROPERTIES_SEQUENCE_START = "<!--\\s*#PROPERTIES\\s*";
    private final static String PROPERTIES_SEQUENCE_END   = "\\s*-->";
    private final static String PROPERTY_SEQUENCE_START = "<!--\\s*#PROPERTY\\s*";
    private final static String PROPERTY_SEQUENCE_END   = "\\s*-->";
    
    /** Estremo inferiore range codTPN riservato a layer inseriti lato client (WMSExplorer e CSWExplorer). */
    public final static int CODTPNCLIENTLAYERBASE = 1000000;
    /** Estremo superiore range codTPN riservato a layer inseriti lato client (WMSExplorer e CSWExplorer). */
    public final static int CODTPNCLIENTLAYERMAX = CODTPNCLIENTLAYERBASE + 1000;
    /** Estremo inferiore range codTPN riservato a layer inseriti tramite parametro su url. */
    public final static int URLWMSCODTPNBASE = CODTPNCLIENTLAYERMAX;
    /** Estremo superiore range codTPN riservato a layer inseriti tramite parametro su url. */
    public final static int URLWMSCODTPNMAX = URLWMSCODTPNBASE + 100;
    /** Estremo inferiore range codTPN riservato a layer inseriti tramite parametro autolayer in preset. */
    public final static int CODTPNAUTOLAYERBASE = URLWMSCODTPNMAX + 1;
    /** Estremo superiore range codTPN riservato a layer inseriti tramite parametro autolayer in preset. */
    public final static int CODTPNAUTOLAYERMAX= CODTPNAUTOLAYERBASE + 1000;
    
    
    // Attenzione se modificate deve essere modificato anche in javascript
    /** Operazione di inserimento */
    public static final String digitizeOperationInsert       = ILayersManager.digitizeOperationInsert;  // 
    /** Operazione di subtract */
    public static final String digitizeOperationSubtract     = ILayersManager.digitizeOperationSubtract;   
    /** Operazione di add */
    public static final String digitizeOperationAdd          = ILayersManager.digitizeOperationAdd;  
    /** Operazione di AddSub */
    public static final String digitizeOperationAddSub       = ILayersManager.digitizeOperationAddSub;  
    /** Operazione di Cancellazione */
    public static final String operationFeatureDelete        = ILayersManager.operationFeatureDelete;     
    /** Operazione di editing vertici */
    public static final String operationFeatureVertexEditing = ILayersManager.operationFeatureVertexEditing;   
    /** Operazione di generica modifica geometria */
    public static final String operationGeometryModify       = ILayersManager.operationGeometryModify;   
    /** Operazione di dragdrop */
    public static final String operationFeatureDragDrop      = ILayersManager.operationFeatureDragDrop;
    /** Operazione di clona */
    public static final String operationFeatureClone         = ILayersManager.operationFeatureClone; 
    /** Operazione di aggiornamento alfanumerico */
    public static final String operationUpdateAlfa           = ILayersManager.operationUpdateAlfa;
    /** Operazione di identify */
    public static final String operationIdentify             = ILayersManager.operationIdentify;
    
    
    private String nomePreset = "Stradario";
    private ParametriMappeList mappe = new ParametriMappeList();
	private ParametriAzioniEventi azioniEventi = new ParametriAzioniEventi();
	private ParametriLayout layOut = new ParametriLayout();
	private ParametriAzioniApertura azioniApertura = new ParametriAzioniApertura();
	private ParametriServerPool serverPool = new ParametriServerPool();
	/**  contenente i parametri globali tolomeo. */
	private ParametriComportamento comportamento = new ParametriComportamento();

	// Questo parametro non è incluse nel preset ma viene recuperato da tolomeo.properties
	// Individua la modalità di selezione di default (quella che non necessita della pressione del tasto shift
	private String selectDefaultMode="FIRSTONTOP";
	
	private String sitCoreVersion = "x.x.x";
	
	// Utilizzato per trasmettere al client javascript eventuali parametri aggiungitivi di lancio (vedi metodo elaboraParametri di TolomeoServlet)
	private Map<String, Object> urlAdditionalParams =  new HashMap<String, Object>();
	
	private int currentUrlWmsCodTpn = URLWMSCODTPNBASE;
	
    public Parametri() {
    }

    @Deprecated
    public static Parametri createParametri(String presetID, SITLayersManager comunePO) {
    
    	LogInterface log = TolomeoApplicationContext.getInstance().getAnonymousLogger();
    	String fileName= TolomeoApplicationContext.getInstance().getPresetFileName() + presetID + ".xml";
        Parametri retVal = new Parametri();
        
        // Lettura file
        try {
            log.info("File di preset utilizzato: " + fileName);
            
            File presetFile = new File(fileName);
            if(!presetFile.exists()){
                throw new FileNotFoundException ("Il file di preset " + fileName + " non esiste!");
            }
            // Sostituisco all'espressione di #INCLUDE il contenuto specifico del file che si intende includere sotto forma di stringa
            // Lo stesso faccio con le #PROPERTIES
            String newPreset = loadPreset(presetFile);
            
            retVal = createParametriFromString(newPreset, comunePO); 
            
            retVal.setSitCoreVersion(SITCoreVersion.getInstance().getCoreVersion().format());
            
        } catch (FileNotFoundException e) {
        	log.error("Il file di preset " + fileName + " non e' stato trovato!", e);
        } catch (IOException e) {
            if (fileName!=null) log.error("Errore I/O durante lettura preset: " + fileName, e);
        } catch (InvalidNameException e){
            log.error("Errore con i nomi degli INCLUDE nel file: " + fileName, e); 
        } catch (SITException site){
            log.error("Imopssibile rilevare la versione del SIT core",site);
        }
        return retVal;
    }
    
    
    public static Parametri createParametriFromString(String presetContent, SITLayersManager comunePO) {
            
        LogInterface log = TolomeoApplicationContext.getInstance().getAnonymousLogger();
        Parametri retVal = new Parametri();
        
        // Lettura file
        try {
            //System.out.println(newPreset);
            StringReader sr = new StringReader(presetContent);

            // Create BeanReader
            BeanReader beanReader  = new BeanReader();
                
            // Configure the reader
            beanReader.getXMLIntrospector().getConfiguration().setAttributesForPrimitives(false);
            beanReader.getXMLIntrospector().getConfiguration().setElementNameMapper(new DecapitalizeNameMapper());
            beanReader.getBindingConfiguration().setMapIDs(false);
            
            // Register beans so that betwixt knows what the xml is to be converted to
            beanReader.registerBeanClass("parametri",Parametri.class);
            retVal = (Parametri) beanReader.parse(sr);
            
        } catch (IntrospectionException e) {
        	log.error("Errore durante il parsing del preset xml: IntrospectionException",e);
        } catch (IOException e) {
        	log.error("Errore durante il parsing del preset xml: IOException",e);
        } catch (SAXException e) {
        	log.error("Errore durante il parsing del preset xml: SAXException", e);
        }
        
        // Settaggi successivi (campi derivati non presenti in xml
        
        // Descrizioni delle ricerche
        List<ParametriEventiLayer> evl = retVal.getAzioniEventi().getEventiLayerList();
        
        log.debug("Recupero i metadati per le ricerche dei layer...");
        
        for (int i = 0; i < evl.size(); i++) {
            ParametriEventiLayer pel = evl.get(i);
            Integer codTPN = pel.getCodTPN();
            List<ParametriEventoLayerRicerca> evlrList =  pel.getAzioniEventiRicercaList().getRicercaList();
            LayerTerritorio lay = comunePO.getLayerByCodTPN(codTPN);
            if (lay!=null) {
		        for (int j = 0; j < evlrList.size(); j++) {
		            ParametriEventoLayerRicerca evlr = evlrList.get(j);
		            MetadatoRicerche metadatoRicerca = lay.getRicerche().get(evlr.getIdRicerca());
		            evlr.setMetadatoRicerca(metadatoRicerca);
		        }
            } else {
            	// Cerca tra i GetFeatureInfoLayers
            	IGetFeatureInfoLayer gfLayer = comunePO.getGetFeatureInfoLayerByCodTPN(codTPN);
            	if (gfLayer==null) {
            		// Non esiste veramente, quindi loggare errore. Se esiste non si fa nulla (non supportano le ricerche)  
            		log.error("Il layer recuperato tramite codice " + codTPN + " e' nullo");
            	}
            	
            }
        }
        
        retVal.updateCatIdxs();
        
        // Aggiunta parametro selectModeDefault
        TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();      
        retVal.setSelectDefaultMode(context.getSelectModeDefault());
        
        return retVal;
    }
    
    /**
     * Carica e sostituisce gli <!-- #INCLUDE nomePresetDaIncludere.xml --> ricorsivamente.
     * Per ogni #INCLUDE vengono poi caricate le properties definite nei <!-- #PROPERTIES nomePropertiesDaCaricare.properties -->
     * Una volta caricate le properties vengono sostituiti i #P{nomeProperties} con la relativa proprietà, se definita nei files.
     * Se in un file che si include c'è una direttiva di properties, queste vengono caricate e prevalgono su quelle del file includente.
     * 
     * Se in un file ci sono più file di properties definiti, vengono caricati tutti e quelli successivi sovrascrivono eventuali proprietà 
     * comuni ai precedenti.
     * I percorsi sono RELATIVI AL FILE DA CUI SI STA INCLUDENDO
     */
    public static String loadIncludeEProperties(String presetString, File basePath) throws IOException,InvalidNameException {
        
        String regExp = INCLUDE_SEQUENCE_START + "([^\\s]*)" + INCLUDE_SEQUENCE_END;
        String regExpPath = "(\\.|\\.\\.)*((\\\\|\\/)?[a-zA-Z0-9_-]+)+\\.xml";
        Pattern patternPath = Pattern.compile(regExpPath);
        Pattern pattern = Pattern.compile(regExp);
        
        Matcher m = pattern.matcher(presetString);
        Matcher mPath = null;
        StringBuffer sb = new StringBuffer();
        
        while(m.find()){
            String presetPath = m.group(1);
            mPath = patternPath.matcher(presetPath);
            if(!mPath.find()){
                throw new InvalidNameException("Preset file xml da includere NON SPECIFICATO CORRETTAMENTE : " + presetPath);
            } 
                            
            File includeFile = new File(basePath,mPath.group(0));
            if(!includeFile.exists()){
                throw new FileNotFoundException("Preset file xml da includere NON ESITE : " + includeFile.getPath());
            }
            String include = leggiFile(includeFile);
            m.appendReplacement(sb,loadIncludeEProperties(include,includeFile.getParentFile()));     
        }
        
        m.appendTail(sb);
        
        presetString = loadProperties(sb.toString(), basePath);
        return presetString;
        
    }
        

    /**
     * Restituisce un file come Stringa
     * @param presetFile File recuperare
     * @return
     * @throws IOException
     */
    public static String leggiFile(File presetFile) throws IOException {
        BufferedReader br = null;
        try {            
            br = new BufferedReader(new FileReader(presetFile));
            StringBuffer sb = new StringBuffer();
            String line = null;
            while((line = br.readLine()) != null){
                sb.append(line);
            }
            return sb.toString();
        } finally {
            if(br != null) br.close();
        }        
    }
    
    /**
     * Carica i file di properties definiti nel preset.xml tramite le direttive
     * <!-- #PROPERTIES percorso/nomeFileDaCaticare.properties -->
     * I percorsi del file di properties devono essere relativi al file che le include.
     * 
     * Carica anhe le property definiti direttamente mediante la direttiva
     * <!-- #PROPERTY nomeProprieta=valoreProprieta -->
     * 
     * @param presetString
     * @param basePath
     * @return
     * @throws IOException
     * @throws InvalidNameException
     */
    public static String loadProperties(String presetString, File basePath) throws IOException,InvalidNameException {
        
        Properties properties = new Properties();
        String propertiesRegExp = "(" + PROPERTIES_SEQUENCE_START + "([^\\s]*)" + PROPERTIES_SEQUENCE_END + ")";
        String propertyDefinitionRegExp = "(" + PROPERTY_SEQUENCE_START + "((([\\.a-zA-Z0-9_-]+)\\s*\\=\\s*([^\\s]*))|([^\\s]*))" + PROPERTY_SEQUENCE_END + ")";
        String regExp = propertiesRegExp + "|" + propertyDefinitionRegExp;
        String regExpPath = "(\\.|\\.\\.)*((\\\\|\\/)?[\\.a-zA-Z0-9_-]+)+\\.properties";
        Pattern patternPath = Pattern.compile(regExpPath);
        Pattern pattern = Pattern.compile(regExp);
        
        Matcher m = pattern.matcher(presetString);
        Matcher mPath = null;        
        FileInputStream fis = null;
        StringBuffer sb = new StringBuffer();
        
        while(m.find()){
            // CASO DI #PROPERTIES
            if(m.group(1) != null){
                String presetPath = m.group(2);
                mPath = patternPath.matcher(presetPath);
                if(!mPath.matches()){
                    throw new InvalidNameException("PROPERTIES file da caricare NON SPECIFICATO CORRETTAMENTE : " + presetPath);
                } 
                    
                File propertiesFile = new File(basePath,mPath.group(0));
                if(!propertiesFile.exists()){
                    throw new FileNotFoundException("Il file di PROPERTIES da caricare NON ESITE : " + propertiesFile.getPath());
                }
                                                    
                try {                    
//                    EVENTUALE GESTIONE CACHE
//                    Definire private final static HashMap<String, Properties> CACHED_PROPERTIES = new HashMap<String, Properties>();
//                    if(CACHED_PROPERTIES.containsKey(propertiesFile.getAbsolutePath())){
//                        properties.putAll(CACHED_PROPERTIES.get(propertiesFile.getAbsolutePath()));
//                    }else{
//                        fis = new FileInputStream(propertiesFile);
//                        Properties tmpProp = new Properties(); 
//                        tmpProp.load(fis);
//                        String cacheMe = tmpProp.getProperty("cacheMe");
//                        if(cacheMe!=null && Boolean.parseBoolean(cacheMe)){
//                            CACHED_PROPERTIES.put(propertiesFile.getAbsolutePath(), tmpProp);
//                        }
//                        properties.putAll(tmpProp);
//                    }
                    
                    fis = new FileInputStream(propertiesFile);
                    properties.load(fis);
                    m.appendReplacement(sb,"");
                } finally {
                    if(fis != null) fis.close();
                }
            // CASO DI UNA #PROPERTY 
            }else if (m.group(3)!= null){   
                // SONO ENTRATO NELLA PARTE CHE ACCETTA TUTTO QUINDI NON SINTATTICAMENTE CORRETTO
                if(m.group(5) == null){
                    throw new InvalidNameException("PROPERTY NON DEFINITA CORRETTAMENTE : " + m.group(3));
                }
                properties.put(m.group(6), m.group(7));
                m.appendReplacement(sb,"");
            }
        }
        m.appendTail(sb);
        
        return replaceProperties(sb.toString(), properties);
         
    }

    /**
     * Sostituisce le properties definite nel preset.xml tipo #P{nomeProperty} con quelle presenti nell'oggetto Poperties passato
     * @param presetString
     * @param properties
     * @return
     * @throws IOException
     */
    public static String replaceProperties(String presetString, Properties properties) throws IOException {
        
        if(properties.isEmpty()){
            return presetString;
        }
        
        String regExp = "\\#P\\{\\s*([\\.a-zA-Z0-9_-]+)\\s*\\}";
        Pattern pattern = Pattern.compile(regExp);
        Matcher m = pattern.matcher(presetString);
        StringBuffer sb = new StringBuffer();
        
        while(m.find()){            
            String sos = m.group(1);
            if(properties.containsKey(sos)){
                m.appendReplacement(sb,properties.getProperty(sos));
            }
        }        
        m.appendTail(sb);        
        return sb.toString();
        
    } 
    
    public static String loadPreset(File presetFile) throws IOException, InvalidNameException {                
        File basePath = presetFile.getParentFile();
        String presetString = leggiFile(presetFile);        
        presetString = loadIncludeEProperties(presetString,basePath);
        return presetString;
    }
    
    public static String loadPreset(String presetString, File basePath) throws IOException, InvalidNameException {                
        presetString = loadIncludeEProperties(presetString, basePath);
        return presetString;
    }
    
    /**
     * Sostituisce l'oggetto azioniApertura esistente con uno nuovo generato a partire dal frammento xml corrispondente
     * 
     * @param xmlAzioniApertura Stringa contenente l'xml corrispondente all'elemento AzioniApertura da sostituire
     */
    public void newAzioniApertura (String xmlAzioniApertura) throws TolomeoWebException {
        
        if (xmlAzioniApertura == null) return;
        
        // Create BeanReader
        BeanReader beanReader  = new BeanReader();
            
        // Configure the reader
        beanReader.getXMLIntrospector().getConfiguration().setAttributesForPrimitives(false);
        beanReader.getXMLIntrospector().getConfiguration().setElementNameMapper(new DecapitalizeNameMapper());
        beanReader.getBindingConfiguration().setMapIDs(false);
        
        // Register beans so that betwixt knows what the xml is to be converted to
        ParametriAzioniApertura paz = null;
        try {
            beanReader.registerBeanClass("azioniApertura",ParametriAzioniApertura.class);
            StringReader xmlReader = new StringReader(xmlAzioniApertura);
            paz = (ParametriAzioniApertura) beanReader.parse(xmlReader);
        } catch (IntrospectionException e) {
            throw new TolomeoWebException("IntrospectionException processando il parametro azioniApertura - " + xmlAzioniApertura,e);
        } catch (IOException e) {
            throw new TolomeoWebException("IOException processando il parametro azioniApertura - " + xmlAzioniApertura,e);
        } catch (SAXException e) {
            throw new TolomeoWebException("SAXException processando il parametro azioniApertura - " + xmlAzioniApertura,e);
        }
        
        azioniApertura = paz;
    }
    
    
    /**
     * Sostituisce l'oggetto layOut esistente con uno nuovo generato a partire dal frammento xml corrispondente
     * 
     * @param xmlLayOut Stringa contenente l'xml corrispondente all'elemento AzioniApertura da sostituire
     */
    public void newLayOut (String xmlLayOut) throws TolomeoWebException {
        
        if (xmlLayOut == null) return;
        
        // Create BeanReader
        BeanReader beanReader  = new BeanReader();
            
        // Configure the reader
        beanReader.getXMLIntrospector().getConfiguration().setAttributesForPrimitives(false);
        beanReader.getXMLIntrospector().getConfiguration().setElementNameMapper(new DecapitalizeNameMapper());
        beanReader.getBindingConfiguration().setMapIDs(false);
        
        // Register beans so that betwixt knows what the xml is to be converted to
        ParametriLayout paz = null;
        try {
            beanReader.registerBeanClass("layOut",ParametriLayout.class);
            StringReader xmlReader = new StringReader(xmlLayOut);
            paz = (ParametriLayout) beanReader.parse(xmlReader);
        } catch (IntrospectionException e) {
            throw new TolomeoWebException("IntrospectionException processando il parametro azioniApertura - " + xmlLayOut,e);
        } catch (IOException e) {
            throw new TolomeoWebException("IOException processando il parametro azioniApertura - " + xmlLayOut,e);
        } catch (SAXException e) {
            throw new TolomeoWebException("SAXException processando il parametro azioniApertura - " + xmlLayOut,e);
        }
        
        for (ParametriCustomButton cb: paz.getCustomButtonList()) {
            // Recupero le azioni e le sostituisco (le altre cose non si possono cambiare)
            String idCb = cb.getIdCustomButton();
            for (ParametriCustomButton cbLayOut: layOut.getCustomButtonList()) {
                if (cbLayOut.getIdCustomButton().equals(idCb)) {
                    cbLayOut.getAzioniEventiCustomButton().setAzioneList(cb.getAzioniEventiCustomButton().getAzioneList());
                }
            }
            
        }
        
        // Recupera i customButton così modificati 
        paz.setCustomButtonList(layOut.getCustomButtonList());
        layOut = paz;
        
    }
    
    /**
     * Sostituisce i tag customQuery contenuti in xmlMappe nei corrispondenti. xmlMappe non deve essere completo in quanto solo i tag customQuery vengono
     * presi in considerazione, ognuno all'interno del contesto (mappa) all'interno del quale e' definito (vedi anche javadoc di  {@link ParametriCustomQuery})
     * 
     * 
     * @param xmlMappe
     * @throws TolomeoWebException
     */
    public void modifyCustomQuery(String xmlMappaList) throws TolomeoWebException {
        if (xmlMappaList == null) return;
        
        String xmlMappe = "<mappe>" + xmlMappaList + "</mappe>";
        
        // Create BeanReader
        BeanReader beanReader  = new BeanReader();
            
        // Configure the reader
        beanReader.getXMLIntrospector().getConfiguration().setAttributesForPrimitives(false);
        beanReader.getXMLIntrospector().getConfiguration().setElementNameMapper(new DecapitalizeNameMapper());
        beanReader.getBindingConfiguration().setMapIDs(false);
        
        // Register beans so that betwixt knows what the xml is to be converted to
        ParametriMappeList mappeDaParam = null;
        try {
            beanReader.registerBeanClass("mappe",ParametriMappeList.class);
            StringReader xmlReader = new StringReader(xmlMappe);
            mappeDaParam = (ParametriMappeList) beanReader.parse(xmlReader);
        } catch (IntrospectionException e) {
            throw new TolomeoWebException("IntrospectionException processando il parametro customQuery - " + xmlMappe,e);
        } catch (IOException e) {
            throw new TolomeoWebException("IOException processando il parametro customQuery - " + xmlMappe,e);
        } catch (SAXException e) {
            throw new TolomeoWebException("SAXException processando il parametro customQuery - " + xmlMappe,e);
        }
        
        ArrayList<ParametriMappa> pml =  mappeDaParam.getMappaList();
        
        for (int i=0; i<pml.size(); i++) {
            ParametriMappa pmlmap =  pml.get(i);
            ArrayList<ParametriCustomQuery> cqList = pmlmap.getCustomQueryList();
            if ((cqList!=null) && (cqList.size()>0)) {
                ParametriMappa map = this.mappe.getMappaList().get(i);
                for (int j=0; j<cqList.size(); j++) {
                    if (cqList.get(j).getNome()!=null) {
                        map.getCustomQueryList().set(j, cqList.get(j));
                    }
                }
            }
        }
                
    }
    
    public boolean parse(HttpServletRequest request) {
        
        //presetName = request.getParameter("paramPreset");
        azioniEventi.parse(request);
        layOut.parse(request);
        azioniApertura.parse(request);
        
        return true;
    }
    
	public ParametriAzioniApertura getAzioniApertura() {
		return azioniApertura;
	}
    

	public ParametriAzioniEventi getAzioniEventi() {
		return azioniEventi;
	}

	public ParametriLayout getLayOut() {
		return layOut;
	}

	public String getHiddenFieldsAll() {
		String str = "";
		return str;
	}

    public void setAzioniApertura(ParametriAzioniApertura azioniApertura) {
        this.azioniApertura = azioniApertura;
    }

    public void setAzioniEventi(ParametriAzioniEventi azioniEventi) {
        this.azioniEventi = azioniEventi;
    }

    public void setLayOut(ParametriLayout layOut) {
        this.layOut = layOut;
    }


    public ParametriMappeList getMappe() {
        return mappe;
    }

    public void setMappe(ParametriMappeList mappe) {
        this.mappe = mappe;
    }

    public String getNomePreset() {
        return nomePreset;
    }

    public void setNomePreset(String nomePreset) {
        this.nomePreset = nomePreset;
    }

    public String getSitCoreVersion() {
        return sitCoreVersion;
    }

    public void setSitCoreVersion(String sitCoreVersion) {
        this.sitCoreVersion = sitCoreVersion;
    }

	/**
	 * @return the serverPool
	 */
	public ParametriServerPool getServerPool() {
		return serverPool;
	}

	/**
	 * @param serverPool the serverPool to set
	 */
	public void setServerPool(ParametriServerPool serverPool) {
		this.serverPool = serverPool;
	}

	/**
	 * @return the selectDefaultMode
	 */
	public String getSelectDefaultMode() {
		return selectDefaultMode;
	}

	/**
	 * @param selectDefaultMode the selectDefaultMode to set
	 */
	public void setSelectDefaultMode(String selectDefaultMode) {
		this.selectDefaultMode = selectDefaultMode;
	}

	/**
	 * @return the urlAdditionalParams
	 */
	public Map<String, Object> getUrlAdditionalParams() {
		return urlAdditionalParams;
	}
	
	/**
	 * @return the urlAdditionalParams
	 */
	public void addUrlAdditionalParams(String key,Object value) {
		urlAdditionalParams.put(key, value);
	}

	public void updateCatIdxs(){
			// Attribuzione identificativi a voci legenda (categorie e layer)
	        // Le categorie sono identificate dal path per raggiungerle nell'albero, con ogni nodo espresso dalla sua posizione all'interno del nodo padre
	        // I layer sono identificati dalla categoria di appartenenza e dalla posizione 
	        for (ParametriMappa pm1 : getMappe().getMappaList()) {
	        	ParametriLegenda pl1 = pm1.getLegenda();
	        	if (pl1!=null) {
	        		for (int i1 = 0; i1<pl1.getCategoryList().size(); i1++ ){
	        			ParametriLegendaCategoria pmlc = pl1.getCategoryList().get(i1);
	        			pmlc.setTreeIdxs(""+i1);
	        		}
	        	}
	        }
	}
	
	/**
	 * Restituisce il prossimo codTPN libero nel range dei codici per layer creati al volo 
	 * da argomento url.
	 * @return
	 */
	public final int getNewCodTPN() {
		currentUrlWmsCodTpn++;
		return currentUrlWmsCodTpn;
	}
	
	/**
	 * Restituisce l'estremo inferiore range codTPN riservato a layer inseriti lato client (WMSExplorer e CSWExplorer).
	 *  
	 * @return valore
	 */
	public final int getcodTPNClientLayerBase() {
		return CODTPNCLIENTLAYERBASE;
	}
	
	
	public ParametriServer findServer(String serverId,int nMappa){
	    if(serverId == null || serverId.trim().equals("")){
	        return getMappe().getMappaList().get(nMappa).getDefaultServer();
	    } else {
	        return getServerPool().getServer(serverId);
	    }
	}

	/**
	 * Recupera comportamento.
	 *
	 * @return comportamento
	 */
	public ParametriComportamento getComportamento() {
		return comportamento;
	}

	/**
	 * Imposta il valore di comportamento.
	 * @param comportamento valore di comportamento da impostare
	 */
	public void setComportamento(ParametriComportamento comportamento) {
		this.comportamento = comportamento;
	}
	
}

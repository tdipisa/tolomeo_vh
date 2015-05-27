/**
 * 
 */
package it.prato.comune.tolomeo.configuration;

import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.runtime.SITCoreVersion;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.naming.InvalidNameException;

/**
 * @author Tobia Di Pisa at <tobia.dipisa@geo-solutions.it>
 *
 */
public class FileConfigurationStore implements ConfigurationStore {

	private String defaultConfigTypeName;
	
	/**
	 * @param defaultConfigTypeName the defaultConfigTypeName to set
	 */
	public void setDefaultConfigTypeName(String defaultConfigTypeName) {
		this.defaultConfigTypeName = defaultConfigTypeName;
	}

	/* (non-Javadoc)
	 * @see it.prato.comune.tolomeo.configuration.ConfigurationStore#get(java.lang.Object, it.prato.comune.sit.SITLayersManager)
	 */
	@Override
	public <T> Parametri get(T configurationId, SITLayersManager comunePO) {
	    
		LogInterface log = TolomeoApplicationContext.getInstance().getAnonymousLogger();
		
    	String fileName = TolomeoApplicationContext.getInstance().getPresetFileName() + configurationId + ".xml";
        Parametri retVal = new Parametri();
        
        // Lettura file
        try {
            log.info("File di preset utilizzato: " + fileName);
            
            File presetFile = new File(fileName);
            if(!presetFile.exists()){
                throw new FileNotFoundException ("Il file di preset " + fileName + " non esiste!");
            }
            
            // ///////////////////////////////////////////////////////////////////////////////
            // Sostituisco all'espressione di #INCLUDE il contenuto specifico del file 
            // che si intende includere sotto forma di stringa, lo stesso faccio con le 
            // #PROPERTIES.
            // ///////////////////////////////////////////////////////////////////////////////
            String newPreset = Parametri.loadPreset(presetFile);
            
            retVal = Parametri.createParametriFromString(newPreset, comunePO); 
            
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

	/* (non-Javadoc)
	 * @see it.prato.comune.tolomeo.configuration.ConfigurationStore#delete(java.lang.Object)
	 */
	@Override
	public <T> void delete(T configurationId) {}

	/* (non-Javadoc)
	 * @see it.prato.comune.tolomeo.configuration.ConfigurationStore#save(java.lang.String)
	 */
	@Override
	public long save(String name, String configuration) throws Exception {return -1;}

	/* (non-Javadoc)
	 * @see it.prato.comune.tolomeo.configuration.ConfigurationStore#update(java.lang.String, java.lang.String)
	 */
	@Override
	public long update(String name, String configuration) {return -1;}

}

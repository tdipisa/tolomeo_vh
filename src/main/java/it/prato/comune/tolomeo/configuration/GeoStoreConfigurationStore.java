/**
 * 
 */
package it.prato.comune.tolomeo.configuration;

import it.geosolutions.geostore.core.model.Category;
import it.geosolutions.geostore.core.model.Resource;
import it.geosolutions.geostore.core.model.StoredData;
import it.geosolutions.geostore.services.CategoryService;
import it.geosolutions.geostore.services.ResourceService;
import it.geosolutions.geostore.services.dto.search.BaseField;
import it.geosolutions.geostore.services.dto.search.FieldFilter;
import it.geosolutions.geostore.services.dto.search.SearchFilter;
import it.geosolutions.geostore.services.dto.search.SearchOperator;
import it.geosolutions.geostore.services.exception.BadRequestServiceEx;
import it.geosolutions.geostore.services.exception.InternalErrorServiceEx;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.runtime.SITCoreVersion;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.naming.InvalidNameException;

/**
 * @author Tobia Di Pisa at <tobia.dipisa@geo-solutions.it>
 *
 */
public class GeoStoreConfigurationStore implements ConfigurationStore {

	private ResourceService resourceService;
	
	private CategoryService categoryService;
	
	private String defaultConfigCategoryName;

	final private LogInterface logger = TolomeoApplicationContext.getInstance().getAnonymousLogger();

	/**
	 * @param resourceService
	 */
	public void setResourceService(ResourceService resourceService) {
		this.resourceService = resourceService;
	}
	
	/**
	 * @param categoryService the categoryService to set
	 */
	public void setCategoryService(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	/**
	 * @param defaultConfigCategoryName the defaultConfigCategoryName to set
	 */
	public void setDefaultConfigCategoryName(String defaultConfigCategoryName) {
		this.defaultConfigCategoryName = defaultConfigCategoryName;
	}
	
	/* (non-Javadoc)
	 * @see it.prato.comune.tolomeo.configuration.ConfigurationStore#get(java.lang.Object, it.prato.comune.sit.SITLayersManager)
	 */
	@Override
	public <T> Parametri get(T configurationId, SITLayersManager comunePO) {
	    
    	File fileBasePath = TolomeoApplicationContext.getInstance().getPresetDirectory();
    	
        Parametri retVal = new Parametri();
        
        try {
        	logger.info("File di preset utilizzato: " + configurationId);

            // //////////////////////////////////////////////////////////////////
            // Retrieving the preset configuration from GeoStore and write the 
            // content inside the new created file.
            // //////////////////////////////////////////////////////////////////
        	logger.info("Retrieving a full resource");
    		
    		List<Resource> resourcesFull;
    		
            try {
            	SearchFilter filter;
            	if(configurationId instanceof String){
            		filter = new FieldFilter(BaseField.NAME, 
            				(String)configurationId, SearchOperator.EQUAL_TO);
            	}else{
            		filter = new FieldFilter(BaseField.ID, 
            				((Long)configurationId).toString(), SearchOperator.EQUAL_TO);
            	}
                	
                resourcesFull = resourceService.getResourcesFull(filter, null);
            } catch (Exception ex) {
            	logger.error(ex.getMessage(), ex);
                throw new IOException("Exception durante il reperimento della risorsa preset da GeoStore.");
            }
            
            if (resourcesFull.isEmpty()){
                throw new IOException("Resource not found");
            }
            
            StoredData storedData = resourcesFull.get(0).getData();
            
            String presetString;
            if(storedData != null){
            	presetString = storedData.getData();
            	logger.debug("DATA is " + presetString);
            }else{
            	throw new IOException("Style Stored Data not available");
            }  
            
            // ///////////////////////////////////////////////////////////////////////////////
            // Sostituisco all'espressione di #INCLUDE il contenuto specifico del file 
            // che si intende includere sotto forma di stringa, lo stesso faccio con le 
            // #PROPERTIES.
            // ///////////////////////////////////////////////////////////////////////////////
            String newPreset = Parametri.loadPreset(presetString, fileBasePath);
            
            retVal = Parametri.createParametriFromString(newPreset, comunePO); 
            
            retVal.setSitCoreVersion(SITCoreVersion.getInstance().getCoreVersion().format());
            
        } catch (IOException e) {
            if (configurationId != null) 
            	logger.error("Errore I/O durante lettura preset: " + configurationId, e);
        } catch (InvalidNameException e){
        	logger.error("Errore con i nomi degli INCLUDE nel file: " + configurationId, e); 
        } catch (SITException site){
        	logger.error("Imopssibile rilevare la versione del SIT core", site);
        }
        
        return retVal;
    }
	
	/* (non-Javadoc)
	 * @see it.prato.comune.tolomeo.configuration.ConfigurationStore#delete(java.lang.Object)
	 */
	@Override
	public <T> void delete(T configurationId) throws Exception{
		try {
	    	SearchFilter filter;
	    	if(configurationId instanceof String){
	    		filter = new FieldFilter(BaseField.NAME, 
	    				(String)configurationId, SearchOperator.EQUAL_TO);
	    	}else{
	    		filter = new FieldFilter(BaseField.ID, 
	    				((Long)configurationId).toString(), SearchOperator.EQUAL_TO);
	    	}
	    	
			resourceService.deleteResources(filter);
		} catch (BadRequestServiceEx e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e);
		} catch (InternalErrorServiceEx e) {
			logger.error(e.getMessage(), e);
			throw new Exception(e);
		}
	}
	
	@Override
	public long save(String name, String configuration) throws Exception{
        // ////////////////////////////////
        // Creating a new full resource
        // ////////////////////////////////
        
		logger.info("Creating a new full resource...");
        	
    	Category category = categoryService.get(defaultConfigCategoryName);
    	
    	if(category == null){
    		logger.info("Category " + defaultConfigCategoryName + " does not exists: "
    				+ defaultConfigCategoryName + " category must be created...");
    		category = new Category();
        	category.setName(defaultConfigCategoryName);
        	categoryService.insert(category);
        	logger.info("Category " + defaultConfigCategoryName + " successfully created!");            	
    	}
    	
    	StoredData storedData = new StoredData();
    	storedData.setData(configuration);
    	
    	Resource resource = new Resource();
    	resource.setData(storedData);
    	resource.setName(name);
    	resource.setCategory(category);
    	
        long resourceId = resourceService.insert(resource);
        
        if(resourceId > 0){
        	logger.info("Configuration resource successfully saved with ID=" + resourceId);
        }
        
        return resourceId;
	}

}

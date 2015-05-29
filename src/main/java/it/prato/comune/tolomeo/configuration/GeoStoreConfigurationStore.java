/**
 * 
 */
package it.prato.comune.tolomeo.configuration;

import it.geosolutions.geostore.core.model.Category;
import it.geosolutions.geostore.core.model.Resource;
import it.geosolutions.geostore.core.model.StoredData;
import it.geosolutions.geostore.services.CategoryService;
import it.geosolutions.geostore.services.ResourceService;
import it.geosolutions.geostore.services.StoredDataService;
import it.geosolutions.geostore.services.dto.ShortResource;
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

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.naming.InvalidNameException;

import org.apache.log4j.Logger;

/**
 * @author Tobia Di Pisa at <tobia.dipisa@geo-solutions.it>
 *
 */
public class GeoStoreConfigurationStore implements ConfigurationStore {

	private static final Logger LOGGER = Logger.getLogger(GeoStoreConfigurationStore.class);
	
	private ResourceService resourceService;
	
	private CategoryService categoryService;
	
	private StoredDataService storedDataService;
	
	private String defaultConfigTypeName;

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
	 * @param storedDataService the storedDataService to set
	 */
	public void setStoredDataService(StoredDataService storedDataService) {
		this.storedDataService = storedDataService;
	}

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
		
    	File fileBasePath = TolomeoApplicationContext.getInstance().getPresetDirectory();
    	
        Parametri retVal = new Parametri();
        
        try {
        	if(LOGGER.isInfoEnabled()){
        		LOGGER.info("File di preset utilizzato: " + configurationId);
        		LOGGER.info("Retrieving a full resource");
        	}

            // //////////////////////////////////////////////////////////////////
            // Retrieving the preset configuration from GeoStore 
            // //////////////////////////////////////////////////////////////////
    		
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
            	LOGGER.error(ex.getMessage(), ex);
                throw new IOException("Exception durante il reperimento della risorsa preset da GeoStore.");
            }
            
            if (resourcesFull.isEmpty()){
                throw new IOException("Resource not found");
            }
            
            StoredData storedData = resourcesFull.get(0).getData();
            
            String presetString;
            if(storedData != null){
            	presetString = storedData.getData();
            	if(LOGGER.isDebugEnabled())
            		LOGGER.debug("DATA is " + presetString);
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
            	LOGGER.error("Errore I/O durante lettura preset: " + configurationId, e);
        } catch (InvalidNameException e){
        	LOGGER.error("Errore con i nomi degli INCLUDE nel file: " + configurationId, e); 
        } catch (SITException site){
        	LOGGER.error("Imopssibile rilevare la versione del SIT core", site);
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
			LOGGER.error(e.getMessage(), e);
			throw new Exception(e);
		} catch (InternalErrorServiceEx e) {
			LOGGER.error(e.getMessage(), e);
			throw new Exception(e);
		}
	}
	
	/* (non-Javadoc)
	 * @see it.prato.comune.tolomeo.configuration.ConfigurationStore#save(java.lang.String, java.lang.String)
	 */
	@Override
	public long save(String name, String configuration) throws Exception{
        // ////////////////////////////////
        // Creating a new full resource
        // ////////////////////////////////

		if(LOGGER.isInfoEnabled())
			LOGGER.info("Creating a new full resource...");
        	
    	Category category = categoryService.get(defaultConfigTypeName);
    	
    	if(category == null){
    		if(LOGGER.isInfoEnabled())
    			LOGGER.info("Category " + defaultConfigTypeName + " does not exists: "
    				+ defaultConfigTypeName + " category must be created...");
    		category = new Category();
        	category.setName(defaultConfigTypeName);
        	categoryService.insert(category);
        	if(LOGGER.isInfoEnabled())
        		LOGGER.info("Category " + defaultConfigTypeName + " successfully created!");            	
    	}
    	
    	StoredData storedData = new StoredData();
    	storedData.setData(configuration);
    	
    	Resource resource = new Resource();
    	resource.setData(storedData);
    	resource.setName(name);
    	resource.setCategory(category);
    	
        long resourceId = resourceService.insert(resource);
        
        if(resourceId > 0){
        	if(LOGGER.isInfoEnabled())
        		LOGGER.info("Configuration resource successfully saved with ID=" + resourceId);
        }
        
        return resourceId;
	}

	/* (non-Javadoc)
	 * @see it.prato.comune.tolomeo.configuration.ConfigurationStore#update(java.lang.String, java.lang.String)
	 */
	@Override
	public long update(String name, String configuration) throws Exception{
        // ////////////////////////////////
        // Creating a new full resource
        // ////////////////////////////////

		if(LOGGER.isInfoEnabled())
			LOGGER.info("Creating a new full resource...");
        	
    	SearchFilter filter;
		filter = new FieldFilter(BaseField.NAME, name, SearchOperator.EQUAL_TO);
    	
		List<ShortResource> resources = resourceService.getResources(filter, null);
		
    	long storedDataId = storedDataService.update(resources.get(0).getId(), configuration);
    	
        if(storedDataId > 0){
        	if(LOGGER.isInfoEnabled())
        		LOGGER.info("Configuration resource successfully updated with ID=" + storedDataId);
        }
        
        return storedDataId;
	}
	
}

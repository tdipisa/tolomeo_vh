package it.prato.comune.tolomeo.test;

import it.prato.comune.tolomeo.configuration.ConfigurationManager;
import it.prato.comune.tolomeo.configuration.ConfigurationStore;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.parametri.Parametri;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Map;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

/**
 * Class ConfigurationManagerTest.
 * 
 * @author Tobia di Pisa (tobia.dipisa at geo-solutions.it)
 * 
 */
public class ConfigurationManagerTest extends TolomeoServiceTestBase {

	protected static ConfigurationManager manager;
	
	protected static TolomeoApplicationContext toloAppContext;
	
    /**
     * @throws Exception
     */
    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    /**
     * @throws Exception
     */
    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    /**
     * 
     */
    public ConfigurationManagerTest() {
    	manager = (ConfigurationManager) ctx.getBean("configurationManager");
    	
    	String fileName = "/tolomeo.properties";
    	fileName = getClass().getResource(fileName).getFile();
    	toloAppContext = TolomeoApplicationContext.getInstance();
    	toloAppContext.setConfigFileName(fileName);
    }
    
    /**
     * @throws Exception
     */
    @Test
    public void testInternalFields() throws Exception{
    	assertNotNull(manager);
    	assertNotNull(toloAppContext);
    }
    
    /**
     * @throws Exception
     */
    @Test
    public void testConfigurationStores() throws Exception{
    	Map<String, ConfigurationStore> stores = manager.getConfigurationStores();
    	assertNotNull(stores);
    }
    
    /**
     * @throws Exception
     */
    @Test
    public void testDefaultConfigStoreType() throws Exception{
    	String defaultConfigStoreType = manager.getDefaultConfigStoreType();
    	assertNotNull(defaultConfigStoreType);
    }

    /**
     * @throws Exception
     */
    @Test
    public void testGeoStoreResourcePreset() throws Exception {
    	String fileName = toloAppContext.getPresetFileName() + "Demo.xml";
    	File presetDemo = new File(fileName);

        if(!presetDemo.exists()){
        	fail("Demo preset file does not exists");
            throw new FileNotFoundException ("Il file di preset " + fileName + " non esiste!");
        }
        
        StringBuilder stringBuilder = new StringBuilder();  
        BufferedReader bufferedReader = null;
        String presetConfiguration = null;
        
        try {
	    	FileInputStream fis = new FileInputStream(presetDemo);
	    	
	        if (fis != null) {
	        	bufferedReader = new BufferedReader(new InputStreamReader(fis));
	            
	            char[] charBuffer = new char[1024];
	            int bytesRead = -1;
	            while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
	                stringBuilder.append(charBuffer, 0, bytesRead);
	            }
	            
	            presetConfiguration = stringBuilder.toString();
	        }
        } catch (IOException ex) {
        	LOGGER.error("Error while getting the File InputStream ", ex);
        	throw new IOException(ex);
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    throw ex;
                }
            }
        }
    	
        //
        // Test Save
        //
        long resourceId = manager.save("configuration1", presetConfiguration, "geostore");    	
        assertEquals(1, resourceService.getCount(null));

        //
        // Test Get
        //
        Parametri parametri = manager.get(null, resourceId, "geostore");
        assertNotNull("Colud not retrieve preset configuration", parametri);
        
        //
        // Test Update
        //
        resourceId = manager.update("configuration1", "<test>testupdate</test>", "geostore");
        assertNotNull("Colud not update preset configuration", Long.valueOf(resourceId));
        
        //
        // Test Delete
        //
        manager.delete(resourceId, "geostore");        
        assertEquals(0, resourceService.getCount(null));
    }
    
    /**
     * @throws Exception
     */
    @Test
    public void testFileResourcePreset() throws Exception {
        Parametri parametri = manager.get(null, "Demo", "file");
        assertNotNull("Colud not retrieve preset configuration", parametri);
    }
    
}

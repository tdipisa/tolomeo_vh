/**
 * 
 */
package it.prato.comune.tolomeo.configuration;

import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.web.parametri.Parametri;

import java.io.IOException;
import java.util.Map;

/**
 * @author Tobia Di Pisa at <tobia.dipisa@geo-solutions.it>
 *
 */
public class ConfigurationManager {
	
	String defaultConfigStoreType;
	
	Map<String, ConfigurationStore> configurationStores;
	
	/**
	 * 
	 */
	public ConfigurationManager() {
		super();
	}

	/**
	 * @param defaultConfigStoreType
	 * @param configurationStores
	 */
	public ConfigurationManager(String defaultConfigStoreType,
			Map<String, ConfigurationStore> configurationStores) {
		super();
		this.defaultConfigStoreType = defaultConfigStoreType;
		this.configurationStores = configurationStores;
	}

	/**
	 * @param configurationStores
	 */
	public void setConfigurationStores(
			Map<String, ConfigurationStore> configurationStores) {
		this.configurationStores = configurationStores;
	}

	/**
	 * @param defaultConfigStoreType the defaultConfigStoreType to set
	 */
	public void setDefaultConfigStoreType(String defaultConfigStoreType) {
		this.defaultConfigStoreType = defaultConfigStoreType;
	}

	/**
	 * @return
	 * @throws IOException 
	 */
	public <T> Parametri get(SITLayersManager comunePO, T configurationId, String type) throws Exception{
		String configType = type != null ? type : this.defaultConfigStoreType;
		return configurationStores.get(configType).get(configurationId, comunePO);
	}

}

/**
 * 
 */
package it.prato.comune.tolomeo.configuration;

import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.web.parametri.Parametri;

import java.util.Map;

/**
 * @author Tobia Di Pisa at <tobia.dipisa@geo-solutions.it>
 *
 */
public class ConfigurationManager {
	
	Map<String, ConfigurationStore> configurationStores;
	
	public void setConfigurationStores(
			Map<String, ConfigurationStore> configurationStores) {
		this.configurationStores = configurationStores;
	}

	/**
	 * @return
	 */
	public <T> Parametri get(String type, SITLayersManager comunePO, T configurationId){
		return configurationStores.get(type).get(configurationId, comunePO);
	}

}

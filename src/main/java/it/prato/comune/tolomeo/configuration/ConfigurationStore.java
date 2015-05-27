/**
 * 
 */
package it.prato.comune.tolomeo.configuration;

import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.web.parametri.Parametri;


/**
 * @author Tobia Di Pisa at <tobia.dipisa@geo-solutions.it>
 *
 */
public interface ConfigurationStore {


	<T> Parametri get(T configurationId, SITLayersManager comunePO);

	<T> void delete(T configurationId) throws Exception;

	long save(String name, String configuration) throws Exception;
    
	
}

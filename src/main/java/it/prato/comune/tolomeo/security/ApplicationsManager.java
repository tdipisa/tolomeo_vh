/* 
 Tolomeo is a developing framework for visualization, editing,  
 geoprocessing and decisional support application based on cartography.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 This file is part of Tolomeo.
 
 Tolomeo is free software; you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License 
 as published by the Free Software Foundation; either version 3 of the License, 
 or (at your option) any later version.
 
 Tolomeo is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 
 You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo è un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo è un software libero; è possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo è distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo è sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
*/

package it.prato.comune.tolomeo.security;

import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.security.xml.role.Application;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

public class ApplicationsManager {
	
	private LogInterface logger = null;
	private List<Application> applications;
	
	private Map<Application, Parametri> applicationConfigurations;
	
	private Boolean updated;
	
	private Parametri getApplicationConfigurationByApplicationName(String applicationName) throws Exception {
		Iterator<Application> applicationsIterator = applicationConfigurations.keySet().iterator();
		while (applicationsIterator.hasNext()) {
			Application application = applicationsIterator.next();
			if (application.getName().equals(applicationName)) {
				return applicationConfigurations.get(application);
			}
		}
		return null;
	}

	private Boolean loadApplicationConfiguration(Application application, SITLayersManager terr) throws Exception {
		logger.info("loading application \"" + application.getName() + "\" configuration ...");
		Boolean result = false;

		try {
			Parametri parametri = Parametri.createParametri( application.getName() , terr);
			applicationConfigurations.put(application, parametri);
			result = true;
		} catch (Exception exception) {
			exception.printStackTrace();
			logger.error(exception.getMessage());
			logger.warn("unable to load application \"" + application.getName() + "\" configuration ...");
		}
		return result;
	}

	@Autowired
	public ApplicationsManager() throws Exception {
		
		LogInterface logger = TolomeoApplicationContext.getInstance().getAnonymousLogger();
		logger.debug("public ApplicationsManager.ApplicationsManager();");
		reset();
	}
	
	public Boolean loadApplication(Application application, SITLayersManager terr) throws Exception {
		logger.info("loading application \"" + application.getName() + "\"");
		Boolean result = false;
		if (!applications.contains(application)) {
			Parametri parametri = getApplicationConfigurationByApplicationName(application.getName());
			if (parametri != null) {
				applicationConfigurations.put(application, parametri);
				applications.add(application);
				updated = true;
				result = true;
			} else {
				if (loadApplicationConfiguration(application, terr) == true) {
					applications.add(application);
					updated = true;
					result = true;
				}
			}
		}
		return result;
	}
	
	public Parametri getApplicationConfiguration(Application application) throws Exception {
		return applicationConfigurations.get(application);
	}
	
	public void reset() {
		applications = new ArrayList<Application>();
		applicationConfigurations = new HashMap<Application, Parametri>();
		updated = false;
	}
	
	public List<Application> getApplications() {
		return applications;
	}

	public void setApplications(List<Application> applications) {
		this.applications = applications;
	}

	public Map<Application, Parametri> getApplicationConfigurations() {
		return applicationConfigurations;
	}

	public void setApplicationConfigurations(Map<Application, Parametri> applicationConfigurations) {
		this.applicationConfigurations = applicationConfigurations;
	}

	public Boolean isUpdated() {
		return updated;
	}

	public void setUpdated(Boolean updated) {
		this.updated = updated;
	}

}

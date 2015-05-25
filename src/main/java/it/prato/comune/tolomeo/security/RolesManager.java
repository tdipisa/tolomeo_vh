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
import it.prato.comune.tolomeo.security.xml.role.AssignedRole;
import it.prato.comune.tolomeo.security.xml.role.IncomingRole;
import it.prato.comune.tolomeo.security.xml.role.RolesMapping;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.betwixt.io.BeanReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

public class RolesManager {
	
	LogInterface logger = null;

	private String rolesMappingFilePath;
	
	private RolesMapping rolesMapping;
	
	private ApplicationsManager applicationsManager;

	private Boolean loadRolesMapping(InputStream inputStream) throws Exception {
		logger.info("loading roles mapping ...");
		Boolean result = false;
		
        try {
            // Create BeanReader
            BeanReader beanReader  = new BeanReader();
                
            // Configure the reader
            beanReader.getXMLIntrospector().getConfiguration().setAttributesForPrimitives(false);
           // beanReader.getXMLIntrospector().getConfiguration().setElementNameMapper(new DecapitalizeNameMapper());
            beanReader.getBindingConfiguration().setMapIDs(false);
            
            // Register beans so that betwixt knows what the xml is to be converted to
            beanReader.registerBeanClass("rolesMapping",RolesMapping.class);
            rolesMapping = (RolesMapping) beanReader.parse(inputStream);
            
        } catch (Exception e) {
			logger.error(e.getMessage(), e);
			logger.warn("unable to load roles mapping ...");
        }
        
		/*
		Boolean result = false;
		Serializer serializer = new Persister();
		try {
			rolesMapping = serializer.read(RolesMapping.class, inputStream);
			logger.info("incoming roles count: " + rolesMapping.getIncomingRoles().size());
			result = true;
		} catch (Exception exception) {
			exception.printStackTrace();
			logger.error(exception.getMessage());
			logger.warn("unable to load roles mapping ...");
		}*/
		return result;
	}
	
	@Autowired
	public RolesManager(String rolesMappingFilePath) throws Exception {
		logger = TolomeoApplicationContext.getInstance().getAnonymousLogger();
		logger.debug("public RolesManager.RolesManager(String rolesMappingFilePath);");
		this.rolesMappingFilePath = rolesMappingFilePath;
		logger.info("roles mapping file path: " + this.rolesMappingFilePath);
		InputStream inputStream = getClass().getResourceAsStream(rolesMappingFilePath);
		if (inputStream != null) {
			loadRolesMapping(inputStream);
			inputStream.close();
		} else {
			logger.warn("roles mapping file (\"" + rolesMappingFilePath + "\") not found ...");
			logger.warn("put the roles mapping file (\"" + rolesMappingFilePath + "\") in the class path ...");
		}
	}
	
	public synchronized Authentication updateAuthenticationRoles(Authentication authentication) throws Exception {
		logger.info("setting authentication roles ...");
		if (rolesMapping != null) {
			applicationsManager.setUpdated(false);
			List<GrantedAuthority> assignedGrantedAuthorities = new ArrayList<GrantedAuthority>();
			logger.info("authentication name: " + authentication.getName());
			List<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>(authentication.getAuthorities());
			logger.info("authentication roles count: " + grantedAuthorities.size());
			Iterator<GrantedAuthority> grantedAuthoritiesIterator = grantedAuthorities.iterator();
			while (grantedAuthoritiesIterator.hasNext()) {
				GrantedAuthority grantedAuthority = grantedAuthoritiesIterator.next();
				String authenticationRole = grantedAuthority.getAuthority();
				logger.info("authentication role: " + authenticationRole);
				IncomingRole incomingRole = rolesMapping.getIncomingRoleByName(authenticationRole);
				if (incomingRole != null) {
					logger.info("incoming role \"" + incomingRole.getName() + "\" found ...");
					List<Application> applications = incomingRole.getApplications();
					logger.info("applications count: " + applications.size());
					Iterator<Application> applicationsIterator = applications.iterator();
					SITLayersManager terr = new SITLayersManager(TolomeoApplicationContext.getInstance().getShapePath(),logger, "");
					while (applicationsIterator.hasNext()) {
						Application application = applicationsIterator.next();
						logger.info("application name: " + application.getName());
						if (applicationsManager.loadApplication(application, terr)) {
							List<AssignedRole> assignedRoles = application.getAssignedRoles();
							logger.info("assigned roles count: " + assignedRoles.size());
							Iterator<AssignedRole> assignedRolesIterator = assignedRoles.iterator();
							while (assignedRolesIterator.hasNext()) {
								AssignedRole assignedRole = assignedRolesIterator.next();
								logger.info("assigned role: " + assignedRole.getName());
								SimpleGrantedAuthority simpleGrantedAuthority = new SimpleGrantedAuthority("ROLE_" + application.getName() + "_" + assignedRole.getName());
								if (!assignedGrantedAuthorities.contains(simpleGrantedAuthority)) {
									assignedGrantedAuthorities.add(simpleGrantedAuthority);
								}
							}
						}
					}
				} else {
					logger.warn("incoming role \"" + authenticationRole + "\" not found ...");
				}
			}
			authentication = new PreAuthenticatedAuthenticationToken(authentication.getPrincipal(), authentication.getCredentials(), assignedGrantedAuthorities);
			grantedAuthorities = new ArrayList<GrantedAuthority>(authentication.getAuthorities());
			logger.info("assigned authentication roles count: " + grantedAuthorities.size());
			grantedAuthoritiesIterator = grantedAuthorities.iterator();
			while (grantedAuthoritiesIterator.hasNext()) {
				GrantedAuthority grantedAuthority = grantedAuthoritiesIterator.next();
				String authenticationRole = grantedAuthority.getAuthority();
				logger.info("assigned authentication role: " + authenticationRole);
			}
		} else {
			logger.warn("roles mapping not loaded ...");
		}
		return authentication;
	}

	public Boolean reloadRolesMapping(String rolesMappingAsString) throws Exception {
		logger.info("reloading roles mapping ...");
		Boolean result = false;
		InputStream inputStream = new ByteArrayInputStream(rolesMappingAsString.getBytes());
		if (loadRolesMapping(inputStream) == true) {
			applicationsManager.reset();
			SecurityContextHolder.clearContext();
			result = true;
		}
		return result;
	}

	public String getRolesMappingFilePath() {
		return rolesMappingFilePath;
	}

	public void setRolesMappingFilePath(String rolesMappingFilePath) {
		this.rolesMappingFilePath = rolesMappingFilePath;
	}
	
	public RolesMapping getRolesMapping() {
		return rolesMapping;
	}
	
	public void setRolesMapping(RolesMapping rolesMapping) {
		this.rolesMapping = rolesMapping;
	}
	
	public ApplicationsManager getApplicationsManager() {
		logger.debug("public ApplicationsManager RolesManager.getApplicationsManager();");
		return applicationsManager;
	}
	
	public void setApplicationsManager(ApplicationsManager applicationsManager) {
		logger.debug("public void RolesManager.setApplicationsManager(ApplicationsManager applicationsManager);");
		this.applicationsManager = applicationsManager;
	}
	
}

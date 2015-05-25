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

import it.prato.comune.tolomeo.security.xml.role.Application;
import it.prato.comune.tolomeo.security.xml.role.AssignedRole;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.tolomeo.web.parametri.ParametriEventiLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerCanc;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerCancList;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerIns;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerInsList;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerUpdateAlpha;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerUpdateAlphaList;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerUpdateGeom;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerUpdateGeomList;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerVis;
import it.prato.comune.tolomeo.web.parametri.ParametriEventoLayerVisList;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.web.access.expression.DefaultWebSecurityExpressionHandler;
import org.springframework.security.web.access.expression.ExpressionBasedFilterInvocationSecurityMetadataSource;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.util.matcher.RequestMatcher;

public class AuthorizationManager {
	
	private LogInterface logger = null;
	
	private ApplicationsManager applicationsManager;

	private List<Service> services;
	
	private List<Resource> resources;
	
	private List<Rule> rules;
	
	private FilterInvocationSecurityMetadataSource filterInvocationSecurityMetadataSource;
	
	private void loadDefaultRules() throws Exception {
		
		
		logger.info("loading default rules ...");
		rules = new ArrayList<Rule>();
		String pattern;
		String expression;
		pattern = "/html/accessDenied.html";
		expression = "permitAll";
		loadRule(RequestMatcherType.AntPath, pattern, HttpMethod.GET, expression);
		pattern = "/**";
		expression = "denyAll";
		loadRule(RequestMatcherType.AntPath, pattern, HttpMethod.GET, expression);
	}
	
	private void setFilterInvocationSecurityMetadataSource() throws Exception {
		logger.info("setting filter invocation security metadata source ...");
		LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>> requestMatchers = new LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>>();
		Iterator<Rule> rulesIterator = rules.iterator();
		while (rulesIterator.hasNext()) {
			Rule rule = rulesIterator.next();
			requestMatchers.put(rule.getRequestMatcher(), rule.getExpressionBasedAttributes());
		}
		filterInvocationSecurityMetadataSource = new ExpressionBasedFilterInvocationSecurityMetadataSource(requestMatchers, new DefaultWebSecurityExpressionHandler());
	}
	
	private List<String> getApplicationRoles(Application application) throws Exception {
		List<String> applicationRoles = new ArrayList<String>();
		List<AssignedRole> assignedRoles = application.getAssignedRoles();
		Iterator<AssignedRole> assignedRolesIterator = assignedRoles.iterator();
		while (assignedRolesIterator.hasNext()) {
			AssignedRole assignedRole = assignedRolesIterator.next();
			String applicationRole = "ROLE_" + application.getName() + "_" + assignedRole.getName();
			if (!applicationRoles.contains(applicationRole)) {
				applicationRoles.add(applicationRole);
			}
		}
    	return applicationRoles;
	}
	
	private List<String> getApplicationsRoles() throws Exception {
		List<String> applicationsRoles = new ArrayList<String>();
		Iterator<Application> applicationsIterator = applicationsManager.getApplications().iterator();
		while (applicationsIterator.hasNext()) {
			Application application = applicationsIterator.next();
			List<AssignedRole> assignedRoles = application.getAssignedRoles();
			Iterator<AssignedRole> assignedRolesIterator = assignedRoles.iterator();
			while (assignedRolesIterator.hasNext()) {
				AssignedRole assignedRole = assignedRolesIterator.next();
				String applicationRole = "ROLE_" + application.getName() + "_" + assignedRole.getName();
				if (!applicationsRoles.contains(applicationRole)) {
					applicationsRoles.add(applicationRole);
				}
			}
		}
    	return applicationsRoles;
	}
	
	private List<String> getServiceRolesByApplication(String serviceName, Application application) throws Exception {
		List<String> serviceRoles = new ArrayList<String>();
		Parametri parametri = applicationsManager.getApplicationConfiguration(application);
		
		for (ParametriEventiLayer eventiLayer: parametri.getAzioniEventi().getEventiLayerList()) {
			ParametriEventoLayerVisList azioniEventiVis = eventiLayer.getAzioniEventiVis();
			if (azioniEventiVis != null && azioniEventiVis.getAzioneList() != null) {
				for (ParametriEventoLayerVis azione : azioniEventiVis.getAzioneList()) {
					if (azione.getUrl() != null) {
						if (azione.getUrl().contains(serviceName)) {
							String[] roles = azione.getRuoliautorizzati().split(",");
							for (String role : roles) {
								String serviceRole = "ROLE_"
										+ application.getName() + "_"
										+ role;
								if (!serviceRoles.contains(serviceRole)) {
									serviceRoles.add(serviceRole);
								}
							}
						}
					}
				}
			}
			
			ParametriEventoLayerCancList azioniEventiCanc = eventiLayer.getAzioniEventiCanc();
			if (azioniEventiCanc != null && eventiLayer.getAzioniEventiCanc().getAzioneList() != null) {
				for (ParametriEventoLayerCanc azione : azioniEventiCanc.getAzioneList()) {
					if (azione.getUrl() != null) {
						if (azione.getUrl().contains(serviceName)) {
							String[] roles = azione.getRuoliautorizzati().split(",");
							for (String role : roles) {
								String serviceRole = "ROLE_"
										+ application.getName() + "_"
										+ role;
								if (!serviceRoles.contains(serviceRole)) {
									serviceRoles.add(serviceRole);
								}
							}
						}
					}
				}
			}
			
			ParametriEventoLayerUpdateGeomList azioniEventiUpdateGeom = eventiLayer.getAzioniEventiUpdateGeom();
			if (azioniEventiUpdateGeom != null && azioniEventiUpdateGeom.getAzioneList() != null) {
				for (ParametriEventoLayerUpdateGeom azione : azioniEventiUpdateGeom.getAzioneList()) {
					if (azione.getUrl() != null) {
						if (azione.getUrl().contains(serviceName)) {
							String[] roles = azione.getRuoliautorizzati().split(",");
							for (String role : roles) {
								String serviceRole = "ROLE_"
										+ application.getName() + "_"
										+ role;
								if (!serviceRoles.contains(serviceRole)) {
									serviceRoles.add(serviceRole);
								}
							}
						}
					}
				}
			}
			
			ParametriEventoLayerUpdateAlphaList azioniEventiUpdateAlpha = eventiLayer.getAzioniEventiUpdateAlpha();
			if (azioniEventiUpdateAlpha != null && azioniEventiUpdateAlpha.getAzioneList() != null) {
				for (ParametriEventoLayerUpdateAlpha azione : azioniEventiUpdateAlpha.getAzioneList()) {
					if (azione.getUrl() != null) {
						if (azione.getUrl().contains(serviceName)) {
							String[] roles = azione.getRuoliautorizzati().split(",");
							for (String role : roles) {
								String serviceRole = "ROLE_"
										+ application.getName() + "_"
										+ role;
								if (!serviceRoles.contains(serviceRole)) {
									serviceRoles.add(serviceRole);
								}
							}
						}
					}
				}
			}
			
			ParametriEventoLayerInsList azioniEventiIns = eventiLayer.getAzioniEventiIns();
			if (azioniEventiIns != null && azioniEventiIns.getAzioneList() != null) {
				for (ParametriEventoLayerIns azione : azioniEventiIns.getAzioneList()) {
					if ((azione.getUrl() != null) &&
							(azione.getUrl().contains(serviceName))) {
						String[] roles = azione.getRuoliautorizzati().split(",");
						for (String role : roles) {
							String serviceRole = "ROLE_"
									+ application.getName() + "_"
									+ role;
							if (!serviceRoles.contains(serviceRole)) {
								serviceRoles.add(serviceRole);
							}
						}
					}
				}
			}
			
		}
		if (serviceRoles.size() == 0) {
			serviceRoles = getApplicationRoles(application);
		}
		return serviceRoles;
	}
	
	private void loadRule(RequestMatcherType requestMatcherType, String pattern, HttpMethod httpMethod, List<String> roles) throws Exception {
		logger.info("loading rule ...");
		Rule rule = new Rule(requestMatcherType, pattern, httpMethod, roles);
		Integer ruleIndex = rules.indexOf(rule);
		if (ruleIndex == -1) {
			logger.info("rule not found ...");
			logger.info("rule will be added ...");
			rules.add(rule);
		} else {
			logger.info("rule found ...");
			logger.info("rule will be updated ...");
			Iterator<String> rolesIterator = roles.iterator();
			while (rolesIterator.hasNext()) {
				String role = rolesIterator.next();
				if (!rules.get(ruleIndex).containsRole(role)) {
					rules.get(ruleIndex).addRole(role);
				}
			}
		}
	}
	
	private void loadRule(RequestMatcherType requestMatcherType, String pattern, HttpMethod httpMethod, String expression) throws Exception {
		logger.info("loading rule ...");
		Rule rule = new Rule(requestMatcherType, pattern, httpMethod, expression);
		Integer ruleIndex = rules.indexOf(rule);
		if (ruleIndex == -1) {
			logger.info("rule not found ...");
			logger.info("rule will be added ...");
			rules.add(rule);
		}
	}
	
	private void loadServicesRulesByApplication(Application application) throws Exception {
		String pattern;
		List<String> roles;
		Iterator<Service> servicesIterator = services.iterator();
		while (servicesIterator.hasNext()) {
			Service service = servicesIterator.next();
			pattern = service.getUrlPattern().replace("/", "\\/") + "\\?.*";
			roles = getServiceRolesByApplication(service.getServletName(), application);
			loadRule(RequestMatcherType.Regex, pattern, service.getHttpMethod(), roles);
		}
	}
	
	private void loadResourcesRules() throws Exception {
		String pattern;
		List<String> roles;
		Iterator<Resource> resourcesIterator = resources.iterator();
		while (resourcesIterator.hasNext()) {
			Resource resource = resourcesIterator.next();
			pattern = resource.getUrlPattern() + "/**";
			roles = getApplicationsRoles();
			loadRule(RequestMatcherType.AntPath, pattern, resource.getHttpMethod(), roles);
		}
	}
	
	private void loadRules() throws Exception {
		logger.info("loading rules ...");
		rules = new ArrayList<Rule>();
		String pattern;
		List<String> roles;
		String expression;
		if (applicationsManager.getApplicationConfigurations().size() > 0) {
			Set<Application> applications = applicationsManager.getApplicationConfigurations().keySet();
			Iterator<Application> applicationsIterator;
			applicationsIterator = applications.iterator();
			while (applicationsIterator.hasNext()) {
				Application application = applicationsIterator.next();
				pattern = "\\/TolomeoMainServlet\\?paramPreset=" + application.getName();
				roles = getApplicationRoles(application);
				loadRule(RequestMatcherType.Regex, pattern, HttpMethod.GET, roles);
			}
			applicationsIterator = applications.iterator();
			while (applicationsIterator.hasNext()) {
				Application application = applicationsIterator.next();
				loadServicesRulesByApplication(application);
			}
		}
		loadResourcesRules();
		pattern = "/html/accessDenied.html";
		expression = "permitAll";
		loadRule(RequestMatcherType.AntPath, pattern, HttpMethod.GET, expression);
		pattern = "/**";
		expression = "denyAll";
		loadRule(RequestMatcherType.AntPath, pattern, HttpMethod.GET, expression);
	}
	
	@Autowired
	public AuthorizationManager() throws Exception {
		logger = TolomeoApplicationContext.getInstance().getAnonymousLogger();
		logger.debug("public AuthorizationManager.AuthorizationManager();");
		loadDefaultRules();
		setFilterInvocationSecurityMetadataSource();
	}
	
	public synchronized FilterInvocationSecurityMetadataSource updateFilterInvocationSecurityMetadataSource() throws Exception {
		logger.info("updating filter invocation security metadata source ...");
		if (applicationsManager.isUpdated()) {
			logger.info("applications manager is updated ...");
			loadRules();
			setFilterInvocationSecurityMetadataSource();
		}
		return filterInvocationSecurityMetadataSource;
	}
	
	public FilterInvocationSecurityMetadataSource getFilterInvocationSecurityMetadataSource() throws Exception {
		return filterInvocationSecurityMetadataSource;
	}
	
	public ApplicationsManager getApplicationsManager() {
		logger.debug("public ApplicationsManager AuthorizationManager.getApplicationsManager();");
		return applicationsManager;
	}
	
	public void setApplicationsManager(ApplicationsManager applicationsManager) {
		logger.debug("public void AuthorizationManager.setApplicationsManager(ApplicationsManager applicationsManager);");
		this.applicationsManager = applicationsManager;
	}
	
	public List<Service> getServices() {
		logger.debug("public List<String> AuthorizationManager.getServices();");
		return services;
	}

	public void setServices(List<Service> services) {
		logger.debug("public void AuthorizationManager.setServices(List<String> services);");
		logger.info("services ...");
		Iterator<Service> servicesIterator = services.iterator();
		while (servicesIterator.hasNext()) {
			Service service = servicesIterator.next();
			logger.info("servlet name: " + service.getServletName());
			logger.info("url pattern: " + service.getUrlPattern());
			logger.info("http method: " + service.getHttpMethod());
		}
		this.services = services;
	}

	public List<Resource> getResources() {
		logger.debug("public List<String> AuthorizationManager.getResources();");
		return resources;
	}

	public void setResources(List<Resource> resources) {
		logger.debug("public void AuthorizationManager.setResources(List<String> resources);");
		logger.info("resources ...");
		Iterator<Resource> resourcesIterator = resources.iterator();
		while (resourcesIterator.hasNext()) {
			Resource resource = resourcesIterator.next();
			logger.info("url pattern: " + resource.getUrlPattern());
			logger.info("http method: " + resource.getHttpMethod());
		}
		this.resources = resources;
	}
	
}

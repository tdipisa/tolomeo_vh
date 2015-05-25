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

import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.stereotype.Component;

@Component("filterSecurityInterceptor")
public class CustomFilterSecurityInterceptor extends FilterSecurityInterceptor {
	
	private LogInterface logger = null;
	
	private AuthorizationManager authorizationManager;

	@Autowired
	public CustomFilterSecurityInterceptor() {
		super();
		logger = TolomeoApplicationContext.getInstance().getAnonymousLogger();
		logger.debug("public CustomFilterSecurityInterceptor.CustomFilterSecurityInterceptor();");
	}
	
	@Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		logger.debug("public void CustomFilterSecurityInterceptor.doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException;");
		super.doFilter(servletRequest, servletResponse, filterChain);
    }
	
	@Override
	public void invoke(FilterInvocation filterInvocation) throws IOException, ServletException {
		logger.debug("public void CustomFilterSecurityInterceptor.invoke(FilterInvocation filterInvocation) throws IOException, ServletException;");
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication != null) {
			logger.info("about authentication ...");
			logger.info("user: " + authentication.getName());
			logger.info("password: " + authentication.getCredentials());
			logger.info("roles ...");
			List<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>(authentication.getAuthorities());
			Iterator<GrantedAuthority> grantedAuthoritiesIterator = grantedAuthorities.iterator();
			while (grantedAuthoritiesIterator.hasNext()) {
				logger.info(grantedAuthoritiesIterator.next().getAuthority());
			}
		}
		try {
			FilterInvocationSecurityMetadataSource filterInvocationSecurityMetadataSource = authorizationManager.getFilterInvocationSecurityMetadataSource();
			setSecurityMetadataSource(filterInvocationSecurityMetadataSource);
		} catch (Exception exception) {
			exception.printStackTrace();
			logger.error(exception.getMessage());
		}
		super.invoke(filterInvocation);
	}
	
	public AuthorizationManager getAuthorizationManager() {
		logger.debug("public AuthorizationManager CustomFilterSecurityInterceptor.getAuthorizationManager();");
		return authorizationManager;
	}
	
	public void setAuthorizationManager(AuthorizationManager authorizationManager) {
		logger.debug("public void CustomFilterSecurityInterceptor.setAuthorizationManager(AuthorizationManager authorizationManager);");
		this.authorizationManager = authorizationManager;
	}

}

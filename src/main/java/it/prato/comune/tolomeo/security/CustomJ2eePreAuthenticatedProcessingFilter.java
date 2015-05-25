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

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.preauth.j2ee.J2eePreAuthenticatedProcessingFilter;
import org.springframework.stereotype.Component;

@Component("j2eePreAuthenticatedProcessingFilter")
public class CustomJ2eePreAuthenticatedProcessingFilter extends J2eePreAuthenticatedProcessingFilter {
	
	private LogInterface logger = null;        
    
	@Autowired
	public CustomJ2eePreAuthenticatedProcessingFilter() {
		super();       
		logger = TolomeoApplicationContext.getInstance().getAnonymousLogger();
		
		logger.debug("public CustomJ2eePreAuthenticatedProcessingFilter.CustomJ2eePreAuthenticatedProcessingFilter();");
	}

	@Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		logger.debug("public void CustomJ2eePreAuthenticatedProcessingFilter.doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException;");
		super.doFilter(servletRequest, servletResponse, filterChain);
    }
	
	@Override
	protected void successfulAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) {
		logger.debug("protected void CustomJ2eePreAuthenticatedProcessingFilter.successfulAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication);");
		super.successfulAuthentication(httpServletRequest, httpServletResponse, authentication);
	}
	
	@Override
	protected void unsuccessfulAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException authenticationException) {
		logger.debug("protected void CustomJ2eePreAuthenticatedProcessingFilter.unsuccessfulAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException authenticationException);");
		super.unsuccessfulAuthentication(httpServletRequest, httpServletResponse, authenticationException);
	}

	@Override
	protected Object getPreAuthenticatedPrincipal(HttpServletRequest httpServletRequest) {
		logger.debug("protected Object CustomJ2eePreAuthenticatedProcessingFilter.getPreAuthenticatedPrincipal(HttpServletRequest httpServletRequest);");
		return super.getPreAuthenticatedPrincipal(httpServletRequest);
	}

	@Override
	protected Object getPreAuthenticatedCredentials(HttpServletRequest httpServletRequest) {
		logger.debug("protected Object CustomJ2eePreAuthenticatedProcessingFilter.getPreAuthenticatedCredentials(HttpServletRequest httpServletRequest);");
		return super.getPreAuthenticatedCredentials(httpServletRequest);
	}
	
}

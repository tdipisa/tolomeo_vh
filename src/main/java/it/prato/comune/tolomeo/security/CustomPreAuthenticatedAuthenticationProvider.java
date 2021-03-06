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
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110�1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo � un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo � un software libero; � possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo � distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT� o
 IDONEIT� PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110�1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo � sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
*/

package it.prato.comune.tolomeo.security;

import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationProvider;
import org.springframework.stereotype.Component;

@Component("preAuthenticatedAuthenticationProvider")
public class CustomPreAuthenticatedAuthenticationProvider extends PreAuthenticatedAuthenticationProvider {
	
	private LogInterface logger = null;        
	   
	private RolesManager rolesManager;
	
	private AuthorizationManager authorizationManager;
	
	@Autowired
	public CustomPreAuthenticatedAuthenticationProvider() {
		super();
		logger = TolomeoApplicationContext.getInstance().getAnonymousLogger();
		logger.debug("public CustomPreAuthenticatedAuthenticationProvider.CustomPreAuthenticatedAuthenticationProvider();");
	}
	
	@Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		logger.debug("public CustomPreAuthenticatedAuthenticationProvider.authenticate(Authentication authentication) throws AuthenticationException;");
		try {
			authentication = rolesManager.updateAuthenticationRoles(super.authenticate(authentication));
			authorizationManager.updateFilterInvocationSecurityMetadataSource();
		} catch (Exception exception) {
			exception.printStackTrace();
			logger.error(exception.getMessage());
		}
		return authentication;
    }
	
	public RolesManager getRolesManager() {
		logger.debug("public RolesManager CustomPreAuthenticatedAuthenticationProvider.getRolesManager();");
		return rolesManager;
	}
	
	public void setRolesManager(RolesManager rolesManager) {
		logger.debug("public void CustomPreAuthenticatedAuthenticationProvider.setRolesManager(RolesManager rolesManager);");
		this.rolesManager = rolesManager;
	}
	
	public AuthorizationManager getAuthorizationManager() {
		logger.debug("public AuthorizationManager CustomPreAuthenticatedAuthenticationProvider.getAuthorizationManager();");
		return authorizationManager;
	}
	
	public void setAuthorizationManager(AuthorizationManager authorizationManager) {
		logger.debug("public void CustomPreAuthenticatedAuthenticationProvider.setAuthorizationManager(AuthorizationManager authorizationManager);");
		this.authorizationManager = authorizationManager;
	}
    
}

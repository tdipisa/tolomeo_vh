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

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.springframework.http.HttpMethod;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

public class Rule {
	
	LogInterface logger = null;

	private RequestMatcherType type;
	
	private String pattern;
	
	private HttpMethod method;
	
	private List<String> roles;
	
	private String expression;
	
	private void updateExpression() throws Exception {
    	expression = "hasAnyRole(";
		Iterator<String> rolesIterator = roles.iterator();
		while (rolesIterator.hasNext()) {
			String role = rolesIterator.next();
			expression += "'" + role + "'";
        	if (rolesIterator.hasNext()) {
        		expression += ", ";
        	}
		}
		expression += ")";
		logger.info("expression: " + expression);
	}
	
	public Rule(RequestMatcherType type, String pattern, HttpMethod method, List<String> roles) throws Exception {
		logger = TolomeoApplicationContext.getInstance().getAnonymousLogger();
		logger.info("rule ...");
		this.type = type;
		logger.info("type: " + type);
		this.pattern = pattern;
		logger.info("pattern: " + pattern);
		this.method = method;
		logger.info("method: " + method);
		this.roles = roles;
		updateExpression();
	}

	public Rule(RequestMatcherType type, String pattern, HttpMethod method, String expression) throws Exception {
		logger = TolomeoApplicationContext.getInstance().getAnonymousLogger();
		logger.info("rule ...");
		this.type = type;
		logger.info("type: " + type);
		this.pattern = pattern;
		logger.info("pattern: " + pattern);
		this.method = method;
		logger.info("method: " + method);
		this.expression = expression;
		logger.info("expression: " + expression);
	}
	
	@Override
	public boolean equals(Object object) {
		if (!type.equals(((Rule)object).getType()) || !pattern.equals(((Rule)object).getPattern()) || !method.equals(((Rule)object).getMethod())) {
			return false;
		}
		return true;
	}
	
	public Boolean containsRole(String role) throws Exception {
		return roles.contains(role);
	}
	
	public void addRole(String role) throws Exception {
		roles.add(role);
		updateExpression();
	}
	
	public RequestMatcher getRequestMatcher() throws Exception {
		logger.info("type: " + type);
		logger.info("pattern: " + pattern);
		logger.info("method: " + method);
		RequestMatcher requestMatcher = null;
		switch (type) {
			case Regex:
				requestMatcher = new RegexRequestMatcher(pattern, method.toString());
				break;
			case AntPath:
				requestMatcher = new AntPathRequestMatcher(pattern, method.toString());
				break;
		}
		return requestMatcher;
	}
	
	public Collection<ConfigAttribute> getExpressionBasedAttributes() throws Exception {
    	logger.info("expression: " + expression);
    	Collection<ConfigAttribute> attributes = new ArrayList<ConfigAttribute>();
   		attributes.add(new SecurityConfig(expression));
    	return attributes;
	}

	public RequestMatcherType getType() {
		return type;
	}

	public void setType(RequestMatcherType type) {
		this.type = type;
	}

	public String getPattern() {
		return pattern;
	}

	public void setPattern(String pattern) {
		this.pattern = pattern;
	}

	public HttpMethod getMethod() {
		return method;
	}

	public void setMethod(HttpMethod method) {
		this.method = method;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}
	
	public String getExpression() {
		return expression;
	}

	public void setExpression(String expression) {
		this.expression = expression;
	}
	
}

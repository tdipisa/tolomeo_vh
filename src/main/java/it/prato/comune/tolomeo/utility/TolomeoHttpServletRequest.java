/*******************************************************************************
 * Tolomeo is a developing framework for visualization, editing,  
 * geoprocessing and decisional support application based on cartography.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * This file is part of Tolomeo.
 * 
 * Tolomeo is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License 
 * as published by the Free Software Foundation; either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * Tolomeo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 * if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 * 
 * Developers Information:
 * 
 * Tolomeo is developed by Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it 
 * 
 * 
 * Versione in Italiano LGPL
 * 
 * Tolomeo è un framework per lo sviluppo di applicazioni per
 * visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * Questo file fa parte di Tolomeo.
 * 
 * Tolomeo è un software libero; è possibile redistribuirlo e / o 
 * modificarlo sotto i termini della GNU Lesser General Public License, 
 * come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 *  
 * Tolomeo è distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 * IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 * si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
 *   
 * 
 * Informazioni Sviluppatori:
 * 
 * Tolomeo è sviluppato dal Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 ******************************************************************************/
package it.prato.comune.tolomeo.utility;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class TolomeoHttpServletRequest extends HttpServletRequestWrapper{

    private static final String DEFAULT_CONNECTOR_URI_ENCODING = "ISO-8859-1";
    private static final String DEFAULT_BROWSER_URI_ENCODING = "UTF-8";
    private static final String DEFAULT_BROWSER_CHARACTER_ENCODING = "UTF-8";
    private static final String PARAM__CUSTOM_CHARSET  = "charset";
    private static final String PARAM__BROWSER_CHARSET = "_charset_";
    
    //private String connectorUriEncoding;    
    private HashMap<String, String[]> parameterMap;
    private List<String> parameterNames;
    private String connectorUriEncoding;
    private String requestCharacterEncoding;
    //private boolean initialized = false;
    //private List<String> parameterValues;
    
    public TolomeoHttpServletRequest(HttpServletRequest request, String connectorUriEncoding, String requestCharacterEncoding){
        
        super(request);  
        this.connectorUriEncoding = connectorUriEncoding;
        this.requestCharacterEncoding = requestCharacterEncoding;
        init();
        
    }
    
    private void init(){
//        System.out.println("==== INIT ====");
        //if(initialized) return;
        parameterMap = new HashMap<String, String[]>();
        parameterNames = new ArrayList<String>();
        
        //this.connectorUriEncoding = connectorUriEncoding;
        if(connectorUriEncoding == null){
            connectorUriEncoding = DEFAULT_CONNECTOR_URI_ENCODING;
        }   
        
        if(requestCharacterEncoding == null){
            requestCharacterEncoding = DEFAULT_BROWSER_CHARACTER_ENCODING;
        }
        
        String method = _getHttpServletRequest().getMethod();        
        
        // Se il Browser mi ha inviato il charset utilizzando il campo "_charset_" allora considero quello come charset valido
        // altrimenti imposto quello del campo "charset" se mi è stato inviato
//        System.out.println("_CHARSET_ = " + _getHttpServletRequest().getParameter(PARAM__BROWSER_CHARSET));
        String charset =    _getHttpServletRequest().getParameter(PARAM__BROWSER_CHARSET) != null ?
                            _getHttpServletRequest().getParameter(PARAM__BROWSER_CHARSET):
                            _getHttpServletRequest().getParameter(PARAM__CUSTOM_CHARSET);
        
        Enumeration<String> paramNames = _getHttpServletRequest().getParameterNames();
        
//        System.out.println("QUERY STRING " + _getHttpServletRequest().getQueryString());
//        System.out.println("PARAM PRESET_ " + super.getParameter("paramPreset"));
//        System.out.println("METHOD = " + method);
//        System.out.println("CHARSET = " + charset);
//        System.out.println("connectorUriEncoding = " + connectorUriEncoding);
        
        while(paramNames.hasMoreElements()){
            
            String nativeParamName = paramNames.nextElement();
            String[] nativeParamValues = _getHttpServletRequest().getParameterValues(nativeParamName);
            
            String encodedParamName = nativeParamName;
            String[] encodedParamValues = nativeParamValues;
            
            // Se siamo in GET devo considerare come il Connettore APJ codifica gli URL
            // Di default li codifica ISO-8859-1 per non perdere la possibilità di ricodificare 
            // (ISO-8859-1) mappa un carattere per byte
            if(method.equalsIgnoreCase("GET")){       
                if(charset == null || charset.equals("")){
                    // se non mi è stato specificato il charset come parametro presumo UTF-8             
                    charset = DEFAULT_BROWSER_URI_ENCODING;            
                }
                if(!charset.equalsIgnoreCase(connectorUriEncoding)){
                    
                    try {
                        encodedParamName = new String(encodedParamName.getBytes(connectorUriEncoding),charset);
                    } catch (UnsupportedEncodingException e) {
                        System.out.println("Codifica non supportata : " + charset + ". " + e.getMessage());
                    }
                    
                    for (int i = 0; i < encodedParamValues.length; i++) {                    
                        try {
//                            System.out.println("Ricodifico il parametro da " + connectorUriEncoding + " a " + charset);
                            //encode = URLDecoder.decode(URLEncoder.encode(param,connectorUriEncoding),charset); //new String(param.getBytes(connectorUriEncoding),charset);
                            encodedParamValues[i] = new String(encodedParamValues[i].getBytes(connectorUriEncoding),charset);
//                            System.out.println("paramName = " + encodedParamName);
//                            System.out.println("paramValue = " + encodedParamValues[i]);
                        } catch (UnsupportedEncodingException e) {
                             System.out.println("Codifica non supportata : " + charset + ". " + e.getMessage());
                        }    
                    }
                } 
                
            // Se siamo in POST devo verificare che codifica è stata impostata nel reque
            } else if(method.equalsIgnoreCase("POST")){                
                String characterEncoding = _getHttpServletRequest().getCharacterEncoding().toUpperCase();
                //System.out.println("characterEncoding = " + characterEncoding);
                if(charset == null || charset.equals("")){             
                    charset = requestCharacterEncoding;            
                }
                
                // se non mi è stato specificato il charset come parametro presumo che il charset sia quello della request e non faccio nulla                
                if(!charset.equalsIgnoreCase(characterEncoding)){
                    try {
                        encodedParamName = new String(encodedParamName.getBytes(characterEncoding),charset);
                    } catch (UnsupportedEncodingException e) {
                        System.out.println("Codifica non supportata : " + charset + ". " + e.getMessage());
                    }
                    for (int i = 0; i < encodedParamValues.length; i++) {
                        try {
                            System.out.println("Ricodifico il parametro da " + characterEncoding + " a " + charset);
                            encodedParamValues[i] = new String(encodedParamValues[i].getBytes(characterEncoding),charset);
                            System.out.println("paramName = " + encodedParamName);
                            System.out.println("paramValue = " + encodedParamValues[i]);
                        } catch (UnsupportedEncodingException e) {
                            System.out.println("Codifica non supportata : " + charset + ". " + e.getMessage());
                        }    
                    }                    
                }
                               
            }
            
            this.parameterMap.put(nativeParamName, nativeParamValues);
        }
    }
   
    public TolomeoHttpServletRequest(HttpServletRequest request){
        this(request,null,null);
    }
    
    
    @Override
    public String getParameter(String name) {     
        String value = null;
        if(this.parameterMap.containsKey(name)){
            value = this.parameterMap.get(name)[0];
        } 
        if(value == null) return super.getParameter(name);
        return value; 
    }

    @Override
    public Map<String,String[]> getParameterMap() {
        //init();
        return this.parameterMap;
    }

    @Override
    public Enumeration<String> getParameterNames() {
        //init();
        return new TolomeoParamEnumeration(this.parameterMap.keySet());
    }

    @Override
    public String[] getParameterValues(String name) {
        //init();
        return this.parameterMap.get(name);
    }
    
    private class TolomeoParamEnumeration implements Enumeration<String> {
                
        private List<String> paramNamesSet;
        private int index;
        
        public TolomeoParamEnumeration(Set<String> paramNamesSet) {
            index = 0;
            if(paramNamesSet != null){
                this.paramNamesSet = new ArrayList<String>(paramNamesSet);
            }
        }

        public boolean hasMoreElements() {
            if(paramNamesSet == null) 
                return false;
            
            return index < paramNamesSet.size();                
        }

        public String nextElement() {
            if(hasMoreElements()){
                String nextElement = paramNamesSet.get(index);
                index++;
                return nextElement;
            }
            throw new NoSuchElementException();
        }
        
    }

    private HttpServletRequest _getHttpServletRequest() {
        return (HttpServletRequest) super.getRequest();
    }
    
    @Override
    public void setRequest(ServletRequest request) {
//        System.out.println("==== setRequest ==== ");
//        System.out.println(((HttpServletRequest)request).getRequestURI());
//        if(TolomeoHttpServletRequest.class.isAssignableFrom(request.getClass())){
//            
//            System.out.println("Wrapper LA RICHIESTA E' UNA TolomeoHttpServletRequest");
//        }
        super.setRequest(request);
        this.init();
    }

    @Override
    public ServletRequest getRequest() {
//        System.out.println("==== getRequest ==== ");
        return super.getRequest();
    }    
    
    

}

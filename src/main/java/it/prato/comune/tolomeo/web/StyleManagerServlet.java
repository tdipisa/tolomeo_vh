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
/**************************************************************
* Copyright © 2007 Comune di Prato - All Right Reserved
* Project:      Tolomeo - WebGis con funzioni di editing
* File:         AjaxQueryServlet.java
* Function:     Servlet di default per query oggetti secondo criterio
* Author:       Alessandro Radaelli
* Version:      1.0.0
* CreationDate: 04/09/2007
* ModifyDate:   
***************************************************************/

package it.prato.comune.tolomeo.web;

import it.geosolutions.geostore.core.model.Category;
import it.geosolutions.geostore.core.model.Resource;
import it.geosolutions.geostore.core.model.StoredData;
import it.geosolutions.geostore.services.CategoryService;
import it.geosolutions.geostore.services.CategoryServiceImpl;
import it.geosolutions.geostore.services.ResourceService;
import it.geosolutions.geostore.services.ResourceServiceImpl;
import it.geosolutions.geostore.services.dto.search.BaseField;
import it.geosolutions.geostore.services.dto.search.FieldFilter;
import it.geosolutions.geostore.services.dto.search.SearchFilter;
import it.geosolutions.geostore.services.dto.search.SearchOperator;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.HttpException;
import org.h2.util.IOUtils;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.DefaultHandler;
import org.xml.sax.helpers.XMLReaderFactory;


/**
 * StyleManagerServlet, this servlet allows to retrieve and save an SLD resource interacting with GeoStore's 
 * core services.
 * 
 * GET - You can provide the name of the resource or directly the ID:
 * 
 * curl -i "http://localhost:8080/tolomeo_vh/StyleManagerServlet?stylename=teststyle"
 * curl -i "http://localhost:8080/tolomeo_vh/StyleManagerServlet?styleid=10"
 * 
 * POST - You can provide the SLD content inside the request body specifying the style name if you want (if the name is missing 
 *        an UUID will be automatically assigned by the service)
 *        
 * curl -XPOST -H "Content-type: text/xml" -d "<?xml version="1.0" encoding="ISO-8859-1"?>
 * 	<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" 
 * 	xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml"
 * 	xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
 * 	<NamedLayer><Name>topp:states</Name><UserStyle><Name>population</Name><Title>Population in the United States</Title>
 * 	<Abstract>A sample filter that filters the United States into three categories of population, drawn in different colors</Abstract>
 * 	<FeatureTypeStyle><Rule><Title>&lt; 2M</Title><ogc:Filter><ogc:PropertyIsLessThan><ogc:PropertyName>PERSONS</ogc:PropertyName>
 * 	<ogc:Literal>2000000</ogc:Literal></ogc:PropertyIsLessThan></ogc:Filter><PolygonSymbolizer><Fill><CssParameter name="fill">#000000</CssParameter>
 * 	<CssParameter name="fill-opacity">0.7</CssParameter></Fill></PolygonSymbolizer></Rule><Rule><Title>2M - 4M</Title><ogc:Filter><ogc:PropertyIsBetween>
 * 	<ogc:PropertyName>PERSONS</ogc:PropertyName><ogc:LowerBoundary><ogc:Literal>2000000</ogc:Literal></ogc:LowerBoundary><ogc:UpperBoundary>
 * 	<ogc:Literal>4000000</ogc:Literal></ogc:UpperBoundary></ogc:PropertyIsBetween></ogc:Filter><PolygonSymbolizer><Fill>
 * 	<CssParameter name="fill">#FFFFFF</CssParameter><CssParameter name="fill-opacity">0.7</CssParameter></Fill></PolygonSymbolizer></Rule><Rule>
 * 	<Title>&gt; 4M</Title><ogc:Filter><ogc:PropertyIsGreaterThan><ogc:PropertyName>PERSONS</ogc:PropertyName><ogc:Literal>4000000</ogc:Literal>
 * 	</ogc:PropertyIsGreaterThan></ogc:Filter><PolygonSymbolizer><Fill><CssParameter name="fill">#000000</CssParameter>
 * 	<CssParameter name="fill-opacity">0.7</CssParameter></Fill></PolygonSymbolizer></Rule><Rule><Title>Boundary</Title>
 * 	<LineSymbolizer><Stroke><CssParameter name="stroke-width">0.2</CssParameter></Stroke></LineSymbolizer><TextSymbolizer>
 * 	<Label><ogc:PropertyName>STATE_ABBR</ogc:PropertyName></Label><Font><CssParameter name="font-family">Times New Roman</CssParameter>
 * 	<CssParameter name="font-style">Normal</CssParameter><CssParameter name="font-size">14</CssParameter></Font><LabelPlacement><PointPlacement>
 * 	<AnchorPoint><AnchorPointX>0.5</AnchorPointX><AnchorPointY>0.5</AnchorPointY></AnchorPoint></PointPlacement></LabelPlacement></TextSymbolizer>
 * 	</Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>" "http://localhost:8080/tolomeo_vh/StyleManagerServlet?stylename=population"
 * 
 * @author Tobia Di Pisa at <tobia.dipisa@geo-solutions.it>
 * 
 */
public class StyleManagerServlet extends TolomeoServlet {
	
	private ResourceService resourceService;
	
	private CategoryService categoryService;
	
	private int defaultStreamByteSize = 1024;

	private String sldGeoStoreCategoryName = "SLD";
	
    /**
	 * 
	 */
	private static final long serialVersionUID = -8814674331663923608L;

	/* (non-Javadoc)
	 * @see it.prato.comune.tolomeo.web.TolomeoServlet#init(javax.servlet.ServletConfig)
	 */
	@Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);       

        ServletContext servletContext =this.getServletContext();

        WebApplicationContext wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
        
        this.resourceService = (ResourceServiceImpl)wac.getBean("resourceService");
        this.categoryService = (CategoryServiceImpl)wac.getBean("categoryService");
    }
    
    /* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
        // Recupero il logger
        LogInterface LOGGER = getLogger(request);

        String styleId = request.getParameter("styleid");
        String styleName = request.getParameter("stylename");
        
        SearchFilter filter;
        if(styleId != null){
        	filter = new FieldFilter(BaseField.ID, 
            		styleId, SearchOperator.EQUAL_TO);
        }else if(styleName != null){
        	filter = new FieldFilter(BaseField.NAME, styleName,
                    SearchOperator.EQUAL_TO);
        }else{
            String errMsg = "Deve essere fornito l'identificativo della risorsa o il nome.";
            LOGGER.error(errMsg);     
            throw new ServletException(errMsg);
        }
        
        // ////////////////////////////////
        // Retrieving a full resource
        // ////////////////////////////////
        
		LOGGER.info("Retrieving a full resource");
		String style;
		
		List<Resource> resourcesFull;
		
        try {
            resourcesFull = resourceService.getResourcesFull(filter, null);
        } catch (Exception ex) {
            LOGGER.error(ex.getMessage(), ex);
            throw new ServletException("SITException in StyleManagerServlet durante il reperimento della risorsa SLD.");
        }
        
        if (resourcesFull.isEmpty()){
            throw new ServletException("Resource not found");
        }

        StoredData storedData = resourcesFull.get(0).getData();
        
        if(storedData != null){
        	style = storedData.getData();
        	LOGGER.debug("DATA is " + style);
        	
        	this.sendResponse(request, response, style, "text/xml");
        }else{
        	throw new ServletException("Style Stored Data not available");
        }  
        
        
    }

    /* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
        // Recupero il logger
        LogInterface LOGGER = getLogger(request);

        String styleName = request.getParameter("stylename");

        if(styleName == null){
            String infoMsg = "Nome risorsa non definito: generazione UUID per la nuova risorsa.";
            LOGGER.info(infoMsg); 
 
            UUID uuid = UUID.randomUUID();	
            styleName = uuid.toString();
        }
        
        // //////////////////////////////
        // Get Request's Content Body
        // //////////////////////////////
        String data = null;
        BufferedReader bufferedReader = null;
        StringBuilder stringBuilder = new StringBuilder();
        
        try {
            InputStream is = request.getInputStream();
            
            if (is != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(is));
                
                char[] charBuffer = new char[this.defaultStreamByteSize];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
                
                data = stringBuilder.toString();
            } 
            
            if(data == null){
            	String errorMsg = "POST content cannot be empty!";
            	LOGGER.error(errorMsg);
            	throw new IOException(errorMsg);
            }
                        
        } catch (IOException ex) {
        	LOGGER.error("Error while getting the request InputStream ", ex);
        	throw new IOException(ex);
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException ex) {
                    throw ex;
                }
            }
        }
                
        // /////////////////////////////////////////////////////
        // Check if the request body content is in XML format
        // /////////////////////////////////////////////////////
        XMLReader parser;
		try {
			parser = XMLReaderFactory.createXMLReader();
	        parser.setContentHandler(new DefaultHandler());
	        InputSource source = new InputSource(new ByteArrayInputStream(data.getBytes()));
	        parser.parse(source);
		} catch (SAXException e) {
        	String errorMsg = "The POST content must be in XML format!";
        	LOGGER.error(errorMsg);
        	throw new ServletException(errorMsg);
		}

        
        // ////////////////////////////////
        // Creating a new full resource
        // ////////////////////////////////
        
        LOGGER.info("Creating a new full resource...");
        
        try {
        	
        	Category category = categoryService.get(this.sldGeoStoreCategoryName);
        	
        	if(category == null){
        		LOGGER.info("Category SLD does not exists: SLD category must be created...");
        		category = new Category();
            	category.setName(this.sldGeoStoreCategoryName);
            	categoryService.insert(category);
            	LOGGER.info("Category SLD successfully created!");            	
        	}
        	
        	StoredData storedData = new StoredData();
        	storedData.setData(data);
        	
        	Resource resource = new Resource();
        	resource.setData(storedData);
        	resource.setName(styleName);
        	resource.setCategory(category);
        	
            long resourceId = resourceService.insert(resource);
            
            if(resourceId > 0){
                LOGGER.info("SLD resource successfully saved with ID=" + resourceId);
                this.sendResponse(request, response, Long.toString(resourceId), "text/plain");
            }
            
        } catch (Exception ex) {
            LOGGER.error(ex.getMessage(), ex);
            throw new ServletException("SITException in StyleManagerServlet durante ili reperimento della risorsa SLD.");
        }
    }
    
    /**
     * @param request
     * @param response
     * @param responseBody
     * @param contentType
     * @throws IOException
     * @throws ServletException
     */
    private void sendResponse(HttpServletRequest request, HttpServletResponse response, 
    		String responseBody, String contentType) throws IOException, ServletException{
    	
    	// Recupero il logger
        LogInterface LOGGER = getLogger(request);
        
        // ///////////////////////////////////
        // Send the content to the client
        // ///////////////////////////////////
        
        InputStream inputStreamServerResponse = null;
        ByteArrayOutputStream baos = null;
        
        try{
	        if(responseBody != null){        	
	            response.setContentType(contentType);
	            response.setContentLength(responseBody.length());
	            
	            byte[] b = new byte[this.defaultStreamByteSize];
	            
	            baos = new ByteArrayOutputStream(b.length);
	            inputStreamServerResponse = IOUtils.getInputStreamFromString(responseBody);
	            
	            int read = 0;
	    	    while((read = inputStreamServerResponse.read(b)) > 0){ 
	    	      	baos.write(b, 0, read);
	    	        baos.flush();
	    	    }
	                
	    	    baos.writeTo(response.getOutputStream());	
	        }
        } catch (HttpException e) {
                LOGGER.error("Error executing HTTP method ", e);
        } finally {
			try {
	        	if(inputStreamServerResponse != null)
	        		inputStreamServerResponse.close();
			} catch (IOException e) {
					LOGGER.error("Error closing request input stream ", e);
				throw new ServletException(e.getMessage());
			}
			
			try {
	        	if(baos != null){
	        		baos.flush();
	        		baos.close();
	        	}
			} catch (IOException e) {
					LOGGER.error("Error closing response stream ", e);
				throw new ServletException(e.getMessage());
			}
			
			response.getOutputStream().close();
        }
    }
    
	@Override
	protected String getDefaultForward() {
		return null;
	}

}
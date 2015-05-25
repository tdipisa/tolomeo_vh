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

package it.prato.comune.tolomeo.web;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;



public class MirrorServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    /**
     * Costruttore di default
     */
    public MirrorServlet() {
        
    }

	/**
	 * 
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	doPost(request, response);
	}

	/**
	 * @param  mode - modalità per la risposta. Possibile json o download
	 * @param  filename - nome del file da impostare per la risposta di tipo download
	 * @param  mimetype - mimetype da utilizzare per la risposta di tipo download
	 * @param contenuto - contenuto da utilizzare per il tipo download
	 * 
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Map<String, String> parametri = new HashMap<String, String>();
		PrintWriter out = null;
		
		//response.setContentType("text/html");
		//response.setHeader("Access-Control-Allow-Origin", "*");
		//response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		//response.setHeader("Access-Control-Allow-Headers" , "X-File-Name,X-File-Type,X-File-Size");
		
		//request.getSession(true);
		
		//String upload = request.getParameter("upload").toString();
		//String key = request.getParameter("key").toString();
		
		
		// Verifica se è multipart (upload di file)
		if (ServletFileUpload.isMultipartContent(request)) {
		
			DiskFileItemFactory  fileItemFactory = new DiskFileItemFactory ();
			
			// Configure a repository (to ensure a secure temp location is used)
			ServletContext servletContext = this.getServletConfig().getServletContext();
			File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
			fileItemFactory.setRepository(repository);
	
			
			fileItemFactory.setSizeThreshold(100*1024*1024); //100 MB
			ServletFileUpload uploadHandler = new ServletFileUpload(fileItemFactory);
			StringBuilder s_content=new StringBuilder();
			try {
				List items = uploadHandler.parseRequest(request);
				Iterator itr = items.iterator();
				while(itr.hasNext()) {
					FileItem item = (FileItem) itr.next();
					if(!item.isFormField()) {
						InputStream in = null;
						try {
							in = item.getInputStream();
							int nextChar = in.read();
							while ( nextChar != -1 ){
								s_content.append((char) nextChar);
								nextChar = in.read();
							}
						} finally {
							if (in != null) {
								in.close();
							}
						}
					} else {
					    String name  = item.getFieldName();
					    String value = item.getString();
					    parametri.put(name, value);
					    
					}
				}
				
				if (parametri.get("mode")==null || parametri.get("mode").equals("json")) {
					response.setContentType("application/json");
					JSONObject json = new JSONObject();
					json.put("success", "true");
					json.put("contenuto", s_content.toString());
					out = response.getWriter();
					out.write(json.toString());
				} else {
					String mime = (parametri.get("mimetype")!=null) ? parametri.get("mimetype") : "application/json";
					String filename = (parametri.get("filename")!=null && !parametri.get("filename").equals("")) ? parametri.get("filename")  : "download" ;
					response.setContentType(mime);
					response.setHeader("Content-Disposition","attachment; filename=\""+ filename + "\";");
					out = response.getWriter();
					out.write(s_content.toString());
				}
				
				//out.write(s_content.toString());
			}catch(FileUploadException ex) {
				out = response.getWriter();
				out.println("Error encountered while parsing the request: " + ex.getMessage());
	
			} catch(Exception ex) {
				out = response.getWriter();
				out.println("Error encountered while uploading file: " + ex.getMessage() + "<br>");
				ex.printStackTrace();
			}
		} else {
			String mime = (request.getParameter("mimetype")!=null) ? parametri.get("mimetype") : "text/html";
			String filename = (request.getParameter("filename")!=null && !request.getParameter("filename").equals("")) ? request.getParameter("filename")  : "download" ;
			response.setContentType(mime);
			response.setHeader("Content-Disposition","attachment; filename=\""+ filename + "\";");
			out = response.getWriter();
			out.write(request.getParameter("contenuto"));
		}
		
		out.close();
	}
}

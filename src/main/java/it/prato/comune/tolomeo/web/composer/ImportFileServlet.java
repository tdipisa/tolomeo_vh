/**************************************************************
* Project:      TolomeoApplicationComposer - Compositore di layout per Tolomeo
* File:         ExportFileServlet.java
* Function:     Servlet per eseguire il caricamento dei file sul server
* Version:      1.0.0
***************************************************************/

package it.prato.comune.tolomeo.web.composer;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;


/**
 * Implementazione metodi comuni a tutte le servlet di composer
 */
public class ImportFileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	/**
	 * contenitore per la gestione delle richieste, salvate in base ad una chiave UID
	 */
	private static HashMap<String, String> _all_responses=new HashMap<String, String>(); 
	
    /**
     * Costruttore di default
     */
    public ImportFileServlet() {
        
    }

	/**
	 * 
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	doPost(request, response);
	}

	/**
	 * @param  upload - indica se è la prima o la seconda richiesta (CrossDomain)
	 * @param  key - chiave identificativa della richiesta. Utilizzata per memorizzare il contenuto del file in un hashMap alla prima richiesta e recuperarlo nella seconda richiesta.
	 * @param  response - contenuto del file
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		response.setContentType("text/xml");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		response.setHeader("Access-Control-Allow-Headers" , "X-File-Name,X-File-Type,X-File-Size");
		
		request.getSession(true);
		
		String upload = request.getParameter("upload").toString();
		String key = request.getParameter("key").toString();
		
		PrintWriter out;
		out = response.getWriter();
		if(upload.equalsIgnoreCase("true")){
			if(_all_responses.containsKey(key)){
				_all_responses.remove(key);
			}
			DiskFileItemFactory  fileItemFactory = new DiskFileItemFactory ();
			fileItemFactory.setSizeThreshold(100*1024*1024); //100 MB
			ServletFileUpload uploadHandler = new ServletFileUpload(fileItemFactory);
			StringBuilder s_content=new StringBuilder();
			try {
				List items = uploadHandler.parseRequest(request);
				Iterator itr = items.iterator();
				while(itr.hasNext()) {
					FileItem item = (FileItem) itr.next();
					if(!item.isFormField()) {
						InputStream in=item.getInputStream();
						int nextChar;
						while ( ( nextChar = in.read() ) != -1  ){
							s_content.append((char) nextChar);
						}
					}
				}
				_all_responses.put(key, s_content.toString());
			}catch(FileUploadException ex) {
				out.println("Error encountered while parsing the request: " + ex.getMessage());
			} catch(Exception ex) {
				out.println("Error encountered while uploading file: " + ex.getMessage());
			}
		}else{
			if(_all_responses.containsKey(key)){
				out.write(_all_responses.get(key));
				_all_responses.remove(key);
			}
		}
		out.close();
	}
}

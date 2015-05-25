/**************************************************************
* Project:      TolomeoApplicationComposer - Compositore di layout per Tolomeo
* File:         ExportFileServlet.java
* Function:     Servlet per eseguire lo scaricamento dei file
* Version:      1.0.0
***************************************************************/

package it.prato.comune.tolomeo.web.composer;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//import org.htmlparser.util.Translate;


/**
 * Implementazione metodi comuni a tutte le servlet di composer 
 */
public class ExportFileServlet extends HttpServlet {
    
	private static final long serialVersionUID = 1L;

    /**
     * Costruttore di default
     */
    public ExportFileServlet() {
        
    }

	/**
	 * @param  filecontent contenuto del file
	 * @param  filename nome del file
	 * @param  fileExt estensione del file
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	doPost(request, response);
	}

	/**
	 * @param  filecontent contenuto del file
	 * @param  filename nome del file
	 * @param  fileExt estensione del file
	 * @param  response
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		/*
	    String fileContent=Translate.decode(request.getParameter("fileContent"));
		String fileName=Translate.decode(request.getParameter("fileName"));
		String fileExt=Translate.decode(request.getParameter("fileExt"));
		*/
	    String fileContent=request.getParameter("fileContent");
        String fileName=request.getParameter("fileName");
        String fileExt=request.getParameter("fileExt");
		export(request, response,fileContent,fileName,fileExt);
	}
	
	/**
	 * Crea l'attachment XML di risposta data una stringa
	 * @param request - richiesta della servlet
	 * @param response - risposta della servlet
	 * @param content - contenuto del file
	 * @param name - nome del file
	 * @param ext - estensione del file
	 */
	private void export(HttpServletRequest request,HttpServletResponse response, String content, String name, String ext){
		try {
			response.setContentType(getContentType(request, ext));
			response.setHeader("Content-Disposition", "attachment;filename=" + name +"." + ext);
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
			PrintWriter out;		
			out = response.getWriter();
			out.println(content);
			out.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
	/**
	 * Ritorna il ContentType da settare alla risposta della servlet
	 * @param request - richiesta della servlet
	 * @param ext - estensione del file
	 * @return
	 */
	private String getContentType(HttpServletRequest request,String ext){

		String ret="";
		if(ext=="xml"){
			ret="text/xml";
		}else if (ext=="json"){
			String cb = request.getParameter("callback");
			if (cb != null) {
				ret="text/javascript";
			} else {
				ret="application/x-json";
			}			
		}
		return ret;
		
	}

}

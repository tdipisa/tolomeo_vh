/**************************************************************
* Project:      TolomeoApplicationComposer - Compositore di layout per Tolomeo
* File:         ExportFileServlet.java
* Function:     Servlet per eseguire le richieste allo schema xsd e tornarle in stringhe Json
* Version:      1.0.0
***************************************************************/

package it.prato.comune.tolomeo.web.composer;

import it.prato.comune.tolomeo.xmleditor.Xsd2Json;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Implementazione metodi comuni a tutte le servlet di composer
 */
public class XsdServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Costruttore di default
     */
    public XsdServlet() {
    	
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @param schema - url al file xsd
	 * @param el - percorso all'elemento da interrogare
	 * @param response - stringa json per la creazione del contexMenu
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out = response.getWriter();
    	response.setContentType("application/x-json");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST");

		String json = "";
		
		ServletContext sc = getServletContext();
		sc.log("XsdServlet - doPost - START");
		try{
			String schema = request.getParameter("schema");
			String elementPath = request.getParameter("el");
			
			sc.log("XsdServlet - doPost - schema: " + schema);
			sc.log("XsdServlet - doPost - elementPath: " + elementPath);
			
			try {
				if (schema!=""){
					Xsd2Json xs = new Xsd2Json();
					json=xs.toJson(schema, elementPath);
				}
			} catch (Exception e) {
				sc.log("XsdServlet - Xsd2Json.toJson EXCEPTION: " + e.getMessage());
				out.print("{'exception':'" + e.getMessage() +"'}");
			}
			
			if (json!=""){
				String jsonSplitted[] = json.split(":");
				StringBuilder sbjson = new StringBuilder();
				for (int i=1; i < jsonSplitted.length; i++){
					sbjson.append(jsonSplitted[i] + ":");
				}
				json = sbjson.toString();
				
				json = json.substring(1,json.length()-3).replace("\\", "");
				json = json.replace("}{", "},{");
				json = json.replace("\"[", "[");
				json = json.replace("]\"", "]");
				json = json.replace("\n", "");

			}
			
			sc.log("XsdServlet - doPost - result: " + json);
			sc.log("XsdServlet - doPost - STOP");
			
			out.print(json);
		
		}catch (Exception e) {
			sc.log("XsdServlet - EXCEPTION: " + e.getMessage());
			out.print("{'exception':'" + e.getMessage() +"'}");
		}
		out.close();
	}

}

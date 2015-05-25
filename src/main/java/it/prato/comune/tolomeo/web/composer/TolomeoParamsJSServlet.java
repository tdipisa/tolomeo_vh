/**************************************************************
* Project:      TolomeoApplicationComposer - Compositore di layout per Tolomeo
* File:         ExportFileServlet.java
* Function:     Servlet per la richiesta della mappa tramite parametri Tolomeo
* Version:      1.0.0
***************************************************************/

package it.prato.comune.tolomeo.web.composer;

import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

/**
 * Implementazione metodi comuni a tutte le servlet di composer
 */
public class TolomeoParamsJSServlet extends TolomeoServlet {
    
    private static final long serialVersionUID = 1L;
      
    /**
     * Costruttore di defualt
     */
    public TolomeoParamsJSServlet() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	doPost(request, response);
    }

    /**
     * @param MapServerCGI - url al map server
     * @param MapRepository - percorso del repository
     * @param PresetXML - contenuto del preset
     * @param PresetName - nome del preset
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        SITLayersManager sitLayersManager = null;
        PrintWriter out = null;        
        LogInterface logger = null;
        
    	try {
    	    out = response.getWriter();
    	    
//	    	response.setContentType("text/html");
  	  	    response.setHeader("Access-Control-Allow-Origin", "*");
    		response.setHeader("Access-Control-Allow-Methods", "GET, POST");
	        logger = getLogger(request);
	        sitLayersManager = getTerritorio(logger);
//	        String map_server_CGI = null;
//			String map_repository = null;
	        String preset_XML = null;
			String preset_name = null;
			/*
			if (request.getParameter("MapServerCGI") != null) {
				map_server_CGI = request.getParameter("MapServerCGI");
			}
			if (request.getParameter("MapRepository") != null) {
				map_repository = request.getParameter("MapRepository");
			}
			*/
			if (request.getParameter("PresetXML") != null) {
				preset_XML = request.getParameter("PresetXML");
				TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();
				File presetDirectory = context.getPresetDirectory(); 
				if(presetDirectory != null) {
//				    logger.info("Preset directory = " + presetDirectory.getAbsolutePath());				    
				    preset_XML = Parametri.loadIncludeEProperties(preset_XML, presetDirectory);
				    
				}
				/*
				if ((map_server_CGI != null) && (map_repository != null)) {
					preset_XML = preset_XML.replaceAll("#P\\{mapserver.cgi\\}", map_server_CGI);
					preset_XML = preset_XML.replaceAll("#P\\{map.repository\\}", map_repository);
				}
				*/
			}
			if (request.getParameter("PresetName") != null) {
				preset_name = request.getParameter("PresetName");
			}
			if ((preset_XML != null) && (preset_name != null)) {
				Parametri params = Parametri.createParametriFromString(preset_XML, sitLayersManager);
				params.setNomePreset(preset_name);
				params = elaboraParametri(params, request, sitLayersManager, true);
				out.write(JSONObject.fromObject(params).toString());
			} else {
				out.write("Errore nella generazione del Preset");
			}
    	} catch (Exception exception) {
    		out.write(exception.getMessage());
    	} finally {
    	    
    	    if(sitLayersManager != null){
                try {
                    sitLayersManager.dispose();
                } catch (SITException e) {
                    logger.error("Impossibile fare il dispose del LayersManager", e);
                }
            }
    	    
    	    if(out != null){
    	        out.flush();
    	        out.close();
    	    }
    	    
    	}		
    }
    protected String getDefaultForward() {
        return null;
    } 

}
/**************************************************************
* Project:      TolomeoApplicationComposer - Compositore di layout per Tolomeo
* File:         ExportFileServlet.java
* Function:     Servlet per la richiesta dei codici TPN tramite oggetti Tolomeo
* Version:      1.0.0
***************************************************************/

package it.prato.comune.tolomeo.web.composer;

import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Implementazione metodi comuni a tutte le servlet di composer
 */
public class TolomeoTPNServlet extends TolomeoServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * Costruttore di defualt
     */
    public TolomeoTPNServlet() {
        super();
    }

	/**
	 * @param response - stringa json contenente un array di oggetti composti dagli attributi cod e text
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
        response.setContentType("text/html");
    	response.setHeader("Access-Control-Allow-Origin", "*");
    	response.setHeader("Access-Control-Allow-Methods", "GET, POST");
    	
    	SITLayersManager sitLayersManager = null;
    	PrintWriter out = null;
    	LogInterface logger = getLogger(request);
    	    	
    	try {
    	        	    
    	    out = response.getWriter();
    	    
    		// Recupero oggetto Territorio
    		sitLayersManager = getTerritorio(getLogger(request));
    		
    		//HashMap<Integer, LayerTerritorio> ll=comunePO.TipologieDivisioniTerritorio;
    		List<LayerTerritorio> layersOnConfig = new ArrayList<LayerTerritorio>(sitLayersManager.getAllLayers()); 
    		Collections.sort(layersOnConfig, new Comparator<LayerTerritorio>() {
                public int compare(LayerTerritorio l0, LayerTerritorio l1) {
                    return (l0.getNome() != null ? l0.getNome() : "").compareToIgnoreCase(l1.getNome() != null ? l1.getNome() : "");
                }
            });
    		
    		/*
    		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();
    		String filePath = context.getShapePath();
    		
    		File contextFile = new File(filePath);
    		URL path=(contextFile.toURI()).toURL();
    		InputStream is=path.openStream();
    		BufferedReader br=new BufferedReader(new InputStreamReader(is));
    		String i;
    		*/
    		
    		out.write("[");
    		
    		for (Iterator<LayerTerritorio> iterator = layersOnConfig.iterator(); iterator.hasNext();) {
                LayerTerritorio lay = (LayerTerritorio) iterator.next();                
                if (lay!=null){
                    out.write("{ cod : ");
                    out.write("'"+lay.getCodTPN()+"'");
                    out.write(",text: ");
                    out.write("'"+lay.getNome()+"'");
                    out.write(" }, ");
                }
            }
    		/*
    		while ( (i =  br.readLine()) != null){
    			if (i.indexOf('#') != 0){
    				int idx=i.indexOf("CODTPN=");
    				if (idx>=0){
    					String rst =i.substring(idx+7,i.length());
    					int tpn=Integer.valueOf(rst);
    					LayerTerritorio lay = sit.getLayerByCodTPN(tpn);
    					if (lay!=null){
    						out.write("{ cod : ");
    						out.write("'"+rst+"'");
    						out.write(",text: ");
    						out.write("'"+lay.getNome()+"'");
    						out.write(" }, ");
    					}
//    					else{
//    						out.write("{ cod : ");
//    						out.write("'"+rst+"'");
//    						out.write(",text : ");
//    						out.write( "'NON CARICATO'");
//    						out.write(" }, ");
//
//    					}
    				}
    			} 
    		}*/
    		out.write("]");
    		// is.close();
    		// out.close();
    	} catch(Exception ex) {
    		out.println("Error encountered while Search TPN CODE: " + ex.getMessage());
    	} finally{
    	    
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

	/**
	 * @param response - stringa json contenente un array di oggetti composti dagli attributi cod e text
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request,response);
	}
	 @Override
    protected String getDefaultForward() {
        return null;
    }    
	
}
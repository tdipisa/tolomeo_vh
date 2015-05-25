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
package it.prato.comune.tolomeo.servizi.gss;
 
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.asm.LayerUbicazioni;
import it.prato.comune.sit.asm.PoligonoZonaInterrog;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.ActionResponse;
import it.prato.comune.tolomeo.web.parametri.URLParameter;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;


public class CaricaDatiZonaInterrogazServlet extends TolomeoServlet {    

	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
       
        String idTPN = request.getParameter("IDTPN");
        String codTPN = request.getParameter("codTPN");
        String geoCoord = request.getParameter("geoCoord");
        String geoOp = request.getParameter("geoOp");

        LogInterface logger = getLogger(request);
        SITLayersManager comunePO = getTerritorio(logger);
        
        //Se sono presenti errori giro la richiesta alla pagina di errore
		if (StringUtils.isEmpty(codTPN)) {
			
			addMessaggio(request, Messaggio.ERRORE, "Chiave layer non valorizzata");
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
		} 
		PoligonoZonaInterrog zona = null;
		ArrayList<OggettoTerritorio>  ubiList = null;
		try {
			
			LayerTerritorio layer = comunePO.getLayerByCodTPN(Integer.parseInt(codTPN));
			zona = (PoligonoZonaInterrog) layer.cercaIDTPN(idTPN);
			
			LayerUbicazioni layUbi = LayerUbicazioni.getInstance(comunePO);
			
			ubiList = layUbi.chiInterseca(zona);
			
			request.setAttribute("ubiList", ubiList);
            
						
		} catch (NumberFormatException e) {

			String errMsg = "Si è verificata un'eccezione durante l'inserimento";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
		} catch (SITException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
		request.setAttribute("idTPN",idTPN); 
		request.setAttribute("codTPN",codTPN); 
		request.setAttribute("geoCoord",geoCoord); 
		request.setAttribute("geoOp",geoOp); 
        request.setAttribute("zona",zona); 
        
       // HashMap<String,String> parametri = new HashMap<String, String>();
        URLParameter[] parametri = new URLParameter[1];
        
        String ubiListParam = "";
        boolean bflag = true;
        for (OggettoTerritorio og: ubiList) {
            if (!bflag) {
                ubiListParam += ",";
            } else {
                bflag=false;
            }
            
            ubiListParam += og.getIDTPN();
        }
        
        parametri[0] = new URLParameter("ubiList", ubiListParam);
        
        ActionResponse ar = new ActionResponse();
        ar.getNextAction().setParameters(parametri);
        ar.getNextAction().setRedirectUrl("http://www.comune.prato.it");
        JSONObject arJSON = JSONObject.fromObject(ar);
        
        request.setAttribute("nextActionBean", arJSON.toString());
        
        logger.debug(getCommand(request));
        logger.debug(getForward(request));
        forward(request,response);      
		
	}

	@Override
	protected String getDefaultForward() {
	    return "/jsp/servizi/gss/redirectZoneInterrogazInfo.jsp";
        //return "/jsp/servizi/gss/inserisciZonaInterrog.jsp";
	}
}

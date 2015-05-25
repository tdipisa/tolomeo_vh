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
package it.prato.comune.tolomeo.servizi.procivPianoNeve.anno2013;

import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerFasiLineari;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerFasiPoligonali;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerFasiPuntuali;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerLivello3FaseD;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LineaFasiLineari;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PoligonoFasiPoligonali;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PuntoFasiPuntuali;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PuntoLivello3FaseD;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

/**
 * Servlet che restituisce alla JSP la lista di punti, linee o poligoni da mostrare nella fase specifica
 * 
 * @author Mattia Gennari
 *
 */
public class VisualizzaOggettoServlet extends TolomeoServlet {    

	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
		doPost(request,response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {

		LogInterface logger = getLogger(request);
		SITLayersManager comunePO = getTerritorio(logger);

//		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();
//		Connection conn = null;

		int    idLivello = Integer.parseInt(request.getParameter("idLivello"));
		String idFase    = (String) request.getParameter("idFase");
		String key       = getKey(request);
//        Integer codTPN   = getCodTPN(request);
		
        //int idSquadra    = (StringUtils.isEmpty(request.getParameter("idSquadra"))) ? 0 : Integer.parseInt(request.getParameter("idSquadra"));

		LayerFasiLineari    liv1FaseA0     = null;
		LayerFasiLineari    liv1FaseA1     = null;
		LayerFasiLineari    liv1FaseBLinee = null;
		LayerFasiPuntuali   liv1FaseBPunti = null;
		LayerFasiLineari    liv1FaseC      = null;
		LayerFasiPuntuali   liv2           = null;
		LayerFasiLineari    liv3FaseA      = null;
		LayerFasiLineari    liv3FaseB      = null;
		LayerFasiLineari    liv3FaseAB     = null;
		LayerFasiPoligonali liv3FaseC      = null;
		LayerLivello3FaseD  liv3FaseD      = null;
//		LayerLivello4       liv4           = null;

		//Filtro filtro;

		PuntoFasiPuntuali      punto               = null;
		LineaFasiLineari       linea               = null;
		PoligonoFasiPoligonali poligono            = null;
//		LineaLivello4          lineaLivello4       = null;
		PuntoLivello3FaseD     puntoLivello3FaseD  = null;

		try {

			//conn = context.getConnection("pg_sit", logger);

			if (idLivello==0 || StringUtils.isNotEmpty(idFase)) {

				//livello 1 (con 4 fasi)
				if (idLivello == 1) {

					//livello 1 fase A0
					if (StringUtils.equalsIgnoreCase(idFase, "A0")) {

						liv1FaseA0 = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello1FaseA0);

						linea = (LineaFasiLineari) liv1FaseA0.cercaIDTPN(key);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv1FaseA0",liv1FaseA0);
						request.setAttribute("linea",linea);
						setAfterForward(request, false, linea.getJSGeometry());
						forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoLineare.jsp",request,response);

					//livello 1 fase A1
					} else if (StringUtils.equalsIgnoreCase(idFase, "A1")) {

						liv1FaseA1 = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello1FaseA1);

						linea = (LineaFasiLineari) liv1FaseA1.cercaIDTPN(key);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv1FaseA1",liv1FaseA1);
						request.setAttribute("linea",linea);
						setAfterForward(request, false, linea.getJSGeometry());
						forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoLineare.jsp",request,response);

					//livello 1 fase B
					} else if (StringUtils.equalsIgnoreCase(idFase, "B")) {

						//...questa fase ha una parte puntuale ed un'altra lineare

						int tipoGeom = Integer.parseInt(request.getParameter("tipoGeom"));
						
						if (tipoGeom==1) {
						
							//layer puntuale
							liv1FaseBPunti = LayerFasiPuntuali.getInstance(comunePO, LayerFasiPuntuali.SottoTipo.Livello1FaseBPunti);
	
							punto = (PuntoFasiPuntuali) liv1FaseBPunti.cercaIDTPN(key);
	
							request.setAttribute("idLivello", idLivello);
							request.setAttribute("idFase", idFase);
							request.setAttribute("liv1FaseBPunti",liv1FaseBPunti);
							request.setAttribute("punto",punto);
							setAfterForward(request, false, punto.getJSGeometry());
							forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoPuntuale.jsp",request,response);
							
						} else if(tipoGeom==2) {
							
							//layer lineare
							liv1FaseBLinee = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello1FaseBLinee);
	
							linea = (LineaFasiLineari) liv1FaseBLinee.cercaIDTPN(key);
	
							request.setAttribute("idLivello", idLivello);
							request.setAttribute("idFase", idFase);
							request.setAttribute("liv1FaseBLinee",liv1FaseBLinee);
							request.setAttribute("linea",linea);
							setAfterForward(request, false, linea.getJSGeometry());
							forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoLineare.jsp",request,response);
						}

					//livello 1 fase C
					} else if (StringUtils.equalsIgnoreCase(idFase, "C")) {

						liv1FaseC = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello1FaseC);

						linea = (LineaFasiLineari) liv1FaseC.cercaIDTPN(key);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv1FaseC",liv1FaseC);
						request.setAttribute("linea",linea);
						setAfterForward(request, false, linea.getJSGeometry());
						forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoLineare.jsp",request,response);

					}

				//livello 2 (una sola fase)
				} else if (idLivello == 2) {

					liv2 = LayerFasiPuntuali.getInstance(comunePO, LayerFasiPuntuali.SottoTipo.Livello2);

					punto = (PuntoFasiPuntuali) liv2.cercaIDTPN(key);

					request.setAttribute("idLivello", idLivello);
					request.setAttribute("idFase", idFase);
					request.setAttribute("liv2",liv2);
					request.setAttribute("punto",punto);
					setAfterForward(request, false, punto.getJSGeometry());
					forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoPuntuale.jsp",request,response);

				//livello 3 (con 5 fasi)
				} else if (idLivello == 3) {

					//livello 3 fase A
					if (StringUtils.equalsIgnoreCase(idFase, "A")) {

						liv3FaseA = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello3FaseA);

						linea = (LineaFasiLineari) liv3FaseA.cercaIDTPN(key);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv3FaseA",liv3FaseA);
						request.setAttribute("linea",linea);
						setAfterForward(request, false, linea.getJSGeometry());
						forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoLineare.jsp",request,response);

					//livello 3 fase B
					} else if (StringUtils.equalsIgnoreCase(idFase, "B")) {

						liv3FaseB = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello3FaseB);

						linea = (LineaFasiLineari) liv3FaseB.cercaIDTPN(key);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv3FaseB",liv3FaseB);
						request.setAttribute("linea",linea);
						setAfterForward(request, false, linea.getJSGeometry());
						forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoLineare.jsp",request,response);

					//livello 3 fase A-B
					} else if (StringUtils.equalsIgnoreCase(idFase, "AB")) {

						liv3FaseAB = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello3FaseAB);

						linea = (LineaFasiLineari) liv3FaseAB.cercaIDTPN(key);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv3FaseAB",liv3FaseAB);
						request.setAttribute("linea",linea);
						setAfterForward(request, false, linea.getJSGeometry());
						forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoLineare.jsp",request,response);

					//livello 3 fase C
					} else if (StringUtils.equalsIgnoreCase(idFase, "C")) {

						liv3FaseC = LayerFasiPoligonali.getInstance(comunePO);

						poligono = (PoligonoFasiPoligonali) liv3FaseC.cercaIDTPN(key);
						
						logger.debug("Oggetto recuperato: " + poligono.getDescrizione());

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv3FaseC",liv3FaseC);
						request.setAttribute("poligono",poligono);
						setAfterForward(request, false, poligono.getJSGeometry());
						forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoPoligonale.jsp",request,response);

					//livello 3 fase D
					} else if (StringUtils.equalsIgnoreCase(idFase, "D")) {

						liv3FaseD = LayerLivello3FaseD.getInstance(comunePO);

						puntoLivello3FaseD = (PuntoLivello3FaseD) liv3FaseD.cercaIDTPN(key);
							
						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv3FaseD",liv3FaseD);
						request.setAttribute("puntoLivello3FaseD", puntoLivello3FaseD);
						setAfterForward(request, false, puntoLivello3FaseD.getJSGeometry());
						forward("/jsp/servizi/procivPianoNeve/anno2013/visualizzaOggettoPuntuale.jsp",request,response);
					}

				//livello 4 (una sola fase)
				} else if (idLivello == 4) {

//					liv4 = LayerLivello4.getInstance(comunePO);

					//TODO
				}

			} else {

				String errMsg = "E' necessario passare il numero del livello e l'identificativo della fase!";
				addMessaggio(request, Messaggio.ERRORE, errMsg);
				forward(super.ERROR_PAGE, request, response);
				return;
			}


		} catch (Exception e) {
			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(super.ERROR_PAGE, request, response);
			return;
		}

	}

	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiLineariFase.jsp";
	}
}
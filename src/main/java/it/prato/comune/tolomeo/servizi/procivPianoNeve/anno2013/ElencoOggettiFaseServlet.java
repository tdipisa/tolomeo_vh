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

import it.prato.comune.sit.Filtro;
import it.prato.comune.sit.JSGeometry;
import it.prato.comune.sit.LayerConfineComunale;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.PoligonoConfineComunale;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.plugin.comunePO.beans.pianoNeve.anno2013.SquadraBean;
import it.prato.comune.sit.plugin.comunePO.dao.pianoNeve.anno2013.SquadreDAO;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.PuntoPuntiSensibili;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerFasiLineari;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerFasiPoligonali;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerFasiPuntuali;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerLivello3FaseD;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerLivello4;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LineaFasiLineari;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LineaLivello4;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PoligonoFasiPoligonali;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PuntoFasiPuntuali;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PuntoLivello3FaseD;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

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
public class ElencoOggettiFaseServlet extends TolomeoServlet {    

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

		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();
		Connection conn = null;

		int    idLivello = Integer.parseInt(request.getParameter("idLivello"));
		String idFase    = (String) request.getParameter("idFase");
		int idSquadra    = (StringUtils.isEmpty(request.getParameter("idSquadra"))) ? 0 : Integer.parseInt(request.getParameter("idSquadra"));

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
		LayerLivello4       liv4           = null;

		Filtro filtro;

		List<PuntoFasiPuntuali>      listaPunti               = null;
		List<LineaFasiLineari>       listaLinee               = null;
		List<PoligonoFasiPoligonali> listaPoligoni            = null;
		List<LineaLivello4>          listaLineeLivello4       = null;
		List<PuntoLivello3FaseD>     listaPuntiLivello3FaseD  = null;

		try {

			conn = context.getConnection("pg_sit", logger);

			if (idLivello==0 || StringUtils.isNotEmpty(idFase)) {

				//livello 1 (con 4 fasi)
				if (idLivello == 1) {

					//livello 1 fase A0
					if (StringUtils.equalsIgnoreCase(idFase, "A0")) {

						liv1FaseA0 = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello1FaseA0);

						filtro = liv1FaseA0.getFiltroVuoto();
						liv1FaseA0.setFiltro(filtro);
						listaLinee = liv1FaseA0.cercaFiltro();

						liv1FaseA0.ordinaByIdOggetto(listaLinee);
						
						//calcolo ingombro per zoom
						List<LineaFasiLineari> listaBB = new ArrayList<LineaFasiLineari>();
						LineaFasiLineari oTmp = (LineaFasiLineari) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, listaLinee.get(0).getJSGeometry(), logger);
						listaBB.add(oTmp);
						listaBB.addAll(listaLinee);
						OggettoTerritorio ingombro = OggettoTerritorio.getUnione(listaBB);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv1FaseA0",liv1FaseA0);
						request.setAttribute("listaLinee",listaLinee);
						setAfterForward(request, false, ingombro.getJSGeometry());
						addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, clica per selezionarlo e vederne il dettaglio");
						forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiLineariFase.jsp",request,response);

					//livello 1 fase A1
					} else if (StringUtils.equalsIgnoreCase(idFase, "A1")) {

						liv1FaseA1 = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello1FaseA1);

						filtro = liv1FaseA1.getFiltroVuoto();
						liv1FaseA1.setFiltro(filtro);
						listaLinee = liv1FaseA1.cercaFiltro();

						liv1FaseA1.ordinaByIdOggetto(listaLinee);
						
						//calcolo ingombro per zoom
						List<LineaFasiLineari> listaBB = new ArrayList<LineaFasiLineari>();
						LineaFasiLineari oTmp = (LineaFasiLineari) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, listaLinee.get(0).getJSGeometry(), logger);
						listaBB.add(oTmp);
						listaBB.addAll(listaLinee);
						OggettoTerritorio ingombro = OggettoTerritorio.getUnione(listaBB);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv1FaseA1",liv1FaseA1);
						request.setAttribute("listaLinee",listaLinee);
						setAfterForward(request, false, ingombro.getJSGeometry());
						addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
						forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiLineariFase.jsp",request,response);

					//livello 1 fase B
					} else if (StringUtils.equalsIgnoreCase(idFase, "B")) {

						//...questa fase ha una parte puntuale ed un'altra lineare

						//layer puntuale
						liv1FaseBPunti = LayerFasiPuntuali.getInstance(comunePO, LayerFasiPuntuali.SottoTipo.Livello1FaseBPunti);

						filtro = liv1FaseBPunti.getFiltroVuoto();
						liv1FaseBPunti.setFiltro(filtro);
						listaPunti = liv1FaseBPunti.cercaFiltro();

						liv1FaseBPunti.ordinaByPriorita(listaPunti);

						//layer lineare
						liv1FaseBLinee = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello1FaseBLinee);

						filtro = liv1FaseBLinee.getFiltroVuoto();
						liv1FaseBLinee.setFiltro(filtro);
						listaLinee = liv1FaseBLinee.cercaFiltro();

						liv1FaseBLinee.ordinaByIdOggetto(listaLinee);
						
						//calcolo ingombro per zoom (tutta Prato)
						LayerConfineComunale layerConfineComunale = LayerConfineComunale.getInstance(comunePO);
						filtro = layerConfineComunale.getFiltroVuoto();
						layerConfineComunale.setFiltro(filtro);
						List<PoligonoConfineComunale> lista = layerConfineComunale.cercaFiltro();
						OggettoTerritorio ingombro = lista.get(0);
						
						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv1FaseBPunti",liv1FaseBPunti);
						request.setAttribute("liv1FaseBLinee",liv1FaseBLinee);
						request.setAttribute("listaPunti",listaPunti);
						request.setAttribute("listaLinee",listaLinee);
						setAfterForward(request, false, ingombro.getJSGeometry());
						addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
						forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiMistiFase.jsp",request,response);

					//livello 1 fase C
					} else if (StringUtils.equalsIgnoreCase(idFase, "C")) {

						liv1FaseC = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello1FaseC);

						filtro = liv1FaseC.getFiltroVuoto();
						liv1FaseC.setFiltro(filtro);
						listaLinee = liv1FaseC.cercaFiltro();

						liv1FaseC.ordinaByIdOggetto(listaLinee);
						
						//calcolo ingombro per zoom
						List<LineaFasiLineari> listaBB = new ArrayList<LineaFasiLineari>();
						LineaFasiLineari oTmp = (LineaFasiLineari) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, listaLinee.get(0).getJSGeometry(), logger);
						listaBB.add(oTmp);
						listaBB.addAll(listaLinee);
						OggettoTerritorio ingombro = OggettoTerritorio.getUnione(listaBB);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv1FaseC",liv1FaseC);
						request.setAttribute("listaLinee",listaLinee);
						setAfterForward(request, false, ingombro.getJSGeometry());
						addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
						request.setAttribute("listaItinerari",listaLinee);
						forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiLineariFase.jsp",request,response);

					}

				//livello 2 (una sola fase)
				} else if (idLivello == 2) {

					liv2 = LayerFasiPuntuali.getInstance(comunePO, LayerFasiPuntuali.SottoTipo.Livello2);

					filtro = liv2.getFiltroVuoto();
					liv2.setFiltro(filtro);
					listaPunti = liv2.cercaFiltro();

					liv2.ordinaByIdOggetto(listaPunti);
					
					//calcolo ingombro per zoom
					List<PuntoFasiPuntuali> listaBB = new ArrayList<PuntoFasiPuntuali>();
					PuntoFasiPuntuali oTmp = (PuntoFasiPuntuali) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, listaPunti.get(0).getJSGeometry(), logger);
					listaBB.add(oTmp);
					listaBB.addAll(listaPunti);
					OggettoTerritorio ingombro = OggettoTerritorio.getUnione(listaBB);

					request.setAttribute("idLivello", idLivello);
					request.setAttribute("idFase", idFase);
					request.setAttribute("liv2",liv2);
					request.setAttribute("listaPunti",listaPunti);
					setAfterForward(request, false, ingombro.getJSGeometry());
					addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
					forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiPuntualiFase.jsp",request,response);

				//livello 3 (con 5 fasi)
				} else if (idLivello == 3) {

					//livello 3 fase A
					if (StringUtils.equalsIgnoreCase(idFase, "A")) {

						liv3FaseA = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello3FaseA);

						logger.debug("Livello recuperato: " + liv3FaseA.getCodTPN() + " " + liv3FaseA.getNome());

						filtro = liv3FaseA.getFiltroVuoto();
						liv3FaseA.setFiltro(filtro);
						listaLinee = liv3FaseA.cercaFiltro();

						liv3FaseA.ordinaByIdOggetto(listaLinee);
						
						//calcolo ingombro per zoom
						List<LineaFasiLineari> listaBB = new ArrayList<LineaFasiLineari>();
						LineaFasiLineari oTmp = (LineaFasiLineari) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, listaLinee.get(0).getJSGeometry(), logger);
						listaBB.add(oTmp);
						listaBB.addAll(listaLinee);
						OggettoTerritorio ingombro = OggettoTerritorio.getUnione(listaBB);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv3FaseA", liv3FaseA);
						request.setAttribute("listaLinee", listaLinee);
						setAfterForward(request, false, ingombro.getJSGeometry());
						addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
						forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiLineariFase.jsp",request,response);

					//livello 3 fase B
					} else if (StringUtils.equalsIgnoreCase(idFase, "B")) {

						liv3FaseB = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello3FaseB);

						logger.debug("Livello recuperato: " + liv3FaseB.getCodTPN() + " " + liv3FaseB.getNome());

						filtro = liv3FaseB.getFiltroVuoto();
						liv3FaseB.setFiltro(filtro);
						listaLinee = liv3FaseB.cercaFiltro();

						liv3FaseB.ordinaByIdOggetto(listaLinee);
						
						//calcolo ingombro per zoom
						List<LineaFasiLineari> listaBB = new ArrayList<LineaFasiLineari>();
						LineaFasiLineari oTmp = (LineaFasiLineari) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, listaLinee.get(0).getJSGeometry(), logger);
						listaBB.add(oTmp);
						listaBB.addAll(listaLinee);
						OggettoTerritorio ingombro = OggettoTerritorio.getUnione(listaBB);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv3FaseB", liv3FaseB);
						request.setAttribute("listaLinee", listaLinee);
						setAfterForward(request, false, ingombro.getJSGeometry());
						addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
						forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiLineariFase.jsp",request,response);

					//livello 3 fase A-B
					} else if (StringUtils.equalsIgnoreCase(idFase, "AB")) {

						liv3FaseAB = LayerFasiLineari.getInstance(comunePO, LayerFasiLineari.SottoTipo.Livello3FaseAB);

						logger.debug("Livello recuperato: " + liv3FaseAB.getCodTPN() + " " + liv3FaseAB.getNome());

						filtro = liv3FaseAB.getFiltroVuoto();
						liv3FaseAB.setFiltro(filtro);
						listaLinee = liv3FaseAB.cercaFiltro();

						liv3FaseAB.ordinaByIdOggetto(listaLinee);
						
						//calcolo ingombro per zoom
						List<LineaFasiLineari> listaBB = new ArrayList<LineaFasiLineari>();
						LineaFasiLineari oTmp = (LineaFasiLineari) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, listaLinee.get(0).getJSGeometry(), logger);
						listaBB.add(oTmp);
						listaBB.addAll(listaLinee);
						OggettoTerritorio ingombro = OggettoTerritorio.getUnione(listaBB);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv3FaseAB", liv3FaseAB);
						request.setAttribute("listaLinee", listaLinee);
						setAfterForward(request, false, ingombro.getJSGeometry());
						addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
						forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiLineariFase.jsp",request,response);

					//livello 3 fase C
					} else if (StringUtils.equalsIgnoreCase(idFase, "C")) {

						liv3FaseC = LayerFasiPoligonali.getInstance(comunePO);

						logger.debug("Livello recuperato: " + liv3FaseC.getCodTPN() + " " + liv3FaseC.getNome());

						filtro = liv3FaseC.getFiltroVuoto();
						liv3FaseC.setFiltro(filtro);
						listaPoligoni = liv3FaseC.cercaFiltro();

						liv3FaseC.ordinaByIdOggetto(listaPoligoni);
						
						//calcolo ingombro per zoom
						List<PoligonoFasiPoligonali> listaBB = new ArrayList<PoligonoFasiPoligonali>();
						PoligonoFasiPoligonali oTmp = (PoligonoFasiPoligonali) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, listaPoligoni.get(0).getJSGeometry(), logger);
						listaBB.add(oTmp);
						listaBB.addAll(listaPoligoni);
						OggettoTerritorio ingombro = OggettoTerritorio.getUnione(listaBB);

						request.setAttribute("idLivello", idLivello);
						request.setAttribute("idFase", idFase);
						request.setAttribute("liv3FaseC", liv3FaseC);
						request.setAttribute("listaPoligoni", listaPoligoni);
						setAfterForward(request, false, ingombro.getJSGeometry());
						addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
						forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiPoligonaliFase.jsp",request,response);

					//livello 3 fase D
					} else if (StringUtils.equalsIgnoreCase(idFase, "D")) {

						liv3FaseD = LayerLivello3FaseD.getInstance(comunePO);

						//per questa fase occorre un passaggio intermedio, cioè la visualizzazione delle squadre...

						if (idSquadra==0) {
							
							//TODO
							SquadreDAO squadreDAO = new SquadreDAO(logger);
							List<SquadraBean> listaSquadreSql = squadreDAO.getSquadre(conn);
	
							//List<Squadra> listaSquadre = new ArrayList<Squadra>();
	
							List<PuntoLivello3FaseD> listaSquadre = new ArrayList<PuntoLivello3FaseD>();
	
	//						for (int i=1; i<16; i++) {
	//							PuntoLivello3FaseD tutte = (PuntoLivello3FaseD) OggettoTerritorio.getUnione(liv3FaseD.cercaPuntiBySquadra(i));
	//							listaSquadre.add(i, tutte);
	//						};
	
							for (SquadraBean squadra: listaSquadreSql) {
	
								//...calcolo ingombro per squadra 
								PuntoLivello3FaseD tutte = (PuntoLivello3FaseD) OggettoTerritorio.getUnione(liv3FaseD.cercaPuntiBySquadra(squadra.getId().intValue()));
								listaSquadre.add(tutte);
							}
							
							request.setAttribute("idLivello", idLivello);
							request.setAttribute("idFase", idFase);
							request.setAttribute("listaSquadre", listaSquadre);
							addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati col mouse sul nome della squadra per evidenziarla sulla mappa, clicca per vedere l'elenco dei punti della squadra");
							forward("/jsp/servizi/procivPianoNeve/anno2013/elencoSquadre.jsp", request, response);
							
						} else {
							
							listaPuntiLivello3FaseD = liv3FaseD.cercaPuntiBySquadra(idSquadra);

							liv3FaseD.ordinaByPriorita(listaPuntiLivello3FaseD);
							
							PuntoLivello3FaseD pTmp = (PuntoLivello3FaseD) liv3FaseD.cercaIDTPN(listaPuntiLivello3FaseD.get(0).getIDTPN());
			        		List<PuntoLivello3FaseD> listaPerIngombro = new ArrayList<PuntoLivello3FaseD>();
			        		listaPerIngombro.add(pTmp);
			        		listaPerIngombro.addAll(listaPuntiLivello3FaseD);
			        		OggettoTerritorio tutte = OggettoTerritorio.getUnione(listaPerIngombro);

							request.setAttribute("idLivello", idLivello);
							request.setAttribute("idFase", idFase);
							request.setAttribute("liv3FaseD", liv3FaseD);
							request.setAttribute("listaPuntiLivello3FaseD", listaPuntiLivello3FaseD);
							setAfterForward(request, false, tutte.getJSGeometry());
							addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati col mouse sulla riga del punto per evidenziare la sua posizione, clicca per selezionarlo e vederne il dettaglio");
							forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiPuntualiFase.jsp",request,response);
							
						}
					}

					//livello 4 (una sola fase)
				} else if (idLivello == 4) {

					liv4 = LayerLivello4.getInstance(comunePO);

					filtro = liv4.getFiltroVuoto();
					liv4.setFiltro(filtro);
					listaLineeLivello4 = liv4.cercaFiltro();

					liv4.ordinaByIdOggetto(listaLineeLivello4);

					request.setAttribute("idLivello", idLivello);
					request.setAttribute("idFase", idFase);
					request.setAttribute("liv4", liv4);
					request.setAttribute("listaLineeLivello4", listaLineeLivello4);
					addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
					forward("/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiPuntualiFase.jsp",request,response);
				}

			} else {

				String errMsg = "E' necessario passare il numero del livello e l'identificativo della fase!";
				addMessaggio(request, Messaggio.ERRORE, errMsg);
				forward(super.ERROR_PAGE, request, response);
				return;
			}


		} catch (SITException e) {
			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(super.ERROR_PAGE, request, response);
			return;
		} catch (SQLException e) {
			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(super.ERROR_PAGE, request, response);
			return;
		} catch (BasicException e) {
			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(super.ERROR_PAGE, request, response);
			return;
		} finally {
			if (context != null) context.closeConnection(conn, logger);
		}

	}

	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/procivPianoNeve/anno2013/elencoOggettiLineariFase.jsp";
	}
}
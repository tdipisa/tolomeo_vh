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
package it.prato.comune.tolomeo.servizi.telefoniaMobile.model;

import it.prato.comune.sit.LayerAnagrafe;
import it.prato.comune.sit.LayerCatasto;
import it.prato.comune.sit.LayerCircoscrizioni;
import it.prato.comune.sit.LayerRuWeb;
import it.prato.comune.sit.LayerTelefoniaMobile;
import it.prato.comune.sit.LayerVincoli;
import it.prato.comune.sit.PoligonoCatasto;
import it.prato.comune.sit.PoligonoCircoscrizione;
import it.prato.comune.sit.PuntoAnagrafe;
import it.prato.comune.sit.PuntoTelefoniaMobile;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.beans.telefoniaMobile.AntennaBean;
import it.prato.comune.sit.dao.telefoniaMobile.AntennaDAO;
import it.prato.comune.sit.plugin.comunePO.prociv.LayerPericolositaIdraulica;
import it.prato.comune.sit.plugin.comunePO.prociv.PoligonoPericolositaIdraulica;
import it.prato.comune.tolomeo.model.TolomeoService;
import it.prato.comune.tolomeo.servizi.shared.model.IntersectRuWebService;
import it.prato.comune.tolomeo.servizi.shared.model.IntersectVincoliService;
import it.prato.comune.tolomeo.servizi.telefoniaMobile.beans.StatisticaImpianto;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

public class TelefoniaMobileService extends TolomeoService {
	
	public TelefoniaMobileService(LogInterface logger, LayerTelefoniaMobile impianti) {
		super(logger, impianti);
	}
	
	/**
	 * Metodo che estrae la statistica relativa ad un impianto, nello specifico:
	 * <ul>
	 * 	<li>Circoscrizione sulla quale è collocato</li>
	 * 	<li>Cordinate catastali</li>
	 * 	<li>Vincoli</li>
	 * 	<li>ZO, SUB, DU, TI e PS del Regolamento Urbanistico</li>
	 * 	<li>Nel raggio di 50, 100 e 250 m dal punto:</li>
	 * 	<ul>
	 * 		<li>Numero di residenti</li>
	 * 		<li>Destinazioni d'uso dell'R.U. se è di tipo: Sa, Sb, Sh, Si, Sr e Su</li>
	 * 		<li>Ulteriori impianti presenti nel territorio</li>
	 * </ul>
	 * 
	 * @param impianto <code>PuntoTelefoniaMobile</code>
	 * @return il bean <code>StatisticaImpianto</code>
	 * @throws SITException
	 * @throws IOException
	 */
	public StatisticaImpianto getStatisticaImpianto(PuntoTelefoniaMobile impianto)
		throws SITException, IOException {
		
		LayerTelefoniaMobile layerTelefoniaMobile = getLayer();
		
		SITLayersManager comunePO = getTerritorio(logger);
		LayerCircoscrizioni layerCircoscrizioni = LayerCircoscrizioni.getInstance(comunePO);
		LayerCatasto layerCatasto             = LayerCatasto.getInstance(comunePO);
		LayerPericolositaIdraulica layerPI3 = LayerPericolositaIdraulica.getInstance(comunePO, LayerPericolositaIdraulica.SottoTipo.PI3);
		LayerPericolositaIdraulica layerPI4 = LayerPericolositaIdraulica.getInstance(comunePO, LayerPericolositaIdraulica.SottoTipo.PI4);
		LayerRuWeb layerRuWeb                 = LayerRuWeb.getInstance(comunePO);
		LayerVincoli layerVincoli             = LayerVincoli.getInstance(comunePO);
		LayerAnagrafe layerAnagrafe           = LayerAnagrafe.getInstance(comunePO);
		
		List<PoligonoCircoscrizione> intersectCircoscrizioni = new ArrayList<PoligonoCircoscrizione>();
		List<PoligonoCatasto> intersectCatasto = new ArrayList<PoligonoCatasto>();
		List<PoligonoPericolositaIdraulica> intersectPericolositaIdraulica = new ArrayList<PoligonoPericolositaIdraulica>();
		List<PuntoTelefoniaMobile> intersectTelefoniaMobile = new ArrayList<PuntoTelefoniaMobile>();
		
		StatisticaImpianto statistica = new StatisticaImpianto();
		int [] raggi = {50, 100, 250};
		
		intersectCircoscrizioni = layerCircoscrizioni.chiInterseca(impianto);
		intersectCatasto = layerCatasto.chiInterseca(impianto);
		intersectPericolositaIdraulica = layerPI4.chiInterseca(impianto);

		statistica.setX((int)impianto.getCentroide().getX());
		statistica.setY((int)impianto.getCentroide().getY());
		statistica.setCircoscrizione(intersectCircoscrizioni.get(0).getCircoscrizione());
		statistica.setFoglio(intersectCatasto.get(0).getFoglio());
		statistica.setParticella(intersectCatasto.get(0).getParticella());
		List<String> pericolosita = new ArrayList<String>();
		for (int i=0; i<intersectPericolositaIdraulica.size(); i++) {
			if (intersectPericolositaIdraulica.get(i).getDescrizione().equalsIgnoreCase("PI3") || intersectPericolositaIdraulica.get(i).getDescrizione().equalsIgnoreCase("PI4"))
				pericolosita.add(intersectPericolositaIdraulica.get(i).getDescrizione());
		}
		statistica.setPericolositaIdraulica(pericolosita);
		//impianto di prossimità: codice e distanza
		ArrayList distanze = new ArrayList();
		ArrayList impVic = layerTelefoniaMobile.chiPiuVicino(impianto, distanze);
		if (impVic!= null && impVic.size()>0) {
			for (int i=0; i<impVic.size(); i++) {
				PuntoTelefoniaMobile impProssimo = (PuntoTelefoniaMobile) impVic.get(i);
				if (!impProssimo.getIDTPN().equals(impianto.getIDTPN())) {
					String codImpPross = impProssimo.getCodImpianto();
					int distImpPross = ((Double) distanze.get(i)).intValue();
					
					statistica.setImpiantoProssimo(codImpPross + " a metri " + distImpPross);
					break;
				}
			}
		}

		ArrayList<PuntoAnagrafe> puntiTrovati = new ArrayList<PuntoAnagrafe>();
		//estraggo numero residenti nei raggi 50, 100 e 250 metri
		for (int i=0; i<raggi.length; i++) {
			logger.debug("raggio       : " + raggi[i]);
			logger.debug("layerAnagrafe: " + layerAnagrafe.getNome());
			puntiTrovati = layerAnagrafe.chiInterseca(impianto, raggi[i]);
			int res = puntiTrovati.size();
			logger.debug("risultati    :" + res); 

			statistica.getStatisticaRaggio(raggi[i]).setNumResidenti(res);
		}
		
		//estraggo dal service Vincoli l'intersezione con l'impianto
		IntersectVincoliService serviceVincoli = new IntersectVincoliService(logger, layer);
		statistica.setVincoli(serviceVincoli.getIntersectVincoliDescrizione(layerVincoli, impianto));
		
		//estraggo dal service RuWeb l'intersezione con l'impianto
		IntersectRuWebService serviceRuWeb = new IntersectRuWebService(logger, layerRuWeb);
		statistica.setZonaOmogenea(serviceRuWeb.getIntersectZO(impianto));
		statistica.setSubSistema(serviceRuWeb.getIntersectSUB(impianto));
		statistica.setDestinazioneUso(serviceRuWeb.getIntersectDU(impianto));
		statistica.setTipoIntervento(serviceRuWeb.getIntersectTI(impianto));
		statistica.setProgettoSuolo(serviceRuWeb.getIntersectPS(impianto));
		
		//estraggo DU e altri impianti di telefonia nei raggi 50, 100 e 250 metri
		for (int i=0; i<raggi.length; i++) {
			statistica.getStatisticaRaggio(raggi[i]).setDU(getDUSpecifiche(serviceRuWeb.getIntersectDURange(impianto, raggi[i])));
			//mi assicuro che l'impianto selezionato non venga incluso anch'esso tra gli impianti nel raggio specifico
			intersectTelefoniaMobile = layerTelefoniaMobile.chiNelRaggioDi(impianto, raggi[i]);
			for (int j=0; j<intersectTelefoniaMobile.size(); j++) {
				if (impianto.getIDTPN().equalsIgnoreCase((intersectTelefoniaMobile.get(j).getIDTPN())) )
					intersectTelefoniaMobile.remove(j);
			}
			statistica.getStatisticaRaggio(raggi[i]).setAltriImpianti(intersectTelefoniaMobile);
		}
		
		return statistica;
	}
	
	/**
	 * Metodo che estrae le destinazioni d'uso specifiche per la Telefonia Mobile: Sa, Sb, Sh, Si, Sr e Su. 
	 * 
	 * @param DU
	 * @return
	 */
	private List<String> getDUSpecifiche(List<String> DU) {
		
		List<String> DUSpecifiche = new ArrayList<String>();
		
		for (int i=0; i<DU.size(); i++) {
			if (StringUtils.containsIgnoreCase(DU.get(i), "sa") || 
				StringUtils.containsIgnoreCase(DU.get(i), "sb") ||
				StringUtils.containsIgnoreCase(DU.get(i), "sh") ||
				StringUtils.containsIgnoreCase(DU.get(i), "si") ||
				StringUtils.containsIgnoreCase(DU.get(i), "sr") ||
				StringUtils.containsIgnoreCase(DU.get(i), "su")) 
			{
				DUSpecifiche.add(DU.get(i));
			}
		}
		
		return DUSpecifiche;
	}
	
	private LayerTelefoniaMobile getLayer(){
        return (LayerTelefoniaMobile)this.layer;
    }
	
	/**
	 * Metodo che inserisce in transazione un impianto di telefonia mobile e gli eventuali gestori associati.
	 * 
	 * @param impianti
	 * @param impianto
	 * @param codGestori
	 * @throws IOException
	 * @throws SITException
	 * @throws SQLException
	 */
	public void insertTelefoniaMobile(LayerTelefoniaMobile impianti, PuntoTelefoniaMobile impianto, int [] codGestori) throws IOException, SITException, SQLException {
		
		//inserisco l'oggetto nel layer specifico
		impianti.appendFeature(impianto, transaction);
		
		//inserisco i gestori associati all'impianto
		if (codGestori != null) {
			AntennaBean antennaBean = new AntennaBean();
			antennaBean.setIdGestori(codGestori);
			antennaBean.setIdImpianto(Long.parseLong(impianto.getIDTPN()));
			
			AntennaDAO antennaDAO = new AntennaDAO(logger);
			antennaDAO.insertAntenna(antennaBean, conn);
		}
	}
	
	/**
	 * Metodo che modifica in transazione un impianto di telefonia mobile e gli eventuali gestori associati.
	 * 
	 * @param impianti
	 * @param impianto
	 * @param codGestori
	 * @throws IOException
	 * @throws SITException
	 * @throws SQLException
	 */
	public void modifyTelefoniaMobile(LayerTelefoniaMobile impianti, PuntoTelefoniaMobile impianto, int [] codGestori) throws IOException, SITException, SQLException {
		
		//modifico l'oggetto nel layer specifico
		impianti.modifyFeature(impianto, transaction);
		
		//modifico i gestori associati all'impianto
		if (codGestori != null) {
			AntennaBean antennaBean = new AntennaBean();
			antennaBean.setIdImpianto(Long.parseLong(impianto.getIDTPN()));
			antennaBean.setIdGestori(codGestori);
			
			AntennaDAO antennaDAO = new AntennaDAO(logger);
			antennaDAO.riscritturaAntenna(antennaBean, conn);
		}
	}
}

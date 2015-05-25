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
package it.prato.comune.tolomeo.servizi.shared.model;

import it.prato.comune.sit.LayerRuWeb;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.PoligonoRuWeb;
import it.prato.comune.sit.SITException;
import it.prato.comune.tolomeo.model.TolomeoService;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

/**
 * Classe che gestisce l'intersezione tra un <code>OggettoTerritorio</code> generico e il layer <code>LayerRuWeb</code>
 * del Regolamento Urbanisttico
 * 
 * @author bf1f
 *
 */
public class IntersectRuWebService extends TolomeoService {

	/**
	 * Metodo costruttore
	 * 
	 * @param logger
	 * @param ruWeb <code>LayerRuWeb</code>
	 */
	public IntersectRuWebService(LogInterface logger, LayerTerritorio territorio) {
		super(logger, territorio);
	}
	
	/**
	 * Metodo che ricava le destinazioni d'uso del Regolamento Urbanistico eseguento un intersezione tra un oggetto generico e il layer RuWeb
	 * 
	 * @param oggetto <code>OggettoTerritorio</code>
	 * @return la lista contenente le destinazioni d'uso
	 */
	public List<String> getIntersectDU(OggettoTerritorio oggetto) {
		
		LayerRuWeb ruWeb = getLayer();
		List<String> DU = new ArrayList<String>();
		List<PoligonoRuWeb> intersezione = new ArrayList<PoligonoRuWeb>();
		
		try {
			
			intersezione = ruWeb.chiInterseca(oggetto);
			
			for (int i=0; i<intersezione.size(); i++) {
				if (StringUtils.isNotEmpty(intersezione.get(i).getDU()))
					DU.add(intersezione.get(i).getDU());
			}
			
		} catch (IOException e) {
			logger.error(e);
		} catch (SITException e) {
			logger.error(e);
		}
		
		return DU;
	}
	
	/**
	 * Metodo che ricava le destinazioni d'uso del Regolamento Urbanistico eseguento un intersezione
	 * tra un oggetto generico e il layer RuWeb intorno ad un range
	 * 
	 * @param oggetto <code>OggettoTerritorio</code>
	 * @param range raggio intorno al quale si estrae l'intersezione
	 * @return la lista contenente le destinazioni d'uso
	 */
	public List<String> getIntersectDURange(OggettoTerritorio oggetto, double range) {
		
		LayerRuWeb ruWeb = getLayer();
		List<String> DU = new ArrayList<String>();
		List<PoligonoRuWeb> intersezione = new ArrayList<PoligonoRuWeb>();
		
		try {
			
			intersezione = ruWeb.chiInterseca(oggetto, range);
			
			for (int i=0; i<intersezione.size(); i++) {
				if (StringUtils.isNotEmpty(intersezione.get(i).getDU()))
					if(!DU.contains(intersezione.get(i).getDU()))
						DU.add(intersezione.get(i).getDU());
			}
			
		} catch (IOException e) {
			logger.error(e);
		} catch (SITException e) {
			logger.error(e);
		}
		
		return DU;
	}
	
	
	/**
	 * Metodo che ricava le zone omogenee (ZO) del Regolamento Urbanistico eseguento un intersezione tra un oggetto generico e il layer RuWeb
	 * 
	 * @param oggetto <code>OggettoTerritorio</code>
	 * @return la lista contenente le zone omogenee
	 */
	public List<String> getIntersectZO(OggettoTerritorio oggetto) {
		
		LayerRuWeb ruWeb = getLayer();
		List<String> ZO = new ArrayList<String>();
		List<PoligonoRuWeb> intersezione = new ArrayList<PoligonoRuWeb>();
		
		try {
			
			intersezione = ruWeb.chiInterseca(oggetto);
			
			for (int i=0; i<intersezione.size(); i++) {
				if (StringUtils.isNotEmpty(intersezione.get(i).getZO()))
					ZO.add(intersezione.get(i).getZO());
			}
			
		} catch (IOException e) {
			logger.error(e);
		} catch (SITException e) {
			logger.error(e);
		}
		
		return ZO;
	}
	
	/**
	 * Metodo che ricava i sub-sistemi (SUB) del Regolamento Urbanistico eseguento un intersezione tra un oggetto generico e il layer RuWeb
	 * 
	 * @param oggetto <code>OggettoTerritorio</code>
	 * @return la lista contenente i sub-sistemi
	 */
	public List<String> getIntersectSUB(OggettoTerritorio oggetto) {
		
		LayerRuWeb ruWeb = getLayer();
		List<String> SUB = new ArrayList<String>();
		List<PoligonoRuWeb> intersezione = new ArrayList<PoligonoRuWeb>();
		
		try {
			
			intersezione = ruWeb.chiInterseca(oggetto);
			
			for (int i=0; i<intersezione.size(); i++) {
				if (StringUtils.isNotEmpty(intersezione.get(i).getSUB()))
					SUB.add(intersezione.get(i).getSUB());
			}
			
		} catch (IOException e) {
			logger.error(e);
		} catch (SITException e) {
			logger.error(e);
		}
		
		return SUB;
	}
	
	/**
	 * Metodo che ricava il tipo di intervento (TI) del Regolamento Urbanistico eseguento un intersezione tra un oggetto generico e il layer RuWeb
	 * 
	 * @param oggetto <code>OggettoTerritorio</code>
	 * @return la lista contenente i tipi d'intervento
	 */
	public List<String> getIntersectTI(OggettoTerritorio oggetto) {
		
		LayerRuWeb ruWeb = getLayer();
		List<String> TI = new ArrayList<String>();
		List<PoligonoRuWeb> intersezione = new ArrayList<PoligonoRuWeb>();
		
		try {
			
			intersezione = ruWeb.chiInterseca(oggetto);
			
			for (int i=0; i<intersezione.size(); i++) {
				if (StringUtils.isNotEmpty(intersezione.get(i).getTI()))
					TI.add(intersezione.get(i).getTI());
			}
			
		} catch (IOException e) {
			logger.error(e);
		} catch (SITException e) {
			logger.error(e);
		}
		
		return TI;
	}
	
	/**
	 * Metodo che ricava il progetto del suolo (PS) del Regolamento Urbanistico eseguento un intersezione tra un oggetto generico e il layer RuWeb
	 * 
	 * @param oggetto <code>OggettoTerritorio</code>
	 * @return la lista contenente i progetti del suolo
	 */
	public List<String> getIntersectPS(OggettoTerritorio oggetto) {
		
		LayerRuWeb ruWeb = getLayer();
		List<String> PS = new ArrayList<String>();
		List<PoligonoRuWeb> intersezione = new ArrayList<PoligonoRuWeb>();
		
		try {
			
			intersezione = ruWeb.chiInterseca(oggetto);
			
			for (int i=0; i<intersezione.size(); i++) {
				if (StringUtils.isNotEmpty(intersezione.get(i).getPS()))
					PS.add(intersezione.get(i).getPS());
			}
			
		} catch (IOException e) {
			logger.error(e);
		} catch (SITException e) {
			logger.error(e);
		}
		
		return PS;
	}
	
	private LayerRuWeb getLayer(){
        return (LayerRuWeb)this.layer;
    }
}

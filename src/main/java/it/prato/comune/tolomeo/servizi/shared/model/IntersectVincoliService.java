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

import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.LayerVincoli;
import it.prato.comune.sit.LayerVincoloCascineTavola;
import it.prato.comune.sit.LayerVincoloCimiteriale;
import it.prato.comune.sit.LayerVincoloParco;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.PoligonoVincoli;
import it.prato.comune.sit.PoligonoVincoloCascineTavola;
import it.prato.comune.sit.PoligonoVincoloCimiteriale;
import it.prato.comune.sit.PoligonoVincoloParco;
import it.prato.comune.sit.SITException;
import it.prato.comune.tolomeo.model.TolomeoService;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class IntersectVincoliService extends TolomeoService {

	public IntersectVincoliService(LogInterface logger, LayerTerritorio layerTerritorio) {
		super(logger, layerTerritorio);
	}
	
	/**
	 * Metodo che esegue un intersezione tra il <code>LayerVincoloCascineTavola</code> è un oggetto territorio. Se l'oggetto interseca il layer
	 * viene restituito <code>true</code> in caso contrario <code>false</code>
	 * @param layerVincoloCascineTavola
	 * @param oggetto
	 * @return
	 * @throws IOException
	 * @throws SITException
	 */
	public boolean isIntersectVincoloCascineTavola (LayerVincoloCascineTavola layerVincoloCascineTavola, OggettoTerritorio oggetto)
		throws IOException, SITException {
		
		List<PoligonoVincoloCascineTavola> intersezione = new ArrayList<PoligonoVincoloCascineTavola>();
		
		intersezione = layerVincoloCascineTavola.chiInterseca(oggetto);

		return (intersezione.size()==0) ? false : true;
	}
	
	/**
	 * Metodo che esegue un intersezione tra il <code>LayerVincoloCimiteriale</code> è un oggetto territorio. Se l'oggetto interseca il layer
	 * viene restituito <code>true</code> in caso contrario <code>false</code>
	 * @param layerVincoloCimiteriale
	 * @param oggetto
	 * @return
	 * @throws IOException
	 * @throws SITException
	 */
	public boolean isIntersectVincoloCimiteriale (LayerVincoloCimiteriale layerVincoloCimiteriale, OggettoTerritorio oggetto) 
		throws IOException, SITException {
		
		List<PoligonoVincoloCimiteriale> intersezione = new ArrayList<PoligonoVincoloCimiteriale>();
		
		intersezione = layerVincoloCimiteriale.chiInterseca(oggetto);
		
		return (intersezione.size()==0) ? false : true;
	}
	
	/**
	 * Metodo che esegue un intersezione tra il <code>LayerVincoloCimiteriale</code> è un oggetto territorio. Se l'oggetto interseca il layer
	 * viene restituito <code>true</code> in caso contrario <code>false</code>
	 * @param layerVincoloParco
	 * @param oggetto
	 * @return
	 * @throws IOException
	 * @throws SITException
	 */
	public boolean isIntersectVincoloParco (LayerVincoloParco layerVincoloParco, OggettoTerritorio oggetto)
		throws IOException, SITException {
		
		List<PoligonoVincoloParco> intersezione = new ArrayList<PoligonoVincoloParco>();
		
		intersezione = layerVincoloParco.chiInterseca(oggetto);

		return (intersezione.size()==0) ? false : true;
	}
	
	/**
	 * Metodo che esegue un intersezione tra il <code>LayerVincoli</code> è un oggetto territorio, restituendo la descrizione dei vincoli che interseca.
	 * @param layerVincoli
	 * @param oggetto
	 * @return
	 * @throws SITException
	 * @throws IOException
	 */
	public List<String> getIntersectVincoliDescrizione(LayerVincoli layerVincoli, OggettoTerritorio oggetto)
		throws SITException, IOException {
		
		List<String> vincoliDescrizione = new ArrayList<String>();
		
			
		List<PoligonoVincoli> intersezione = layerVincoli.chiInterseca(oggetto);
		PoligonoVincoli vincolo = new PoligonoVincoli();
		
		for (int i=0; i<intersezione.size(); i++) {
			
			vincolo = intersezione.get(i);
			
			if (vincolo.isVincoloVS01()) vincoliDescrizione.add(vincolo.getDescrizioneVS01());
			if (vincolo.isVincoloVS02()) vincoliDescrizione.add(vincolo.getDescrizioneVS02());
			if (vincolo.isVincoloVS03()) vincoliDescrizione.add(vincolo.getDescrizioneVS03());
			if (vincolo.isVincoloVS04()) vincoliDescrizione.add(vincolo.getDescrizioneVS04());
			if (vincolo.isVincoloVS05()) vincoliDescrizione.add(vincolo.getDescrizioneVS05());
			if (vincolo.isVincoloVS06()) vincoliDescrizione.add(vincolo.getDescrizioneVS06());
			if (vincolo.isVincoloVS07()) vincoliDescrizione.add(vincolo.getDescrizioneVS07());
			if (vincolo.isVincoloVS08()) vincoliDescrizione.add(vincolo.getDescrizioneVS08());
			if (vincolo.isVincoloVS09()) vincoliDescrizione.add(vincolo.getDescrizioneVS09());
		}
		return vincoliDescrizione;
	}
}

/*******************************************************************************
 Tolomeo is a developing framework for visualization, editing,  
 geoprocessing and decisional support application based on cartography.

 Tolomeo Copyright 2011 Comune di Prato;

 This file is part of Tolomeo.

 Tolomeo is free software; you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License 
 as published by the Free Software Foundation; either version 3 of the License, 
 or (at your option) any later version.

 Tolomeo is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA

 Developers Information:

 Tolomeo is developed by Comune di Prato

 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari

 sit@comune.prato.it 


 Versione in Italiano LGPL

 Tolomeo è un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.

 Tolomeo Copyright 2011 Comune di Prato;

 Questo file fa parte di Tolomeo.

 Tolomeo è un software libero; è possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.

 Tolomeo è distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.

 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA


 Informazioni Sviluppatori:

 Tolomeo è sviluppato dal Comune di Prato

 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari

 sit@comune.prato.it
 */

package it.prato.comune.tolomeo.web.toc.geoserver;

import it.geosolutions.geoserver.rest.GeoServerRESTReader;
import it.geosolutions.geoserver.rest.Util;
import it.geosolutions.geoserver.rest.decoder.RESTLayer;
import it.geosolutions.geoserver.rest.decoder.RESTLayerGroup;
import it.geosolutions.geoserver.rest.decoder.RESTLayerList;
import it.geosolutions.geoserver.rest.decoder.RESTStyle;
import it.geosolutions.geoserver.rest.decoder.utils.NameLinkElem;
import it.prato.comune.sit.SITException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.util.List;

import org.geotools.factory.CommonFactoryFinder;
import org.geotools.styling.FeatureTypeStyle;
import org.geotools.styling.SLDParser;
import org.geotools.styling.Style;
import org.geotools.styling.StyleFactory;
import org.opengis.style.Rule;

/**
 * Classe che si occupa di interfacciarsi via REST con geoserver
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class GeoserverUti {

	private static final StyleFactory styleFactory = CommonFactoryFinder.getStyleFactory(null);

	//private String restURL  = "http://geoserver.comune.prato.it/geoserver";
	//private String restUser = "admin";
	//private String restPW   = "";
	private GeoServerRESTReader reader;
	private LogInterface logger = null;

	/**
	 * Costruttore
	 * 
	 * @param restURL 	url di base di geoserver (es. http://geoserver.comune.prato.it/geoserver)
	 * @param restUser 	utente con il quale connettersi
	 * @param restPW  	password con la quale connettersi
	 * @param logger 	
	 * @throws SITException 
	 */
	public GeoserverUti(String restURL, String restUser, String restPW, LogInterface logger) throws SITException {

		this.logger = logger;

		try {
			reader = new GeoServerRESTReader(restURL, restUser, restPW);
			if (!reader.existGeoserver()) {
				// Errore di connessione a Geoserver
				String msg = "GeoserverUti: Impossibile connettersi a geoserver ("+ restURL + ") utilizzando REST.\nVerificare url e credenziali geoserver (in preset e tolomeo.properties) e configurazione di geoserver" ;
				logger.error(msg);
				throw new SITException(msg);

			}
		} catch (MalformedURLException e) {
			String msg = "GeoserverUti: Impossibile connettersi a geoserver ("+ restURL + ")  utilizzando REST.\nVerificare url e credenziali geoserver (in preset e tolomeo.properties) e configurazione di geoserver" ;
			logger.error(msg, e);
			throw new SITException(msg, e);
		}

	}

	/**
	 * Metodo che ritorna il valore minimo e massimo della scala di visualizzazione di un determinato gruppo o layer, utilizzando lo stile di default
	 * 
	 * @param nomeLayerOrGroup
	 * @return ritorna un array di double, retVal[0]contiene il valore minimo, retVal[1] il valore massimo
	 * @throws UnsupportedEncodingException 
	 */
	public double[] getLayerScaleDenom(String nomeLayerOrGroup) throws UnsupportedEncodingException {

		double[] retVal = new double[2];
		retVal[0] = Double.POSITIVE_INFINITY;
		retVal[1] = Double.NEGATIVE_INFINITY;
		String nomeStile = "";   

		// TODO verificare cosa succede per layer in cascade
		RESTLayer lay = reader.getLayer(nomeLayerOrGroup);
		if (lay!=null) 	{
			//E' un layer
			nomeStile = lay.getDefaultStyle();
			logger.warn("STILE DI DEFAULT 1 = " + nomeStile);
			double[] denom = getStyleScaleDenom(nomeStile);
			retVal[1] = denom[1];
			retVal[0] = denom[0];

		}
		else {
			
			// cerca se è un gruppo invece che un layer semplice
			RESTLayerGroup group = reader.getLayerGroup(nomeLayerOrGroup);
			if (group!=null) {
				// TODO prendere la lista dei layer e nomeStile = group.getDefaultStyle();
				// E' un gruppo, quindi scorrere la lista e gli stili di tutti i layer
				RESTLayerList layList = group.getLayerList();

				if (layList!=null) {
					for (NameLinkElem layname: layList){
						RESTLayer lay1 = reader.getLayer(layname.getName());
						//TODO invece di stile di defaul dovrebbe recuperare quello effettivamente utilizzato nel gruppo
						nomeStile = lay1.getDefaultStyle();
						logger.warn("STILE DI DEFAULT 2 = " + nomeStile);

						double[] denom = getStyleScaleDenom(nomeStile);
						retVal[1] = Math.max(retVal[1], denom[1]);
						retVal[0] = Math.min(retVal[0], denom[0]);
					}
				} else {
					retVal[1] = Double.POSITIVE_INFINITY;
					retVal[0] = Double.NEGATIVE_INFINITY;
				}
			}
			else {
				// Se non è nemmeno un gruppo vuol dire che non riesco a trovarlo. Nome sbagliato?
				// Loggo e setto visibilità su tutta la scala 
				logger.warn("Layer " + nomeLayerOrGroup + " non trovato durante la ricerca per settare i limiti di visibilità in GeoserverUti.getLayerScaleDenom. Imposto visibilità ad ogni scala");
				retVal[1] = Double.POSITIVE_INFINITY;
				retVal[0] = Double.NEGATIVE_INFINITY;
			}
		}

		return retVal;
	}

	/**
	 * 
	 * Metodo che ritorna il valore minimo e massimo della scala di visualizzazione di un determinato stile
	 * 
	 * @param nomeStile
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public double[] getStyleScaleDenom(String nomeStile) throws UnsupportedEncodingException {
		double[] retVal = new double[2];
		// Recupera lo stile	
		
		List<RESTStyle> restStyles = Util.searchStyles(reader, nomeStile);

		// Per adesso si suppone che lo stile tornato sia uno soltanto
		String stile = null;
		
		if(restStyles != null && restStyles.size() > 0){
    		RESTStyle restStyle = restStyles.get(0);
    		
    		if(restStyle.getWorkspace() == null) {
    		    stile = reader.getSLD(nomeStile);
    		} else {
    		    stile = reader.getSLD(restStyle.getWorkspace(),nomeStile);
    		}
		} 

		if (stile!=null) {
			InputStream is = new ByteArrayInputStream(stile.getBytes("UTF-8"));     	
			SLDParser stylereader = new SLDParser(styleFactory, is);
			Style[] styles = stylereader.readXML();

			double maxScaleMax = Double.NEGATIVE_INFINITY;
			double minScaleMin = Double.POSITIVE_INFINITY;
			for (Style style:styles) {
				for (FeatureTypeStyle fst: style.featureTypeStyles()) {
					for(Rule rule:fst.rules()) {
						maxScaleMax = Math.max(maxScaleMax, rule.getMaxScaleDenominator());
						minScaleMin = Math.min(minScaleMin, rule.getMinScaleDenominator());
					}
				}
			}

			retVal[0] = (minScaleMin!=Double.POSITIVE_INFINITY)?minScaleMin:0;
			retVal[1] = (maxScaleMax!=Double.NEGATIVE_INFINITY)?maxScaleMax:Double.POSITIVE_INFINITY;
		}else {
			// Stile trovarlo. Nome sbagliato?
			// Loggo e setto visibilità su tutta la scala 
			logger.warn("Stile " + nomeStile + " non trovato durante la ricerca per settare i limiti di visibilità in GeoserverUti.getStyleScaleDenom. Imposto visibilità ad ogni scala");
			retVal[0] = Double.NEGATIVE_INFINITY;
			retVal[1] = Double.POSITIVE_INFINITY;
		}
		return retVal;
	}

}

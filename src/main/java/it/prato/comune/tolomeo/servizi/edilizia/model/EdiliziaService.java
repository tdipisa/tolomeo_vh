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
package it.prato.comune.tolomeo.servizi.edilizia.model;

import it.prato.comune.sit.LayerDepositiAperto;
import it.prato.comune.sit.LayerEdifici;
import it.prato.comune.sit.LayerFerrovie;
import it.prato.comune.sit.LayerRuWeb;
import it.prato.comune.sit.LayerVincoloPaesaggistico;
import it.prato.comune.sit.LineaFerrovia;
import it.prato.comune.sit.PoligonoDepositiAperto;
import it.prato.comune.sit.PoligonoEdificio;
import it.prato.comune.sit.PoligonoRuWeb;
import it.prato.comune.sit.PoligonoVincoloPaesaggistico;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.model.TolomeoService;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

public class EdiliziaService extends TolomeoService{
        
    private LogInterface logger;         
    
    public EdiliziaService(LogInterface logger, LayerDepositiAperto depositi) {
        super(logger, depositi);        
    }
    
    public List checkDeposito(HttpServletRequest request, SITLayersManager comunePO, PoligonoDepositiAperto deposito, PoligonoDepositiAperto depositoNewGeom) throws IOException, SITException {

    	List<String> violazioni = new ArrayList<String>();
    	boolean sub4567 = false;
    	
		LayerRuWeb layerRuWeb               = LayerRuWeb.getInstance(comunePO);
		LayerVincoloPaesaggistico layerVS03 = LayerVincoloPaesaggistico.getInstance(comunePO);
		LayerDepositiAperto layerDepositi   = LayerDepositiAperto.getInstance(comunePO);
		LayerEdifici layerEdifici           = LayerEdifici.getInstance(comunePO);
		LayerFerrovie layerFerrovie         = LayerFerrovie.getInstance(comunePO);

		ArrayList<PoligonoRuWeb> poligoniRuWeb = new ArrayList<PoligonoRuWeb>();
		ArrayList<PoligonoRuWeb> poligoniRuWeb150 = new ArrayList<PoligonoRuWeb>();
		ArrayList<PoligonoRuWeb> poligoniRuWeb30 = new ArrayList<PoligonoRuWeb>();
		ArrayList<PoligonoVincoloPaesaggistico> poligoniVS03 = new ArrayList<PoligonoVincoloPaesaggistico>();
		ArrayList<PoligonoDepositiAperto> depositiLimitrofi = new ArrayList<PoligonoDepositiAperto>();
		ArrayList<PoligonoEdificio> edifici = new ArrayList<PoligonoEdificio>();
		ArrayList<LineaFerrovia> ferrovie = new ArrayList<LineaFerrovia>();

		poligoniRuWeb = layerRuWeb.chiInterseca(depositoNewGeom);
		poligoniRuWeb150 = layerRuWeb.chiNelRaggioDi(depositoNewGeom, 150);
		poligoniRuWeb30 = layerRuWeb.chiNelRaggioDi(depositoNewGeom, 30);
		poligoniVS03 = layerVS03.chiInterseca(depositoNewGeom);
		depositiLimitrofi = layerDepositi.chiNelRaggioDi(depositoNewGeom, 200);
		edifici = layerEdifici.chiNelRaggioDi(depositoNewGeom, 100);
		ferrovie = layerFerrovie.chiNelRaggioDi(depositoNewGeom, 35);

		//...verifico ambiti sub-sistema V1 V2 o V3
		for (PoligonoRuWeb poligonoRuWeb : poligoniRuWeb) {
			if (StringUtils.containsIgnoreCase(poligonoRuWeb.getSUB(),"V1") || StringUtils.containsIgnoreCase(poligonoRuWeb.getSUB(),"V2") ||
					StringUtils.containsIgnoreCase(poligonoRuWeb.getSUB(),"V3")) {
				
				violazioni.add("Violato ambito sub-sistema V1, V2 o V3");
				break;
			}
		}

		//...verifico sistema mobilità M1
		for (PoligonoRuWeb poligonoRuWeb : poligoniRuWeb150) {
			if (StringUtils.containsIgnoreCase(poligonoRuWeb.getSUB(),"M1")) {
				violazioni.add("Violato sistema di mobilità M1 150ml");
				break;
			}
		}

		//...verifico sistema mobilità M2
		for (PoligonoRuWeb poligonoRuWeb : poligoniRuWeb30) {
			if (StringUtils.containsIgnoreCase(poligonoRuWeb.getSUB(),"M2")) {
				violazioni.add("Violato sistema di mobilità M2 30ml");
				break;
			}
		}

		//...verifico vincolo paesaggistico
		if (poligoniVS03.size()>0)
			violazioni.add("Violato ambito di vincolo paesaggistico (VS03)");
		
		//...verifico distanza minima da ferrovia
		if (ferrovie.size()>0) {
			violazioni.add("Violata distanza minima di 30ml dalla ferrovia");
		}

		//...veridico se il deposito interseca i sub-sistemi V4, V5, V6 o V7
		for (PoligonoRuWeb poligonoRuWeb : poligoniRuWeb) {
			if (StringUtils.containsIgnoreCase(poligonoRuWeb.getSUB(),"V4") || StringUtils.containsIgnoreCase(poligonoRuWeb.getSUB(),"V5")
					|| StringUtils.containsIgnoreCase(poligonoRuWeb.getSUB(),"V6") || StringUtils.containsIgnoreCase(poligonoRuWeb.getSUB(),"V7")) {
				sub4567 = true;
			}
		}
		
		if (sub4567) {
			//...verifico le dimensioni del deposito
			if (!(depositoNewGeom.getArea()>300 && depositoNewGeom.getArea()<3000)) {
				violazioni.add("Violata dimensione deposito: " + (int) depositoNewGeom.getArea() + " mq");
			}
	
			//...verifico la distanza del deposito da quelli limitrofi
			String codDepositiVicini = "";
			for (PoligonoDepositiAperto depositoLimitrofo : depositiLimitrofi) {
				if (!StringUtils.equals(deposito.getNumPratica(), depositoLimitrofo.getNumPratica())) {
					codDepositiVicini += depositoLimitrofo.getNumPratica() + ", ";
				}
			}
			if (StringUtils.isNotEmpty(codDepositiVicini))
				violazioni.add("Violata distanza minima deposito. Depositi nel raggio di 200 m: " + codDepositiVicini.substring(0, codDepositiVicini.length()-2));
		}
		
		//...verifico la presenza di edificato nel raggio di 100m
		if (edifici.size()>0) {
			violazioni.add("Violata distanza minima dall' edificato: sono presenti " + edifici.size() + " edifici nel raggio di 100ml");
		}
		
		
		return violazioni;
	}
    
    private LayerDepositiAperto getLayer(){
        return (LayerDepositiAperto)this.layer;
    }
}

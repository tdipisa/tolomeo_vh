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

import it.prato.comune.sit.Filtro;
import it.prato.comune.sit.LayerAnagrafe;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.PoligonoTerritorio;
import it.prato.comune.sit.PuntoAnagrafe;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.model.TolomeoService;
import it.prato.comune.tolomeo.servizi.shared.beans.FasciaEta;
import it.prato.comune.tolomeo.servizi.shared.beans.StatisticaArea;
import it.prato.comune.tolomeo.servizi.shared.beans.StatisticaCompleta;
import it.prato.comune.tolomeo.servizi.shared.beans.StatisticaCompletaFasceEta;
import it.prato.comune.tolomeo.servizi.shared.beans.StatisticaFasceEta;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.TreeMap;

public class IntersectAnagrafeService extends TolomeoService {

	public IntersectAnagrafeService(LogInterface logger, LayerTerritorio territorio) {
		super(logger, territorio);
	}

	/**
	 * Metodo che estrae la statistica di intersezione tra un <code>OggettoTerritorio</code> e l'anagrafe.<br/>
	 * La statistica prevede:
	 * <ul>
	 * 	<li>Il numero totale dei residenti;</li>
	 *  <li>Densità di popolazione se l'oggetto è di tipo poligonale;</li>
	 * 	<li>Il numero totale di famiglie.</li>
	 * </ul>
	 * 
	 * @param punto di tipo <code>PuntoTerritorio</code>
	 * @return il bean <code>StatisticaArea</code>
	 * @throws SITException
	 */
	public StatisticaArea getStatisticaArea(OggettoTerritorio oggetto)
	throws SITException {

		StatisticaArea statistica = new StatisticaArea();
		List<PuntoAnagrafe> abitanti = new ArrayList<PuntoAnagrafe>();

		int famiglie = 0;
		DecimalFormat df = new DecimalFormat(); 
		df.setMaximumFractionDigits(2);
		String densita = "";

		try {

		    SITLayersManager comunePO = super.getTerritorio(logger);
			LayerAnagrafe anagrafi = LayerAnagrafe.getInstance(comunePO);

			abitanti = anagrafi.chiInterseca(oggetto);
			for (int i=0; i<abitanti.size(); i++) {
				if (abitanti.get(i).isCapoFamiglia()) famiglie++;
			}

			densita = df.format((abitanti.size()/oggetto.getArea())*10000); //densita' in ettari
			

			statistica.setResidenti(abitanti.size());
			statistica.setFamiglie(famiglie);
			statistica.setDensita(densita);

		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return statistica;
	}

	/**
	 * Metodo che estrae i residenti in un dato punto sul territorio di tipo <code>PuntoTerritorio</code>.
	 * 
	 * @param punto di tipo <code>PuntoTerritorio</code>
	 * @return una lista di tipo <code>PuntoAnagrafe</code>
	 * @throws SITException
	 */
	public List<PuntoAnagrafe> getAbitanti(OggettoTerritorio oggetto)
	throws SITException {

		List<PuntoAnagrafe> abitanti = new ArrayList<PuntoAnagrafe>();

		try {

		    SITLayersManager comunePO = super.getTerritorio(logger);
			LayerAnagrafe anagrafi = LayerAnagrafe.getInstance(comunePO);

			abitanti = anagrafi.chiInterseca(oggetto);

		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return abitanti;
	}

	/**
	 * Metodo che estrae i soli capi famiglie in un dato punto sul territorio di tipo <code>PuntoTerritorio</code>.
	 * 
	 * @param punto di tipo <code>PuntoTerritorio</code>
	 * @return una lista di tipo <code>PuntoAnagrafe</code>
	 */
	public List<PuntoAnagrafe> getFamiglie(OggettoTerritorio oggetto) {

		List<PuntoAnagrafe> famiglie = new ArrayList<PuntoAnagrafe>();

		try {

		    SITLayersManager comunePO = super.getTerritorio(logger);
			LayerAnagrafe anagrafi = LayerAnagrafe.getInstance(comunePO);

			List<PuntoAnagrafe> puntiAnagrafe = anagrafi.chiInterseca(oggetto);
			for (int i=0; i<puntiAnagrafe.size(); i++) {
				PuntoAnagrafe puntoAnagrafe = puntiAnagrafe.get(i);
				if (puntoAnagrafe.isCapoFamiglia()) {
					famiglie.add(puntoAnagrafe);
				}
			}

			Collections.sort(famiglie, new Comparator<PuntoAnagrafe>() {
				public int compare(PuntoAnagrafe pa1,PuntoAnagrafe pa2){
					int c = pa1.getCognome().compareToIgnoreCase(pa2.getCognome());
					if(c != 0) return c;
					return pa1.getNome().compareToIgnoreCase(pa2.getNome());
				}
			});

		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return famiglie;
	}


	/**
	 * Metodo che estrae il numero di residenti suddivisi solo per fascia di età contenuti in un poligono generico.
	 * @param poligono
	 * @param codClassificazione codice che identifica il tipo di suddivisone di fascia età (vedi tabella SIT.CLASSIETA)
	 * @throws SITException
	 */
	public StatisticaFasceEta getAbitantiFasceEta(OggettoTerritorio oggetto, int codClassificazione)
	throws SITException {

		LayerTerritorio anagrafe = getLayer();
		StatisticaFasceEta statistica = new StatisticaFasceEta();
		List<FasciaEta> fasceEta = new ArrayList<FasciaEta>();
		ResultSet rs = null;
		int interInf = 0;
		int interSup = 0;
		int totFascia = 0;
		int totGlobale = 0;

		Filtro filtroGeografico = anagrafe.getFiltroVuoto();                    
		filtroGeografico.ResetFiltro();                                        
		filtroGeografico.AndFiltroGeog(oggetto,Filtro.GEOMETRY_INTERSECTS);

		anagrafe.setFiltro(filtroGeografico);

		try {

			StringBuffer preWhere = new StringBuffer();
			preWhere.append("SELECT SUM(NUMERO) AS TOTALE , CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE FROM (");  

			preWhere.append("SELECT 0 AS NUMERO, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE "); 
			preWhere.append("FROM CLASSIETA WHERE CODICECLASSIFICAZIONE = "); 
			preWhere.append(codClassificazione);
			preWhere.append(" UNION ALL ");

			preWhere.append("SELECT 1 AS TOTALE, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE "); 
			preWhere.append("FROM ANAGRAFEXY, CLASSIETA");   

			rs = anagrafe.queryDiretta(conn,
					preWhere.toString(),
					"trunc(trunc(MONTHS_BETWEEN(SYSDATE,ANAGRAFEXY.DATANASCIT))/12) <= CLASSIETA.ETAMAX AND trunc(trunc(MONTHS_BETWEEN(SYSDATE,ANAGRAFEXY.DATANASCIT))/12) >= CLASSIETA.ETAMIN AND CLASSIETA.CODICECLASSIFICAZIONE = " + codClassificazione,
					" ) GROUP BY CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE ORDER BY ETAMIN ",
					true);

			while (rs.next()) {
				interInf = rs.getInt("ETAMIN");
				interSup = rs.getInt("ETAMAX");
				totFascia = rs.getInt("TOTALE");

				fasceEta.add(getFasciaEta(interInf, interSup, 0, 0, 0, 0, totFascia));

				totGlobale += totFascia;
			}
			statistica.setFasceEta(fasceEta);
			//statistica.setTotGlobale(totGlobale);

		} catch (SQLException e) {

			throw new SITException("Errore sql" + e.getMessage(),e);

		} catch (IOException e) {

			throw new SITException("Errore accesso risorse",e);

		} finally {

			if(rs!= null) {

				try {
					anagrafe.queryDirettaCloseRs(rs);

				} catch (SQLException e) {
					logger.error("Impossibile chiudere le risorse",e);
				}
			}
		}
		return statistica;
	}

	/**
	 * Metodo da chiamare nel caso in cui si voglia estrarre il numero di residenti suddivisi per fascia di età e anche per sesso contenuti in un <code>OggettoTerritorio</code>.
	 * @param oggetto
	 * @param codClassificazione
	 * @return
	 * @throws SITException
	 */
	public StatisticaFasceEta getAbitantiFasceEtaSesso(OggettoTerritorio oggetto, int codClassificazione)
	throws SITException {

		LayerTerritorio anagrafe = getLayer();
		StatisticaFasceEta statistica = new StatisticaFasceEta();
		List<FasciaEta> fasceEta = new ArrayList<FasciaEta>();

		ResultSet rs = null;
		int interInf = 0;
		int interSup = 0;
		String sesso = null;
		int numero = 0;
		int maschi = 0;
		int femmine = 0;
		boolean bmaschi = false;
		boolean bfemmine = false;

		Filtro filtroGeografico = anagrafe.getFiltroVuoto();                    
		filtroGeografico.ResetFiltro();                                        
		filtroGeografico.AndFiltroGeog(oggetto,Filtro.GEOMETRY_INTERSECTS);

		anagrafe.setFiltro(filtroGeografico);

		try {

			StringBuffer preWhere = new StringBuffer();
			preWhere.append("SELECT SUM(NUMERO) AS TOTALE , SESSO, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE FROM (");  

			preWhere.append("SELECT 0 AS NUMERO, 'M' as SESSO, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE "); 
			preWhere.append("FROM CLASSIETA WHERE CODICECLASSIFICAZIONE = "); 
			preWhere.append(codClassificazione);
			preWhere.append(" UNION ALL ");

			preWhere.append("SELECT 0 AS NUMERO, 'F' as SESSO, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE  ");
			preWhere.append("FROM CLASSIETA WHERE CODICECLASSIFICAZIONE = "); 
			preWhere.append(codClassificazione);
			preWhere.append(" UNION ALL  ");

			preWhere.append("SELECT 1 AS NUMERO, SESSO, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE "); 
			preWhere.append("FROM ANAGRAFEXY, CLASSIETA");   

			rs = anagrafe.queryDiretta(conn,
					preWhere.toString(),
					"trunc(trunc(MONTHS_BETWEEN(SYSDATE,ANAGRAFEXY.DATANASCIT))/12) <= CLASSIETA.ETAMAX AND trunc(trunc(MONTHS_BETWEEN(SYSDATE,ANAGRAFEXY.DATANASCIT))/12) >= CLASSIETA.ETAMIN AND CLASSIETA.CODICECLASSIFICAZIONE = " + codClassificazione,
					" ) GROUP BY SESSO, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE ORDER BY ETAMIN ",
					true);

			while (rs.next()){

				int totFascia = 0;

				sesso = rs.getString("SESSO");
				numero  = rs.getInt("TOTALE");
				
				if (sesso.equalsIgnoreCase("F")) {
					femmine = numero;
					bfemmine = true;
				} else if(sesso.equalsIgnoreCase("M")) {
					maschi = numero;
					bmaschi = true;
				}
				
				if (bfemmine && bmaschi) {
					interInf = rs.getInt("ETAMIN");
					interSup = rs.getInt("ETAMAX");
					
					statistica.addMaschi(maschi);
					statistica.addFemmine(femmine);
					totFascia = maschi + femmine;
					fasceEta.add(getFasciaEta(interInf, interSup, maschi, femmine, 0, 0, totFascia));
					
					maschi = 0;
					femmine = 0;
					bfemmine = false;
					bmaschi = false;
				}
			}
			statistica.setFasceEta(fasceEta);

		} catch (SQLException e) {

			throw new SITException("Errore sql " + e.getMessage(),e);

		} catch (IOException e) {

			throw new SITException("Errore accesso risorse",e);

		} finally {

			if(rs!= null) {

				try {
					anagrafe.queryDirettaCloseRs(rs);

				} catch (SQLException e) {
					logger.error("Impossibile chiudere le risorse",e);
				}
			}
		}
		return statistica;
	}

	/**
	 * Metodo da chiamare nel caso in cui si voglia estrarre il numero di residenti suddivisi per fascia di età e anche per nazionalità contenuti in un <code>OggettoTerritorio</code>.
	 * @param oggetto
	 * @param codClassificazione
	 * @return
	 * @throws SITException
	 */
	public StatisticaFasceEta getAbitantiFasceEtaNazio(OggettoTerritorio oggetto, int codClassificazione)
	throws SITException {

		LayerTerritorio anagrafe = getLayer();
		StatisticaFasceEta statistica = new StatisticaFasceEta();

		ResultSet rs = null;
		int interInf = 0;
		int interSup = 0;
		String nazionalita = null;
		int numero = 0;       

		Filtro filtroGeografico = anagrafe.getFiltroVuoto();                    
		filtroGeografico.ResetFiltro();                                        
		filtroGeografico.AndFiltroGeog(oggetto,Filtro.GEOMETRY_INTERSECTS);

		anagrafe.setFiltro(filtroGeografico);

		try {

			StringBuffer preWhere = new StringBuffer();
			preWhere.append("SELECT SUM(NUMERO) AS TOTALE , NAZIONALIT, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE FROM (");  

			preWhere.append("SELECT 0 AS NUMERO, 'I' as NAZIONALIT, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE "); 
			preWhere.append("FROM CLASSIETA WHERE CODICECLASSIFICAZIONE = "); 
			preWhere.append(codClassificazione);
			preWhere.append(" UNION ALL ");

			preWhere.append("SELECT 0 AS NUMERO, 'S' as NAZIONALIT, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE  ");
			preWhere.append("FROM CLASSIETA WHERE CODICECLASSIFICAZIONE = "); 
			preWhere.append(codClassificazione);
			preWhere.append(" UNION ALL  ");

			preWhere.append("SELECT 1 AS TOTALE, NAZIONALIT, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE "); 
			preWhere.append("FROM ANAGRAFEXY, CLASSIETA");   

			rs = anagrafe.queryDiretta(conn,
					preWhere.toString(),
					"trunc(trunc(MONTHS_BETWEEN(SYSDATE,ANAGRAFEXY.DATANASCIT))/12) <= CLASSIETA.ETAMAX AND trunc(trunc(MONTHS_BETWEEN(SYSDATE,ANAGRAFEXY.DATANASCIT))/12) >= CLASSIETA.ETAMIN AND CLASSIETA.CODICECLASSIFICAZIONE = " + codClassificazione,
					" ) GROUP BY NAZIONALIT, CODICECLASSE, ETAMIN, ETAMAX, CODICECLASSIFICAZIONE ORDER BY ETAMIN ",
					true);

			TreeMap<Integer,FasciaEta> fasceEtaTM = new TreeMap<Integer, FasciaEta>(); 

			while (rs.next()){

				interInf = rs.getInt("ETAMIN");
				interSup = rs.getInt("ETAMAX");

				if(!fasceEtaTM.containsKey(interInf)){
					fasceEtaTM.put(interInf, getFasciaEta(interInf, interSup, 0, 0, 0, 0, 0));
				}

				FasciaEta fasciaEta = fasceEtaTM.get(interInf);

				nazionalita = rs.getString("NAZIONALIT");
				numero  = rs.getInt("TOTALE");

				if (nazionalita.equalsIgnoreCase("S")) {
					fasciaEta.setStranieri(numero + fasciaEta.getStranieri());
				} else if(nazionalita.equalsIgnoreCase("I") || nazionalita.equalsIgnoreCase("1")) {
					fasciaEta.setItaliani(numero + fasciaEta.getItaliani());
				}

			}

			statistica.setFasceEta(new ArrayList<FasciaEta>(fasceEtaTM.values()));

		} catch (SQLException e) {

			throw new SITException("Errore sql" + e.getMessage(),e);

		} catch (IOException e) {

			throw new SITException("Errore accesso risorse",e);

		} finally {

			if(rs!= null) {

				try {
					anagrafe.queryDirettaCloseRs(rs);

				} catch (SQLException e) {
					logger.error("Impossibile chiudere le risorse",e);
				}
			}
		}
		return statistica;
	}

	/**
	 * Metodo che estrae la statistica completa dell'area e l'elenco dei residenti per fasce di eta suddivisi per sesso e nazionalità.
	 * @param oggetto
	 * @param codClassificazione
	 * @return
	 * @throws SITException
	 */
	public StatisticaFasceEta getAbitantiFasceEtaTutto(OggettoTerritorio oggetto, int codClassificazione) throws SITException {
		
		StatisticaFasceEta statFasceEtaSesso = getAbitantiFasceEtaSesso(oggetto, codClassificazione);
		StatisticaFasceEta statFasceEtaNazio = getAbitantiFasceEtaNazio(oggetto, codClassificazione);
		StatisticaFasceEta statFasceEtaTutto = new StatisticaFasceEta();
		List<FasciaEta> fascie = new ArrayList<FasciaEta>();

		for(int i=0; i<statFasceEtaSesso.getFasceEta().size(); i++) {
			fascie.add(getFasciaEta(statFasceEtaSesso.getFasceEta().get(i).getInterInf(),
					statFasceEtaSesso.getFasceEta().get(i).getInterSup(),
					statFasceEtaSesso.getFasceEta().get(i).getMaschi(),
					statFasceEtaSesso.getFasceEta().get(i).getFemmine(),
					statFasceEtaNazio.getFasceEta().get(i).getItaliani(),
					statFasceEtaNazio.getFasceEta().get(i).getStranieri(),
					statFasceEtaSesso.getFasceEta().get(i).getTotFascia()
			));
		}

		statFasceEtaTutto.setFasceEta(fascie);
		
		return statFasceEtaTutto;
	}

	/**
	 * Metodo da richiamare nel caso si voglia estrarre sia la statistica che i dati anagrafici di tutti gli abitanti.
	 * @see getStatisticaArea
	 * @see getStatisticaAbitanti
	 *  
	 * @param <code>PoligonoTerritorio</code> poligono nel quale sono contenuti gli abitanti
	 * @return <code>StatisticaCompleta</code> bean contenente la <code>StatisticaArea</code> e la <code>List</code> di bean <code>Abitante</code> 
	 * @throws SITException
	 */
	public StatisticaCompleta getStatisticaCompletaAbitanti(OggettoTerritorio oggetto)
	throws SITException {

		StatisticaCompleta statisticaCompletaAbitanti = new StatisticaCompleta();
		StatisticaArea statistica = new StatisticaArea();
		List<PuntoAnagrafe> abitanti = new ArrayList<PuntoAnagrafe>();

		statistica = this.getStatisticaArea(oggetto);
		abitanti = this.getAbitanti(oggetto);

		statisticaCompletaAbitanti.setStatistica(statistica);
		statisticaCompletaAbitanti.setAbitanti(abitanti);

		return statisticaCompletaAbitanti;
	}

	/**
	 * Metodo da invocare nel caso si voglia estrarre sia la statistica che i dati anagrafici dei soli capo famiglia.
	 * @see getStatisticaArea
	 * @see getStatisticaAbitanti
	 *  
	 * @param <code>PoligonoTerritorio</code> poligono nel quale sono contenuti gli abitanti
	 * @return <code>StatisticaCompleta</code> bean contenente la <code>StatisticaArea</code> e la <code>List</code> di bean <code>Abitante</code> 
	 * @throws SITException
	 */
	public StatisticaCompleta getStatisticaCompletaFamiglie(OggettoTerritorio oggetto)
	throws SITException {

		StatisticaCompleta statisticaCompletaFamiglie = new StatisticaCompleta();
		StatisticaArea statistica = new StatisticaArea();
		List<PuntoAnagrafe> abitanti = new ArrayList<PuntoAnagrafe>();

		statistica = this.getStatisticaArea(oggetto);
		abitanti = this.getFamiglie(oggetto);

		statisticaCompletaFamiglie.setStatistica(statistica);
		statisticaCompletaFamiglie.setAbitanti(abitanti);

		return statisticaCompletaFamiglie;
	}

	/**
	 * Metodo che estare la statistica dell'area, vedi metodo getStatisticaArea, e il numero di residenti suddivisi per una certa fascia di età,
	 * vedi metodo getAbitantiFasceEta.
	 * @param poligono
	 * @param codClassificazione
	 * @return
	 * @throws SITException
	 */
	public StatisticaCompletaFasceEta getStatisticaCompletaFasceEta(OggettoTerritorio oggetto, boolean perSesso, boolean perNazionalita, int codClassificazione)
	throws SITException {

		StatisticaCompletaFasceEta statisticaCompletaFasceEta = new StatisticaCompletaFasceEta();

		StatisticaArea statisticaArea = new StatisticaArea();
		StatisticaFasceEta statisticaFasceEta = new StatisticaFasceEta();

		statisticaArea = getStatisticaArea(oggetto);
		if (perSesso && !perNazionalita){
			statisticaFasceEta = getAbitantiFasceEtaSesso(oggetto, codClassificazione);
		} else if (perNazionalita && !perSesso){
			statisticaFasceEta = getAbitantiFasceEtaNazio(oggetto, codClassificazione);
		} else if (perNazionalita && perSesso) {
			statisticaFasceEta = getAbitantiFasceEtaTutto(oggetto, codClassificazione);
		} else {		    
			statisticaFasceEta = getAbitantiFasceEta(oggetto, codClassificazione);
		}

		statisticaCompletaFasceEta.setStatisticaArea(statisticaArea);
		statisticaCompletaFasceEta.setStatisticaFasceEta(statisticaFasceEta);

		return statisticaCompletaFasceEta;
	}

	private LayerTerritorio getLayer(){
		return (LayerTerritorio)this.layer;
	}

	private FasciaEta getFasciaEta(int interInf, int interSup, int maschi, int femmine, int italiani, int stranieri, int totFascia) {

		FasciaEta fasciaEta = new FasciaEta();

		fasciaEta.setInterInf(interInf);
		fasciaEta.setInterSup(interSup);
		fasciaEta.setMaschi(maschi);
		fasciaEta.setFemmine(femmine);
		fasciaEta.setItaliani(italiani);
		fasciaEta.setStranieri(stranieri);
		fasciaEta.setTotFascia(totFascia);

		return fasciaEta;
	}
}
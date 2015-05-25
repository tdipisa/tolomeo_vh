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
package it.prato.comune.tolomeo.web.toc;

import it.prato.comune.sit.SITException;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriMappa;
import it.prato.comune.tolomeo.web.parametri.ParametriServer;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

/**
 * Classe di base per le classi di utilità di gestione della legenda
 * 
 * @author Ing. Alessandro Radaelli
 */
public abstract class TOCServerUtiBase {
	
	public static final String TOCCATSEPARATOR = "/"; 
	
	protected  TOCBean toc = null;
    
    // TODO verificare se rendere configurabile da preset
    protected  Integer icoW = 23;        
    protected  Integer icoH = 15;
    protected  String  imgExt = "agga";
    protected  String  imgFormat = "agga";
    protected  String  imgFormatExt = "agga";
    // TODO file
    
 //   protected ParametriMappa paramMappa = null;
    protected LogInterface logger = null;

    protected boolean withClasseUnica = false;
    
    //public TOCServerUtiBase(ParametriServer ps, ParametriMappa pm, LogInterface logger) {
    public TOCServerUtiBase(ParametriServer ps, LogInterface logger) {	
    
    	this.logger = logger;
   //     this.paramMappa = pm;
        
    }
    //Map<String, String> styles,
    public abstract TOCLayerBean createLayer(ParametriLegendaLayer lay,  String SRID) throws SITException;
    
    /**
     * Metodo che inizializza TOCCategoryBean per una categoria (escluse le sue categorie annidate)
     * @param cat
     * @param styles
     * @return
     * @throws SITException
     */
  //  protected abstract TOCCategoryBean createCategory(ParametriLegendaCategoria cat, Map<String, String> styles) throws SITException;
    
    /**
     * Metodo che recupera l'intervallo di visualizzazione di un layer
     * 
     * @param layer nome del layer. Se lo stile non è nullo o vuoto questo parametro viene ignorato
     * @param style nome dello stile, Se definito ha la precedenza sul parametro layer
     * @return array di double nel quale il primo elemento è la scala minima, il secondo la massima. Se un valore non è definito viene posto a -1
     * @throws SITException
     */
    protected abstract double[] getLayerScaleDenom(String layer, String style) throws SITException;
    
    /**
     * Recupera la url con l'immagine della legenda in caso di tipologia a classe unica 
     * (come per esempio wms che con getLegendGraphics ritorna l'intera legenda anche se composta da più classi)
     * 
     * @param lay
     * @param style
     * @return
     * @throws SITException
     */
    protected abstract String getUrlLegendaClasseUnica(ParametriLegendaLayer lay, String style) throws SITException;
    
    /**
     *  Metodo che inizializza le categorie
     * @throws SITException
     */
    /*public void initCategories() throws SITException {
    	initCategories(null);
    }*/
    
    /**
    * Metodo che inizializza le categorie
    * 
    * @param styles mappa conenente nome layer e stile da utilizzare. <br/>
    *        Se null vengono utilizzati gli stili definiti nel preset. <br/>
    *        Se un layer non è presente viene utilizzato lo stile definito nel preset. <br/>
    *        Se il layer è presente e lo stile è null o la string vuota viene utilizato il lo stile di default per il layer. <br/>
    * @throws SITException 
    */
   /*public void initCategories(Map<String, String> styles) throws SITException {
       
       ArrayList<ParametriLegendaCategoria> cl = paramMappa.getLegenda().getCategoryList();
       
       for (ParametriLegendaCategoria cat: cl) {
       	
           TOCCategoryBean newCat = createCategoryPriv(cat, styles);
           toc.getCategories().add(newCat);

       }
   }*/
   
   /**
    * Medodo che crea TOCCategoryBean di una categoria completo di tutte le categorie annidate (richiamando {@link TOCServerUtiBase#createCategory(ParametriLegendaCategoria, Map)})
    * @param cat
    * @param styles
    * @return
    * @throws SITException
    */
  /* private TOCCategoryBean createCategoryPriv(ParametriLegendaCategoria cat, Map<String, String> styles) throws SITException {
   		
	   // cat, this, logger
       TOCCategoryBean newCat = createCategory(cat, styles);
       
       // categorie annidate
       ArrayList<ParametriLegendaCategoria> cl1 = cat.getCategoryList();
       
       if (cl1 != null) {
           for (ParametriLegendaCategoria cat1: cl1) {
           	newCat.addCategory(createCategoryPriv(cat1, styles));
           }
       }
       
       return newCat;
   }
    */
    
    /**
     * Recupera la legenda
     * @return
     */
    public TOCBean getTocBean() {
        return this.toc;
    }
    
    
	/**
	 * Recupera l'oggetto JSON necessario per passare le informazioni di aggiornamento della legenda
	 * 
	 * @return
	 * @throws SITException 
	 */
    public JSONObject jSONGroupVis(ParametriMappa pm, String layers[], String stili[], String catIdx[], String layIdx[]) throws SITException {
    	TOCVisBean retVal = null;

		List<TOCVisEntryBean> vis = new ArrayList<TOCVisEntryBean>();

		for (int i=0; i<layers.length; i++) {
			int iLayIdx =  Integer.parseInt(layIdx[i] );
			TOCVisEntryBean vb = processLayerVis(pm, catIdx[i], iLayIdx, stili[i] );
			vis.add(vb);
		}
		
		retVal = new TOCVisBean(vis);
		return JSONObject.fromObject(retVal);
    		
    }
    
   /**
    * Metodo che calcola la visibilità di un layer
    * 
    * @param catIdx
    * @param layIdx
    * @param actualStyle
    * @return
    * @throws SITException
    */
    public TOCVisEntryBean processLayerVis(ParametriMappa pm, String catIdx, int layIdx, String actualStyle ) throws SITException {
    	TOCVisEntryBean vb = new TOCVisEntryBean();
		ParametriLegendaLayer pll = pm.getLegenda().getCategoria(catIdx).getLayerList().get(layIdx);
		
    	vb.setCat(catIdx);
		vb.setLay(layIdx);
        double[] scaleDenom = getLayerScaleDenom(pll.getName(),actualStyle);
		vb.setMinScaleMin(scaleDenom[0]);
		vb.setMaxScaleMax(scaleDenom[1]);
		if (withClasseUnica) vb.setUrlLegendaClasseUnica(getUrlLegendaClasseUnica(pll, actualStyle));
		
		return vb;
    }

    /**
     * Metodo che inizializza TOCCategoryBean per una categoria (escluse le sue categorie annidate)
     * @param cat
     * @param styles
     * @return
     * @throws SITException
     */
    /*protected TOCCategoryBean createCategory(ParametriMappa pm, ParametriLegendaCategoria cat,
    										Map<String, String> styles) throws SITException {
    
        TOCCategoryBean newCat = new TOCCategoryBean();
        
        String nome = cat.getName();
        newCat.setNome(nome);
        newCat.setCatDescr(nome);
        int rnd = + (int) (Math.random() * 100000);
        newCat.setCatId(nome+rnd);
        newCat.setChecked(cat.getDefaultCategory());      
        newCat.setCatTreeIdx(cat.getCatTreeIdx());
        newCat.setExpanded(cat.getExpanded());
        
        for (ParametriLegendaLayer lay : cat.getLayerList()) {  
            //catDescr = cat.addslashes(_p($cat));
            TOCLayerBean layBean = createLayer(lay, styles, pm.getSRID());
            if (layBean!=null) {
            	newCat.getLayers().add(layBean);
            } else {
                //TODO Layer presente in file xml non presente su .map
            }

        }
        
        return newCat;
        
    }
*/
    
    
    
}

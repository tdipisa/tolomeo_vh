package it.prato.comune.tolomeo.web.toc.export.qgis;

import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.tolomeo.web.parametri.ParametriLegenda;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaCategoria;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriMappa;
import it.prato.comune.tolomeo.web.parametri.ParametriServer;
import it.prato.comune.tolomeo.web.toc.TOCBean;
import it.prato.comune.tolomeo.web.toc.TOCCategoryBean;
import it.prato.comune.tolomeo.web.toc.TOCLayerBean;
import it.prato.comune.tolomeo.web.toc.TOCLayerOrderBean;
import it.prato.comune.tolomeo.web.toc.TOCServerBean;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONException;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;
import net.sf.json.JsonConfig;
import net.sf.json.util.PropertySetStrategy;

import org.apache.commons.lang.StringEscapeUtils;

/**
 * Servlet implementation class ExportToQgisServlet
 */
public class ExportToQgisServlet extends TolomeoServlet {
    
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ExportToQgisServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    public class PropertyStrategyWrapper extends PropertySetStrategy {
    	 
        private PropertySetStrategy original;
     
        public PropertyStrategyWrapper(PropertySetStrategy original) {
            this.original = original;
        }
     
        @Override
        public void setProperty(Object o, String string, Object o1) throws JSONException {
            try {
            		original.setProperty(o, string, o1);	
            } catch (Exception ex) {
            	System.out.println(ex.getMessage());
                //ignore
            }
        }
    }
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    
	    LogInterface logger = getLogger(request);
	    
		StringBuffer out = new StringBuffer("");
		StringBuffer outLayers = new StringBuffer("");
		int outLayerCount=0;
		
		String fileExportName = request.getParameter("fileExportName");
		fileExportName = (fileExportName==null || fileExportName.equals("")) ? "exporttolomeo_qgis.qgs" : fileExportName+".qgs";
		
		String tocInfoString  = request.getParameter("tocInfo");
		String paramsJSString = request.getParameter("paramsJS");		
		int nMappa = Integer.parseInt(request.getParameter("nMappa"));
		
		String idxCategoriaBase = request.getParameter("idxCategoriaBase");
		if (idxCategoriaBase.equals("")) idxCategoriaBase = null;
		String idxLayerBase = request.getParameter("idxLayerBase");
		if (idxLayerBase.equals("")) idxLayerBase = null;
		
		JsonConfig cfg = new JsonConfig();
		cfg.setPropertySetStrategy(new PropertyStrategyWrapper(PropertySetStrategy.DEFAULT));
		cfg.setRootClass(TOCBean.class);
		Map<String, Class<?>> classMap1 = new HashMap<String, Class<?>>();
		classMap1.put( "server", TOCServerBean.class );
		classMap1.put( "categories", TOCCategoryBean.class );
		classMap1.put( "layers", TOCLayerBean.class );
		classMap1.put( "layerOrder", TOCLayerOrderBean.class );
		cfg.setClassMap(classMap1);
		
		JSONObject jsonTocInfo = (JSONObject) JSONSerializer.toJSON( tocInfoString, cfg );
		//TOCBean tocBean = (TOCBean) JSONObject.toBean(jsonTocInfo, TOCBean.class);
		TOCBean tocBean = (TOCBean) JSONObject.toBean(jsonTocInfo, cfg);
		
		JsonConfig cfg1 = new JsonConfig();
		cfg1.setPropertySetStrategy(new PropertyStrategyWrapper(PropertySetStrategy.DEFAULT));
		cfg1.setRootClass(Parametri.class);
		JSONObject jsonParamsJS = (JSONObject) JSONSerializer.toJSON( paramsJSString,cfg1 );
		Map<String, Class<?>> classMap = new HashMap<String, Class<?>>();  
		classMap.put( "mappaList", ParametriMappa.class );
		classMap.put( "categoryList", ParametriLegendaCategoria.class );
		classMap.put( "layerList", ParametriLegendaLayer.class );
		classMap.put( "serverList", ParametriServer.class );
		
		cfg1.setRootClass(Parametri.class);
		cfg1.setClassMap(classMap);
		Parametri paramsJS = (Parametri) JSONObject.toBean(jsonParamsJS, cfg1 );
		
		List<TOCLayerOrderBean> layerOrderBuff = new ArrayList<TOCLayerOrderBean>();
		for (TOCLayerOrderBean lob: tocBean.getLayerOrder()) {
			if (isQGISExportable(paramsJS, nMappa, lob.getCat(), lob.getLay(),logger)) {
				layerOrderBuff.add(lob);
			}
		}
		
		List<TOCLayerOrderBean> layerOrder = null;
		
		if (idxLayerBase!=null && idxCategoriaBase!=null) {
			// Se export di un solo layer specifico
			TOCLayerOrderBean t = new TOCLayerOrderBean();
			t.setCat(idxCategoriaBase);
			t.setLay(idxLayerBase);
			layerOrder = new ArrayList<TOCLayerOrderBean>();
			layerOrder.add(t);
		} else {
			if (layerOrderBuff.size()!=0){
				// Se indicato un ordine diverso da quello di default
				if (idxCategoriaBase!=null) {
					// Se indicata una categoria di base
					layerOrder = new ArrayList<TOCLayerOrderBean>();
					// prende solo quelli figli della categoria di base 
					for (TOCLayerOrderBean tlb: layerOrderBuff) {
						if (tlb.getCat().startsWith(idxCategoriaBase)) layerOrder.add(tlb);
					}
				} else {
					// Se non indicata categoria di base li prende tutti
					layerOrder = layerOrderBuff;
				}
			} else {
				// Se non indicato ordine particolare prende quello di default
				layerOrder = defaultLayerOrder(paramsJS, nMappa, idxCategoriaBase, logger);
			}
		}
		
		ParametriLegenda pl = paramsJS.getMappe().getMappaList().get(nMappa).getLegenda();
		
		// Intestazione progetto
		String cr = System.getProperty("line.separator");
		out.append("<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>");
		out.append(cr);
		out.append("<qgis projectname=\"\" version=\"1.8.0-Lisboa\">");
		out.append(cr);
		out.append("    <title></title>");
		out.append(cr);
		
		// MapCanvas
		out.append(" 	<mapcanvas>");
		out.append(cr);
		out.append("        <units>" + decodUnits( paramsJS.getMappe().getUnits() )+ "</units>");
		out.append(cr);
		out.append("        <extent>");
		out.append(cr);
		out.append("            <xmin>" + paramsJS.getMappe().getMaxExtentLeft() + "</xmin>");
		out.append(cr);
		out.append("            <ymin>" + paramsJS.getMappe().getMaxExtentBottom() + "</ymin>");
		out.append(cr);
		out.append("            <xmax>" + paramsJS.getMappe().getMaxExtentRight() + "</xmax>");
		out.append(cr);
		out.append("            <ymax>" + paramsJS.getMappe().getMaxExtentTop() + "</ymax>");
		out.append(cr);
		out.append("        </extent>");
		out.append(cr);
		out.append("        <projections>0</projections>");
		out.append(cr);
		out.append("        <destinationsrs>");
		out.append(cr);
		out.append("            <spatialrefsys>");
		out.append(cr);
		//out.append("                <proj4>+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs</proj4>");  // TODO ??????
		//out.append(cr);
		//out.append("                <srsid>3452</srsid>");  							// TODO ??????
		//out.append(cr);
		out.append("                <srid>"+ stripEPSG(paramsJS.getMappe().getSRID()) +"</srid>");
		out.append(cr);
		out.append("                <authid>"+ paramsJS.getMappe().getSRID() +"</authid>");
		out.append(cr);
		//out.append("                <description>WGS 84</description>");  				// TODO ??????
		//out.append(cr);
		//out.append("                <projectionacronym>longlat</projectionacronym>"); 	// TODO ??????
		//out.append(cr);
		//out.append("                <ellipsoidacronym>WGS84</ellipsoidacronym>"); 		// TODO ??????
		//out.append(cr);
		//out.append("                <geographicflag>true</geographicflag>");
		//out.append(cr);
		out.append("            </spatialrefsys>");
		out.append(cr);
		out.append("        </destinationsrs>");
		out.append(cr);
		out.append("    	</mapcanvas>");
		out.append(cr);
		
		// Inizio legenda
		out.append(" 	<legend updateDrawingOrder=\"true\">");
		out.append(cr);
		
		String catIdxPrev = null;
		for(TOCLayerOrderBean tlob: layerOrder) {
			String catIdx 	= tlob.getCat();
			int layIdx 		= Integer.parseInt(tlob.getLay());
			
			TOCCategoryBean cb = tocBean.getCategoria(catIdx);
			TOCLayerBean    lb = cb.getLayers().get(layIdx);
			ParametriLegendaLayer pll = pl.getCategoria(catIdx).getLayerList().get(layIdx);
			//ParametriServer ps = paramsJS.getServerPool().getServer(lb.getServerID());
			ParametriServer ps = paramsJS.findServer(lb.getServerID(),nMappa);
			String catIdxBuff="";
			String[] c = catIdx.split(tocBean.getTOCCATSEPARATOR());
			String[] cPrev = (catIdxPrev!=null) ? catIdxPrev.split(tocBean.getTOCCATSEPARATOR()) : null;
			//StringBuffer out1= new StringBuffer();
	
			if (catIdxPrev != catIdx) {
				if (catIdxPrev!=null) {
					// Fine tutte categoria precedenti cambiate
					for (int i=0; i<cPrev.length; i++) {
						if ((i>=c.length) || !cPrev[i].equals(c[i])) {
							out.append(" 		</legendgroup>");
							out.append(cr);
						}
					}
				}
				// Inizio tutte le categorie nuove
				for (int i=0; i<c.length; i++) {
					catIdxBuff += ((!catIdxBuff.equals("")) ? tocBean.getTOCCATSEPARATOR() : "") + c[i];
					if ((idxCategoriaBase==null) || catIdxBuff.startsWith(idxCategoriaBase)) {
						if (cPrev == null || (i>=cPrev.length) || !cPrev[i].equals(c[i])) {
							TOCCategoryBean cb1 = tocBean.getCategoria(catIdxBuff);
							//
							int buff;
							if ( !areAllParentChecked(tocBean, cb1)) {
								buff=0;
							} else {
								buff = recurseChecked(cb1, -1) ;
							}
							
							out.append("		<legendgroup open=\"" + cb1.getExpanded() + "\" checked=\"" + getCheckedString(buff)  +  "\" name=\""+ StringEscapeUtils.escapeHtml(cb1.getNome()) +"\">");
							out.append(cr);
						}
					}
				}
			}
			
			// Layer
			out.append("			<legendlayer drawingOrder=\"0\" open=\"false\" checked=\"" + getCheckedString(lb.isChecked()&& areAllParentChecked(tocBean, lb.getCatTreeIdx())) +  "\" name=\""+ StringEscapeUtils.escapeHtml(lb.getDescr()) +"\" showFeatureCount=\"0\">"); 
			out.append(cr);
			out.append("    			<filegroup open=\"false\" hidden=\"false\">");
			out.append(cr);
			out.append("       				<legendlayerfile isInOverview=\"0\" layerid=\""+ lb.getNameId() +"\" visible=\"0\"/>"); 
			out.append(cr);
			out.append("    			</filegroup>");
			out.append(cr);
			out.append("			</legendlayer>");
			out.append(cr);
			
			// layer WMS
			// TODO da gestire opacità impostata su preset
			int opacity = (lb.getOpacity()!=null) ? Math.round(lb.getOpacity()*255) : Math.round(tocBean.getServer().get(lb.getServerID()).getOpacity()*255)  ;  //" + tocBean.getServer().get(lb.getServerID()) +"
			
			outLayerCount++;
			int hasScaleBasedVisibilityFlag = 0;
			String maximumScale = "1e+08";
			String minimumScale = "0";
			if ((lb.getMinScaleMin()>0) || (lb.getMaxScaleMax()>0) ||
					pll.getScalaMassima() >= 0 || pll.getScalaMinima() >= 0) {
				hasScaleBasedVisibilityFlag = 1;
				if (pll.getScalaMassima()>0) {
					maximumScale = Double.toString(pll.getScalaMassima());	
				} else {
					if (lb.getMaxScaleMax()>0) {
						maximumScale = Double.toString(lb.getMaxScaleMax());
					}
				}
				if (pll.getScalaMinima()>0) {
					minimumScale = Double.toString(pll.getScalaMinima());
				} else {
					if (lb.getMinScaleMin()>0) {
						minimumScale = Double.toString(lb.getMinScaleMin());	
					}
				}
			}
			outLayers.append("		<maplayer minimumScale=\"" + minimumScale + "\" maximumScale=\"" + maximumScale + "\" type=\"raster\" hasScaleBasedVisibilityFlag=\""+ hasScaleBasedVisibilityFlag +"\">"); 
			outLayers.append(cr);
			outLayers.append("	        <id>"+ lb.getNameId() +"</id>");
			outLayers.append(cr);
			//StringEscapeUtils.escapeXml(ps.getUrl()) : StringEscapeUtils.escapeXml(paramsJS.getMappe().getMappaList().get(nMappa).getUrl()))
			outLayers.append("	        <datasource><![CDATA[" + ((ps!=null) ? ps.getUrl() : paramsJS.getMappe().getMappaList().get(nMappa).getUrl()) +"]]></datasource>");
			outLayers.append(cr);
			outLayers.append("	        <title></title>");
			outLayers.append(cr);
			outLayers.append("	        <abstract></abstract>");
			outLayers.append(cr);
			outLayers.append("	        <layername>"+ StringEscapeUtils.escapeHtml(lb.getDescr()) +"</layername>");
			outLayers.append(cr);
			outLayers.append("	        <srs>");  // TODO
			outLayers.append(cr);
			outLayers.append("	            <spatialrefsys>");
			outLayers.append(cr);
			//outLayers.append("	                <proj4>+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs</proj4>");
			//outLayers.append(cr);
			//outLayers.append("	                <srsid>3452</srsid>");
			//outLayers.append(cr);
			//outLayers.append("	                <srid>4326</srid>");
			//outLayers.append(cr);
			outLayers.append("                	<srid>"+ stripEPSG(paramsJS.getMappe().getSRID()) +"</srid>");
			outLayers.append(cr);
			outLayers.append("                	<authid>" + paramsJS.getMappe().getSRID() +"</authid>");
			outLayers.append(cr);
			//outLayers.append("	                <projectionacronym>longlat</projectionacronym>");
			//outLayers.append(cr);
			//outLayers.append("	                <ellipsoidacronym>WGS84</ellipsoidacronym>");
			//outLayers.append(cr);
			//outLayers.append("	                <geographicflag>true</geographicflag>");
			//outLayers.append(cr);
			outLayers.append("	            </spatialrefsys>");
			outLayers.append(cr);
			outLayers.append("	        </srs>");
			outLayers.append(cr);
			outLayers.append("	        <transparencyLevelInt>" + opacity + "</transparencyLevelInt>");
			outLayers.append(cr);
			outLayers.append("	        <customproperties/>");
			outLayers.append(cr);
			outLayers.append("	        <provider>wms</provider>");
			outLayers.append(cr);
			outLayers.append("	        <rasterproperties>");
			outLayers.append(cr);
			outLayers.append("	            <wmsSublayer>");
			outLayers.append(cr);
			outLayers.append("	                <name>"+ lb.getName() +"</name>");
			outLayers.append(cr);
			outLayers.append("	                <style>"+ ((lb.getStyle()!=null) ? lb.getStyle() :"")  + "</style>");
			outLayers.append(cr);
			outLayers.append("	            </wmsSublayer>");
			outLayers.append(cr);
			outLayers.append("	            <wmsFormat>image/png</wmsFormat>");  // TODO
			outLayers.append(cr);
			outLayers.append("	            <mDrawingStyle>SingleBandColorDataStyle</mDrawingStyle>");
			outLayers.append(cr);
			outLayers.append("	            <mColorShadingAlgorithm>UndefinedShader</mColorShadingAlgorithm>");
			outLayers.append(cr);
			outLayers.append("	            <mInvertColor boolean=\"false\"/>");
			outLayers.append(cr);
			outLayers.append("	            <mRedBandName></mRedBandName>");
			outLayers.append(cr);
			outLayers.append("	            <mGreenBandName></mGreenBandName>");
			outLayers.append(cr);
			outLayers.append("	            <mBlueBandName></mBlueBandName>");
			outLayers.append(cr);
			outLayers.append("	            <mGrayBandName>Banda 1</mGrayBandName>");
			outLayers.append(cr);
			outLayers.append("	            <mStandardDeviations>0</mStandardDeviations>");
			outLayers.append(cr);
			outLayers.append("	            <mUserDefinedRGBMinimumMaximum boolean=\"false\"/>");
			outLayers.append(cr);
			outLayers.append("	            <mRGBMinimumMaximumEstimated boolean=\"true\"/>");
			outLayers.append(cr);
			outLayers.append("	            <mUserDefinedGrayMinimumMaximum boolean=\"false\"/>");
			outLayers.append(cr);
			outLayers.append("	            <mGrayMinimumMaximumEstimated boolean=\"true\"/>");
			outLayers.append(cr);
			outLayers.append("	            <mContrastEnhancementAlgorithm>NoEnhancement</mContrastEnhancementAlgorithm>");
			outLayers.append(cr);
			outLayers.append("	            <contrastEnhancementMinMaxValues>");
			outLayers.append(cr);
			outLayers.append("	                <minMaxEntry>");
			outLayers.append(cr);
			outLayers.append("	                    <min>-1.79769e+308</min>");
			outLayers.append(cr);
			outLayers.append("	                    <max>1.79769e+308</max>");
			outLayers.append(cr);
			outLayers.append("	                </minMaxEntry>");
			outLayers.append(cr);
			outLayers.append("	            </contrastEnhancementMinMaxValues>");
			outLayers.append(cr);
			outLayers.append("	            <mNoDataValue mValidNoDataValue=\"true\">0.000000</mNoDataValue>");
			outLayers.append(cr);
			outLayers.append("	            <singleValuePixelList>");
			outLayers.append(cr);
			outLayers.append("	                <pixelListEntry pixelValue=\"0.000000\" percentTransparent=\"100\"/>");
			outLayers.append(cr);
			outLayers.append("	            </singleValuePixelList>");
			outLayers.append(cr);
			outLayers.append("	            <threeValuePixelList>");
			outLayers.append(cr);
			outLayers.append("	                <pixelListEntry red=\"0.000000\" blue=\"0.000000\" green=\"0.000000\" percentTransparent=\"100\" />");
			outLayers.append(cr);
			outLayers.append("	            </threeValuePixelList>");
			outLayers.append(cr);
			outLayers.append("	        </rasterproperties>");
			outLayers.append(cr);
			outLayers.append("	    </maplayer>");
			outLayers.append(cr);
			
			catIdxPrev = catIdx;
			
		}
		// Fine ultima categoria
		int categoriaBaseNumLevels = (idxCategoriaBase!=null) ? idxCategoriaBase.split(tocBean.getTOCCATSEPARATOR()).length : 1;
		for (int i=0; i<catIdxPrev.split(tocBean.getTOCCATSEPARATOR()).length-categoriaBaseNumLevels+1; i++) {
			out.append(" 		</legendgroup>");
			out.append(cr);
		}
		out.append("    </legend>");
		out.append(cr);
		
		// Inizio sezione projectlayers
		out.append("	<projectlayers layercount=\""+ outLayerCount +"\">");
		out.append(cr);
		out.append(outLayers);
		out.append(cr);
		// Fine sezione projectlayers
		out.append("  </projectlayers>");
		out.append(cr);
		
		
		// Fine Progetto
		out.append("</qgis>");
		
		response.setContentType("application/x-qgis-project");
		response.setHeader("Content-Disposition","filename=\"" + fileExportName + "\"");
		
		response.getWriter().write(out.toString());
		response.getWriter().flush();
	}
	
	private String stripEPSG(String in) {
		
		return in.replace("EPSG:", "");
		
	}
	
	private String decodUnits(String units) {
		
		return (units.equals("m")? "meters" : units);
		
	}
	
	private String getCheckedString(boolean checked) {
		
		return getCheckedString((checked) ? 1:0);
		
	}
	
	private String getCheckedString(int checked) {
		
		switch (checked) {
			case 0: return "Qt::Unchecked";
			case 1: return "Qt::Checked";
			case 2: return "Qt:PartiallyChecked";
			default: return "Qt::Unchecked";
			
		}
	}
	
	// stati possibili
	// -2 - primo figlio del nodo iniziale
	// -1 - stato iniziale
	// 0  - tutti disabiltitati
	// 1  - tutti abilitati
	// 2  - misto
	private int recurseChecked(TOCCategoryBean tb, int stato) {
		int statoAttuale; //(tb.getChecked()) ? 1 : 0;
		
		if ((stato==-1) && (!tb.getChecked())) {
			return 0;
		}
		
		switch (stato) {
			case -1: statoAttuale = -2;
				break;
			case -2: statoAttuale = (tb.getChecked()) ? 1 : 0;
				break;
			case 0:
			case 1: statoAttuale = (tb.getChecked()) ? 1 : 0;
					if (stato != statoAttuale)  return 2;
				break;
			case 2: return 2;
			default: statoAttuale = (tb.getChecked()) ? 1 : 0;
		}
		
		for (TOCCategoryBean tcb: tb.getCategories()) {
			statoAttuale = recurseChecked(tcb, statoAttuale);
			if (statoAttuale==2) return 2;
		}
		
		for (TOCLayerBean tlb : tb.getLayers()) {
			int statoLayer = (tlb.isChecked()&& tlb.getParentcategorychecked()) ? 1 : 0;
			switch (statoAttuale) {
				case -2: statoAttuale = (tb.getChecked()) ? 1 : 0;
					break;
				case 0:
				case 1: if (statoAttuale != statoLayer)  return 2;
					break;
				case 2: return 2;
			}
		}
		return statoAttuale;
		
	}
/*
private int[] recurseChecked(TOCCategoryBean tb, int[] contatori) {
	
	switch (tb.getChecked()){
	case true:
	
	
	}
	for (TOCCategoryBean tcb: tb.getCategories()) {
		contatori = recurseChecked(tcb, contatori);
		if (statoAttuale==2) return 2;
	}
	
	for (TOCLayerBean tlb : tb.getLayers()) {
		int statoLayer = (tlb.isChecked()&& tlb.getParentcategorychecked()) ? 1 : 0;
		switch (statoAttuale) {
			case -2: statoAttuale = (tb.getChecked()) ? 1 : 0;
				break;
			case 0:
			case 1: if (statoAttuale != statoLayer)  return 2;
				break;
			case 2: return 2;
		}
	}
	return contatori;
	
}
	*/
	private boolean areAllParentChecked(TOCBean tocBean, String catIdx) {
		return areAllParentChecked(tocBean, tocBean.getCategoria(catIdx));
	}
	
	private boolean areAllParentChecked(TOCBean tocBean, TOCCategoryBean cat) {
		
		if (!cat.getChecked()) return false;
		else {
			String separator = tocBean.getTOCCATSEPARATOR();
			String parentIdx = cat.getCatTreeIdx();
			int pos = parentIdx.lastIndexOf(separator);
			if (pos!=-1) parentIdx = parentIdx.substring(0, pos);
			else return true;
			return areAllParentChecked(tocBean, tocBean.getCategoria(parentIdx)); 
		}
	}
	
	private List<TOCLayerOrderBean> defaultLayerOrder(Parametri paramsJS, int nMappa, String catIdx, LogInterface logger) {
		List<TOCLayerOrderBean> retVal=new ArrayList<TOCLayerOrderBean>();
		
		List<ParametriLegendaCategoria> base = null;
		ParametriLegendaCategoria currCat 	 = null;
		
		if (catIdx!=null) {
			currCat = paramsJS.getMappe().getMappaList().get(nMappa).getLegenda().getCategoria(catIdx);
			base = currCat.getCategoryList();
		} else {
			base = paramsJS.getMappe().getMappaList().get(nMappa).getLegenda().getCategoryList();
		}
		
		for (ParametriLegendaCategoria cat: base) {
			layerOrderAddCategory(paramsJS, nMappa,  cat, retVal,logger);
		}
		
		if (currCat!=null) {
			for (ParametriLegendaLayer lay: currCat.getLayerList()) {
				
				if (isQGISExportable(paramsJS, nMappa, currCat.getCatTreeIdx(), lay.getLayTreeIdx(),logger)) {
					TOCLayerOrderBean tlob = new TOCLayerOrderBean();
					tlob.setCat(currCat.getCatTreeIdx());
					tlob.setLay(lay.getLayTreeIdx());
					retVal.add(tlob);	
				}
			}
		}
		return retVal;
	}
	
	private void layerOrderAddCategory(Parametri paramsJS, int nMappa, ParametriLegendaCategoria currCat, List<TOCLayerOrderBean> retVal, LogInterface logger) {
		
		for (ParametriLegendaCategoria cat: currCat.getCategoryList()) {
			layerOrderAddCategory(paramsJS, nMappa,  cat, retVal, logger);
		}
		for (ParametriLegendaLayer lay: currCat.getLayerList()) {
			if (isQGISExportable(paramsJS, nMappa, currCat.getCatTreeIdx(), lay.getLayTreeIdx(), logger)) {
				TOCLayerOrderBean tlob = new TOCLayerOrderBean();
				tlob.setCat(currCat.getCatTreeIdx());
				tlob.setLay(lay.getLayTreeIdx());
				retVal.add(tlob);
			}
		}
		
	}

	/**
	 * Indica se il layer indicato dai parametri è esportabile in QGIS
	 * @param paramsJS 
	 * @param nMappa Numero della mappa
	 * @param catTreeIdx Indice della categoria
	 * @param layTreeIdx Indice del layer
	 * @return
	 */
	private boolean isQGISExportable(Parametri paramsJS, int nMappa, String catTreeIdx, String layTreeIdx, LogInterface logger ) {
				
		ParametriLegendaLayer lay = paramsJS.getMappe().getMappaList().get(nMappa).getLegenda().getCategoria(catTreeIdx).getLayerList().get(Integer.parseInt(layTreeIdx));
		if (lay.getItemType()!=null && lay.getItemType().equals("layer")) {
		    
		    ParametriLegendaLayer pll = paramsJS.getMappe().getMappaList().get(nMappa).getLegenda().getCategoria(catTreeIdx).getLayerList().get(Integer.parseInt(layTreeIdx));
//		    logger.debug("LEGENDA LAYER NAME " + pll.getName());
		    
			String serverID = pll.getServerID();
//			logger.debug("SEVERID =  " + serverID);
			
			ParametriServer ps = paramsJS.findServer(serverID,nMappa);
//			logger.debug("PARAMETRI PS =  " + ps);
			
			return (ps.getTypeCode()==ParametriServer.typeWMS);
		} else {
			return false;
		}
		
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
		

    @Override
    protected String getDefaultForward() {
        // TODO Auto-generated method stub
        return null;
    }
	

}

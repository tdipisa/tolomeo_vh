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
package it.prato.comune.tolomeo.web;

import it.prato.comune.utilita.core.type.TsType;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import net.sf.jasperreports.engine.JRElement;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.design.JRDesignBand;
import net.sf.jasperreports.engine.design.JRDesignElement;
import net.sf.jasperreports.engine.design.JRDesignImage;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRRtfExporter;
import net.sf.jasperreports.engine.export.oasis.JROdtExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.type.OrientationEnum;
import net.sf.jasperreports.engine.util.JRSaver;
import net.sf.jasperreports.engine.xml.JRXmlLoader;


public class StampaMappa{

	private final static String WORKING_DIR = "src/reports/stampaMappa/";
	private final static Map<String,Object> parameters;
	

	static {
		parameters = new HashMap<String,Object>();
		parameters.put("titolo","Mappa di Vaiano");
		parameters.put("sottotitolo","Cartografia tecnica costruita in base ai rilevamenti fatti sul territorio");
		parameters.put("scala",new Integer(6000));
		parameters.put("descrizione","Proviamo a <i>mettere</i> una descrizione di tipo <b>html</b> in modo che si possa testa il corretto funzionamento del campo che contiene il markup<br/>nuova riga<br/>nuova riga<br/>nuova riga<br/>nuova riga<br/>nuova riga<br/>nuova riga<br/>nuova riga<br/>nuova riga<br/>nuova riga");
		parameters.put("urlMappa","http://pratomaps.comune.prato.it/cgi-bin/mapserv?map=/usr1/prod/vh/pratomaps/mapfiles/stradario.map&layers=undefined%20circoscrizioni%20fiumi_laghi%20parchi%20edifici%20poligoni_strade%20piste_ciclabili%20cartelli_stradali%20numeri_civici&map_imagetype=agga&map_resolution=96&mode=map&CQTEMPORALFILTERDTINIZIO=01/01/0001&CQTEMPORALFILTERDTFINE=31/12/9999&random=0.9780897723093724&mapext=1652177.7587031+4852467.1992802+1685347.3397355+4869618.1992802&imgext=1652177.7587031+4852467.1992802+1685347.3397355+4869618.1992802&map_size=2416+1249&imgx=1208&imgy=624.5&imgxy=2416+1249");
		// parameters.put("urlMappa","c:/temp/img/mappa-A4.png");
		parameters.put("urlLogo", "reports/img/stemma2.png");
		//parameters.put("urlLogoSecondario", "reports/img/sori.bmp");
		parameters.put("urlLogoSecondario","http://mappe.comune.prato.it/img/storiastrade/guida/girasole.gif");
		parameters.put("referer", "http://www.miosito.it");
		parameters.put("dataOra", new TsType().getFormattedTimeStamp());
		parameters.put("xMin", "1.646.730");
		parameters.put("yMin", "4.849.790");
		parameters.put("xMax", "1.691.110");
		parameters.put("yMax", "4.872.725");
		parameters.put("crs", "EPSG:4386");
		parameters.put("permalinkImgUrl", "reports/img/permalink.gif");
		parameters.put("permalinkHref", "http://mappe.comune.prato.it");
		parameters.put("permalinkTooltip", "link mappa prato");
		
	}
	
	public static enum FormatoPagina {        
        
		A4("A4"),
        A3("A3"),
        A2("A2"),
        A1("A1"),
        A0("A0");                
        
        FormatoPagina(String tipo){
           this.tipo = tipo;           
        }
        
        private final String tipo;
                               
        public String getTipo() {
			return tipo;
		}
        
		public static FormatoPagina decode(String tipo){
            for(FormatoPagina og: FormatoPagina.values()){
               if(og.getTipo() == tipo)
                  return og;
            }
            return null;
        }
    }
	
	public static enum Orientamento {        
        
		ORIZZONTALE("O"),
        VERTICALE("V");                
        
		Orientamento(String tipo){
           this.tipo = tipo;           
        }
        
        private final String tipo;
                               
        public String getTipo() {
			return tipo;
		}
        
		public static Orientamento decode(String tipo){
            for(Orientamento og: Orientamento.values()){
               if(og.getTipo() == tipo)
                  return og;
            }
            return null;
        }
    }		
	
	public static enum FormatoJasperreports {        
        
		A4_VERTICALE  (FormatoPagina.A4,Orientamento.VERTICALE,  595,842,530),
        A4_ORIZZONTALE(FormatoPagina.A4,Orientamento.ORIZZONTALE,842,595,330),
        
        A3_VERTICALE  (FormatoPagina.A3,Orientamento.VERTICALE,  842,1190,880),
        A3_ORIZZONTALE(FormatoPagina.A3,Orientamento.ORIZZONTALE,1190,842,530),
        
        // come va calcolata l'atezza max dell'immagine
        A2_VERTICALE  (FormatoPagina.A2,Orientamento.VERTICALE,  1190,1684,1372),
        A2_ORIZZONTALE(FormatoPagina.A2,Orientamento.ORIZZONTALE,1684,1190,880),
        
        A1_VERTICALE  (FormatoPagina.A1,Orientamento.VERTICALE,  1684,2380,2070),        
        A1_ORIZZONTALE(FormatoPagina.A1,Orientamento.ORIZZONTALE,2380,1684,1372),
        
        A0_VERTICALE  (FormatoPagina.A0,Orientamento.VERTICALE,  2380,3368,3056),
        A0_ORIZZONTALE(FormatoPagina.A0,Orientamento.ORIZZONTALE,3368,2380,2070);        
        
        FormatoJasperreports(FormatoPagina formatoPagina, Orientamento orientamento, int width, int height, int maxImageHeight){
           this.formato = formatoPagina.getTipo();
           this.orientamento = orientamento.getTipo();
           this.width = width;
           this.height = height;
           this.maxImageHeight = maxImageHeight;
        }
        
        private final String formato;
        private final String orientamento;
        private final int width;
        private final int height;        
        private final int maxImageHeight;
                
        public String getFormato() {
			return formato;
		}

		public String getOrientamento() {
			return orientamento;
		}

		public int getWidth() {
			return width;
		}

		public int getHeight() {
			return height;
		}
		
		public int getMaxImageHeight() {
			return maxImageHeight;
		}

		public OrientationEnum getOrientamentoJasperreports() {
			if(this.orientamento.equals(Orientamento.VERTICALE.getTipo())){
				return OrientationEnum.PORTRAIT;
			}else if(this.orientamento.equals(Orientamento.ORIZZONTALE.getTipo())){
				return OrientationEnum.LANDSCAPE;
			} else {
				return null;
			}
		}

		public static FormatoJasperreports decode(FormatoPagina formatoPagina, Orientamento orientamento){
            for(FormatoJasperreports og: FormatoJasperreports.values()){
               if(og.getFormato().equals(formatoPagina.getTipo()) && og.getOrientamento().equals(orientamento.getTipo()))
                  return og;
            }
            return null;
        }
     }

	protected static String getTemplateName(){
		return "stampaMappa";
	}
	
	protected static String getJrxmlFileName() {    
		return getTemplateName() + ".jrxml";
	}

	private void generateJaspers(File modelloXmlFile, FormatoJasperreports formatoJasperreports) {
		try {		    		    
					    		    
			JasperDesign jasperDesign = JRXmlLoader.load(modelloXmlFile);
								
			int leftMargin = jasperDesign.getLeftMargin();
			int rightMargin = jasperDesign.getRightMargin();			
										
			jasperDesign.setPageWidth(formatoJasperreports.getWidth());
			jasperDesign.setPageHeight(formatoJasperreports.getHeight());
			jasperDesign.setName(jasperDesign.getName() + "_" + formatoJasperreports.getFormato() + "_" + formatoJasperreports.getOrientamento());
			
			int elementsWidth = formatoJasperreports.getWidth() - leftMargin - rightMargin;
				
			JRDesignBand detailBand = (JRDesignBand)jasperDesign.getDetailSection().getBands()[0];			
			
			JRDesignImage mappa      = (JRDesignImage)detailBand.getElementByKey("mappa");
			//JRDesignImage logo       = (JRDesignImage)title.getElementByKey("logo");
			JRDesignImage logoCustom = (JRDesignImage)detailBand.getElementByKey("logoCustom");
			JRElement titolo = detailBand.getElementByKey("titolo");
			JRElement sottotitolo = detailBand.getElementByKey("sottotitolo");
			JRDesignElement descrizione = (JRDesignElement)detailBand.getElementByKey("descrizione");
			JRDesignElement bottomLeftCoordX = (JRDesignElement)detailBand.getElementByKey("bottomLeftCoordX");
			JRDesignElement bottomLeftCoordY = (JRDesignElement)detailBand.getElementByKey("bottomLeftCoordY");
			JRDesignElement topRightCoordX = (JRDesignElement)detailBand.getElementByKey("topRightCoordX");
			JRDesignElement topRightCoordY = (JRDesignElement)detailBand.getElementByKey("topRightCoordY");
			
			JRDesignElement crs = (JRDesignElement)detailBand.getElementByKey("crs");
			JRDesignElement permalink = (JRDesignElement)detailBand.getElementByKey("permalink");
			
			JRElement referer = (JRElement)jasperDesign.getPageFooter().getElementByKey("referer");
			
			int borderWidth = (int)mappa.getBottomBorder();          
            int mappaWidth = mappa.getWidth(); 
                    
			titolo.setWidth(elementsWidth);
			sottotitolo.setWidth(elementsWidth);
			mappa.setWidth(elementsWidth-20); //-(2*new Double(Math.ceil(borderWidth)).intValue())
			logoCustom.setX(elementsWidth - logoCustom.getWidth());
			
			int vGap = formatoJasperreports.getMaxImageHeight()-mappa.getHeight();
            int hGap = mappa.getWidth() - mappaWidth;			
			
			detailBand.setHeight(detailBand.getHeight()+vGap);
			mappa.setHeight(mappa.getHeight()+vGap);
			descrizione.setWidth(elementsWidth);
			descrizione.setY(descrizione.getY()+vGap);
			
			bottomLeftCoordX.setY(bottomLeftCoordX.getY()+vGap);
			bottomLeftCoordY.setHeight(mappa.getHeight());
			topRightCoordX.setX(topRightCoordX.getX()+hGap);
			topRightCoordY.setX(topRightCoordY.getX()+hGap);
			topRightCoordY.setHeight(mappa.getHeight());
			
			crs.setX(elementsWidth/2 - (crs.getWidth()/2));
			crs.setY(crs.getY()+vGap);
			permalink.setX(permalink.getX() + hGap);
			permalink.setY(permalink.getY()+vGap);
			
			referer.setWidth(elementsWidth-90);
				
			jasperDesign.setOrientation(formatoJasperreports.getOrientamentoJasperreports().getValueByte());							
							
			JasperReport jasperReport = JasperCompileManager.compileReport(jasperDesign);
			//JRImage image = (JRImage)jasperReport.getTitle().getElementByKey("mappa");			
			JRSaver.saveObject(jasperReport, new File(modelloXmlFile.getParentFile(),jasperDesign.getName() + ".jasper"));
			
			// PROVA GENERAZIONE REPORTS
  			
			JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());
			generatePdfReport(jasperPrint, new File(modelloXmlFile.getParentFile(),jasperPrint.getName() + ".pdf"));
			generateDocxReport(jasperPrint, new File(modelloXmlFile.getParentFile(),jasperPrint.getName() + ".docx"));	
			generateRtfReport(jasperPrint, new File(modelloXmlFile.getParentFile(),jasperPrint.getName() + ".rtf"));
			generateOdtReport(jasperPrint, new File(modelloXmlFile.getParentFile(),jasperPrint.getName() + ".odt"));
			
			
		} catch (JRException e) {
			e.printStackTrace();
		}
	}
	
	private void generatePdfReport(JasperPrint jasperPrint, File filePdf) throws JRException {		
	    		    
		JRPdfExporter exporter = new JRPdfExporter();
		exporter.setParameter(JRExporterParameter.JASPER_PRINT,jasperPrint);
		exporter.setParameter(JRExporterParameter.OUTPUT_FILE, filePdf);			
		exporter.exportReport();
	}
	
	private void generateDocxReport(JasperPrint jasperPrint, File fileDocx) throws JRException {		
	    		    
		JRDocxExporter exporter = new JRDocxExporter();
		exporter.setParameter(JRExporterParameter.JASPER_PRINT,jasperPrint);
		exporter.setParameter(JRExporterParameter.OUTPUT_FILE, fileDocx);		
		exporter.exportReport();
	}
	
	private void generateRtfReport(JasperPrint jasperPrint, File fileRtf) throws JRException {		

		JRRtfExporter exporter = new JRRtfExporter();
		exporter.setParameter(JRExporterParameter.JASPER_PRINT,jasperPrint);
		exporter.setParameter(JRExporterParameter.OUTPUT_FILE, fileRtf);			
		exporter.exportReport();
	}
	
	private void generateOdtReport(JasperPrint jasperPrint, File fileOdt) throws JRException {		

		JROdtExporter exporter = new JROdtExporter();
		exporter.setParameter(JRExporterParameter.JASPER_PRINT,jasperPrint);
		exporter.setParameter(JRExporterParameter.OUTPUT_FILE, fileOdt);			
		exporter.exportReport();
	}

	public static void main(String[] args) throws JRException {
		
		StampaMappa report = new StampaMappa();
		File modelloXmlFile = null;
		if(args.length == 0 || args[0] == null){
			modelloXmlFile = new File(WORKING_DIR + getJrxmlFileName());
		}else{
			modelloXmlFile = new File(args[0]);
		}
			
		for(FormatoJasperreports formato : FormatoJasperreports.values()){
		    report.generateJaspers(modelloXmlFile,formato);
		}
		/*
		report.generateJaspers(modelloXmlFile,FormatoJasperreports.A4_VERTICALE);
		report.generateJaspers(modelloXmlFile,FormatoJasperreports.A4_ORIZZONTALE);
		report.generateJaspers(modelloXmlFile,FormatoJasperreports.A3_VERTICALE);
		report.generateJaspers(modelloXmlFile,FormatoJasperreports.A3_ORIZZONTALE);
		*/
        
    }
}

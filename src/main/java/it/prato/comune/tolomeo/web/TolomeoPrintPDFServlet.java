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

import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfWriter;

/**
 * Servlet che stampa un file pdf con intestazione e immagine dell'attuale stato di visualizzazione della mappa
 * 
 * @author Mattia Gennari
 */
public class TolomeoPrintPDFServlet extends TolomeoServlet {

	private static final long serialVersionUID = -6096347001193086197L;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		LogInterface logger = getLogger(request);

		String titolo = request.getParameter("titolo");
		String descrizione = request.getParameter("descrizione");
		String scala = request.getParameter("scala");
		String mapx = request.getParameter("mapx");
		String mapy = request.getParameter("mapy");
		//creo URL alla mappa
		URL urlMappa = new URL(URLDecoder.decode(request.getParameter("urlMappa"), "UTF-8"));
		URI uriMappa = null;
		try {
			uriMappa = new URI(urlMappa.getProtocol(),null,urlMappa.getHost(),urlMappa.getPort(),urlMappa.getPath(),urlMappa.getQuery()+"&mode=map&scale="+scala+"&mapxy="+mapx+"+"+mapy+"&map_size=500 500",null);
			logger.info("URI di stampa mappa: " + uriMappa);
		} catch (URISyntaxException e) {
			logger.error("URI errore di sintassi", e);
		}
		
		Font BOLD15 = new Font(Font.HELVETICA,15,Font.BOLD);
		Font FONT12 = new Font(Font.HELVETICA,12,Font.NORMAL);
		Font FONT10 = new Font(Font.HELVETICA,10,Font.NORMAL);

		Document doc = new Document();;
		PdfWriter pdf = null;
		Paragraph par = new Paragraph();
		
		try {
			
			//creo il PDF
			response.setContentType("application/pdf");
			pdf = PdfWriter.getInstance(doc, response.getOutputStream());

			//attributi file
			doc.addTitle("Mappa di Prato");
			doc.addAuthor("Comune di Prato");
			doc.open();

			//intestazione
			par.setAlignment(Paragraph.ALIGN_CENTER);
			print("Comune di Prato", BOLD15, par, doc);
			print(titolo, FONT10, par, doc);
			print("", FONT10, par, doc);
            
			//mappa
			Image mappa = Image.getInstance(uriMappa.toURL());
            mappa.setAlignment(Image.MIDDLE);
            mappa.setBorder(Rectangle.BOX);
            mappa.setBorderWidth(1f);
            doc.add(mappa);
			
		} catch (Exception e) {
			logger.error("Errore durante la creazione del PDF", e);
			printErr(doc);
		} finally {
			doc.close();
			pdf.close();
			response.getOutputStream().close();
		}
	}

	@Override
	protected String getDefaultForward() {
		return null;
	}

	private void print(String riga, Font font, Paragraph par, Document doc) throws Exception {
		try {
			Phrase frase = new Phrase(riga+"\r\n", font);
			par.add(frase);
			doc.add(par);
			par.clear();
		} catch (Exception e) { throw e; }
	}

	private void printErr(Document doc) {
		try {
			Paragraph par = new Paragraph();
			par.setAlignment(Paragraph.ALIGN_CENTER);
			par.add("\n\n");
			par.add("Errore di stampa!");
			par.add("\n");
			par.add("Contattare sit@comune.prato.it");

			doc.add(par);
		} catch (Exception e) {}
	}
}

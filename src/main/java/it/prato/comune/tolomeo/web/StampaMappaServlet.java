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

import it.prato.comune.sit.SITException;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.core.type.TsType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.Ellipse2D;
import java.awt.geom.GeneralPath;
import java.awt.geom.RoundRectangle2D;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.HttpCookie;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageInputStream;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JRImage;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRPdfExporterParameter;
import net.sf.jasperreports.engine.export.JRRtfExporter;
import net.sf.jasperreports.engine.export.oasis.JROdtExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporterParameter;
import net.sf.jasperreports.engine.util.JRLoader;

import org.apache.commons.lang.StringUtils;

/**
 * Servlet che gestisce la richiesta di stampa del TolomeoExt. Restituisce
 * sul'OutputStrem il report contenete titolo, mappa e descrizione della mappa
 * in visualizzazione. Il report ha i seguenti parametri:
 * <ul>
 * <li>titolo</li>
 * <li>descrizione</li>
 * <li>formato di esportazione (pdf, rtf, docx, ecc...)</li>
 * <li>formato (A4 o A3)</li>
 * <li>orientamento (verticale o orizzontale)</li>
 * <li>urlStemma</li>
 * <li>scala della mappa</li>
 * <li>mapx coordinata x del centroide di visualizzazione</li>
 * <li>mapy coordinata y del centroide di visualizzazione</li>
 * <li>urlMappa url base della mappa in visualizzazione</li>
 * </ul>
 * 
 * @author Mattia Gennari
 */
public class StampaMappaServlet extends TolomeoServlet {

	private static final long serialVersionUID = -6096347001193086197L;
	private List<String> paramsBlackListMS = new ArrayList<String>();
	private List<String> paramsBlackListWMS = new ArrayList<String>();

	private static final HashMap<String, Double> INCHES_PER_UNIT = new HashMap<String, Double>();
	private static final double DOTS_PER_INCH_JASPER = 72.0;
	private static final double DOTS_PER_INCH_MAPSERVER = 72.0;
	private static final double DOTS_PER_INCH_OGC = 25.4 / 0.28;
	private int maxDpi;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);

		INCHES_PER_UNIT.put("inches", 1.0);
		INCHES_PER_UNIT.put("ft", 12.0);
		INCHES_PER_UNIT.put("mi", 63360.0);
		INCHES_PER_UNIT.put("m", 39.3701);
		INCHES_PER_UNIT.put("km", 39370.1);
		INCHES_PER_UNIT.put("dd", 4374754.0);
		INCHES_PER_UNIT.put("degrees", 4374754.0);
		INCHES_PER_UNIT.put("yd", 36.0);

		// lista di parametri da escludere nelle richieste a MapServer
		paramsBlackListMS.add("mapext");
		paramsBlackListMS.add("imgext");
		paramsBlackListMS.add("map_size");
		paramsBlackListMS.add("imgx");
		paramsBlackListMS.add("imgy");
		paramsBlackListMS.add("imgxy");
		paramsBlackListMS.add("map_imagetype");
		paramsBlackListMS.add("map_resolution");
		paramsBlackListMS.add("mode");

		// lista di parametri da escludere nelle richieste a WMS
		paramsBlackListWMS.add("TILESORIGIN");
		paramsBlackListWMS.add("TILED");
		paramsBlackListWMS.add("FORMAT");
		paramsBlackListWMS.add("BBOX");
		paramsBlackListWMS.add("WIDTH");
		paramsBlackListWMS.add("HEIGHT");
		paramsBlackListWMS.add("FORMAT_OPTIONS");

		String maxResolutionDpi = (String) TolomeoApplicationContext
				.getInstance().getProperty(
						TolomeoApplicationContext.PROPERTY_NAME__PRINT_MAX_DPI);
		this.maxDpi = StringUtils.isNotEmpty(maxResolutionDpi) ? Integer
				.parseInt(maxResolutionDpi) : 300;
	}

	@Override
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	@SuppressWarnings("resource")
	@Override
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		LogInterface logger = getLogger(request);
		OutputStream out = null;
		PrintWriter pw = null;
		TsType oggi = new TsType();

		// String szmappaTypeCode = request.getParameter("mappaTypeCode");
		// //indica il tipo di mappa: Mapserver, WMS, ecc
		String[] szmappaTypeCode = request.getParameterValues("mappaTypeCode"); // indica
																				// il
																				// tipo
																				// di
																				// mappa:
																				// Mapserver,
																				// WMS,
																				// ecc

		String[] tileStampaAltezza = request
				.getParameterValues("tileStampaAltezza");
		String[] tileStampaLarghezza = request
				.getParameterValues("tileStampaLarghezza");

		String titolo = request.getParameter("titolo");
		String sottotitolo = request.getParameter("sottotitolo");
		String descrizione = request.getParameter("descrizione");
		String esportazione = request.getParameter("esportazione");
		String formato = request.getParameter("formato");
		String orientamento = request.getParameter("orientamento");
		// String szurlMappa = request.getParameter("urlMappa");

		String[] szurlMappa = request.getParameterValues("urlMappa");
		String[] szopacity = request.getParameterValues("opacity");
		float[] opacity = new float[szopacity.length];
		for (int i = 0; i < szopacity.length; i++) {
			opacity[i] = (szopacity[i] != null && !szopacity[i].equals("")) ? Float
					.parseFloat(szopacity[i]) : 1;
		}

		String[] popupxy = request.getParameterValues("popupxy");
		String[] popuptext = request.getParameterValues("popuptext");

		String scala = request.getParameter("scala");
		String unita = request.getParameter("unita");
		String mapx = request.getParameter("mapx");
		String mapy = request.getParameter("mapy");
		String szdpiStampa = request.getParameter("dpiStampa");
		String stampaRefererP = request.getParameter("stampaReferer");
		String aggDataOraP = request.getParameter("aggDataOra");
		String urlLogoP = request.getParameter("urlLogo");
		String urlLogoSecondario = request.getParameter("urlLogoSecondario");
		String crs = request.getParameter("projectionCode");
		String printPermalinkP = request.getParameter("printPermalink");
		String permalinkHref = request.getParameter("permalinkHref");

		// Integer mappaTypeCode = StringUtils.isEmpty(szmappaTypeCode) ? null :
		// new Integer(szmappaTypeCode);
		Integer mappaTypeCode[] = new Integer[szmappaTypeCode.length]; // StringUtils.isEmpty(szmappaTypeCode)
																		// ?
																		// null
																		// : new
																		// Integer(szmappaTypeCode);

		for (int i = 0; i < szmappaTypeCode.length; i++) {
			mappaTypeCode[i] = StringUtils.isEmpty(szmappaTypeCode[i]) ? null
					: new Integer(szmappaTypeCode[i]);
		}
		String urlLogo = StringUtils.isEmpty(urlLogoP) ? "reports/img/stemma2.png"
				: urlLogoP;
		boolean stampaReferer = (stampaRefererP != null && stampaRefererP
				.equalsIgnoreCase("on"));
		boolean printPermalink = (printPermalinkP != null && printPermalinkP
				.equalsIgnoreCase("on"));
		boolean aggDataOra = (aggDataOraP != null && aggDataOraP
				.equalsIgnoreCase("on"));
		int dpiStampa = StringUtils.isEmpty(szdpiStampa) ? Math.min(96,
				this.maxDpi) : Math.min(Integer.parseInt(szdpiStampa),
				this.maxDpi);

		logger.debug("szdpiStampa: " + szdpiStampa);
		logger.debug("dpiStampa  : " + dpiStampa);

		if (StringUtils.isEmpty(titolo)) {
			titolo = "Mappa di Prato";
		}

		if (!StringUtils.isEmpty(descrizione)) {
			descrizione = descrizione.replaceAll("(?i)<strong>", "<b>");
			descrizione = descrizione.replaceAll("(?i)</strong>", "</b>");
			descrizione = descrizione.replaceAll("(?i)<em>", "<i>");
			descrizione = descrizione.replaceAll("(?i)</em>", "</i>");
		}

		// creo URL alla mappa
		URL urlMappa[] = new URL[szurlMappa.length];
		for (int i = 0; i < urlMappa.length; i++) {
			urlMappa[i] = new URL(URLDecoder.decode(szurlMappa[i], "UTF-8"));
		}

		logger.debug("URL di stampa mappa completa: " + urlMappa.toString());

		List<TileMappa> tilesMappa = new ArrayList<TileMappa>();
		long maxWidth = 0;
		long maxHeight = 0;

		try {

			JasperReport jasperReport = null;

			jasperReport = (JasperReport) JRLoader
					.loadObjectFromLocation("reports/stampaMappa/stampaMappa_"
							+ formato.toUpperCase() + "_"
							+ orientamento.toUpperCase() + ".jasper");

			JRImage image = (JRImage) jasperReport.getDetailSection()
					.getBands()[0].getElementByKey("mappa");
			List<TileMappa> tiles = new ArrayList<StampaMappaServlet.TileMappa>();
			BBox bbox = null;

			try {
				for (int j = 0; j < urlMappa.length; j++) {
					if (mappaTypeCode[j] != null) {
						String[] params = urlMappa[j].getQuery().split("&");
						StringBuffer paramsToUse = new StringBuffer();

						switch (mappaTypeCode[j]) {

						// MapServer
						case 0:
							for (int i = 0; i < params.length; i++) {
								if (!paramsBlackListMS.contains(params[i]
										.split("=")[0])) {
									paramsToUse.append(params[i] + "&");
								}
							}
							long mapsize_w = Math.round(image.getWidth()
									* dpiStampa / DOTS_PER_INCH_MAPSERVER);
							long mapsize_h = Math.round(image.getHeight()
									* dpiStampa / DOTS_PER_INCH_MAPSERVER);
							maxWidth = Math.max(mapsize_w, maxWidth);
							maxHeight = Math.max(mapsize_h, maxHeight);

							// Andrebbe ottimizzato togliendolo dal ciclo,
							// dovrebbe venire uguale ogni volta anche con
							// quello eventualmente calcolato per WMS
							bbox = getBounds(Double.parseDouble(scala), unita,
									(int) mapsize_w, (int) mapsize_h,
									Double.parseDouble(mapx),
									Double.parseDouble(mapy),
									DOTS_PER_INCH_MAPSERVER, logger);

							tiles = createTileList(bbox, (int) mapsize_w,
									(int) mapsize_h, tileStampaAltezza[j],
									tileStampaLarghezza[j], dpiStampa
											/ DOTS_PER_INCH_MAPSERVER, scala,
									unita, mapx, mapy, DOTS_PER_INCH_MAPSERVER,
									opacity[j], logger);

							for (TileMappa t : tiles) {

								double centerX = (t.getBbox().getRight() + t
										.getBbox().getLeft()) / 2;
								double centerY = (t.getBbox().getTop() + t
										.getBbox().getBottom()) / 2;

								String paramsToUse1 = paramsToUse
										+ "mode=map&scale=" + scala + "&mapxy="
										+ centerX + "+" + centerY
										+ "&map_imagetype=agga&map_resolution="
										+ dpiStampa + "&map_size=" + t.getW()
										+ "+" + t.getH();

								URI tmpURI = new URI(urlMappa[j].getProtocol(),
										null, urlMappa[j].getHost(),
										urlMappa[j].getPort(),
										urlMappa[j].getPath(), paramsToUse1,
										null);
								t.setUri(tmpURI);
								tilesMappa.add(t);
							}
							break;

						// WMS
						case 11:
							for (int i = 0; i < params.length; i++) {
								if (!paramsBlackListWMS.contains(params[i]
										.split("=")[0])) {
									paramsToUse.append(params[i] + "&");
								}
							}

							double dpiFactor = DOTS_PER_INCH_OGC
									/ DOTS_PER_INCH_JASPER;
							double dpiPrintFactor = dpiStampa
									/ DOTS_PER_INCH_OGC;

							int width_px = (int) Math.round(image.getWidth()
									* dpiFactor * dpiPrintFactor);
							int height_px = (int) Math.round(image.getHeight()
									* dpiFactor * dpiPrintFactor);

							maxWidth = Math.max(width_px, maxWidth);
							maxHeight = Math.max(height_px, maxHeight);

							// Andrebbe ottimizzato togliendolo dal ciclo,
							// dovrebbe venire uguale ogni volta anche con
							// quello eventualmente calcolato per mapserver
							bbox = getBounds(Double.parseDouble(scala), unita,
									width_px, height_px,
									Double.parseDouble(mapx),
									Double.parseDouble(mapy),
									DOTS_PER_INCH_OGC, logger);

							tiles = createTileList(bbox, width_px, height_px,
									tileStampaAltezza[j],
									tileStampaLarghezza[j], dpiPrintFactor,
									scala, unita, mapx, mapy,
									DOTS_PER_INCH_OGC, opacity[j], logger);

							for (TileMappa t : tiles) {
								// aggiungo qualche parametro
								String paramsToUse1 = "&FORMAT=image/png&BBOX="
										+ t.getBbox() + "&WIDTH=" + t.getW()
										+ "&HEIGHT=" + t.getH();

								// aggiungo qualche parametro vendor GeoServer
								// layout:stampa;
								String parametriVendor = "&FORMAT_OPTIONS=antialias:on;dpi:"
										+ dpiStampa;
								// mapserver anche usato come WMS
								parametriVendor += "&map_resolution="
										+ dpiStampa;

								// parametriVendor += "&tiles=true";
								// parametriVendor +=
								// "&tilesorigin="+bbox.getLeft()+","+bbox.getBottom();

								URI tmpURI1 = new URI(
										urlMappa[j].getProtocol(), null,
										urlMappa[j].getHost(),
										urlMappa[j].getPort(),
										urlMappa[j].getPath(), paramsToUse
												+ parametriVendor
												+ paramsToUse1, null);
								t.setUri(tmpURI1);

								tilesMappa.add(t);

							}
							break;

						default:
							break;
						}

						// logger.debug("URI di stampa mappa modificata: " +
						// uriMappa.toString());

					} else {
						logger.error("Tipo di mappa non definito!");
					}
				}
			} catch (URISyntaxException e) {
				logger.error("URI errore di sintassi", e);
			}

			BufferedImage output = createMergeImage(tilesMappa, (int) maxWidth,
					(int) maxHeight, request, logger);
			if (popupxy != null && popupxy.length > 0) {
				Graphics2D g = output.createGraphics();
				for (int i = 0; i < popupxy.length; i++) {
					String[] coords = popupxy[i].split("\\|");
					String text = popuptext[i];
					drawTextBox(g, (int) maxWidth, (int) maxHeight, bbox, text,
							Double.parseDouble(coords[0]),
							Double.parseDouble(coords[1]), dpiStampa / 96,
							logger);
				}
			}

			Map<String, Object> parameters = new HashMap<String, Object>();
			
			parameters.put("titolo", titolo);
			parameters.put("sottotitolo", sottotitolo);
			parameters.put("scala", new Integer(scala));
			parameters.put("descrizione", descrizione);
			// parameters.put("urlMappa", tilesMappa.toString());
			parameters.put("imageMappa", output);
			parameters.put("urlLogo", urlLogo);
			parameters.put("urlLogoSecondario", urlLogoSecondario);
			parameters.put("referer",
					stampaReferer ? request.getHeader("referer") : null);
			parameters.put("dataOra",
					aggDataOra ? new TsType().getFormattedTimeStamp() : null);

			// si arrotondano le coordinate a 7 cifre significative
			MathContext mc = new MathContext(7, RoundingMode.HALF_DOWN);
			DecimalFormat df = new DecimalFormat("###,###.#######");

			parameters.put("xMin",
					df.format(new BigDecimal(bbox.getLeft(), mc)));
			parameters.put("yMin",
					df.format(new BigDecimal(bbox.getBottom(), mc)));
			parameters.put("xMax",
					df.format(new BigDecimal(bbox.getRight(), mc)));
			parameters
					.put("yMax", df.format(new BigDecimal(bbox.getTop(), mc)));

			parameters.put("crs", crs);
			parameters.put("permalinkImgUrl", "reports/img/permalink.gif");
			parameters.put("permalinkHref", printPermalink ? permalinkHref
					: null);

			logger.debug("stampaReferer = " + stampaReferer
					+ " , stampaRefererP = " + stampaRefererP);
			logger.debug("crs = " + crs);
			logger.debug("printPermalink = " + printPermalink
					+ " , permalinkHref = " + permalinkHref);

			if (esportazione.equalsIgnoreCase("png")) {

				response.setContentType("image/png");
				response.addHeader(
						"Content-Disposition",
						"attachment;filename=mappa-"
								+ oggi.getYYYYMMDDhhmmssxxxxxx() + ".png");

				out = response.getOutputStream();
				try {
					ImageIO.write(output, "PNG", out);
				} catch (IOException e) {
					logger.error(
							"Eccezione durante la scrittura dell'immagine su outputStream",
							e);
				}

				/*
				 * pw = response.getWriter(); for (int i = 0 ; i <
				 * urlMappa.length ; i++) {
				 * pw.println("TypeCode-"+mappaTypeCode[i]+"-"+urlMappa[i]); }
				 */
				/*
				 * try { huc = (HttpURLConnection)
				 * uriMappa.toURL().openConnection(); huc.setRequestMethod
				 * ("GET") ; huc.setAllowUserInteraction(false); huc.connect();
				 * 
				 * int code = huc.getResponseCode(); if ((code>=200) &&
				 * (code<300)){ InputStream is = huc.getInputStream(); out =
				 * response.getOutputStream(); byte [] buffer = new byte[4096] ;
				 * int bytes = 0; while (true) { bytes = is.read (buffer); if
				 * (bytes <= 0) break; out.write(buffer, 0, bytes); }
				 * out.close(); } else { logger.error(
				 * "Connessione HTTP per recupero immagine mappa fallita!"); } }
				 * catch (Exception e) { logger.error(
				 * "Eccezione durante connessione HTTP verso mapserver!"); }
				 * finally { if (huc!=null) huc.disconnect(); }
				 */

			} else {

				// riempio il report
				JasperPrint jasperPrint = JasperFillManager.fillReport(
						jasperReport, parameters, new JREmptyDataSource());

				// esporto il report in base al formato di esportazine richiesto
				if (esportazione.equalsIgnoreCase("pdf")) {

					out = response.getOutputStream();
					response.setContentType("application/pdf");
					response.addHeader(
							"Content-Disposition",
							"attachment;filename=mappa-"
									+ oggi.getYYYYMMDDhhmmssxxxxxx() + ".pdf");
					JRPdfExporter exporter = new JRPdfExporter();
					exporter.setParameter(JRExporterParameter.JASPER_PRINT,
							jasperPrint);
					exporter.setParameter(JRExporterParameter.OUTPUT_STREAM,
							out);
					exporter.setParameter(
							JRPdfExporterParameter.METADATA_AUTHOR,
							"Comune di Prato");
					exporter.setParameter(
							JRPdfExporterParameter.METADATA_TITLE, titolo);
					exporter.exportReport();

				}
				/*
				 * } else if (esportazione.equalsIgnoreCase("html")) {
				 * 
				 * pw = response.getWriter();
				 * response.setContentType("text/html"); JRHtmlExporter exporter
				 * = new JRHtmlExporter();
				 * //request.getSession().setAttribute(ImageServlet
				 * .DEFAULT_JASPER_PRINT_SESSION_ATTRIBUTE, jasperPrint);
				 * exporter
				 * .setParameter(JRHtmlExporterParameter.CHARACTER_ENCODING
				 * ,"UTF-8");
				 * exporter.setParameter(JRHtmlExporterParameter.SIZE_UNIT
				 * ,JRHtmlExporterParameter.SIZE_UNIT_POINT);
				 * exporter.setParameter
				 * (JRHtmlExporterParameter.IGNORE_PAGE_MARGINS,Boolean.TRUE);
				 * exporter
				 * .setParameter(JRHtmlExporterParameter.IS_USING_IMAGES_TO_ALIGN
				 * ,Boolean.FALSE);
				 * exporter.setParameter(JRExporterParameter.JASPER_PRINT
				 * ,jasperPrint);
				 * exporter.setParameter(JRExporterParameter.OUTPUT_WRITER, pw);
				 * exporter.exportReport();
				 */else if (esportazione.equalsIgnoreCase("docx")) {

					out = response.getOutputStream();
					response.setContentType("application/docx");
					response.addHeader(
							"Content-Disposition",
							"attachment;filename=filename=mappa-"
									+ oggi.getYYYYMMDDhhmmssxxxxxx() + ".docx");
					JRDocxExporter exporter = new JRDocxExporter();
					exporter.setParameter(JRDocxExporterParameter.JASPER_PRINT,
							jasperPrint);
					exporter.setParameter(JRExporterParameter.JASPER_PRINT,
							jasperPrint);
					exporter.setParameter(JRExporterParameter.OUTPUT_STREAM,
							out);
					exporter.exportReport();

				} else if (esportazione.equalsIgnoreCase("rtf")) {

					pw = response.getWriter();
					response.setContentType("application/rtf");
					response.addHeader(
							"Content-Disposition",
							"attachment;filename=filename=mappa-"
									+ oggi.getYYYYMMDDhhmmssxxxxxx() + ".rtf");
					JRRtfExporter exporter = new JRRtfExporter();
					exporter.setParameter(JRExporterParameter.JASPER_PRINT,
							jasperPrint);
					exporter.setParameter(JRExporterParameter.OUTPUT_WRITER, pw);
					exporter.exportReport();

				} else if (esportazione.equalsIgnoreCase("odt")) {

					out = response.getOutputStream();
					response.setContentType("application/odt");
					response.addHeader(
							"Content-Disposition",
							"attachment;filename=filename=mappa-"
									+ oggi.getYYYYMMDDhhmmssxxxxxx() + ".odt");
					JROdtExporter exporter = new JROdtExporter();
					exporter.setParameter(JRExporterParameter.JASPER_PRINT,
							jasperPrint);
					exporter.setParameter(JRExporterParameter.OUTPUT_STREAM,
							out);
					exporter.exportReport();

				}
			}

		} catch (JRException e) {
			logger.error("Errore mappa di stampa! URI: " + tilesMappa);
			logger.error("Eccezione durante la generazione del report!", e);
		} catch (Exception e1) {
			logger.error("Eccezione durante la generazione del report!", e1);
		} finally {

			if (out != null) {
				out.flush();
				out.close();
			}
			if (pw != null) {
				pw.flush();
				pw.close();
			}
		}
	}

	private List<TileMappa> createTileList(BBox bbox, int width_px,
			int height_px, String tileStampaAltezza,
			String tileStampaLarghezza, double dpiPrintFactor, String scala,
			String unita, String mapx, String mapy, double dots_per_inch,
			float opacity, LogInterface logger) {

		List<TileMappa> retVal = new ArrayList<StampaMappaServlet.TileMappa>();
		int maxWidthAllowed = width_px;
		int maxHeightAllowed = height_px;

		if (tileStampaAltezza != null && tileStampaAltezza != null
				&& !tileStampaAltezza.equals("")
				&& Integer.parseInt(tileStampaAltezza) != 0) {
			maxHeightAllowed = (int) (Double.parseDouble(tileStampaAltezza) * 0.9);
		}

		if (tileStampaLarghezza != null && tileStampaLarghezza != null
				&& !tileStampaLarghezza.equals("")
				&& Integer.parseInt(tileStampaLarghezza) != 0) {
			maxWidthAllowed = (int) (Double.parseDouble(tileStampaLarghezza) * 0.9);
		}

		// DOTS_PER_INCH_OGC
		bbox.scale(1 / dpiPrintFactor);

		int nCol = width_px / (maxWidthAllowed + 1) + 1;
		int nRow = height_px / (maxHeightAllowed + 1) + 1;
		double bboxStepX = (bbox.getRight() - bbox.getLeft()) / nCol;
		double bboxStepY = (bbox.getTop() - bbox.getBottom()) / nRow;

		for (int r = 0; r < nRow; r++) {
			for (int c = 0; c < nCol; c++) {
				double left = bbox.getLeft() + c * bboxStepX;
				double right = left + bboxStepX;
				double bottom = bbox.getBottom() + r * bboxStepY;
				double top = bottom + bboxStepY;
				int actualWidth_px = width_px / nCol;
				int actualHeight_px = height_px / nRow;
				BBox bbox1 = new BBox(left, bottom, right, top);

				// aggiungo qualche parametro vendor GeoServer
				// vendor option tiled funziona solo con 256x256 quindi non
				// metto
				// layout:stampa;
				// String parametriVendor = "&FORMAT_OPTIONS=antialias:on;dpi:"
				// + dpiStampa;
				// parametriVendor += "&tiles=true";
				// parametriVendor +=
				// "&tilesorigin="+bbox.getLeft()+","+bbox.getBottom();

				TileMappa t = new TileMappa(c * actualWidth_px, r
						* actualHeight_px, bbox1, actualWidth_px,
						actualHeight_px, opacity);

				retVal.add(t);

			}
		}

		return retVal;
	}

	private void copyHeaders(HttpServletRequest src, HttpURLConnection dst,
							LogInterface logger) {
		
		Enumeration hn=src.getHeaderNames();
		logger.debug("Header inizio copia");
		while (hn.hasMoreElements()){
		    String headerName = (String) hn.nextElement();
		    logger.debug("Header disponibile:" + headerName);
		    if ("Authorization".equalsIgnoreCase(headerName)
		    		|| "Cookie".equalsIgnoreCase(headerName)) {
		    	dst.setRequestProperty(headerName, src.getHeader(headerName));
		    	logger.debug("Header copiato:" + headerName);
		    }
		    
		    /*
		    if (!"Host".equalsIgnoreCase(headerName)
		    		&& !"Accept-Encoding".equalsIgnoreCase(headerName)
		    		&& !"Location".equalsIgnoreCase(headerName)
		    		&& !"Content-Length".equalsIgnoreCase(headerName)
		    		&& !"Content-Type".equalsIgnoreCase(headerName)) {
		    	dst.setRequestProperty(headerName, src.getHeader(headerName));
		    }*/
		}
		logger.debug("Header fine copia");
	}
	
	private BufferedImage createMergeImage(List<TileMappa> tileMappa, int w,
			int h, HttpServletRequest req, LogInterface logger) throws Exception {

		// Creazione immagine finale
		BufferedImage output = new BufferedImage(w, h,
				BufferedImage.TYPE_INT_ARGB);
		Graphics2D g = (Graphics2D) output.createGraphics();

		for (TileMappa tm : tileMappa) {

			InputStream is = null;
			ImageInputStream imageInput = null;
			HttpURLConnection huc = null;
			
			CookieManager msCookieManager = new CookieManager();
			msCookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ALL);
			CookieHandler.setDefault(msCookieManager); 
			
			// TODO per adesso la richiesta delle immagini è seriale
			try {
				huc = (HttpURLConnection) tm.getUri().toURL().openConnection();
				huc.setRequestMethod("GET");
				huc.setAllowUserInteraction(false);
				HttpURLConnection.setFollowRedirects(true);
				
				// Copia eventuali headers e coockie di sicurezza per consentire accesso se server autenticato
				copyHeaders(req, huc, logger);
				
				huc.connect();

				int code = huc.getResponseCode();
				if ((code >= 200) && (code < 300)) {
					is = huc.getInputStream();
					imageInput = ImageIO.createImageInputStream(is);
					BufferedImage bufImage = ImageIO.read(imageInput);
					// il punto 0,0 è in alto a sinistra nell'oggetto graphics,
					// quindi occorre traslare la y
					g.setComposite(AlphaComposite.getInstance(
							AlphaComposite.SRC_OVER, tm.getOpacity()));
					g.drawImage(bufImage, tm.getOffsetX(), h - tm.getOffsetY()
							- bufImage.getHeight(), null);
				} else {
					logger.error("Connessione HTTP per recupero immagine mappa fallita! Response code: " + code + " Url="
							+ tm.getUri().toString());
					throw new SITException(
							"Connessione HTTP per recupero immagine mappa fallita! Url="
									+ tm.getUri().toString());
				}
			} catch (IOException e) {
				logger.error("Errore IOException durante connessione HTTP per generazione stampa - url="
								+ tm.getUri().toString());
				throw new SITException(
						"Connessione HTTP per recupero immagine mappa fallita! Url="
								+ tm.getUri().toString());
			} catch (Exception e) {
				logger.error(
						"Eccezione durante connessione HTTP per generazione stampa - url="
								+ tm.getUri().toString(), e);
				throw e;
			} finally {
				// ripristino opacity=1
				g.setComposite(AlphaComposite.getInstance(
						AlphaComposite.SRC_OVER, 1));
				if (huc != null)
					huc.disconnect();
				if (is != null)
					try {
						is.close();
					} catch (IOException e) {
						logger.error(
								"Eccezione durante connessione HTTP per generazione stampa - url="
										+ tm.getUri().toString(), e);
						throw e;
					}
			}
		}

		return output;
	}

	/*
	 * protected void disegnaFreccia(Graphics2D g, int width, int heigth, ) {
	 * Graphics2D g2 = (Graphics2D)g;
	 * g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
	 * RenderingHints.VALUE_ANTIALIAS_ON); int cx = getWidth()/2; int cy =
	 * getHeight()/2; AffineTransform at =
	 * AffineTransform.getTranslateInstance(cx, cy); at.rotate(theta);
	 * at.scale(2.0, 2.0); Shape shape = at.createTransformedShape(arrow);
	 * g2.setPaint(Color.blue); g2.draw(shape); }
	 * 
	 * private Path2D.Double createArrow() { int length = 80; int barb = 15;
	 * double angle = Math.toRadians(20); Path2D.Double path = new
	 * Path2D.Double(); path.moveTo(-length/2, 0); path.lineTo(length/2, 0);
	 * double x = length/2 - barb*Math.cos(angle); double y =
	 * barb*Math.sin(angle); path.lineTo(x, y); x = length/2 -
	 * barb*Math.cos(-angle); y = barb*Math.sin(-angle); path.moveTo(length/2,
	 * 0); path.lineTo(x, y); return path; }
	 */

	private String getHtmlCoords(double xGeo, double yGeo) {
		// si arrotondano le coordinate a 7 cifre significative
		MathContext mc = new MathContext(7, RoundingMode.HALF_DOWN);
		DecimalFormat df = new DecimalFormat("###,###.#######");

		String xCoord = df.format(new BigDecimal(xGeo, mc));
		String yCoord = df.format(new BigDecimal(yGeo, mc));

		return "<hr noshade size=\"1\"><span>" + xCoord + " - " + yCoord
				+ "</span>";
	}

	/**
	 * Aggiusta le size in base a quelle dell'htmleditor lato client per ottenre
	 * gli stessi risultati. In pratica ad una size="2" che rappresenta
	 * l'altezza base deve corrispondere una size="4". In generale a size="n"
	 * dene corrispondere size="n+2"
	 * 
	 * @param htmlString
	 * @return
	 */
	public static String updateSize(String htmlString) {
		Pattern patt = Pattern.compile("(\\ssize=\")(\\d+)(\")");
		Matcher m = patt.matcher(htmlString);
		StringBuffer sb = new StringBuffer(htmlString.length());
		while (m.find()) {
			String size = m.group(2);
			size = "" + (Integer.parseInt(size) + 2);
			m.appendReplacement(sb, m.group(1) + Matcher.quoteReplacement(size)
					+ m.group(3));
		}
		m.appendTail(sb);
		return sb.toString();
	}

	private void drawTextBox(Graphics g, int gWidth, int gHeight, BBox bbox,
			String text, double xGeog, double yGeog, float scaleFactor,
			LogInterface logger) {

		int x = (int) Math.round((xGeog - bbox.getLeft()) * gWidth
				/ (bbox.getRight() - bbox.getLeft()));
		int y = (int) Math.round((yGeog - bbox.getTop()) * gHeight
				/ (bbox.getBottom() - bbox.getTop()));

		if (x >= 0 && x <= gWidth && y >= 0 && y <= gHeight) {
			Graphics2D g2d = (Graphics2D) g;
			g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
					RenderingHints.VALUE_ANTIALIAS_ON);
			g2d.setComposite(AlphaComposite.getInstance(
					AlphaComposite.SRC_OVER, 0.7f));

			// Fumetto
			int boxXExtra = Math.round(10 * scaleFactor);
			int boxYExtra = Math.round(10 * scaleFactor); // Spazio extra tra
															// scritta e bordo
															// fumetto
			int boxX = 0;
			int boxY = 0; // Variabili che conterranno la posizione del fumetto
			int boxWidth = 0;
			int boxHeight = 0; // Variabili che conterranno dimensioni del
								// fumetto
			Color boxTextColor = Color.BLACK; // Colore della scritta
			Color boxBgColor = Color.YELLOW; // Colore dello sfondo
			boolean boxOnTop = true; // Indica se il fumetto è disegnato sopra o
										// sotto il marker
			// Freccia del fumetto
			int arrowWidth = Math.round(15 * scaleFactor); // Larghezza
			int arrowHeight = Math.round(10 * scaleFactor); // Altezza
			int arrowOffset = Math.round(30 * scaleFactor); // Offset di default
			// Marker
			int circleDiameter = Math.round(5 * scaleFactor); // Diametro
																// cerchietto
																// utilizzato
																// come marker
																// del punto
																// esatto
			Color circleColor = Color.RED;

			HtmlImageGeneratorExtended imageGenerator = new HtmlImageGeneratorExtended(
					scaleFactor);
			// "<div style=\"background-color:yellow;border:0px\"> <b>Hello World!</b> <br/>Please goto <a title=\"Goto Google\" href=\"http://www.google.com\">Google</a>.</div>"
			text = updateSize(text);
			logger.debug("ECCOMI " + text);
			imageGenerator.loadHtml(text);
			BufferedImage imgText = imageGenerator.getBufferedImage();

			// Calcolo dimensioni fumetto
			boxWidth = imgText.getWidth() + boxXExtra;
			boxHeight = imgText.getHeight() + boxYExtra;
			int boxMarkerDistanceY = boxHeight + arrowHeight + circleDiameter
					/ 2;

			// Calcolo posizione fumetto e freccia
			boxOnTop = (boxMarkerDistanceY < y);
			boxY = (boxOnTop) ? y - boxMarkerDistanceY : y + arrowHeight;
			boxX = x - arrowOffset;
			// se necessario ricalcolo arrowOffset e boxX rispetto al default
			if (x < arrowOffset) {
				// troppo vicino a bordo sx
				arrowOffset = x;
				boxX = 0;
			} else {
				if (x + boxWidth - arrowOffset > gWidth) {
					// troppo vicino a bordo dx
					boxX = gWidth - boxWidth;
					arrowOffset = x - boxX;
				}
			}

			// Disegno fumetto e freccia
			RoundRectangle2D.Double rr = new RoundRectangle2D.Double(boxX,
					boxY, boxWidth, boxHeight, 10.0f, 10.0f);
			g2d.setColor(boxBgColor);
			g2d.fill(rr);
			g2d.setColor(boxTextColor);
			g2d.draw(rr);
			int vertX[] = { x - arrowWidth / 2, x, x + arrowWidth / 2 };
			int vertY[] = { (boxOnTop) ? boxY + boxHeight : boxY,
					y - circleDiameter / 2 - 2,
					(boxOnTop) ? boxY + boxHeight : boxY };
			GeneralPath arrow = new GeneralPath();
			arrow.moveTo(vertX[0], vertY[0]);
			// arrow.quadTo(x, y-arrowHeight/2, vertX[1], vertY[1]);

			// arrow.quadTo(vertX[2]-10, vertY[2], vertX[1], vertY[1]);
			arrow.lineTo(vertX[1], vertY[1]);
			arrow.lineTo(vertX[2], vertY[2]);
			arrow.closePath();
			// Polygon arrow = new Polygon(vertX, vertY, 3);
			g2d.setColor(boxBgColor);
			g2d.fill(arrow);
			g2d.setColor(boxTextColor);
			g2d.draw(arrow);
			g2d.setColor(boxBgColor);
			g2d.drawLine(vertX[0], vertY[0], vertX[2], vertY[0]);
			g2d.setColor(boxTextColor);

			// Disegno marker
			// g2d.setRenderingHints(Graphics2D.ANTIALIASING,Graphics2D.ANTIALIAS_ON);
			Ellipse2D.Double circle = new Ellipse2D.Double(x - circleDiameter
					/ 2, y - circleDiameter / 2, circleDiameter, circleDiameter);
			g2d.setColor(circleColor);
			g2d.fill(circle);
			g2d.setColor(boxTextColor);

			// Disegno testo html
			g.drawImage(imgText, boxX + boxXExtra / 2, boxY + boxYExtra / 2,
					null);

			/*
			 * JLayeredPane rp = new JLayeredPane(); rp.setVisible(true);
			 * rp.setSize(400, 400); rp.addNotify(); JPanel jp = new JPanel();
			 * JLabel lb = new JLabel(); jp.setSize(400, 400);
			 * jp.setVisible(true); jp.setOpaque(true); jp.setLayout(null);
			 * rp.add(jp);
			 */
			/*
			 * BalloonTipStyle edgedLook = new EdgedBalloonStyle(Color.WHITE,
			 * Color.BLUE); BalloonTip myBalloonTip = new BalloonTip(jp,
			 * "<div style=\"background-color:yellow;border:0px\"> <b>Hello World!</b> <br/>Please goto <a title=\"Goto Google\" href=\"http://www.google.com\">Google</a>.</div>"
			 * , edgedLook, true);
			 * 
			 * myBalloonTip.setBounds(40, 100, 50,50); // jp.add(myBalloonTip);
			 * g.translate(50, 50); myBalloonTip.paint(g); g.translate(-50,
			 * -50);
			 */

			/*
			 * String html =
			 * "<html><body style=\"font-weight: normal;\"><em>Descrizione</em> <span style=\"color: red;\">html</span> inserita dall'<strong>utente</strong>!</body></html>"
			 * ; BalloonTipStyle look = new RoundedBalloonStyle(5,5,Color.WHITE,
			 * Color.BLACK); BalloonTip myBalloonTip = new BalloonTip(jp, new
			 * JLabel(html),look,Orientation.LEFT_ABOVE, AttachLocation.ALIGNED,
			 * 10, 10, false); myBalloonTip.setBounds(40, 100, 50,50);
			 * jp.add(myBalloonTip); g.translate(50, 50); jp.paint(g);
			 * g.translate(-50, -50);
			 */
			/*
			 * String html =
			 * "<html><body style=\"font-weight: normal;\"><em>Descrizione</em> <span style=\"color: red;\">html</span> inserita dall'<strong>utente</strong>!</body></html>"
			 * ; ToloBalloonTip toloBalloonip = new ToloBalloonTip(200, 200,
			 * html); jp.add(toloBalloonip);
			 * //toloBalloonip.balloonTip.setTopLevelContainer(rp);
			 * 
			 * rp.doLayout(); rp.paint(g);
			 * 
			 * 
			 * 
			 * FontMetrics fm = g.getFontMetrics(); Rectangle2D rect =
			 * fm.getStringBounds(testo, g); int cw = fm.charWidth('X'); int ch
			 * = fm.getHeight(); Integer xExtra = 4 * cw; // rect.getWidth() *
			 * 1; Integer yExtra = 1 * ch; // rect.getHeight() * 1;
			 */
			// RoundRectangle2D.Double rr = new RoundRectangle2D.Double(x, y,
			// rect.getWidth() + xExtra, rect.getHeight() + yExtra, 10.0f,
			// 10.0f);

			/*
			 * 
			 * g.setColor(bgColor); g.fill(rr); g.setColor(textColor);
			 * //g.drawString(testo, Math.round(x + xExtra / 2), Math.round(y +
			 * fm.getAscent() + yExtra / 2)); g.draw(rr);
			 * 
			 * g.drawImage(img, x + xExtra/2, y + yExtra/2, null);
			 */

			/*
			 * //g.translate(x, y); label.setOpaque(false);
			 * //label.setPreferredSize(new Dimension(300, 300));
			 * label.setBounds(0,0, 300,500);
			 * label.setHorizontalTextPosition(JLabel.LEFT);
			 * //label.setVerticalTextPosition(JLabel.BOTTOM);
			 * label.setVerticalAlignment(JLabel.TOP);
			 * label.setVerticalTextPosition(JLabel.TOP); //
			 * label.setAlignmentY(0); //label.setBounds(rr.getBounds()); //
			 * label.setBackground(bgColor); label.setForeground(textColor);
			 * label
			 * .setText("<html><b>lkòokjijhoiojhouh <br/>lkòkoplsklsk</b></html>"
			 * ); //the fontMetrics stringWidth and height can be replaced by
			 * //getLabel().getPreferredSize() if needed label.paint(g);
			 * //g.translate(-x, -y);
			 */

			/*
			 * g.fillRect(x, y - fm.getAscent(), (int) rr.getWidth(), (int)
			 * rr.getHeight());
			 */

			// g.drawString(testo, x, y);

			// imageGenerator.saveAsImage("hello-world.png");
			// imageGenerator.saveAsHtmlWithMap("hello-world.html",
			// "hello-world.png");
		}

	}

	/**
	 * 
	 * @param scala
	 * @return
	 */
	private Double getScalaNormalizzata(Double scala) {
		Double normScala = (scala > 1.0) ? (1.0 / scala) : scala;
		return normScala;
	};

	/**
	 * 
	 * @param scala
	 * @param unita
	 * @return
	 */
	private Double getRisoluzioneDaScala(Double scala, String unita,
			double dpi, LogInterface logger) {
		Double risoluzione = null;
		Double scalaNormalizzata = null;
		if (scala != null) {
			if (unita == null) {
				unita = "degrees";
			}
			scalaNormalizzata = getScalaNormalizzata(scala);
			risoluzione = 1 / (scalaNormalizzata * INCHES_PER_UNIT.get(unita) * dpi);
		}

		return risoluzione;
	}

	/**
	 * 
	 * @param scala
	 * @param unita
	 * @param larghezza
	 * @param altezza
	 * @param mapx
	 * @param mapy
	 * @return
	 */
	private BBox getBounds(double scala, String unita, int width_px,
			int height_px, double mapx, double mapy, double dpi,
			LogInterface logger) {

		double risoluzione = getRisoluzioneDaScala(scala, unita, dpi, logger);

		double width = risoluzione * width_px;
		double height = risoluzione * height_px;

		double left = mapx - width / 2;
		double bottom = mapy - height / 2;
		double right = mapx + width / 2;
		double top = mapy + height / 2;

		return new BBox(left, bottom, right, top);
	}

	@Override
	protected String getDefaultForward() {
		return null;
	}

	private class BBox {

		private double left;
		private double bottom;
		private double right;
		private double top;

		public BBox(double left, double bottom, double right, double top) {
			this.left = left;
			this.bottom = bottom;
			this.right = right;
			this.top = top;
		}

		public double getLeft() {
			return left;
		}

		public double getBottom() {
			return bottom;
		}

		public double getRight() {
			return right;
		}

		public double getTop() {
			return top;
		}

		public String toString() {
			return getLeft() + "," + getBottom() + "," + getRight() + ","
					+ getTop();
		}

		public void scale(double scaleFactor) {

			double cx = (getLeft() + getRight()) / 2;
			double cy = (getBottom() + getTop()) / 2;

			double newWidth = (getRight() - getLeft()) * scaleFactor;
			double newHeight = (getTop() - getBottom()) * scaleFactor;

			this.left = cx - newWidth / 2;
			this.bottom = cy - newHeight / 2;
			this.right = cx + newWidth / 2;
			this.top = cy + newHeight / 2;

		}

	}

	private class TileMappa {
		private URI uri = null;
		private int offsetX = 0;
		private int offsetY = 0;
		private BBox bbox = null;
		private Integer w = null;
		private Integer h = null;
		private float opacity = 1;

		public TileMappa(int offsetX, int offsetY, BBox bbox, Integer w,
				Integer h, float opacity) {

			this.offsetX = offsetX;
			this.offsetY = offsetY;
			this.bbox = bbox;
			this.w = w;
			this.h = h;
			this.opacity = opacity;

		}

		/**
		 * @return the uri
		 */
		public URI getUri() {
			return uri;
		}

		/**
		 * @return the offsetX
		 */
		public int getOffsetX() {
			return offsetX;
		}

		/**
		 * @return the offsetY
		 */
		public int getOffsetY() {
			return offsetY;
		}

		/**
		 * @return the bbox
		 */
		public BBox getBbox() {
			return bbox;
		}

		/**
		 * @return the w
		 */
		public Integer getW() {
			return w;
		}

		/**
		 * @return the h
		 */
		public Integer getH() {
			return h;
		}

		/**
		 * @param uri
		 *            the uri to set
		 */
		public void setUri(URI uri) {
			this.uri = uri;
		}

		/**
		 * @return the opacity
		 */
		public float getOpacity() {
			return opacity;
		}

	}
}

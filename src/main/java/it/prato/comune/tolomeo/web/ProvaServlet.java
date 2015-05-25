package it.prato.comune.tolomeo.web;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.HttpCookie;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class ProvaServlet
 */
public class ProvaServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ProvaServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest req, HttpServletResponse response) throws ServletException, IOException {
		
		InputStream is = null;
		OutputStream out = null;
		
		URL url = new URL("http://dvpgeoserver.comune.prato.it/geoserver/comunepo-intra/wms?LAYERS=comunepo-intra%3Aprociv_pn13_liv3_fasea&STYLES=&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG%3A3003&BBOX=1662428.8896784,4853334.32017,1672525.5458814,4867814.678646&WIDTH=357&HEIGHT=512");
		 try {
			
			is = makeconn (url, req);
			if (is!=null) {
				out = response.getOutputStream();
				int c;
	            while ((c = is.read()) != -1) {
	                out.write(c);
	            }
			}
			
		} catch (Exception e1) {
			System.out.println("Eccezione durante connessione HTTP per generazione stampa - url=");
			PrintWriter out1 = response.getWriter();
			out1.println("Stack Trace:<br/>");
			out1.println(displayErrorForWeb(e1));
			out1.close();
		} finally {
			if (is!=null) {
				is.close();
			}
			if (out!=null) {
				out.close();
			}
		}
		
		 /*
		HttpURLConnection huc = null;
		
		InputStream is=null;
		// TODO per adesso la richiesta delle immagini è seriale
		try {
			//"http://dvptolomeo.comune.prato.it/tolomeobinj/Prova1Servlet"
			huc = (HttpURLConnection) new URL("http://dvpgeoserver.comune.prato.it/geoserver/comunepo-intra/wms?LAYERS=comunepo-intra%3Aprociv_pn13_liv3_fasea&STYLES=&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG%3A3003&BBOX=1662428.8896784,4853334.32017,1672525.5458814,4867814.678646&WIDTH=357&HEIGHT=512").openConnection();
			huc.setInstanceFollowRedirects(false);
			huc.setRequestMethod("GET");
			huc.setAllowUserInteraction(false);
			
			//copyCookies(req, huc);
			copyHeaders(req, huc);
			
			huc.setRequestProperty("host", "dvpgeoserver.comune.prato.it");
			
			huc.connect();

			int code = huc.getResponseCode();
			if ((code >= 200) && (code < 300)) {
				is = huc.getInputStream();
				
				OutputStream out = response.getOutputStream();
				
				int c;
	            while ((c = is.read()) != -1) {
	                out.write(c);
	            }
				
			    out.close();
				
			} else {
				System.out.println("Connessione HTTP per recupero immagine mappa fallita! Codice: " + code);
				
				Map<String, List<String>> r = huc.getHeaderFields();
				for (Iterator iterator = r.keySet().iterator(); iterator
						.hasNext();) {
					String type = (String) iterator.next();
					
					for (String s: r.get(type)) {
						PrintWriter out = response.getWriter();
						out.println("Chiave: "+ type + ":" + s);
					}
				} 

				
			}
		} catch (Exception e) {
			System.out.println("Eccezione durante connessione HTTP per generazione stampa - url=");
			PrintWriter out = response.getWriter();
			out.println("Stack Trace:<br/>");
			out.println(displayErrorForWeb(e));
			out.close();
		} finally {
			if (huc != null)
				huc.disconnect();
			if (is != null)
				try {
					is.close();
				} catch (IOException e) {
					System.out.println("Eccezione durante connessione HTTP per generazione stampa - url=");
					throw e;
				}
		}	
	*/
		
	}
	
	
	public InputStream makeconn (URL url, HttpServletRequest req ) throws Exception {
		
		HttpURLConnection huc 	= null;
		InputStream 	  is	= null;
		
		try {
			huc = (HttpURLConnection) url.openConnection();
			huc.setInstanceFollowRedirects(true);
			huc.setRequestMethod("GET");
			huc.setAllowUserInteraction(false);
			
			//copyCookies(req, huc);
			if (req!=null) {
				copyHeaders(req, huc);
			}
			
			return handleConnection(huc);
			
		} catch (Exception e) {
			System.out.println("Eccezione durante connessione HTTP per generazione stampa - url=");
			throw e;
			/*PrintWriter out = response.getWriter();
			out.println("Stack Trace:<br/>");
			out.println(displayErrorForWeb(e));
			out.close();*/
		} finally {
			if (huc != null)
				huc.disconnect();
			if (is != null)
				try {
					is.close();
				} catch (IOException e) {
					System.out.println("Eccezione durante connessione HTTP per generazione stampa - url=");
					throw e;
				}
		}	
		
		
	}
	
	public InputStream handleConnection(HttpURLConnection huc) throws IOException {
		
		boolean 	redirect	= false;
		InputStream is = null;
		try{
			huc.connect();
			int status = huc.getResponseCode();
			
			if (status != HttpURLConnection.HTTP_OK) {
				if (status == HttpURLConnection.HTTP_MOVED_TEMP
					|| status == HttpURLConnection.HTTP_MOVED_PERM
						|| status == HttpURLConnection.HTTP_SEE_OTHER)
				redirect = true;
			}
		 		 
			if (redirect) {
				// get redirect url from "location" header field
				String newUrl = huc.getHeaderField("Location");
		 
				// get the cookie if need, for login
				Map<String, List<String>> r = huc.getHeaderFields();
				
				// open the new connnection again
				huc = (HttpURLConnection) new URL(newUrl).openConnection();
				//copyHeaders(r, huc);
				String cookies = huc.getHeaderField("Set-Cookie");
				huc.setRequestProperty("Cookie", cookies);
				huc.addRequestProperty("Accept-Language", "en-US,en;q=0.8");
				huc.addRequestProperty("User-Agent", "Mozilla");
				//huc.addRequestProperty("Referer", "google.com");
		 
				System.out.println("Redirect to URL : " + newUrl);
				for (Iterator iterator = r.keySet().iterator(); iterator
						.hasNext();) {
					String type = (String) iterator.next();
					
					for (String s: r.get(type)) {
						System.out.println("Chiave: "+ type + ":" + s);
					}
				}
				
				return handleConnection(huc);
			} else {
				if ((status >= 200) && (status < 300)) {
					is = huc.getInputStream();
					return is;
					
				} else {
					System.out.println("Connessione HTTP per recupero immagine mappa fallita! Codice: " + status);
					return null;
					/*
					Map<String, List<String>> r = huc.getHeaderFields();
					for (Iterator iterator = r.keySet().iterator(); iterator
							.hasNext();) {
						String type = (String) iterator.next();
						
						for (String s: r.get(type)) {
							PrintWriter out = response.getWriter();
							out.println("Chiave: "+ type + ":" + s);
						}
					}*/	
				}
			}
		} catch (IOException e) {
			throw e;
		}
	}
	
	public String displayErrorForWeb(Throwable t) {
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		t.printStackTrace(pw);
		String stackTrace = sw.toString();
		return stackTrace.replace(System.getProperty("line.separator"), "<br/>\n");
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	private void copyCookies(HttpServletRequest src, HttpURLConnection dst) throws URISyntaxException {

		/*
		 * 
		 * 
		List<HttpCookie> clist = HttpCookie.parse(src.getHeader("Set-Cookie"));
		for (HttpCookie c1: clist) {
			//HttpCookie c1 = new HttpCookie(c.getName(), c.getValue());
			msCookieManager.getCookieStore().add(null,c1);
		}		
		 * 
		 */
		
		CookieManager msCookieManager = new CookieManager();
		msCookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ALL);
		CookieHandler.setDefault(msCookieManager); 

		for (Cookie c: src.getCookies()) {
			HttpCookie c1 = new HttpCookie(c.getName(), c.getValue());
			c1.setDomain(c.getDomain());
			c1.setPath(c.getPath());
			msCookieManager.getCookieStore().add(new URI("http://tolomeo.comune.prato.it/tolomeo"),c1);
		}		
	}

	private void copyHeaders(HttpServletRequest src, HttpURLConnection dst) {
		
		Enumeration hn=src.getHeaderNames();
		while (hn.hasMoreElements()){
		    String headerName = (String) hn.nextElement();
		    if (!"Host".equalsIgnoreCase(headerName)
		    		&& !"Accept-Encoding".equalsIgnoreCase(headerName)
		    		&& !"Location".equalsIgnoreCase(headerName)) {
		    	dst.setRequestProperty(headerName, src.getHeader(headerName));
		    }
		}
	}
	
	private void copyHeaders(Map<String, List<String>> r, HttpURLConnection dst) {
		
		for (Iterator iterator = r.keySet().iterator(); iterator
				.hasNext();) {
			String headerName = (String) iterator.next();
			if (headerName != null) {
				List<String> c = r.get(headerName);
				
				for (String s: r.get(headerName)) {
				    if (!"Host".equalsIgnoreCase(headerName)
				    		&& !"Accept-Encoding".equalsIgnoreCase(headerName)
				    		&& !"Location".equalsIgnoreCase(headerName)
				    		&& !"Content-Length".equalsIgnoreCase(headerName)) {

						System.out.println("Copiato header " + headerName + " valore " + s);
				    	dst.setRequestProperty(headerName, s);
				    }
					//System.out.println("Chiave: "+ headerName + ":" + s);
				}
			}
		}
		
	}
	
}

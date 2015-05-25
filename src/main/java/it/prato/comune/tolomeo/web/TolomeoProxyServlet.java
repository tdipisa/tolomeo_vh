package it.prato.comune.tolomeo.web;

import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;



/**
 * Servlet implementation class for Servlet: LayerProxyServlet
 *
 */
 public class TolomeoProxyServlet extends TolomeoServlet {

    private static final long serialVersionUID = 4600713302217773781L;

    //private List<String> hostnameWhitelist = new ArrayList<String>();

    public void init(ServletConfig config) throws ServletException {       
        super.init(config);
        
      //  TolomeoApplicationContext tolomeoContext = TolomeoApplicationContext.getInstance();        
        
                    
        
    }
   
   public void doGet(HttpServletRequest request, HttpServletResponse response){
       doPost(request, response);
   }

   public void doPost(HttpServletRequest request, HttpServletResponse response){

       // Recupero il logger
       LogInterface logger = getLogger(request);       
       
       TolomeoApplicationContext tolomeoContext = TolomeoApplicationContext.getInstance();
       
       List<String> hostnameWhitelist = new ArrayList<String>();
       
       // Imposto gli host a cui è permesso fare richieste
       String hostnameWhitelistStr = (String)tolomeoContext.getProperty("PROXY.HOSTNAME_WHITELIST");
                            
       if(hostnameWhitelistStr != null){
           hostnameWhitelist.addAll(Arrays.asList(hostnameWhitelistStr.split(",")));
       }    

       BufferedInputStream webToProxyBuf = null;
       BufferedOutputStream proxyToClientBuf = null;
       HttpURLConnection conn = null;
       
       try{
           int statusCode;
           String methodName;
           String user = null;
           String password = null;
           
           String requestProtocol   = request.getProtocol().split("/")[0].toLowerCase();
           String characterEncoding = request.getCharacterEncoding() != null ? request.getCharacterEncoding() : "UTF-8";
           
           String urlString = request.getParameter("url");
           String role = request.getParameter("role");
           
           if(urlString == null){
               urlString = request.getQueryString();
           }           
           
           // Sostituisco il primo & con ? nel caso 
           if (!urlString.contains("?")) urlString = urlString.replaceFirst("&", "?");
           
           urlString = URLDecoder.decode(urlString,characterEncoding);                      
           
           String regExp = "^([a-zA-Z])+\\:\\/\\/";                
           Pattern pattern = Pattern.compile(regExp);        
           Matcher m = pattern.matcher(urlString);
           
           if(!m.find()){
               logger.debug("Protocollo non impostato. Impongo " + requestProtocol);
               urlString = requestProtocol + "://" + urlString;
           }
                      
           String[] urlTokens = urlString.split("/");
           String host = urlTokens[2];
           host = host.split(":")[0];
           
           // Controllo se l'host richiesto è fra quelli di fiducia
           if(!hostnameWhitelist.contains(host)){
               logger.error("L'host richiesto non è fra quelli consentiti " + hostnameWhitelist.size());
               for(String trustedHost : hostnameWhitelist){
                   logger.debug("host consentito = " + trustedHost);
               }
               response.setStatus(403);
               PrintWriter out = response.getWriter(); 
               out.write("l'host richiesto \"" + host + "\" non è fra quelli consentiti");
               out.flush();
               out.close();
               return;
           }

           URL url = new URL(urlString);
           
           // se no è stato passato il role nel url del proxy cerco nell'url originale
           if(role == null){
               String queryString = url.getQuery();    
               
               if(queryString != null){
                   String[] keyValues = queryString.split("=|&");
                   for(int i = 0; i < keyValues.length; i+=2){
                       if(keyValues[i].equals("role")){
                           role = keyValues[i+1];
                           break;
                       }
                   
                   }         
               }
           }
           
           logger.debug("role = " + role);
           
           // controllo le credenziali
           if(role != null){
               user     = (String)tolomeoContext.getProperty("PROXY.CREDENTIALS." + role + ".USR");
               password = (String)tolomeoContext.getProperty("PROXY.CREDENTIALS." + role + ".PWD");
               
               if(user == null || password == null){
                   logger.error("Credenziali non valide : il ruolo  " + role + " non è un ruolo definito");
                   response.setStatus(403);
                   PrintWriter out = response.getWriter(); 
                   out.write("Accesso non consentito con le credenziali impostate");
                   out.flush();
                   out.close();
                   return;
               }
           }
           
           URI uriMappa = null;
           int localPort = request.getLocalPort();
           int portN = url.getPort();                      
           if(portN == -1){            
               if(localPort != -1){
                   logger.debug("Porta non impostata. Impongo " + localPort);
                   portN = localPort;  
               }
           }
           
           try {
               host = url.getHost();
               host = (host==null || host.equals("")) ? request.getServerName() : host;                              
               uriMappa = new URI(url.getProtocol(),null,host,portN,url.getPath(),url.getQuery(),null);
               logger.debug("URI : " + uriMappa);
               
           } catch (URISyntaxException e) {
               logger.error("URI errore di sintassi", e);
               throw new IOException(e.getMessage());
           }
           
           conn =(HttpURLConnection) uriMappa.toURL().openConnection();                                 
           methodName = request.getMethod();
           
           conn.setRequestMethod(methodName);
           conn.setAllowUserInteraction(false);
           conn.setDoOutput(true);
           conn.setDoInput(true);
           HttpURLConnection.setFollowRedirects(true);
           conn.setUseCaches(true);
           
           for( Enumeration<String> e = request.getHeaderNames() ; e.hasMoreElements();){
               String headerName = e.nextElement();               
               conn.setRequestProperty(headerName, request.getHeader(headerName));               
           }           
           
           conn.setRequestProperty("host", host);
           
           // se user e password sono diversi da null utilizzo la basic authentication
           String digest=null;
           if (user != null && password!=null) {
               digest = "Basic " + new String(Base64.encodeBase64((user+":"+password).getBytes()));
           }
           if (digest != null) {
               conn.setRequestProperty("Authorization", digest);
           }
           conn.connect();                               
           
           if(methodName.equals("POST")){
               
               BufferedInputStream clientToProxyBuf = null;
               BufferedOutputStream proxyToWebBuf   = null;
               
               try {
                   clientToProxyBuf = new BufferedInputStream(request.getInputStream());
                   proxyToWebBuf    = new BufferedOutputStream(conn.getOutputStream());
                   
                   byte [] buffer = new byte[4096] ;
                   int bytes = 0; 
                   while (true) {  
                       bytes = clientToProxyBuf.read (buffer); 
                       if (bytes <= 0) break;       
                       proxyToWebBuf.write(buffer, 0, bytes);        
                   }
                   /*
                   while ((oneByte = clientToProxyBuf.read()) != -1){ 
                       proxyToWebBuf.write(oneByte);
                   }
                   */
               } finally {
                   if(proxyToWebBuf != null){
                       proxyToWebBuf.flush();
                       proxyToWebBuf.close();
                   }
                   
                   if(clientToProxyBuf != null){
                       clientToProxyBuf.close();
                   }
               }
           }
                     
                                                               
           statusCode = conn.getResponseCode();           
           response.setStatus(statusCode);
           response.setContentType(conn.getContentType());
           
           logger.debug("Impostato status code della risposta " + statusCode);
           logger.debug("RESPONSE HEADERS");
           
           for( Iterator<Entry<String,List<String>>> i = conn.getHeaderFields().entrySet().iterator() ; i.hasNext() ;){
               Map.Entry mapEntry = (Map.Entry)i.next();
               if(mapEntry.getKey()!=null){
                   if(mapEntry.getKey().toString().startsWith("Content-")){
                       response.setHeader(mapEntry.getKey().toString(), ((List)mapEntry.getValue()).get(0).toString());
                       logger.debug(mapEntry.getKey().toString() + " = " + ((List)mapEntry.getValue()).get(0).toString());
                   }
               }
           }           
            
           if ((statusCode >= 200) && (statusCode < 300)){
               webToProxyBuf = new BufferedInputStream(conn.getInputStream());
           }else{
               webToProxyBuf = new BufferedInputStream(conn.getErrorStream());
           }
           
           proxyToClientBuf = new BufferedOutputStream(response.getOutputStream());   
        
           byte [] buffer = new byte[4096] ;
           int bytes = 0; 
           while (true) {  
               bytes = webToProxyBuf.read (buffer); 
               if (bytes <= 0) break;       
               proxyToClientBuf.write(buffer, 0, bytes);        
           }                
/*
           int oneByte;
           while ((oneByte = webToProxyBuf.read()) != -1) 
               proxyToClientBuf.write(oneByte);
                      
           // logger.debug("Scritta risposta al client");

           proxyToClientBuf.flush();
           proxyToClientBuf.close();

           webToProxyBuf.close();
           conn.disconnect();
           
           logger.debug("Disconnesso");
  */         
       } catch(Exception e) {
           logger.error("Problemi nel recupero della risorsa",e);                        
       } finally {
           
           if(proxyToClientBuf != null){
               try{
                   //proxyToClientBuf.flush();
                   proxyToClientBuf.close();
               } catch (IOException e) {
                   logger.error("Problemi nella chiusura del proxyToClientBuf ",e);
               }
           }
           
           if(webToProxyBuf != null){
               try {
                   webToProxyBuf.close();
               } catch (IOException e) {
                   logger.error("Problemi nella chiusura del webToProxyBuf ",e);
               }
           }
           
           if(conn != null){
               conn.disconnect();
           }           
       
       }
    }
      
    @Override
    protected String getDefaultForward() {
        return null;
    }

 }
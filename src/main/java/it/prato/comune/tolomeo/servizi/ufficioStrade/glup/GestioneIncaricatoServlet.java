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
package it.prato.comune.tolomeo.servizi.ufficioStrade.glup;

import it.prato.comune.sit.LayerGLUPCantieri;
import it.prato.comune.sit.beans.glup.IncaricatoBean;
import it.prato.comune.sit.dao.glup.GLUPTransactionService;
import it.prato.comune.sit.dao.glup.IncaricatoDAO;
import it.prato.comune.tolomeo.utility.Costanti;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Submit;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class GestioneIncaricatoServlet extends TolomeoServlet {

    private static final long serialVersionUID = 1L;    
    private static final String TIPO_OPERAZIONE_RICERCA_ALL = "T"; // cerca tutti
    public static final String PAGE_GESTIONE_INCARICATO     = "/jsp/servizi/ufficioStrade/glup/gestioneIncaricato.jsp";
    public static final String PAGE_VISUALIZZA_INCARICATO   = "/jsp/servizi/ufficioStrade/glup/visualizzaIncaricato.jsp";    
    private static final String PAGE_LISTA_INCARICATI            = "/jsp/servizi/ufficioStrade/glup/listaIncaricati.jsp";
    private static final String SERVICE_GESTIONE_INCARICATO = "/glup/GestioneIncaricato";

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }
    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
                
        LogInterface logger = getLogger(request);
        String operazioneStr = request.getParameter("operazione");
        String tipoOperazione = request.getParameter("tipoOperazione");
        Costanti.OperazioniStandard operazione = (operazioneStr == null) ? null : Costanti.OperazioniStandard.decode(operazioneStr.toUpperCase());         
                
        // OPERAZIONE DI DEFAULT
        if(operazione == null){
            operazione = Costanti.OperazioniStandard.RICERCA;
        }
                
        String forwardUrl = getDefaultForward();
        
        // OPERAZIONE DI VISUALIZZAZIONE (SI RIMANDA AL PROGETTO)
        if(operazione.equals(Costanti.OperazioniStandard.VISUALIZZAZIONE)){
            
            // VISUALIZZAZIONE
            forwardUrl = visualizza(request, logger);       
         
        // GESTIONE RICERCA
        } else if (operazione.equals(Costanti.OperazioniStandard.RICERCA)) {
                               
            // RICERCA DI TUTTI GLI INCARICATI
            if(tipoOperazione == null || tipoOperazione.equals(TIPO_OPERAZIONE_RICERCA_ALL)){                
                forwardUrl  = cercaTutti(request, logger);
                
            // SE IL TIPO RICERCA NON E' IMPLEMENTATO, AVVERTO E RIMANDO ALLA LISTA DI TUTTE    
            }else{
                addErrore(request, "Tipo ricerca incaricati non implementato");
                forwardUrl = cercaTutti(request, logger);
            }
 
        // GESTIONE INSERIMENTO
        } else if (operazione.equals(Costanti.OperazioniStandard.INSERIMENTO)) {
                                                    
            // GESTIONE INSERIMENTO
            forwardUrl  = gestioneInserimento(request, logger);
                                        
        } else if (operazione.equals(Costanti.OperazioniStandard.MODIFICA)) {
                           
            // GESTIONE MODIFICA
            forwardUrl  = gestioneModifica(request, logger);
            
                                        
        } else if (operazione.equals(Costanti.OperazioniStandard.INSERIMENTO_OK)) {
            
            // INSERIMENTO
            forwardUrl = inserisci(request,logger);
            
        } else if (operazione.equals(Costanti.OperazioniStandard.MODIFICA_OK)) {
            
            // MODIFICA
            forwardUrl = modifica(request,logger);
            
        } else {
                        
            addErrore(request, "Operazione non implementata");
            forwardUrl = getDefaultForward();
            
        }
        
        forward(forwardUrl, request, response);
        return;        
    }
    
            
    @Override
    protected String getDefaultForward() {
        return SERVICE_GESTIONE_INCARICATO;
    }
    
    private String visualizza(HttpServletRequest request, LogInterface logger) throws ServletException, java.io.IOException{
        
        Integer idIncaricato = recuperaIdIncaricato(request);
        
        // qui si arriva sempre per id e quindi deve essere presente
        if(idIncaricato == null){
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        
        // se ci sono stati errori di connessione al db o il incaricato è nullo
        if(!caricaIncaricato(idIncaricato, request, logger)){
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
                        
        request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA.getCode());
        addButton(request, Input.MODIFICA);                            
        addButton(request, new Submit(Input.CSS_STYLE_GENERICO,"","Elenco incaricati","Vai all'elenco degli incaricati").onClick(Input.ONCLICK_DEFAULT));
        return PAGE_VISUALIZZA_INCARICATO;
                    
    }
    
    private String cercaTutti(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;           
        }
        
        try{
            IncaricatoDAO IncaricatoDAO = new IncaricatoDAO(getLogger(request));
            
            // legge tutte gli incaricati non cessati
            List<IncaricatoBean> incaricati = IncaricatoDAO.leggiTutti(service.getConnection());
            
            request.setAttribute("incaricati", incaricati);
                                                
            request.setAttribute("operazione", Costanti.OperazioniStandard.INSERIMENTO.getCode());
            addButton(request, Submit.lookLike(Input.INSERISCI).val("Nuovo").titled("Aggingi un incaricato"));                                                    
            
        } catch (SQLException e){
            String msg = "Errore durante di accesso ai dati";
            logger.error(msg,e);
            addErrore(request, msg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        } finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
        
        return PAGE_LISTA_INCARICATI;
    }
            
    private String gestioneInserimento(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
            
        IncaricatoBean incaricato = (IncaricatoBean)request.getAttribute("incaricato");
        
        // se esiste già un incaricato utilizzo i dati passati, altrimenti lo creo
        if(incaricato == null){
            incaricato = new IncaricatoBean();            
            request.setAttribute("incaricato", incaricato);               
        }
        
        request.setAttribute("pageTitle", "Inserimento nuovo incaricato");
        request.setAttribute("operazione", Costanti.OperazioniStandard.INSERIMENTO_OK.getCode());
        addButton(request, Input.INSERISCI_OK);
        addButton(request, Submit.lookLike(Input.TERMINA).named(""));
        
        return PAGE_GESTIONE_INCARICATO;
            
        
    }
    
    private String inserisci(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        Integer idInterno = recuperaIdInterno(request);
        
        IncaricatoBean incaricato = new IncaricatoBean();
        
        if(idInterno != null){
            incaricato.setIdInterno(idInterno);
        }else{
            String nome = recuperaNome(request);
            String cognome = recuperaCognome(request);
            String numTel1 = recuperaNumTel1(request);
            String numTel2 = recuperaNumTel2(request);
            String fax = recuperaFax(request);
            String email = recuperaEmail(request);
            
            incaricato.setCognome(cognome);
            incaricato.setNome(nome);
            incaricato.setNumTel1(numTel1);
            incaricato.setNumTel2(numTel2);
            incaricato.setFax(fax);
            incaricato.setEmail(email);
        }
                
        request.setAttribute("incaricato", incaricato);
        
        // se c'è un errore nei parametri devo caricare i dati necessari e tornare alla pagina di gestione/inserimento
        // quindi chiamo la funzione che gestisce i dati di inserimento
        if(isThereMessaggioErrore(request)){                
            return gestioneInserimento(request, logger);                                
        }   
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;           
        }
        
        // I parameri sono OK e procedo all'inserimento
        boolean inserito = false;
        try{
            
            IncaricatoDAO incaricatoDAO = new IncaricatoDAO(getLogger(request));
            inserito = incaricatoDAO.insert(incaricato, service.getConnection());
            service.commit();
            
        } catch (SQLException e) {
            String msg = "Errore durante inserimento dati";
            logger.error(msg,e);
            addErrore(request, msg); 
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
                       
        if(!inserito){
            addWarning(request, "L'inserimento non ha avuto successo!");
        }else{
            addInformazione(request, "Incaricato inserito correttamente!");
        }
        // Rimando alla pagina di visualizzazione della ditta
        return SERVICE_GESTIONE_INCARICATO + "?operazione=R&tipoOperazione=T";
    }
    
    
    private String modifica(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        Integer idIncaricato = recuperaIdIncaricato(request);
        
        // I due parametri sopra non dipendono dall'utente, quindi devono sempre essere valorizzati.
        // Se così non è rimando alla pagina di errore del pannello
        if(idIncaricato == null){                                    
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }             
        
        Integer idInterno = recuperaIdInterno(request);
        IncaricatoBean incaricato = new IncaricatoBean();
        incaricato.setId(idIncaricato);
        
        if(idInterno != null){
            incaricato.setIdInterno(idInterno);
        }else{
            String nome = recuperaNome(request);
            String cognome = recuperaCognome(request);
            String numTel1 = recuperaNumTel1(request);
            String numTel2 = recuperaNumTel2(request);
            String fax = recuperaFax(request);
            String email = recuperaEmail(request);
            
            incaricato.setCognome(cognome);
            incaricato.setNome(nome);
            incaricato.setNumTel1(numTel1);
            incaricato.setNumTel2(numTel2);
            incaricato.setFax(fax);
            incaricato.setEmail(email);
        }
                
        request.setAttribute("incaricato", incaricato);
                          
        // se c'è un errore nei parametri deo caricare i dati necessari e tornare alla pagina di gestione modifica
        // quindi chiamo la funzione che gestisce i dati di modifica
        if(isThereMessaggioErrore(request)){                
            return gestioneModifica(request, logger);                                
        } 
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;           
        }
            
        boolean aggiornato = false;
        
        try{

            IncaricatoDAO incaricatoDAO = new IncaricatoDAO(getLogger(request));
            aggiornato = incaricatoDAO.update(incaricato, service.getConnection());
            service.commit();
                                    
        } catch (SQLException e) {
            String msg = "Errore durante inserimento dati";
            logger.error(msg,e);
            addErrore(request, msg); 
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
                
        if(!aggiornato){
            addWarning(request,"La modifica non ha avuto successo!");           
        }else{
            addInformazione(request, "Incaricato modificato!");
        }
        return SERVICE_GESTIONE_INCARICATO + "?operazione=V&idIncaricato=" + idIncaricato;
    }
    
    private String gestioneModifica(HttpServletRequest request, LogInterface logger) throws ServletException, java.io.IOException{
        
        Integer idIncaricato = recuperaIdIncaricato(request);
        
        // qui si arriva sempre per id e quindi deve essere presente
        // non uso il controllo dei messaggi di errore, perchè potrei arrivare dalla modifica
        if(idIncaricato == null){
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
                
        IncaricatoBean incaricato = (IncaricatoBean)request.getAttribute("incaricato");
        
        // se esiste già un incaricato non lo cerco, ma utilizzo i dati passati (perchè potrei arrivare da un altro passaggio, 
        // errore in inserimento x esempio)
        if(incaricato == null){
            // se ci sono stati errori di connessione al db o il incaricato è nullo
            if(!caricaIncaricato(idIncaricato, request, logger)){
                return TolomeoServlet.ERROR_PAGE_PANNELLO;
            }               
        }
        
        request.setAttribute("pageTitle", "Modifica incaricato \"" + idIncaricato +"\"");
        request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA_OK.getCode());
        addButton(request, Input.MODIFICA_OK);
        addButton(request, Input.PULISCI);
        addButton(request, Submit.lookLike(Input.TERMINA).onClick("if(this.form.operazione){this.form.operazione.value = 'V';}"));            
        
        return PAGE_GESTIONE_INCARICATO;
                    
    }
    
    /**
     * Carica il bean dell'incaricato nel request e ritorna true se è andato tutto bene, false altrimenti
     * 
     * @param idIncaricato
     * @param request
     * @param logger
     * @return
     */
    private boolean caricaIncaricato(Integer idIncaricato, HttpServletRequest request, LogInterface logger) throws IOException{
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return false;           
        }
        
        try{
            IncaricatoDAO incaricatoDAO = new IncaricatoDAO(logger);                        
 
            // legge l'incaricato per id
            IncaricatoBean incaricato = incaricatoDAO.leggi(idIncaricato, service.getConnection());
            
            if(incaricato == null){
                addErrore(request,"L'incaricato non risulta presente");
                return false;
            }
                                    
            request.setAttribute("incaricato", incaricato);                        
            return true;            
            
        } catch (SQLException e){
            String msg = "Errore durante di accesso ai dati";
            logger.error(msg,e);
            addErrore(request, msg);            
            return false;
        } finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
    }
        
    private Integer recuperaIdIncaricato(HttpServletRequest request){
        
        String param = request.getParameter("idIncaricato");
        if(StringUtils.isEmpty(param)){  
            addErrore(request, "Identificativo incaricato non valorizzato!");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo incaricato non numerico");
            return null;
        }  
    }
    
    private Integer recuperaIdInterno(HttpServletRequest request){
        
        String param = request.getParameter("idInterno");
        if(StringUtils.isEmpty(param)){        
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo incaricato non numerico");
            return null;
        }  
    }
            
    private String recuperaNumTel1(HttpServletRequest request){
        
        String param = request.getParameter("numTel1");
        if(StringUtils.isEmpty(param)){            
            return null;
        }
        param = param.trim();
        if(!isValidPhoneNumber(param)){
            addErrore(request,"Il Numero di telefono 1 non è un numero valido");
        }
        return param;
     }  
    
    private String recuperaNumTel2(HttpServletRequest request){
        
        String param = request.getParameter("numTel2");
        if(StringUtils.isEmpty(param)){            
            return null;
        }
        param = param.trim();
        if(!isValidPhoneNumber(param)){
            addErrore(request,"Il Numero di telefono 2 non è un numero valido");
        }
        return param;
     }
    
    private String recuperaFax(HttpServletRequest request){
        
        String param = request.getParameter("fax");
        if(StringUtils.isEmpty(param)){            
            return null;
        }
        param = param.trim();
        if(!isValidPhoneNumber(param)){
            addErrore(request,"Il Numero di fax non è un numero valido");
        }
        return param;
     }
    
     private String recuperaNome(HttpServletRequest request){
        
        String param = request.getParameter("nome");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"Il Nome deve essere valorizzato!");
            return null;
        }
        return param.trim();  
     }  
    
     private String recuperaCognome(HttpServletRequest request){
        
        String param = request.getParameter("cognome");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"Il Cognome deve essere valorizzato!");
            return null;
        }
        return param.trim();  
     }  
        
     private String recuperaEmail(HttpServletRequest request){
                                             
         String param = request.getParameter("email");
         if(StringUtils.isEmpty(param)){
             return null;            
         }
         
         param = param.trim();                 
         String  expression="^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\\.)+[A-Z]{2,4}$";         
         Pattern pattern = Pattern.compile(expression,Pattern.CASE_INSENSITIVE);
         Matcher matcher = pattern.matcher(param);
         if(!matcher.matches()){
             addErrore(request, "Indirizzo email non valido!");             
         }   
         return param;
         
     }   
     
     /**
      * Controlla solo che non ci sia un carattere diverso da spazio, numeri e +
      * @return
      */
     private static boolean isValidPhoneNumber(String phoneNumber){
         String  expression="^\\+?([0-9]{2,8}\\s?)+$";       
         Pattern pattern = Pattern.compile(expression,Pattern.CASE_INSENSITIVE);
         Matcher matcher = pattern.matcher(phoneNumber);
         return matcher.matches();         
     }
}

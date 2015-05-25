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
import it.prato.comune.sit.beans.glup.AnagraficaDittaBean;
import it.prato.comune.sit.beans.glup.DittaBean;
import it.prato.comune.sit.beans.glup.ReferenteBean;
import it.prato.comune.sit.dao.glup.DittaDAO;
import it.prato.comune.sit.dao.glup.GLUPTransactionService;
import it.prato.comune.sit.dao.glup.ReferenteDAO;
import it.prato.comune.tolomeo.utility.Costanti;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Submit;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.SQLException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class GestioneReferenteServlet extends TolomeoServlet {

    private static final long serialVersionUID = 1L;    
    public static final String PAGE_GESTIONE_REFERENTE     = "/jsp/servizi/ufficioStrade/glup/gestioneReferente.jsp";
    public static final String PAGE_VISUALIZZA_REFERENTE   = "/jsp/servizi/ufficioStrade/glup/visualizzaReferente.jsp";
    public static final String SERVICE_GESTIONE_DITTA      = "/glup/GestioneDitta";
    private static final String SERVICE_GESTIONE_REFERENTE = "/glup/GestioneReferente";

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }
    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
                
        LogInterface logger = getLogger(request);
        String operazioneStr = request.getParameter("operazione");
//        String tipoOperazione = request.getParameter("tipoOperazione");
        Costanti.OperazioniStandard operazione = (operazioneStr == null) ? null : Costanti.OperazioniStandard.decode(operazioneStr.toUpperCase());         
                
        // OPERAZIONE DI DEFAULT
        if(operazione == null){
            forward(request, response);
            return;
        }
                
        String forwardUrl = getDefaultForward();
        
        // OPERAZIONE DI VISUALIZZAZIONE (SI RIMANDA AL PROGETTO)
        if(operazione.equals(Costanti.OperazioniStandard.VISUALIZZAZIONE)){
            
            // VISUALIZZAZIONE
            forwardUrl = visualizza(request, logger);       
        
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
        return SERVICE_GESTIONE_DITTA;
    }
    
    private String visualizza(HttpServletRequest request, LogInterface logger) throws ServletException, java.io.IOException{
        
        int idReferente = recuperaIdReferente(request);
        
        // qui si arriva sempre per id e quindi deve essere presente
        if(isThereMessaggioErrore(request)){
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        
        // se ci sono stati errori di connessione al db o il referente è nullo
        if(!caricaReferente(idReferente, request, logger)){
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
                        
        request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA.getCode());
        addButton(request, Input.MODIFICA);        
        addButton(request, new Submit(Input.CSS_STYLE_GENERICO,"V","Ditta","Vai alla ditta").onClick(Input.ONCLICK_DEFAULT).onClick("this.form.action='/tolomeobinj/glup/GestioneDitta';"));            
        
        return PAGE_VISUALIZZA_REFERENTE;
                    
    }
            
    private String gestioneInserimento(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
         
        Integer idDitta = recuperaIdDitta(request);
        
        // la ditta a cui assegnare il referente deve essere valorizzata
        if(idDitta == null){                                    
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);                        
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        try {               
            //  carico la ditta di appartenenza 
            DittaDAO dittaDAO = new DittaDAO(logger);            
            AnagraficaDittaBean ditta = dittaDAO.leggiAnagrafica(idDitta, service.getConnection());            
            
            // se la ditta non esiste rimando alla pagina di errore
            if(ditta == null){
                addErrore(request, "Ditta inesistente");
                return TolomeoServlet.ERROR_PAGE_PANNELLO;
            }
            
            request.setAttribute("ditta", ditta);            
            
            ReferenteBean referente = (ReferenteBean)request.getAttribute("referente");
            
            // se esiste già un referente utilizzo i dati passati, altrimenti lo creo
            if(referente == null){
                referente = new ReferenteBean();
                referente.setIdDitta(idDitta);
                request.setAttribute("referente", referente);               
            }
            
            request.setAttribute("pageTitle", "Inserimento nuovo referente");
            request.setAttribute("operazione", Costanti.OperazioniStandard.INSERIMENTO_OK.getCode());
            addButton(request, Input.INSERISCI_OK);
            addButton(request, Submit.lookLike(Input.TERMINA).onClick("this.form.action = '/tolomeobinj/glup/GestioneDitta'; if(this.form.operazione){this.form.operazione.value = 'V';};"));
            
            return PAGE_GESTIONE_REFERENTE;
            
        } catch(SQLException e){
            String msg = "Errore durante di accesso ai dati";
            logger.error(msg,e);
            addErrore(request, msg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        } finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
    }
    
    private String inserisci(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
                
        Integer idDitta = recuperaIdDitta(request);
        
        // l'idDitta deve essere presente
        if(isThereMessaggioErrore(request)){                                    
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }           
                
        String nome = recuperaNome(request);
        String cognome = recuperaCognome(request);
        String numTel1 = recuperaNumTel1(request);
        String numTel2 = recuperaNumTel2(request);
        String fax = recuperaFax(request);
        String email = recuperaEmail(request);
                           
        ReferenteBean referente = new ReferenteBean();
        
        referente.setIdDitta(idDitta);
        referente.setCognome(cognome);
        referente.setNome(nome);
        referente.setNumTel1(numTel1);
        referente.setNumTel2(numTel2);
        referente.setFax(fax);
        referente.setEmail(email);
                
        request.setAttribute("referente", referente);
        
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
            
            ReferenteDAO referenteDAO = new ReferenteDAO(getLogger(request));
            inserito = referenteDAO.insert(referente, service.getConnection());
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
        } else {
            addInformazione(request, "Referente inserito!");
        }
        
        // Rimando alla pagina di visualizzazione della ditta
        return SERVICE_GESTIONE_DITTA + "?operazione=V&idDitta="+idDitta;
    }
    
    private String modifica(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        Integer idReferente = recuperaIdReferente(request);
        Integer idDitta = recuperaIdDitta(request);
        
        // I due parametri sopra non dipendono dall'utente, quindi devono sempre essere valorizzati.
        // Se così non è rimando alla pagina di errore del pannello
        if(isThereMessaggioErrore(request)){                                    
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }             
        
                
        String nome = recuperaNome(request);
        String cognome = recuperaCognome(request);
        String numTel1 = recuperaNumTel1(request);
        String numTel2 = recuperaNumTel2(request);
        String fax = recuperaFax(request);
        String email = recuperaEmail(request);
                           
        ReferenteBean referente = new ReferenteBean();
        
        referente.setId(idReferente);
        referente.setIdDitta(idDitta);
        referente.setCognome(cognome);
        referente.setNome(nome);
        referente.setNumTel1(numTel1);
        referente.setNumTel2(numTel2);
        referente.setFax(fax);
        referente.setEmail(email);
                
        request.setAttribute("referente", referente);
                          
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

            ReferenteDAO referenteDAO = new ReferenteDAO(getLogger(request));
            aggiornato = referenteDAO.update(referente, service.getConnection());
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
            addWarning(request, "La modifica non avuto successo");
        }else{
            addInformazione(request, "Referente modificato!");
        }
        return SERVICE_GESTIONE_REFERENTE + "?operazione=V&idReferente=" + idReferente;
    }
    
    private String gestioneModifica(HttpServletRequest request, LogInterface logger) throws ServletException, java.io.IOException{
        
        Integer idReferente = recuperaIdReferente(request);
        
        // qui si arriva sempre per id e quindi deve essere presente
        // non uso il controllo dei messaggi di errore, perchè potrei arrivare dalla modifica
        if(idReferente == null){
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
                
        ReferenteBean referente = (ReferenteBean)request.getAttribute("referente");
        
        // se esiste già un referente non lo cerco, ma utilizzo i dati passati (perchè potrei arrivare da un altro passaggio, 
        // errore in inserimento x esempio)
        if(referente == null){
            // se ci sono stati errori di connessione al db o il referente è nullo
            if(!caricaReferente(idReferente, request, logger)){
                return TolomeoServlet.ERROR_PAGE_PANNELLO;
            }               
        }
        
        request.setAttribute("pageTitle", "Modifica referente \"" + idReferente +"\"");
        request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA_OK.getCode());
        addButton(request, Input.MODIFICA_OK);
        addButton(request, Input.PULISCI);
        addButton(request, Submit.lookLike(Input.TERMINA).onClick("if(this.form.operazione){this.form.operazione.value = 'V';}"));            
        
        return PAGE_GESTIONE_REFERENTE;
                    
    }
    
    /**
     * Carica il bean del referente nel request e ritorna true se è andato tutto bene, false altrimenti
     * @param idReferente
     * @param request
     * @param logger
     * @return
     */
    private boolean caricaReferente(Integer idReferente, HttpServletRequest request, LogInterface logger) throws IOException{
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return false;           
        }
        
        try{
            ReferenteDAO referenteDAO = new ReferenteDAO(logger);                        
 
            // legge il referente per id
            ReferenteBean referente = referenteDAO.leggi(idReferente, service.getConnection());
            
            if(referente == null){
                addErrore(request,"Il referente non risulta presente");
                return false;
            }
            
            DittaDAO dittaDAO = new DittaDAO(logger);
            DittaBean ditta = dittaDAO.leggi(referente.getIdDitta(), service.getConnection());
            
            request.setAttribute("ditta", ditta);
            request.setAttribute("referente", referente);                        
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
        
    private Integer recuperaIdReferente(HttpServletRequest request){
        
        String param = request.getParameter("idReferente");
        if(StringUtils.isEmpty(param)){        
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo referente non numerico");
            return null;
        }  
     }
    
    private Integer recuperaIdDitta(HttpServletRequest request){
        
        String param = request.getParameter("idDitta");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"Ditta non selezionata");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo Ditta non numerico");
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

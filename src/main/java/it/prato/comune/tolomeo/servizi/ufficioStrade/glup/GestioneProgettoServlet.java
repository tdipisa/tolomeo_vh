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

import it.prato.comune.menu.startup.GestioneSessione;
import it.prato.comune.sit.LayerGLUPCantieri;
import it.prato.comune.sit.beans.glup.AnagraficaCantiereBean;
import it.prato.comune.sit.beans.glup.DecodificaBean;
import it.prato.comune.sit.beans.glup.IncaricatoBean;
import it.prato.comune.sit.beans.glup.ProgettoBean;
import it.prato.comune.sit.dao.glup.AnagraficaCantiereDAO;
import it.prato.comune.sit.dao.glup.GLUPTransactionService;
import it.prato.comune.sit.dao.glup.IncaricatoDAO;
import it.prato.comune.sit.dao.glup.ProgettoDAO;
import it.prato.comune.sit.dao.glup.TipoApprovazioneDAO;
import it.prato.comune.tolomeo.utility.Costanti;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Submit;
import it.prato.comune.tolomeo.web.TolomeoMainServlet;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.core.type.DateType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class GestioneProgettoServlet extends TolomeoServlet {
    
    private static final long serialVersionUID = 1L;
    public static String TIPO_OPERAZIONE_RICERCA_BYCODICE = "RCOD";
    public static String TIPO_OPERAZIONE_RICERCA_BYID = "RID";  
    public static final String PAGE_GESTIONE_PROGETTO = "/jsp/servizi/ufficioStrade/glup/gestioneProgetto.jsp";
    public static final String PAGE_VISUALIZZA_PROGETTO = "/jsp/servizi/ufficioStrade/glup/visualizzaProgetto.jsp";
    public static final String PAGE_HOME_PROGETTO = "/jsp/servizi/ufficioStrade/glup/homeProgetto.jsp";
    public static final String SERVICE_PROGETTO = "/glup/GestioneProgetto";

    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }
    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
                
        LogInterface logger = getLogger(request);
        String operazioneStr = request.getParameter("operazione");

        Costanti.OperazioniStandard operazione = (operazioneStr == null) ? null : Costanti.OperazioniStandard.decode(operazioneStr.toUpperCase()); 
        String tipoOperazione = request.getParameter("tipoOperazione");
        GestioneSessione gs = new GestioneSessione(request);
                
        // OPERAZIONE DI DEFAULT
        if(operazione == null){
            forward(request, response);
            return;
        }
                                
        String forwardUrl = getDefaultForward();
        
        // OPERAZIONE DI VISUALIZZAZIONE
        if(operazione.equals(Costanti.OperazioniStandard.VISUALIZZAZIONE)){
            
            // RICERCA PER CODICE
            if(StringUtils.isEmpty(tipoOperazione) || tipoOperazione.equals(TIPO_OPERAZIONE_RICERCA_BYCODICE)){
                
                forwardUrl = cercaPerCodice(request, logger);     
                
            } else if(tipoOperazione.equals(TIPO_OPERAZIONE_RICERCA_BYID)) { 
            
                forwardUrl = cercaPerId(request, logger);
                
            }else {
            
                addErrore(request, "Tipo di ricerca non implementata");
                forwardUrl = getDefaultForward();
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
            forwardUrl = inserisciProgetto(request,logger);
            
        } else if (operazione.equals(Costanti.OperazioniStandard.MODIFICA_OK)) {
            
            // MODIFICA
            forwardUrl = modificaProgetto(request,logger);
            
        } else {
                        
            addErrore(request, "Operazione non implementata");
            forwardUrl = getDefaultForward();
            
        }
        
        forward(forwardUrl, request, response);
        return;        
    }
    
    @Override
    protected String getDefaultForward() {
        return PAGE_HOME_PROGETTO;
    }
    
    private String cercaPerId(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
    
        Integer idProgetto = recuperaIdProgetto(request);     
        
        if(idProgetto == null){
            addErrore(request, "L'identificativo del progetto deve essere valorizzato");            
            return getDefaultForward();
        } 
        
        request.setAttribute("idProgetto", idProgetto);        
        request.setAttribute("tipoOperazione",TIPO_OPERAZIONE_RICERCA_BYID);
        
        return visualizzaProgetto(request, logger);        
    }

    private String cercaPerCodice(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        
        String codice = request.getParameter("codice");
        
        if(StringUtils.isEmpty(codice)){
            addErrore(request, "Il codice progetto deve essere valorizzato");            
            return getDefaultForward();
        }         
        
        // se è stato passato solo un numero, aggiungo P all'inizio, così non sono per forza
        // costretti a mettere sempre P più codice (es. P145)
        try{
            int nCodice = Integer.parseInt(codice); 
            codice = "P" + codice;
        }catch(NumberFormatException nfe){}
        
        request.setAttribute("codice", codice);
        request.setAttribute("tipoOperazione", TIPO_OPERAZIONE_RICERCA_BYCODICE);
        
        return visualizzaProgetto(request, logger);
                
    }
    
    private String visualizzaProgetto(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        String tipoOperazione = (String) request.getAttribute("tipoOperazione");        
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;           
        }
        
        try{
            ProgettoDAO progettoDAO = new ProgettoDAO(getLogger(request));

            ProgettoBean progetto = null;
            
            String paramDescription = ""; 
            
            try {
                if(tipoOperazione.equals(TIPO_OPERAZIONE_RICERCA_BYID)){
                    
                    Integer idProgetto = (Integer)request.getAttribute("idProgetto");                    
                    progetto = progettoDAO.leggi(idProgetto, service.getConnection());
                    paramDescription = "id \"" + idProgetto + "\"";
                    
                }else if (tipoOperazione.equals(TIPO_OPERAZIONE_RICERCA_BYCODICE)){
                    
                    String codice = (String)request.getAttribute("codice");
                    progetto = progettoDAO.leggiByCod(codice, service.getConnection());
                    paramDescription = "codice \"" + codice + "\"";
                    
                } else {
                    addErrore(request, "Richiesta operzione non consentita");
                    return TolomeoServlet.ERROR_PAGE_PANNELLO;
                }
            }catch(SQLException e){
                String msg = "Errore durante di accesso ai dati";
                logger.error(msg,e);
                addErrore(request, msg);
                return TolomeoServlet.ERROR_PAGE_PANNELLO;
            }
            
            if(progetto == null){
                addWarning(request, "Progetto con " + paramDescription + " inesistente!");
                return getDefaultForward();
            }
                                  
            // CARICO ANCHE I DATI DEI CANTIERI CORRELATI E LA LISTA STRADE
            try {
                progettoDAO.caricaAnagraficaCantieri(progetto, service.getConnection());
                AnagraficaCantiereDAO cantiereDAO = new AnagraficaCantiereDAO(logger);
                for(AnagraficaCantiereBean cantiere: progetto.getCantieri()){
                    cantiereDAO.caricaStrade(cantiere, service.getConnection());
                }
            } catch (Exception e) {
                String msg = "Errore durante il recupero dati dei cantieri ai dati";
                logger.error(msg,e);
                addErrore(request, msg);
                return TolomeoServlet.ERROR_PAGE_PANNELLO;
            } 
            
            request.setAttribute("progetto", progetto);
            request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA.getCode());
            addButton(request, Submit.lookLike(Input.MODIFICA).val("Modifica Progetto").titled("Modifica dati progetto"));
            
            if(progetto.getAppalto() == null){
                addButton(request, Submit.lookLike(Input.INSERISCI).val("Inserisci Appalto").titled("Inserisci dati Appalto").onClick("this.form.action = '/tolomeobinj/glup/GestioneAppalto';"));                
            } else {
                addButton(request, Submit.lookLike(Input.MODIFICA).val("Modifica Appalto").titled("Modifica dati Appalto").onClick("this.form.action = '/tolomeobinj/glup/GestioneAppalto';"));                
            }
            //addButton(request, new Input(Input.SUBMIT, "cerca", "operazione", "Cerca" , "Torna alla ricerca"));
            addButton(request, Submit.lookLike(Input.CERCA).named(""));
            
            return PAGE_VISUALIZZA_PROGETTO;
            
        } finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
    }
    
    private String gestioneInserimento(HttpServletRequest request, LogInterface logger) throws ServletException, java.io.IOException{
        
        String codice = request.getParameter("codice");
        if(StringUtils.isEmpty(codice)){
            addErrore(request, "Il codice progetto deve essere valorizzato");               
            return getDefaultForward();
        } 
        codice = codice.toUpperCase();
        
        // se è stato passato solo un numero, aggiungo P all'inizio, così non sono per forza
        // costretti a mettere sempre P più codice (es. P145)
        try{
            int nCodice = Integer.parseInt(codice); 
            codice = "P" + nCodice;
        }catch(NumberFormatException nfe){}
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);                        
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        try {   
            ProgettoDAO progettoDAO = new ProgettoDAO(logger);
            if(progettoDAO.exist(codice, service.getConnection())){
                addErrore(request, "Progetto \"" + codice + "\" già esistente!");                
                return getDefaultForward();
            }
            
            TipoApprovazioneDAO tpApprDAO = new TipoApprovazioneDAO(logger);
            IncaricatoDAO incaricatoDAO = new IncaricatoDAO(logger);
            
            List<DecodificaBean> tipiAppr = (List<DecodificaBean>)tpApprDAO.leggiTutti(service.getConnection());
            List<IncaricatoBean> incaricati = incaricatoDAO.leggiTutti(service.getConnection());
            
            request.setAttribute("tipiApprovazione", tipiAppr);
            request.setAttribute("incaricati", incaricati);
            
            ProgettoBean progetto = (ProgettoBean)request.getAttribute("progetto");
            
            // se esiste già un progetto non lo cerco, ma utilizzo i dati passati
            if(progetto == null){
                progetto = new ProgettoBean();
                progetto.setCodice(codice);
                request.setAttribute("progetto", progetto);               
            }
            
            
            request.setAttribute("pageTitle", "Inserimento anagrafica progetto \"" + codice + "\"");
            request.setAttribute("operazione", Costanti.OperazioniStandard.INSERIMENTO_OK.getCode());
            addButton(request, Input.INSERISCI_OK);
            addButton(request, Submit.lookLike(Input.TERMINA).onClick("if(this.form.operazione){this.form.operazione.value = '';};"));
            
            return PAGE_GESTIONE_PROGETTO;
            
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
    
    private String inserisciProgetto(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
                
        String codice = request.getParameter("codice");
        
        if(StringUtils.isEmpty(codice)){
            addErrore(request, "Il codice progetto deve essere valorizzato");            
            return TolomeoMainServlet.ERROR_PAGE_PANNELLO;
        }                            
        
        String descrizione = request.getParameter("descrizione");
        String note = request.getParameter("note");
        Integer anno = recuperaAnno(request);
        Integer idTpAppr = recuperaIdTpAppr(request);
        Integer numAppr = recuperaNumAppr(request);
        DateType dtAppr = recuperaDataApprovazione(request);
        
        Integer idDirLav = recuperaIdDirLav(request);
        Integer idRup = recuperaIdRup(request);
                           
        ProgettoBean progetto = new ProgettoBean();
        progetto.setCodice(codice);
        progetto.setAnno(anno);
        progetto.setDescrizione(descrizione);
        progetto.setIdTipoApprovazione(idTpAppr);
        progetto.setNumeroApprovazione(numAppr);
        progetto.setDtApprovazione(dtAppr);
        progetto.setIdDirLav(idDirLav);
        progetto.setIdRUP(idRup);
        progetto.setNote(note);
        
        request.setAttribute("progetto", progetto);
        
        // se c'è un errore nei parametri devo caricare i dati necessari e tornare alla pagina di gestione inserimento
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
        boolean inserito = false;
        
        try{
            
            ProgettoDAO progettoDAO = new ProgettoDAO(getLogger(request));
            inserito = progettoDAO.insert(progetto, service.getConnection());
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
            return PAGE_HOME_PROGETTO;
        }else{
            addInformazione(request, "Inserimento andato a buon fine");
            return cercaPerCodice(request, logger);
        }        
        
    }
    
    private String modificaProgetto(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        int idProgetto = Integer.parseInt(request.getParameter("idProgetto"));
        String codice = request.getParameter("codice");
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;           
        }
             
        boolean aggiornato = false;
        
        try{
            
            ProgettoBean progetto = new ProgettoBean();
            
            String descrizione = request.getParameter("descrizione");
            String note = request.getParameter("note");
            Integer anno = recuperaAnno(request);
            Integer idTpAppr = recuperaIdTpAppr(request);
            Integer numAppr = recuperaNumAppr(request);
            DateType dtAppr = recuperaDataApprovazione(request);
            
            Integer idDirLav = recuperaIdDirLav(request);
            Integer idRup = recuperaIdRup(request);
            
            progetto.setId(idProgetto);
            progetto.setCodice(codice);
            progetto.setAnno(anno);
            progetto.setDescrizione(descrizione);
            progetto.setIdTipoApprovazione(idTpAppr);
            progetto.setNumeroApprovazione(numAppr);
            progetto.setDtApprovazione(dtAppr);
            progetto.setIdDirLav(idDirLav);
            progetto.setIdRUP(idRup);
            progetto.setNote(note);
            
            request.setAttribute("progetto", progetto);
            
            // se c'è un errore nei parametri deo caricare i dati necessari e tornare alla pagina di gestione modifica
            // quindi chiamo la funzione che gestisce i dati di modifica
            if(isThereMessaggioErrore(request)){                
                return gestioneModifica(request, logger);                                
            }   
                  
            ProgettoDAO progettoDAO = new ProgettoDAO(getLogger(request));
            aggiornato = progettoDAO.update(progetto, service.getConnection());            
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
            addWarning(request, "La modifica non ha avuto successo!");
        }else{
            addInformazione(request, "Progetto modificato!");
        }
        return SERVICE_PROGETTO + "?operazione=V&codice="+codice;
    }
    
    
    private String gestioneModifica(HttpServletRequest request, LogInterface logger) throws ServletException, java.io.IOException{
        
        int idProgetto = Integer.parseInt(request.getParameter("idProgetto"));
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE;
        }
                                
        try{
            ProgettoBean progetto = (ProgettoBean)request.getAttribute("progetto");
            
            // se esiste già un progetto non lo cerco, ma utilizzo i dati passati
            if(progetto == null){
                ProgettoDAO progettoDAO = new ProgettoDAO(logger);
                progetto = progettoDAO.leggi(idProgetto, service.getConnection());               
            }
            
            TipoApprovazioneDAO tpApprDAO = new TipoApprovazioneDAO(logger);
            IncaricatoDAO incaricatoDAO = new IncaricatoDAO(logger);
            
            List<DecodificaBean> tipiAppr = (List<DecodificaBean>)tpApprDAO.leggiTutti(service.getConnection());
            List<IncaricatoBean> incaricati = incaricatoDAO.leggiTutti(service.getConnection());
            
            request.setAttribute("progetto", progetto);
            request.setAttribute("tipiApprovazione", tipiAppr);
            request.setAttribute("incaricati", incaricati);            
            request.setAttribute("pageTitle", "Modifica anagrafica progetto \"" + progetto.getCodice() + "\"");
            request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA_OK.getCode());
            addButton(request, Input.MODIFICA_OK);
            addButton(request, Input.PULISCI);
            addButton(request, Submit.lookLike(Input.TERMINA).onClick("if(this.form.operazione){this.form.operazione.value = 'V';}"));            
            
            return PAGE_GESTIONE_PROGETTO;
            
        } catch(SQLException e){
            
            String msg = "Errore durante di accesso ai dati";
            logger.error(msg,e);
            addErrore(request, msg);            
            return TolomeoServlet.ERROR_PAGE;
            
        } finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
    }
    
    
    private Integer recuperaIdTpAppr(HttpServletRequest request){
        
        String param = request.getParameter("idTipoApprovazione");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"Tipo approvazione non valorizzato");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo tipo approvazione non numerico");
            return null;
        }  
     }
    
    private Integer recuperaIdRup(HttpServletRequest request){
        
        String param = request.getParameter("idRup");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"Responsabile Unico Procedimento non selezionato");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo Responsabile Unico Procedimento non numerico");
            return null;
        }  
     }
    
    private Integer recuperaIdDirLav(HttpServletRequest request){
        
        String param = request.getParameter("idDirLav");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"Direttore Lavori non selezionato");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo Direttore Lavori non numerico");
            return null;
        }  
     }
    
    private Integer recuperaNumAppr(HttpServletRequest request){
        
        String param = request.getParameter("numeroApprovazione");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"Numero approvazione non valorizzato");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"Numero approvazione \"" + param + "\" non numerico");
            return null;
        }  
     }

    private Integer recuperaAnno(HttpServletRequest request){
        
        String param = request.getParameter("anno");
        if(!StringUtils.isEmpty(param)){
            try{
                Integer anno = new Integer(param);
                int annoCorrente = new DateType().getYear();
                if(anno < 1900 || anno > annoCorrente){
                    addErrore(request,"anno non valido");                    
                }
                return anno;                
            }catch(NumberFormatException nfe){
                addErrore(request,"anno \"" + param + "\" non numerico");                
            }  
        }
        return null;                
     }
        
     private DateType recuperaDataApprovazione(HttpServletRequest request){
                                             
         String param = request.getParameter("dtApprovazione");
         if(StringUtils.isEmpty(param)){
             addErrore(request,"Data approvazione non valorizzata");
             return null;
         }
         
         DateType data = DateType.create(param);
         
         if(data == null){
             addErrore(request,"La data di approvazione \"" + param + "\" non è una data corretta (GG/MM/AAAA)");
             return null;
         }
         
         return data;
     }   
     
     private Integer recuperaIdProgetto(HttpServletRequest request){
         
         String param = request.getParameter("idProgetto");
         if(StringUtils.isEmpty(param)){
             addErrore(request,"Identificativo progetto non valorizzato");
             return null;
         }
         
         try{
             return new Integer(param);
         }catch(NumberFormatException nfe){
             addErrore(request,"identificativo progetto non numerico");
             return null;
         }  
      }
}

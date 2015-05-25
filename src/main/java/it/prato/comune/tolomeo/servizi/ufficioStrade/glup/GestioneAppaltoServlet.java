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
import it.prato.comune.sit.beans.glup.AppaltoBean;
import it.prato.comune.sit.beans.glup.DittaBean;
import it.prato.comune.sit.dao.glup.AppaltoDAO;
import it.prato.comune.sit.dao.glup.DittaDAO;
import it.prato.comune.sit.dao.glup.GLUPTransactionService;
import it.prato.comune.sit.dao.glup.ProgettoDAO;
import it.prato.comune.sit.dao.glup.ReferenteDAO;
import it.prato.comune.tolomeo.utility.Costanti;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Submit;
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

public class GestioneAppaltoServlet extends TolomeoServlet {

    private static final long serialVersionUID = 1L;    
    public static final String PAGE_GESTIONE_APPALTO = "/jsp/servizi/ufficioStrade/glup/gestioneAppalto.jsp";
    public static final String PAGE_VISUALIZZA_PROGETTO = "/glup/GestioneProgetto?operazione=V";

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
            
            // RIMANDO ALLA VISUALIZZAZIONE DELL'INTERO PROGETTO
            forwardUrl = PAGE_VISUALIZZA_PROGETTO;       
        
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
        return "/jsp/servizi/ufficioStrade/glup/homeProgetto.jsp";
    }
            
    public String gestioneInserimento(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
         
        Integer idProgetto = recuperaIdProgetto(request);
        if(idProgetto == null){                                    
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
            ProgettoDAO progettoDAO = new ProgettoDAO(logger);
            if(!progettoDAO.exist(idProgetto, service.getConnection())){
                addErrore(request, "Progetto con identificativo\"" + idProgetto + "\" inesistente!");                
                return getDefaultForward();
            }
            
            //  carico le ditte da mostrare nella casella a discesa
            DittaDAO appDAO = new DittaDAO(logger);
            
            List<DittaBean> ditte = (List<DittaBean>)appDAO.leggiTutti(service.getConnection());            
            
            request.setAttribute("ditte", ditte);            
            
            AppaltoBean appalto = (AppaltoBean)request.getAttribute("appalto");
            
            // se esiste già un appalto utilizzo i dati passati
            if(appalto == null){
                appalto = new AppaltoBean();
                appalto.setIdProgetto(idProgetto);
                request.setAttribute("appalto", appalto);               
            }
            
            request.setAttribute("pageTitle", "Inserimento appalto");
            request.setAttribute("operazione", Costanti.OperazioniStandard.INSERIMENTO_OK.getCode());
            addButton(request, Input.INSERISCI_OK);
            addButton(request, Submit.lookLike(Input.TERMINA).onClick("if(this.form.operazione){this.form.operazione.value = 'V';};"));
            
            return PAGE_GESTIONE_APPALTO;
            
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
    
    public String inserisci(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
                
        Integer idProgetto = recuperaIdProgetto(request);
        
        if(isThereMessaggioErrore(request)){                                    
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }           
                
        Integer numeroAffidamento = recuperaNumeroAffidamento(request);
        DateType dataAffidamento = recuperaDataAffidamento(request);
        
        Integer idDitta = recuperaIdDitta(request);
        Integer idReferente = recuperaIdReferente(request);
                           
        AppaltoBean appalto = new AppaltoBean();
        
        appalto.setIdProgetto(idProgetto);
        appalto.setNumeroAffidamento(numeroAffidamento);
        appalto.setDtAffidamento(dataAffidamento);
        appalto.setIdDitta(idDitta);
        appalto.setIdReferente(idReferente);
        
        if(idDitta == null && idReferente != null){
            addErrore(request, "E' stato immesso un referente senza mettere la ditta relativa");
        }
        
        request.setAttribute("appalto", appalto);
        
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
            
            // si controlla se il referente appartiene alla Ditta selezionata            
            if(idReferente != null && idDitta != null){
                ReferenteDAO referenteDAO = new ReferenteDAO(logger);
                boolean appartiene = referenteDAO.appartieneAllaDitta(idReferente, idDitta, service.getConnection());
                if(!appartiene){
                    addErrore(request, "Il referente non risulta appartenere alla ditta selezionata");
                    return  gestioneInserimento(request, logger);
                }
            }
            
            AppaltoDAO appaltoDAO = new AppaltoDAO(getLogger(request));
            inserito = appaltoDAO.insert(appalto, service.getConnection());
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
            addWarning(request, "L'inserimento non è avvenuto con successo!");
        }else{
            addInformazione(request, "Appalto inserito!");
        }
        // Rimando alla pagina di visualizzazione del progetto        
        return PAGE_VISUALIZZA_PROGETTO;
    }
    
    public String modifica(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        Integer idAppalto = recuperaIdAppalto(request);
        Integer idProgetto = recuperaIdProgetto(request);
        
        // I due parametri sopra non dipendono dall'utent, quindi devono sempre essere valorizzati.
        // Se così non è rimando alla pagina di errore del pannello
        if(isThereMessaggioErrore(request)){                                    
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }             
        
        Integer numeroAffidamento = recuperaNumeroAffidamento(request);
        DateType dataAffidamento = recuperaDataAffidamento(request);
                
        Integer idDitta = recuperaIdDitta(request);
        Integer idReferente = recuperaIdReferente(request);
        
        if(idDitta == null && idReferente != null){
            addErrore(request, "E' stato immesso un referente senza mettere la ditta relativa");
        }
        
        AppaltoBean appalto = new AppaltoBean();
        
        appalto.setId(idAppalto);
        appalto.setIdProgetto(idProgetto);
        appalto.setNumeroAffidamento(numeroAffidamento);
        appalto.setDtAffidamento(dataAffidamento);
        appalto.setIdDitta(idDitta);
        appalto.setIdReferente(idReferente);
        
        request.setAttribute("appalto", appalto);                   
        
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
            // si controlla se il referente appartiene alla Ditta selezionata            
            if(idReferente != null && idDitta != null){
                ReferenteDAO referenteDAO = new ReferenteDAO(logger);
                boolean appartiene = referenteDAO.appartieneAllaDitta(idReferente, idDitta, service.getConnection());
                if(!appartiene){
                    addErrore(request, "Il referente non risulta appartenere alla ditta selezionata");
                    return gestioneModifica(request, logger);
                }
            }

            AppaltoDAO appaltoDAO = new AppaltoDAO(getLogger(request));
            aggiornato = appaltoDAO.update(appalto, service.getConnection());                        
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
            addWarning(request, "Modifica non avvenuta con successo!");
        }else{
            addInformazione(request, "Appalto modificato!");
        }        
        return PAGE_VISUALIZZA_PROGETTO;
    }
    
    private String gestioneModifica(HttpServletRequest request, LogInterface logger) throws ServletException, java.io.IOException{
        
        int idAppalto = Integer.parseInt(request.getParameter("idAppalto"));
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE;
        }
                                
        try{
            AppaltoBean appalto = (AppaltoBean)request.getAttribute("appalto");
            
            // se esiste già un appalto non lo cerco, ma utilizzo i dati passati (perchè potrei arrivare da un altro passaggio)
            if(appalto == null){
                AppaltoDAO appaltoDAO = new AppaltoDAO(logger);
                appalto = appaltoDAO.leggi(idAppalto, service.getConnection());               
            }
            
            // carico le ditte da ostrare nella casella a discesa
            DittaDAO dittaDAO = new DittaDAO(logger);            
            
            List<DittaBean> ditte = (List<DittaBean>)dittaDAO.leggiTutti(service.getConnection());            
            
            request.setAttribute("appalto", appalto);
            request.setAttribute("ditte", ditte);
            request.setAttribute("pageTitle", "Modifica appalto \"" + idAppalto + "\"");
            request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA_OK.getCode());
            addButton(request, Input.MODIFICA_OK);
            addButton(request, Input.PULISCI);
            addButton(request, Submit.lookLike(Input.TERMINA).onClick("if(this.form.operazione){this.form.operazione.value = 'V';}"));            
            
            return PAGE_GESTIONE_APPALTO;
            
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
    
    private Integer recuperaIdAppalto(HttpServletRequest request){
        
        String param = request.getParameter("idAppalto");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"identificativo dell'appalto non valorizzato");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo dell'appalto non numerico");
            return null;
        }  
    }
    
    private Integer recuperaIdProgetto(HttpServletRequest request){
        
        String param = request.getParameter("idProgetto");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"identificativo del progetto non valorizzato");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo del progetto non numerico");
            return null;
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
    
    private Integer recuperaNumeroAffidamento(HttpServletRequest request){
        
        String param = request.getParameter("numeroAffidamento");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"N. Determina affidamento non valorizzato");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"N. Determina affidamento \"" + param + "\" non numerico");
            return null;
        }  
     }    
        
     private DateType recuperaDataAffidamento(HttpServletRequest request){
                                             
         String param = request.getParameter("dtAffidamento");
         if(StringUtils.isEmpty(param)){
             addErrore(request,"Data affidamento non valorizzata");
             return null;
         }
         
         DateType data = DateType.create(param);
         
         if(data == null){
             addErrore(request,"La data di approvazione \"" + param + "\" non è una data corretta (GG/MM/AAAA)");
             return null;
         }
         
         return data;
     }   
}

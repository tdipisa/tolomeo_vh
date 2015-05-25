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
import it.prato.comune.sit.dao.glup.DittaDAO;
import it.prato.comune.sit.dao.glup.GLUPTransactionService;
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

public class GestioneDittaServlet extends TolomeoServlet {

    private static final long serialVersionUID = 1L;   
    
    private static final String TIPO_OPERAZIONE_RICERCA_ALL = "T"; // cerca tutti
    
    private static final String PAGE_GESTIONE_DITTA     = "/jsp/servizi/ufficioStrade/glup/gestioneDitta.jsp";
    private static final String PAGE_VISUALIZZA_DITTA   = "/jsp/servizi/ufficioStrade/glup/visualizzaDitta.jsp";    
    private static final String PAGE_LISTA_DITTE        = "/jsp/servizi/ufficioStrade/glup/listaDitte.jsp";
    private static final String PAGE_HOME_GLUP          = "/jsp/servizi/ufficioStrade/glup/homeGlup.jsp";
    private static final String SERVICE_GESTIONE_DITTA  = "/glup/GestioneDitta";
    

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
                
        // DI DEFAULT MOSTRO TUTTE LE DITTE
        if(operazione == null) {
            operazione = Costanti.OperazioniStandard.RICERCA;
            tipoOperazione = TIPO_OPERAZIONE_RICERCA_ALL;
        }
                
        String forwardUrl = getDefaultForward();
        
        // OPERAZIONE DI VISUALIZZAZIONE (SI RIMANDA AL PROGETTO)
        if(operazione.equals(Costanti.OperazioniStandard.VISUALIZZAZIONE)){
            
            // RIMANDO ALLA VISUALIZZAZIONE DELL'INTERO PROGETTO
            forwardUrl = visualizza(request, logger);       
        
        // GESTIONE RICERCA
        } else if (operazione.equals(Costanti.OperazioniStandard.RICERCA)) {
                               
            // RICERCA DI TUTTE LE DITTE
            if(tipoOperazione == null || tipoOperazione.equals(TIPO_OPERAZIONE_RICERCA_ALL)){                
                forwardUrl  = cercaTutte(request, logger);
                
            // SE IL TIPO RICERCA NON E' IMPLEMENTATO, AVVERTO E RIMANDO ALLA LISTA DI TUTTE    
            }else{
                addErrore(request, "Tipo ricerca ditte non implementato");
                forwardUrl = cercaTutte(request, logger);
            }
                                        
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
        return PAGE_HOME_GLUP;
    }
            
    private String visualizza(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        Integer idDitta = recuperaIdDitta(request);
        
        // non dovrebbe mai accadere perchè ci si arriva da link
        if(isThereMessaggioErrore(request)){                                    
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        
        // carico i dati della ditta nel request
        if(!caricaDitta(idDitta, request, logger)){
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        
        request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA.getCode());
        addButton(request, Submit.lookLike(Input.MODIFICA));                        
        addButton(request, Submit.lookLike(Input.INSERISCI).val("Aggiunge Referente").titled("Aggiunge un referente").onClick("this.form.action = '/tolomeobinj/glup/GestioneReferente';"));                                        
        addButton(request, new Submit(Input.CSS_STYLE_GENERICO,"","Elenco ditte","Vai all'elenco delle ditte").onClick(Input.ONCLICK_DEFAULT));

        return PAGE_VISUALIZZA_DITTA;
    }
    
    
    private String cercaTutte(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
                
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;           
        }
        
        try{
            DittaDAO dittaDAO = new DittaDAO(getLogger(request));
            
            // legge tutte le ditte non cessate
            List<AnagraficaDittaBean> ditte = dittaDAO.leggiTutteAnagrafiche(service.getConnection());
            
            request.setAttribute("ditte", ditte);
            request.setAttribute("operazione", Costanti.OperazioniStandard.INSERIMENTO.getCode());
            addButton(request, Submit.lookLike(Input.INSERISCI).val("Nuova").titled("Aggingi una nuova ditta"));                                                    
            
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
        
        return PAGE_LISTA_DITTE;
    }
    
    
    private String gestioneInserimento(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
       DittaBean ditta = (DittaBean)request.getAttribute("ditta");
              
       // se esiste già una ditta utilizzo i dati passati, altrimenti lo creo
       // potrei arrivare da un errore in inserimento
       if(ditta == null){
           ditta = new DittaBean();           
           request.setAttribute("ditta", ditta);               
       }

       request.setAttribute("pageTitle", "Inserimento nuova ditta");
       request.setAttribute("operazione", Costanti.OperazioniStandard.INSERIMENTO_OK.getCode());
       
       addButton(request, Submit.lookLike(Input.INSERISCI_OK));
       addButton(request, Submit.lookLike(Input.TERMINA).named(""));
       
       return PAGE_GESTIONE_DITTA;
    }
    
    private String inserisci(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
                
        String descrizione = recuperaDescrizione(request);
        String cap = recuperaCap(request);
        String provincia = recuperaProvincia(request);
        String via = recuperaNullable(request,"via");
        String nciv = recuperaNciv(request);        
        String citta = recuperaNullable(request,"citta");
        
        DittaBean ditta = new DittaBean();
        ditta.setDescrizione(descrizione);
        ditta.setVia(via);
        ditta.setCitta(citta);
        ditta.setCap(cap);
        ditta.setNciv(nciv);
        ditta.setProvincia(provincia);
        
        request.setAttribute("ditta", ditta);
        
        // se c'è un errore nei parametri rimando alla gestione dell'inserimento
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

            DittaDAO dittaDAO = new DittaDAO(getLogger(request));
            inserito = dittaDAO.insert(ditta, service.getConnection());
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
            // rimando alla lista delle ditte
            return SERVICE_GESTIONE_DITTA + "?operazione=R&tipoOperazione=T";
        }else{
            addInformazione(request, "Ditta inserito!");
            // Rimando alla pagina di visualizzazione della ditta        
            return SERVICE_GESTIONE_DITTA + "?operazione=V&idDitta=" + ditta.getId();
        }
    }
    
    private String modifica(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        Integer idDitta = recuperaIdDitta(request);
        
        // se manca l'identificativo della ditta è un errore di applicazione 
        if(isThereMessaggioErrore(request)){                                    
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }          
                
        String descrizione = recuperaDescrizione(request);
        String cap = recuperaCap(request);
        String provincia = recuperaProvincia(request);
        String via = recuperaNullable(request,"via");
        String nciv = recuperaNciv(request);        
        String citta = recuperaNullable(request,"citta");
        
        DittaBean ditta = new DittaBean();
        ditta.setDescrizione(descrizione);
        ditta.setVia(via);
        ditta.setCitta(citta);
        ditta.setCap(cap);
        ditta.setNciv(nciv);
        ditta.setProvincia(provincia);
        ditta.setId(idDitta);  
        
        request.setAttribute("ditta", ditta);
        
        // se c'è un errore nei parametri rimando alla gestione dell'inserimento
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
            
            DittaDAO dittaDAO = new DittaDAO(getLogger(request));
            aggiornato = dittaDAO.update(ditta, service.getConnection());                        
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
            addInformazione(request, "Ditta modificata!");            
        }
        return SERVICE_GESTIONE_DITTA + "?operazione=V&idDitta=" + ditta.getId();
        
    }
    
    private String gestioneModifica(HttpServletRequest request, LogInterface logger) throws ServletException, java.io.IOException{
        
        Integer idDitta = recuperaIdDitta(request);
        
        // non dovrebbe mai accadere
        if(idDitta == null){            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        
        DittaBean ditta = (DittaBean)request.getAttribute("ditta");
        
        // se esiste già una ditta non lo cerco, ma utilizzo i dati passati (perchè potrei arrivare da un altro passaggio, 
        // errore in modifica x esempio)
        if(ditta == null){            
            // carico i dati della ditta nel request
            if(!caricaDitta(idDitta, request, logger)){
                return TolomeoServlet.ERROR_PAGE_PANNELLO;
            }
        }
                
        request.setAttribute("pageTitle", "Modifica ditta \"" + idDitta +"\"");
        request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA_OK.getCode());
        addButton(request, Input.MODIFICA_OK);
        addButton(request, Input.PULISCI);
        addButton(request, Submit.lookLike(Input.TERMINA).onClick("if(this.form.operazione){this.form.operazione.value = 'V';}"));            
        
        return PAGE_GESTIONE_DITTA;
      
    }
    
    /**
     * Carica il bean della ditta nel request e ritorna true se è andato tutto bene, false altrimenti
     * @param idDitta
     * @param request
     * @param logger
     * @return
     */
    private boolean caricaDitta(Integer idDitta, HttpServletRequest request, LogInterface logger) throws IOException{
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return false;           
        }
        
        try{
            DittaDAO dittaDAO = new DittaDAO(getLogger(request));                        
            // legge la ditta per id
            DittaBean ditta = dittaDAO.leggi(idDitta, service.getConnection());
            
            if(ditta == null){
                addErrore(request,"La ditta non risulta presente");
                return false;
            }
            
            request.setAttribute("ditta", ditta);                        
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
    
    private String recuperaDescrizione(HttpServletRequest request){
        
        String param = request.getParameter("descrizione");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"La ragione sociale della ditta è obbligatoria");
            return null;
        }
        return param;
    }
    
    private String recuperaCap(HttpServletRequest request){
        
        String param = request.getParameter("cap");
        if(StringUtils.isEmpty(param)){            
            return null;
        }
        
        param = param.trim();                 
        String  expression="^\\d{5}$";         
        Pattern pattern = Pattern.compile(expression,Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(param);
        if(!matcher.matches()){
            addErrore(request, "C.a.p. non valido!");             
        }   
        return param;
    }
    
    private String recuperaNciv(HttpServletRequest request){
        
        String param = request.getParameter("nciv");
        if(StringUtils.isEmpty(param)){            
            return null;
        }
        
        return param.trim();                         
    }
    
    private String recuperaProvincia(HttpServletRequest request){
        
        String param = request.getParameter("provincia");
        if(StringUtils.isEmpty(param)){            
            return null;
        }        
        param = param.trim().toUpperCase();                 
        String  expression="^[A-Z]{2}$";         
        Pattern pattern = Pattern.compile(expression,Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(param);
        if(!matcher.matches()){
            addErrore(request, "La sigla dlla provincia deve essere di 2 caratteri");             
        }   
        return param;
    }
    
    private String recuperaNullable(HttpServletRequest request, String nomeCampo){
        
        String param = request.getParameter(nomeCampo);
        if(StringUtils.isEmpty(param)){            
            return null;
        }        
        return param.trim();
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
    
}

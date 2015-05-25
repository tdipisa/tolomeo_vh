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

import it.prato.comune.sit.JSGeometry;
import it.prato.comune.sit.LayerGLUPCantieri;
import it.prato.comune.sit.LayerVie;
import it.prato.comune.sit.PoligonoGLUPCantiere;
import it.prato.comune.sit.PoligonoVia;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.beans.glup.AnagraficaCantiereBean;
import it.prato.comune.sit.beans.glup.CantiereBean;
import it.prato.comune.sit.beans.glup.DecodificaBean;
import it.prato.comune.sit.beans.glup.DittaBean;
import it.prato.comune.sit.beans.glup.ProgettoBean;
import it.prato.comune.sit.dao.glup.AmbitoInterventoDAO;
import it.prato.comune.sit.dao.glup.AnagraficaCantiereDAO;
import it.prato.comune.sit.dao.glup.CantiereDAO;
import it.prato.comune.sit.dao.glup.DittaDAO;
import it.prato.comune.sit.dao.glup.GLUPTransactionService;
import it.prato.comune.sit.dao.glup.ProgettoDAO;
import it.prato.comune.sit.dao.glup.ReferenteDAO;
import it.prato.comune.sit.dao.glup.TipoInterventoDAO;
import it.prato.comune.tolomeo.utility.Costanti;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Submit;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.toponomastica.core.beans.ViaBean;
import it.prato.comune.toponomastica.core.dao.ViaDAO;
import it.prato.comune.utilita.core.type.DateType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class GestioneCantiereServlet extends TolomeoServlet {

    private static final long serialVersionUID = 1L;
                
    public static final String TIPO_OPERAZIONE_TERMINA   = "T";
    public static final String PAGE_NOTIFICA_GLUP       = "/jsp/servizi/ufficioStrade/glup/notificaGlup.jsp";
    public static final String PAGE_GESTIONE_CANTIERE   = "/jsp/servizi/ufficioStrade/glup/gestioneCantiere.jsp";
    public static final String PAGE_VISUALIZZA_CANTIERE = "/jsp/servizi/ufficioStrade/glup/visualizzaCantiere.jsp";
    public static final String PAGE_INSERIMENTO_CANTIERE_STEP_1 = "/jsp/servizi/ufficioStrade/glup/inserimentoCantiereStep1.jsp";
    public static final String PAGE_GESTIONE_VIE_CANTIERE = "/jsp/servizi/ufficioStrade/glup/gestioneVieCantiere.jsp";
    public static final String PAGE_INSERIMENTO_CANTIERE_STEP_2 = PAGE_GESTIONE_VIE_CANTIERE;
    
    public static final String SERVICE_GESTIONE_CANTIERE = "/glup/GestioneCantiere";
    public static final String SERVICE_GESTIONE_PROGETTO   = "/glup/GestioneProgetto";

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
        
        // OPERAZIONE DI DEFAULT
        if(operazione == null){
            forward(request, response);
            return;
        }
                                
        String forwardUrl = getDefaultForward();
        
        // OPERAZIONE DI VISUALIZZAZIONE
        if(operazione.equals(Costanti.OperazioniStandard.VISUALIZZAZIONE)){
            
            // VISUALIZZA
            forwardUrl = visualizzaAnagrafica(request, logger);                
        
        // GESTIONE INSERIMENTO
        } else if (operazione.equals(Costanti.OperazioniStandard.INSERIMENTO)) {
                              
            // SE E' RICHIESTA L'INTERRUZIONE DI UNA MODIFICA
            if (tipoOperazione != null && tipoOperazione.equals(TIPO_OPERAZIONE_TERMINA)){
                
                addInformazione(request, "Inserimento interrotto!");
                addButton(request, new Submit(Input.CSS_STYLE_GENERICO,"nome","Menu","Vai al menu"));
                forwardUrl = PAGE_NOTIFICA_GLUP; 
              
            } else {
                
                String step = request.getParameter("step");
                
                // GESTIONE INSERIMENTO STEP 1
                if(step == null || step.equals("1")){
                    
                    // non dovebbe mai accadere grazie a Tolomeo
                    if(!areGeoParamsPresent(request)){
                        forwardUrl = TolomeoServlet.ERROR_PAGE_PANNELLO;
                    }else{                    
                        forwardUrl  = gestioneInserimentoStep1(request, logger);
                    }
                    
                // GESTIONE INSERIMENTO STEP 2                
                }else if(step.equals("2")){
                    
                    // non dovebbe mai accadere grazie a Tolomeo
                    if(!areGeoParamsPresent(request)){
                        forwardUrl = TolomeoServlet.ERROR_PAGE_PANNELLO;
                    }else{
                        forwardUrl  = gestioneInserimentoStep2(request, logger);
                    }
                    
                // GESTIONE INSERIMENTO STEP 3                
                }else if(step.equals("3")){
                    
                    // non dovebbe mai accadere grazie a Tolomeo
                    if(!areGeoParamsPresent(request)){
                        forwardUrl = TolomeoServlet.ERROR_PAGE_PANNELLO;
                    }else{
                        forwardUrl  = gestioneInserimentoStep3(request, logger);
                    }
                    
                // GESTIONE INSERIMENTO STEP ERRRATO                
                }else{
                    addErrore(request, "Step di inserimento inesistente");
                }
            }
                                        
        } else if (operazione.equals(Costanti.OperazioniStandard.MODIFICA)) {
                           
            // SE E' RICHIESTA L'INTERRUZIONE DI UNA MODIFICA
            if (tipoOperazione != null && tipoOperazione.equals(TIPO_OPERAZIONE_TERMINA)){
                
                addInformazione(request, "Modifica Interrotta!");
                forwardUrl = visualizzaAnagrafica(request, logger); 
              
            } else {
            
                // GESTIONE MODIFICA            
                String geoOp = getGeoOp(request);
                
                // GESTIONE MODIFICA GEOMETRIA 
                // Se è richiesta una operaizone geometrica che non sia l'aggiornamento della parte alfanumerica (anagrafica)
                if(geoOp != null && !geoOp.equals(Parametri.operationUpdateAlfa)){
                    forwardUrl = gestioneModificaGeometria(request, logger);
                // GESTIONE MODIFICA ANAGRAFICA
                }else{
                    forwardUrl  = gestioneModificaAnagrafica(request, logger);
                }
            }

        } else if (operazione.equals(Costanti.OperazioniStandard.INSERIMENTO_OK)) {
            
            // INSERIMENTO 
            // non dovebbe mai accadere grazie a Tolomeo
            if(!areGeoParamsPresent(request)){
                forwardUrl = TolomeoServlet.ERROR_PAGE_PANNELLO;
            }else{
                forwardUrl = inserisci(request,logger);
            }

            
        } else if (operazione.equals(Costanti.OperazioniStandard.MODIFICA_OK)) {
                        
            // MODIFICA
            String geoOp = getGeoOp(request);
            
            // MODIFICA GEOMETRIA 
            if(!StringUtils.isEmpty(geoOp) && !geoOp.equals(Parametri.operationUpdateAlfa)){
                forwardUrl = modificaGeometria(request, logger);
                
            // MODIFICA ANAGRAFICA
            }else{                
                forwardUrl = modificaAnagrafica(request,logger);
            }
            
        } else if (operazione.equals(Costanti.OperazioniStandard.CANCELLAZIONE)) {
            
            // CANCELLAZIONE
            String geoOp = getGeoOp(request);
            
            // se la richiesta arriva da Tolomeo (cancellazione geometria). Presento comunque la pagina del cantiere
            // e setto il parametro deleteRequest in modo che la pagina presenti subito la conferma di cancellazione
            if(!StringUtils.isEmpty(geoOp) && geoOp.equals(Parametri.operationFeatureDelete)){
                request.setAttribute("deletionRequest", true);                
                forwardUrl = "/glup/GestioneCantiere?operazione=V&idCantiere=" + getKey(request);
            }else{
                forwardUrl = elimina(request,logger);
            }
            
        } else {
                        
            addErrore(request, "Operazione non implementata");
            forwardUrl = getDefaultForward();
            
        }
        
        forward(forwardUrl, request, response);
        return;        
    }
    
    @Override
    protected String getDefaultForward() {
        return "/jsp/servizi/ufficioStrade/glup/homeCantiere.jsp";
    }
    
    private String visualizzaAnagrafica(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        Integer idCantiere = recuperaIdCantiere(request);

        if(idCantiere == null){            
            return getDefaultForward();
        }            
        
        SITLayersManager territorio = getTerritorio(logger);
        LayerGLUPCantieri layerGlup = LayerGLUPCantieri.getInstance(territorio);
        GLUPTransactionService service = new GLUPTransactionService(layerGlup,logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;           
        }
        
        try{
            CantiereDAO cantiereDAO = new CantiereDAO(logger,layerGlup);
            CantiereBean cantiere = null;
            
            try {
                
                cantiere = cantiereDAO.leggi(idCantiere, service.getTransaction());
                cantiereDAO.caricaStrade(cantiere, service.getConnection());
                cantiereDAO.caricaProgetto(cantiere, service.getConnection());
                
            }catch(SQLException e){
                String msg = "Errore durante di accesso ai dati";
                logger.error(msg,e);
                addErrore(request, msg);
                return TolomeoServlet.ERROR_PAGE_PANNELLO;
            }
            
            if(cantiere == null){
                addErrore(request, "Cantiere " + idCantiere + " inesistente!");
                return TolomeoServlet.ERROR_PAGE_PANNELLO;
            }
                                             
            request.setAttribute("cantiere", cantiere);
            request.setAttribute("codTPN", layerGlup.getCodTPN());
            addButton(request, Submit.lookLike(Input.MODIFICA).val("Modifica dati"));            
            // addButton(request, new Submit("visualizza","S","Visualizza","Visualizza su mappa").onClick("showOnMap2();return false;"));
            addButton(request, new Submit("visualizza","S","Visualizza","Visualizza su mappa").onClick("showOnMap();return false;"));
            addButton(request, Submit.lookLike(Input.CANCELLA).onClick("return deleteConfirm();"));
            addButton(request, new Submit(Input.CSS_STYLE_GENERICO,"V","progetto","vai al progetto")
                                    .onClick(Input.ONCLICK_DEFAULT)
                                    .onClick("this.form.action='/tolomeobinj/glup/GestioneProgetto'"));            
            //addButton(request, Submit.lookLike(Input.TERMINA).named(""));
            addButton(request, Submit.lookLike(Input.CERCA).named(""));
            
            return PAGE_VISUALIZZA_CANTIERE;
            
        } catch(SITException e){
            String msg = "Errore durante elaborazione dati";
            logger.error(msg,e);
            addErrore(request, msg);
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        } finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
    }
    
    private String elimina(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        Integer idCantiere = recuperaIdCantiere(request);
        
        // caso che non deve mai verificarsi
        if(idCantiere == null){            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;           
        }
        
        try{
            
            AnagraficaCantiereDAO anagraficaCantiereDAO = new AnagraficaCantiereDAO(logger);
            AnagraficaCantiereBean ac = anagraficaCantiereDAO.leggiAnagrafica(idCantiere, service.getConnection());
            Integer idProgetto = ac.getIdProgetto();
            anagraficaCantiereDAO.delete(idCantiere, service.getConnection());
            service.commit();
            
            addInformazione(request,"Il cantiere " + idCantiere + " è stato eliminato!");
            setAfterForward(request, true, null);
            
            return SERVICE_GESTIONE_PROGETTO + "?operazione=V&tipoOperazione=RID&idProgetto=" + idProgetto;
            
        } catch(SQLException e){
            String msg = "Si è verificato un errore durante l'eliminazione del cantiere!";
            logger.error(msg,e);
            addErrore(request, msg);            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        } finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
        
        
    }
    
    private String gestioneInserimentoStep1(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{

        addButton(request, new Submit("next","I","Successivo","Vai all'inserimento dell'anagrafica")
        .onClick(Input.ONCLICK_DEFAULT)
        .onClick("this.form.step.value='2';"));
        addButton(request, new Submit(Input.CSS_STYLE_TERMINA,"I","Termina","Interrompi l'inserimento").onClick("if(confirm('Interrompere l\\'inserimento?')){this.form.operazione.value = this.name;this.form.tipoOperazione.value = 'T';return true;}else{return false;};"));
        return PAGE_INSERIMENTO_CANTIERE_STEP_1;
    }
    
    private String gestioneInserimentoStep2(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
                      
        String geoCoord = request.getParameter("geoCoord");
        String geoOp = request.getParameter("geoOp");
        
        // qualcosa non va
        if(!geoOp.equals(Parametri.digitizeOperationInsert)){
            addErrore(request, "L'operazione geometrica richiesta non corrisponde all'inserimento");               
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        
        String codice = request.getParameter("codice");
        if(StringUtils.isEmpty(codice)){
            addErrore(request, "Il codice progetto deve essere valorizzato");               
            return gestioneInserimentoStep1(request, logger);
        }          
        
        // lo setto come attributo perchè ho necessità di variarlo successivamente
        request.setAttribute("geoCoord", geoCoord);
        
        // se è stato passato solo un numero, aggiungo P all'inizio, così non sono per forza
        // costretti a mettere sempre P più codice (es. P145)
        
        try{
            int nCodice = Integer.parseInt(codice); 
            codice = "P" + codice;
        }catch(NumberFormatException nfe){}
        
        codice = codice.toUpperCase();
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);                        
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        try {
            
            ProgettoDAO progettoDAO = new ProgettoDAO(logger);
            if(!progettoDAO.exist(codice, service.getConnection())){
                addErrore(request, "Il progetto \"" + codice + "\" non esiste. Occorre prima crearlo");                
                return gestioneInserimentoStep1(request, logger);
            }
            caricaDatiIntersezioneStrade(request, logger);            
            
            request.setAttribute("vieSelezionate", request.getParameter("vieSelezionate"));
            request.setAttribute("codice", codice);
            request.setAttribute("operazione", Costanti.OperazioniStandard.INSERIMENTO.getCode());
                        
            addButton(request, new Submit("previous","I","Precedente","Vai alla scelta del progetto")
                                   .onClick(Input.ONCLICK_DEFAULT)
                                   .onClick("this.form.step.value='1';"));
            addButton(request, new Submit("next","I","Successivo","Vai all'inserimento dell'anagrafica")
                                   .onClick(Input.ONCLICK_DEFAULT)
                                   .onClick("this.form.step.value='3';"));
            addButton(request, new Submit(Input.CSS_STYLE_TERMINA,"I","Termina","Interrompi l'inserimento").onClick("if(confirm('Interrompere l\\'inserimento?')){this.form.operazione.value = this.name;this.form.tipoOperazione.value = 'T';return true;}else{return false;};"));
            
            request.setAttribute("pageTitle", "Inserimento - FASE 2");
            return PAGE_INSERIMENTO_CANTIERE_STEP_2;
            
        } catch(Exception e){
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
                   
    private String gestioneInserimentoStep3(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
                 
        String geoCoord = request.getParameter("geoCoord");
        String geoOp = request.getParameter("geoOp");
        String codice = request.getParameter("codice");
        
        if(StringUtils.isEmpty(codice)){
            addErrore(request, "Il codice progetto deve essere valorizzato");               
            return PAGE_INSERIMENTO_CANTIERE_STEP_1;
        }
                        
        // qualcosa non va
        if(!geoOp.equals(Parametri.digitizeOperationInsert)){
            addErrore(request, "L'operazione geometrica richiesta non corrisponde all'inserimento");               
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }

        if(StringUtils.isEmpty(codice)){
            addErrore(request, "Il codice progetto deve essere valorizzato");               
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        } 
        
        String[] codiciVieSelezionate = request.getParameterValues("via");
               
        SITLayersManager territorio = getTerritorio(logger);
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);                        
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        }
        try {   
                                                                                  
            TipoInterventoDAO tpIntDAO = new TipoInterventoDAO(logger);
            AmbitoInterventoDAO ambIntDAO = new AmbitoInterventoDAO(logger);           
            DittaDAO appDAO = new DittaDAO(logger);
            ViaDAO viaDAO = new ViaDAO(logger);
            
            //  carico le ditte da mostrare nella casella a discesa
            List<DittaBean> ditte = (List<DittaBean>)appDAO.leggiTutti(service.getConnection());
            //  carico i tipi di intervento da mostrare nella casella a discesa
            List<DecodificaBean> tipiIntervento = (List<DecodificaBean>)tpIntDAO.leggiTutti(service.getConnection());
            //  carico gli tipi di intervento da mostrare nella casella a discesa            
            List<DecodificaBean> ambitiIntervento = (List<DecodificaBean>)ambIntDAO.leggiTutti(service.getConnection());                                    
                
            List<ViaBean> vieSelezionate = new ArrayList<ViaBean>();
            String vieSelezionateS = "";
            
            if(codiciVieSelezionate != null && codiciVieSelezionate.length > 0){
                for (int i = 0; i < codiciVieSelezionate.length; i++) {
                    ViaBean via = viaDAO.leggiVia(1, codiciVieSelezionate[i], service.getConnection());
                    if(via != null){
                        vieSelezionate.add(via);
                        vieSelezionateS += "," + via.getCodVia6();
                    }
                }
            }
                 
            request.setAttribute("ditte", ditte);
            request.setAttribute("tipiIntervento", tipiIntervento);
            request.setAttribute("ambitiIntervento", ambitiIntervento);
            request.setAttribute("vieSelezionate", vieSelezionateS);
            request.setAttribute("codice", codice);
            
            // setto il titolo della pagina
            request.setAttribute("pageTitle", "Inserimento - FASE 3");
            
            AnagraficaCantiereBean  cantiere = (AnagraficaCantiereBean)request.getAttribute("cantiere");            
            
            // se esiste già un progetto non lo cerco, ma utilizzo i dati passati
            if(cantiere == null){
                cantiere = new AnagraficaCantiereBean();                      
                request.setAttribute("cantiere", cantiere);               
            }
            
            cantiere.setStrade(new HashSet<ViaBean>(vieSelezionate));
            
            request.setAttribute("operazione", Costanti.OperazioniStandard.INSERIMENTO_OK.getCode());
            
            addButton(request, new Submit("previous","I","Precedente","Vai alla scelta del progetto")
            .onClick(Input.ONCLICK_DEFAULT)
            .onClick("this.form.step.value='2';"));
            addButton(request, Submit.lookLike(Input.INSERISCI_OK).val("Fine").titled("Inserisci"));
            addButton(request, new Submit(Input.CSS_STYLE_TERMINA,"I","Termina","Interrompi l'inserimento").onClick("if(confirm('Interrompere l\\'inserimento?')){this.form.operazione.value = this.name;this.form.tipoOperazione.value = 'T';return true;}else{return false;};"));
            //addButton(request, Submit.lookLike(Input.TERMINA).onClick("if(this.form.operazione){this.form.operazione.value = '';};"));
            
            return PAGE_GESTIONE_CANTIERE;
            
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
    
private void caricaDatiIntersezioneStrade(HttpServletRequest request, LogInterface logger) throws SITException, IOException {//ServletException, java.io.IOException {
        
        String geoCoord = (String)request.getAttribute("geoCoord");

        SITLayersManager territorio = getTerritorio(logger);            
                    
        CantiereDAO cantiereDAO = new CantiereDAO(logger,LayerGLUPCantieri.getInstance(territorio));
        PoligonoGLUPCantiere geometria = cantiereDAO.getPoligonoFromJSGeometry(geoCoord);
        
        LayerVie layerVie = LayerVie.getInstance(territorio);
                    
        List<PoligonoVia> poligoniVia = null;
        
        try {
            poligoniVia = layerVie.chiInterseca(geometria);
        } catch (SITException e) {
            String msg = "Impossibile intersecare il layer delle vie";
            logger.error(msg);
            addErrore(request, msg);
            return;
        }
        
        Iterator<PoligonoVia> iterator = poligoniVia.iterator();
        
        HashMap<String, ViaBean> vie = new HashMap<String, ViaBean>();                        
        
        PoligonoVia poligonoUnioneVie = null;
        
        // per adesso evito il passaggio dalla toponomastica, anche se non ci sarebbe da fidarsi delle 
        // descrizione presenti nella tabella delle vie.
        while(iterator.hasNext()) {
            PoligonoVia poligonoVia = iterator.next();
            
            // GESTIONE GEOMETRIA DI INTERSEZIONE CON AREE_VIE
            // creo l'unione delle aree vie trovate per poi intersecarle con il cantiere
            if(poligonoUnioneVie == null){
                poligonoUnioneVie = (PoligonoVia)layerVie.creaNuovoOggettoTerritorio();
                poligonoUnioneVie.setGeometryAttributeWKT(poligonoVia.getGeometryAttributeWKT());
            }else{
                poligonoUnioneVie.unione(poligonoVia);
            }
            
            if(StringUtils.isNotEmpty(poligonoVia.getCodVia()) && 
               !poligonoVia.getCodVia().equals("999999") && // AUTOSTRADA DEL SOLE 
               !vie.containsKey(poligonoVia.getCodVia())){
                
                ViaBean via = new ViaBean();
                via.setCodVia6(poligonoVia.getCodVia());
                via.setDescrLunga(poligonoVia.getNome());
                vie.put(poligonoVia.getCodVia(), via);
            }
        }
             
        // GESTIONE GEOMETRIA DI INTERSEZIONE CON AREE_VIE
        if(poligonoUnioneVie != null){
            JSGeometry jsGeometry = new JSGeometry(geoCoord,logger);
            PoligonoGLUPCantiere poliGlup = cantiereDAO.getPoligonoFromJSGeometry(jsGeometry);
            poliGlup.intersezione(poligonoUnioneVie);
            request.setAttribute("geoCoord", poliGlup.getJSGeometry());
        }
            
        request.setAttribute("vie", vie.values());
        
    }
    
    private String inserisci(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        String geoCoord = request.getParameter("geoCoord");
        String geoOp = request.getParameter("geoOp");
        String codice = request.getParameter("codice");
        
        if(StringUtils.isEmpty(codice)){
            addErrore(request, "Il codice progetto deve essere valorizzato");               
            return PAGE_INSERIMENTO_CANTIERE_STEP_1;
        }
                        
        CantiereBean cantiere = new CantiereBean();
        
        // recupero i dati del cantiere il cui controllo è comune con la modificaAnagrafica
        recuperaDatiCantiere(request, cantiere);
        
        request.setAttribute("cantiere", cantiere);
        
        // se c'è un errore nei parametri devo caricare i dati necessari e tornare alla pagina di gestione modifica
        // quindi chiamo la funzione che gestisce i dati di modifica
        if(isThereMessaggioErrore(request)){                
            return gestioneInserimentoStep3(request, logger);                                
        }   
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE;
        }                
        
        try{
            Integer idReferente = cantiere.getIdReferenteLavori();
            Integer idDitta = cantiere.getIdDittaLavori();
            
            // si controlla se il referente appartiene alla Ditta selezionata            
            if(idReferente != null && idDitta != null){
                ReferenteDAO referenteDAO = new ReferenteDAO(logger);
                boolean appartiene = referenteDAO.appartieneAllaDitta(idReferente, idDitta, service.getConnection());
                if(!appartiene){
                    addErrore(request, "Il referente non risulta appartenere alla ditta selezionata");
                    return gestioneInserimentoStep3(request, logger);
                }
            }
            
            // IMPOSTO LE STRADE
            String[] codiciVieSelezionate = request.getParameterValues("via");
            Set<ViaBean> vieSelezionate = new HashSet<ViaBean>();
            ViaDAO viaDAO = new ViaDAO(logger);
            if(codiciVieSelezionate != null && codiciVieSelezionate.length > 0){
                for (int i = 0; i < codiciVieSelezionate.length; i++) {
                    ViaBean via = viaDAO.leggiVia(1, codiciVieSelezionate[i], service.getConnection());
                    vieSelezionate.add(via);                    
                }
            }
            
            cantiere.setStrade(vieSelezionate);
            
            // IMPOSTO IL PROGETTO
            ProgettoDAO progettoDAO = new ProgettoDAO(logger);
            ProgettoBean progetto = progettoDAO.leggiByCod(codice, service.getConnection());
            
            cantiere.setIdProgetto(progetto.getId());
            
            SITLayersManager territorio = getTerritorio(logger);
            CantiereDAO cantiereDAO = new CantiereDAO(getLogger(request),LayerGLUPCantieri.getInstance(territorio));
            PoligonoGLUPCantiere geometria = cantiereDAO.getPoligonoFromJSGeometry(geoCoord);
            cantiere.setGeometria(geometria);
            
            boolean inserito = false;
                        
            try {
                inserito = cantiereDAO.insert(cantiere, service.getTransaction());
                service.commit();
            } catch (SITException e) {
                String msg = "Errore durante inserimento dati";
                logger.error(msg,e);
                addErrore(request, msg); 
                return TolomeoServlet.ERROR_PAGE_PANNELLO;
            }
            
            if(!inserito){
                addWarning(request, "L'inserimento non avuto successo!");
                return SERVICE_GESTIONE_PROGETTO + "?operazione=V&tipoOperazione=RCOD&codice=" + codice;
            }else{         
                addInformazione(request, "Cantiere correttamente inserito!");
                setAfterForward(request, true, null);
                return SERVICE_GESTIONE_CANTIERE + "?operazione=V&idCantiere=" + cantiere.getId();
            }
            
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
                
        
    }
    
    private String modificaGeometria(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        String geoOp = getGeoOp(request);
        String geoCoord = getGeoCoord(request);
        Integer codTPN = getCodTPN(request);
        
        Integer idCantiere = recuperaIdCantiere(request);
        SITLayersManager territorio = getTerritorio(logger);
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(territorio),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE;
        }          
                
        boolean modificato = false;
        try{
            // IMPOSTO LE STRADE
            String[] codiciVieSelezionate = request.getParameterValues("via");
            Set<ViaBean> vieSelezionate = new HashSet<ViaBean>();
            ViaDAO viaDAO = new ViaDAO(logger);
            if(codiciVieSelezionate != null && codiciVieSelezionate.length > 0){
                for (int i = 0; i < codiciVieSelezionate.length; i++) {
                    ViaBean via = viaDAO.leggiVia(1, codiciVieSelezionate[i], service.getConnection());
                    vieSelezionate.add(via);                    
                }
            }
            
            CantiereDAO cantiereDAO = new CantiereDAO(logger,LayerGLUPCantieri.getInstance(territorio));
            CantiereBean cantiere = cantiereDAO.leggi(idCantiere, service.getTransaction());
            
            PoligonoGLUPCantiere nuovaGeometria = cantiereDAO.getPoligonoFromJSGeometry(geoCoord);
            PoligonoGLUPCantiere geometria = cantiere.getGeometria();
            
            geometria.setGeometryAttributeWKT(nuovaGeometria.getGeometryAttributeWKT());                                    
            modificato = cantiereDAO.updateGeometria(geometria, vieSelezionate, service.getTransaction());
            service.commit();
            
        } catch (Exception e) {
            String msg = "Errore durante modifica dati geometrici";
            logger.error(msg,e);
            addErrore(request, msg); 
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        } finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
        
        if(!modificato){
            addWarning(request, "La modifica non ha avuto successo!");            
        }else{
            addInformazione(request, "Geometria modificata correttamente!");            
        }
        request.setAttribute("refreshSelected", true);
        setAfterForward(request, true, null);
        return SERVICE_GESTIONE_CANTIERE + "?operazione=V&idCantiere=" + idCantiere;
        
    }

    private String gestioneModificaGeometria(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        String geoOp = getGeoOp(request);
        String geoCoord = getGeoCoord(request);
        Integer codTPN = getCodTPN(request);
        
        Integer idCantiere = recuperaIdCantiere(request);
        
        
        if(!geoOp.equals(Parametri.digitizeOperationAdd) && 
           !geoOp.equals(Parametri.digitizeOperationSubtract) &&
           !geoOp.equals(Parametri.operationFeatureDragDrop) &&
           !geoOp.equals(Parametri.operationFeatureVertexEditing)){
            
            addErrore(request, "Funzione di modifica della geometria non implementata");               
            return TolomeoServlet.ERROR_PAGE_PANNELLO;           
        }
        
        SITLayersManager territorio = getTerritorio(logger);
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(territorio),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE;
        }                              
        
        try {
            
            // simulo la modifica per trovare la geometria modificata, ma poi non la committo, perchè devo ancora far sceglier le strade.
            territorio.EditManager ( codTPN,  "" + idCantiere,  null,  geoCoord,  geoOp ,service.getTransaction(),false);
            CantiereDAO cantiereDAO = new CantiereDAO(logger,LayerGLUPCantieri.getInstance(territorio));
            CantiereBean cantiere = cantiereDAO.leggi(idCantiere, service.getTransaction()); 
            cantiereDAO.caricaStrade(cantiere, service.getConnection());
            service.rollback();
                        
            // carico i codici già presenti
            Set<ViaBean> strade = cantiere.getStrade();            
            String vieSelezionateS = "";            
            Iterator<ViaBean> vieIterator = strade.iterator();
            while(vieIterator.hasNext()){
                ViaBean via = vieIterator.next();
                vieSelezionateS += "," + via.getCodVia6();                
            }

            request.setAttribute("vieSelezionate", vieSelezionateS);
            request.setAttribute("cantiere", cantiere);
            request.setAttribute("geoCoord", cantiere.getGeometria().getJSGeometry());
            
            caricaDatiIntersezioneStrade(request, logger);
            
            request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA_OK.getCode());
            addButton(request, Input.MODIFICA_OK);            
            addButton(request, new Submit(Input.CSS_STYLE_TERMINA,"M","Termina","Interrompi la modifica").onClick("if(confirm('Interrompere la modifica?')){this.form.operazione.value = this.name;this.form.tipoOperazione.value = 'T';return true;}else{return false;};"));
            
            request.setAttribute("pageTitle", "Modifica Geometria - FASE 2");
            return PAGE_INSERIMENTO_CANTIERE_STEP_2;
            
        }catch (Exception e) {
            String msg = "Errore modifica geometria";
            logger.error(msg,e);
            addErrore(request, msg); 
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        } finally {                
            if(service != null){
                service.disconnetti();
            }             
        }
        
    }
    
    private String modificaAnagrafica(HttpServletRequest request, LogInterface logger)  throws ServletException, java.io.IOException{
        
        Integer idCantiere = recuperaIdCantiere(request);
        
        // caso che non deve mai verificarsi
        if(idCantiere == null){            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        } 
        
        AnagraficaCantiereBean cantiere = new AnagraficaCantiereBean();
        
        Integer idProgetto = recuperaIdProgetto(request);
        
        // recupero i dati del cantiere il cui controllo è comune con l'inserimento
        recuperaDatiCantiere(request, cantiere);
        
        cantiere.setId(idCantiere);
        cantiere.setIdProgetto(idProgetto);
        
        request.setAttribute("cantiere", cantiere);
        
        // se c'è un errore nei parametri devo caricare i dati necessari e tornare alla pagina di gestione modifica
        // quindi chiamo la funzione che gestisce i dati di modifica
        if(isThereMessaggioErrore(request)){                
            return gestioneModificaAnagrafica(request, logger);                                
        }   
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE;
        }
                
        boolean aggiornato = false;
        try{
            
            Integer idReferente = cantiere.getIdReferenteLavori();
            Integer idDitta = cantiere.getIdDittaLavori();
            
            // si controlla se il referente appartiene alla Ditta selezionata            
            if(idReferente != null && idDitta != null){
                ReferenteDAO referenteDAO = new ReferenteDAO(logger);
                boolean appartiene = referenteDAO.appartieneAllaDitta(idReferente, idDitta, service.getConnection());
                if(!appartiene){
                    addErrore(request, "Il referente non risulta appartenere alla ditta selezionata");
                    return gestioneModificaAnagrafica(request, logger);
                }
            }
                                          
            AnagraficaCantiereDAO cantiereDAO = new AnagraficaCantiereDAO(getLogger(request));
            aggiornato = cantiereDAO.updateAnagrafica(cantiere, service.getConnection());                        
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
            setAfterForward(request, true, null);
            addInformazione(request, "Anagrafica del cantiere modificata!");
        }
        
        return SERVICE_GESTIONE_CANTIERE + "?operazione=V&idCantiere="+idCantiere;
    }
    
    private String gestioneModificaAnagrafica(HttpServletRequest request, LogInterface logger) throws ServletException, java.io.IOException{
        
        Integer idCantiere = recuperaIdCantiere(request);
        
        // caso che non deve mai verificarsi
        if(idCantiere == null){            
            return TolomeoServlet.ERROR_PAGE_PANNELLO;
        } 
        
        GLUPTransactionService service = new GLUPTransactionService(LayerGLUPCantieri.getInstance(getTerritorio(logger)),logger);
        
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addErrore(request, errMsg);            
            return TolomeoServlet.ERROR_PAGE;
        }
                                
        try{
            AnagraficaCantiereBean cantiere = (AnagraficaCantiereBean)request.getAttribute("cantiere");
            
            // se esiste già un cantiere non lo cerco, ma utilizzo i dati passati (potremmo arrivare dalla modifica)
            if(cantiere == null){
                AnagraficaCantiereDAO cantiereDAO = new AnagraficaCantiereDAO(logger);
                cantiere = cantiereDAO.leggiAnagrafica(idCantiere, service.getConnection());               
            }
            
            TipoInterventoDAO tpIntDAO = new TipoInterventoDAO(logger);
            AmbitoInterventoDAO ambIntDAO = new AmbitoInterventoDAO(logger);            
            DittaDAO appDAO = new DittaDAO(logger);
            
            //  carico le ditte da mostrare nella casella a discesa
            List<DittaBean> ditte = (List<DittaBean>)appDAO.leggiTutti(service.getConnection());
            //  carico i tipi di intervento da mostrare nella casella a discesa
            List<DecodificaBean> tipiIntervento = (List<DecodificaBean>)tpIntDAO.leggiTutti(service.getConnection());
            //  carico gli tipi di intervento da mostrare nella casella a discesa            
            List<DecodificaBean> ambitiIntervento = (List<DecodificaBean>)ambIntDAO.leggiTutti(service.getConnection());            
            
            request.setAttribute("cantiere", cantiere);
            request.setAttribute("ditte", ditte);
            request.setAttribute("tipiIntervento", tipiIntervento);
            request.setAttribute("ambitiIntervento", ambitiIntervento);
            
            // setto il titolo della pagina
            request.setAttribute("pageTitle", "Modifica Anagrafica Cantiere");
            request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA_OK.getCode());
            addButton(request, Input.MODIFICA_OK);
            addButton(request, Input.PULISCI);
            addButton(request, Submit.lookLike(Input.TERMINA).onClick("if(this.form.operazione){this.form.operazione.value = 'V';}"));            
            
            return PAGE_GESTIONE_CANTIERE;
            
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
    
    private Integer recuperaIdCantiere(HttpServletRequest request){
        
        String param = request.getParameter("idCantiere");
        if(StringUtils.isEmpty(param)){
            // caso in cui si arrivi dalla selezione della geometria di Tolomeo
            param = request.getParameter(TolomeoServlet.PARAM__UNIQUEID);
            if(StringUtils.isEmpty(param)){
                addErrore(request,"identificativo del cantiere non valorizzato");
                return null;
            }            
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo del cantiere non numerico");
            return null;
        }  
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
    
    private Integer recuperaIdAmbitoIntervento(HttpServletRequest request){
        
        String param = request.getParameter("idAmbitoIntervento");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"Ambito Intervento non selezionato");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo Ambito Intervento non numerico");
            return null;
        }  
     }
    
    private Integer recuperaIdTipoIntervento(HttpServletRequest request){
        
        String param = request.getParameter("idTipoIntervento");
        if(StringUtils.isEmpty(param)){
            addErrore(request,"Tipo intervento non selezionato");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo \"Tipo intervento\" non numerico");
            return null;
        }  
     }
    
    private Integer recuperaIdReferenteLavori(HttpServletRequest request){
        
        String param = request.getParameter("idReferenteLavori");
        if(StringUtils.isEmpty(param)){        
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"identificativo \"Referente lavori\" non numerico");
            return null;
        }  
     }
    
    
    
    private Integer recuperaIdDittaLavori(HttpServletRequest request){
        
        String param = request.getParameter("idDittaLavori");
        if(StringUtils.isEmpty(param)){
            // Ditta lavori non obbligatoria per il cantiere 
            // addErrore(request,"Ditta lavori non selezionata");
            return null;
        }
        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"Identificativo \"Ditta lavori\" non numerico");
            return null;
        }  
     }
    
    private Integer recuperaNumeroOrdinanza(HttpServletRequest request){
        
        String param = request.getParameter("numOrdinanza");
        if(StringUtils.isEmpty(param)){            
            return null;
        }        
        try{
            return new Integer(param);
        }catch(NumberFormatException nfe){
            addErrore(request,"Numero ordinanza \"" + param + "\" non numerico");
            return null;
        }  
     }

    private Integer recuperaAnnoOrdinanza(HttpServletRequest request){
        
        String param = request.getParameter("annoOrdinanza");
        if(StringUtils.isEmpty(param)){
            return null;
        }
        
        try{
            Integer anno = new Integer(param);
            int annoCorrente = new DateType().getYear();
            if(anno < 1900 || anno > annoCorrente){
                addErrore(request,"anno non valido");                    
            }
            return anno;                
        }catch(NumberFormatException nfe){
            addErrore(request,"anno \"" + param + "\" non numerico");
            return null;
        }  
        
     }
        
     private DateType recuperaDataApertura(HttpServletRequest request){
                                             
         String param = request.getParameter("dtApertura");
         if(StringUtils.isEmpty(param)){             
             return null;
         }
         
         DateType data = DateType.create(param);
         
         if(data == null){
             addErrore(request,"La data di apertura \"" + param + "\" non è una data corretta (GG/MM/AAAA)");
             return null;
         }
         
         return data;
     }   
     
     private DateType recuperaDataChiusura(HttpServletRequest request){
         
         String param = request.getParameter("dtChiusura");
         if(StringUtils.isEmpty(param)){             
             return null;
         }
         
         DateType data = DateType.create(param);
         
         if(data == null){
             addErrore(request,"La data di chiusura \"" + param + "\" non è una data corretta (GG/MM/AAAA)");
             return null;
         }
         
         return data;
     }   
     
     private boolean areGeoParamsPresent(HttpServletRequest request){
         Integer codTPN = getCodTPN(request);                
         String geoCoord = request.getParameter("geoCoord");
         String geoOp = request.getParameter("geoOp");
         
         boolean present = true;
         // Questo non dovrebbe mai accadere essendo il framework Tolomeo a gestirlo
         if(codTPN == null){
             addErrore(request, "Il codice del layer deve essere valorizzato");               
             present = false;
         }
         
         // Questo non dovrebbe mai accadere essendo il framework Tolomeo a gestirlo
         if(geoCoord == null){
             addErrore(request, "Le coordinate della geometria non sono definite");               
             present = false;
         }
         
         // Questo non dovrebbe mai accadere essendo il framework Tolomeo a gestirlo
         if(geoOp == null){
             addErrore(request, "L'operazione geometrica da eseguire non è definita");               
             present = false;
         }
         
         return present;
     }
     
     /**
      * Recupera i dati del cantiere fatta eccezione per :
      * <ul>
      *     <li>
      *         id : identificativo del cantiere (PK) 
      *     </li>
      *     <li>
      *         idProgetto : identificativo del progetto (FK)
      *     </li>
      * </ul> 
      * 
      * @param request
      * @param cantiere
      */
     private void recuperaDatiCantiere (HttpServletRequest request, AnagraficaCantiereBean cantiere){
         
         // dati ordinanza
         Integer numeroOrdinanza = recuperaNumeroOrdinanza(request);
         Integer annoOrdinanza = recuperaAnnoOrdinanza(request);
         
         // dati intervento
         Integer idTipoIntervento   = recuperaIdTipoIntervento(request);
         Integer idAmbitoIntervento = recuperaIdAmbitoIntervento(request);
         
         // dati apertura/chiusura cantiere
         DateType dtApertura = recuperaDataApertura(request);
         DateType dtChiusura = recuperaDataChiusura(request);
         
         if((annoOrdinanza != null && numeroOrdinanza == null) || (annoOrdinanza == null && numeroOrdinanza != null)){ 
             addErrore(request, "Il numero e l'anno di ordinanza devono essere valorizzati contestualmente!");
         }
         
         if(dtChiusura != null && dtApertura == null){
             addErrore(request, "Non è possibile valorizzare la data di chiusura senza aver valorizzato quella di apertura");                
         }else if (dtChiusura != null && dtApertura != null){
             if(!dtApertura.before(dtChiusura)){
                 addErrore(request, "La data di apertura deve essere antecendente a quella di chiusura");
             }
         }
         
         if(dtApertura != null && (numeroOrdinanza == null)){
             addErrore(request, "Il cantiere può essere aperto solo contestualmente ad una ordinanza!");
         }
         
         // dati ditta lavori
         Integer idDitta = recuperaIdDittaLavori(request);
         Integer idReferente = recuperaIdReferenteLavori(request);
         
         if(idDitta == null && idReferente != null){
             addErrore(request, "E' stato immesso un referente senza mettere la ditta relativa");
         }
         
         // note                        
         String note = request.getParameter("note");
         
         cantiere.setNumOrdinanza(numeroOrdinanza);
         cantiere.setAnnoOrdinanza(annoOrdinanza);
         
         cantiere.setIdTipoIntervento(idTipoIntervento);
         cantiere.setIdAmbitoIntervento(idAmbitoIntervento);
         
         cantiere.setDtApertura(dtApertura);
         cantiere.setDtChiusura(dtChiusura);
         
         cantiere.setIdDittaLavori(idDitta);
         cantiere.setIdReferenteLavori(idReferente);
         
         cantiere.setNote(note);         
         
     }
}

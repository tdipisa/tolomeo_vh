package it.prato.comune.tolomeo.servizi.censimento;

import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.plugin.comunePO.catasto.LayerCatastoFabbricati;
import it.prato.comune.sit.plugin.comunePO.catasto.PoligonoCatastoFabbricati;
import it.prato.comune.sit.plugin.comunePO.censimento.anno2011.LayerFabbricatiCensimento;
import it.prato.comune.sit.plugin.comunePO.censimento.anno2011.PoligonoFabbricatiCensimento;
import it.prato.comune.tolomeo.utility.Costanti;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Submit;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.core.type.DateType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

/**
 * Servlet implementation class for Servlet: GestioneFabbricatiServlet
 *
 */
 public class GestioneFabbricatiServlet extends TolomeoServlet  {
     
   static final long serialVersionUID = 1L;
   
    /* (non-Java-doc)
	 * @see javax.servlet.http.HttpServlet#HttpServlet()
	 */
	public GestioneFabbricatiServlet() {
		super();
	}   	
	
	/* (non-Java-doc)
	 * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}  	
	
	/* (non-Java-doc)
	 * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    
	    String key     = getKey(request);
        String forward = getForward(request);        
        int codTPN     = getCodTPN(request);
        String JSGeometry = null;
        
        if (StringUtils.isEmpty(key)) {
            /*
            //recupero la key se la richiesta mi è stata inoltrata da una jsp e poi controllo se è valorizzata
            key = request.getParameter("key");
            */
            
            // Se sono presenti errori giro la richiesta alla pagina di errore
            // if (StringUtils.isEmpty(key)) {

                addErrore(request, "Operazione non implementata");
                forward(TolomeoServlet.ERROR_PAGE_PANNELLO, request, response);
                return;
            // }
        } 
        
        String operazioneStr = request.getParameter("operazione");
        Costanti.OperazioniStandard operazione = (operazioneStr == null) ? null : Costanti.OperazioniStandard.decode(operazioneStr.toUpperCase());
        
        LogInterface logger = getLogger(request);

        SITLayersManager comunePO = getTerritorio(logger);
        LayerFabbricatiCensimento layerFabbCens = (LayerFabbricatiCensimento)comunePO.getLayerByCodTPN(codTPN);
        LayerCatastoFabbricati catastoFabbricati = LayerCatastoFabbricati.getInstance(comunePO);
        
        try {
                    
            PoligonoFabbricatiCensimento fabbricatoCensimento = (PoligonoFabbricatiCensimento)layerFabbCens.cercaIDTPN(key);                                
            List<PoligonoCatastoFabbricati> particelleIntersecate = catastoFabbricati.chiInterseca(fabbricatoCensimento);
            request.setAttribute("particelleIntersecate", particelleIntersecate);
            request.setAttribute("fabbricatoCensimento", fabbricatoCensimento);
            request.setAttribute("operazione", Costanti.OperazioniStandard.MODIFICA_OK.getCode());
            addButton(request, Input.MODIFICA_OK);
            addButton(request, Input.PULISCI);
            
            // OPERAZIONE DI DEFAULT
            if(operazione == null || operazione.equals(Costanti.OperazioniStandard.VISUALIZZAZIONE) || operazione.equals(Costanti.OperazioniStandard.MODIFICA)){
                            
                
                
            } else if (operazione.equals(Costanti.OperazioniStandard.MODIFICA_OK)) {
                
                String idFabbricato = request.getParameter("idFabbricato");
                String particella = request.getParameter("particella");
                String foglio = request.getParameter("foglio");
                String note = request.getParameter("note");
                
                if(StringUtils.isEmpty(idFabbricato)){
                    addErrore(request, "L'identificativo del fabbricato non è valorizzato");
                    forward(forward,request,response);
                    return;
                } 
                /*
                else if(StringUtils.isEmpty(particella) || StringUtils.isEmpty(foglio)){
                    addErrore(request, "Foglio e particella devono essere entrambe valorizzati");
                    forward(forward,request,response);
                    return;
                } 
                */               
                             
                fabbricatoCensimento.setParticella(particella);
                fabbricatoCensimento.setFoglio(foglio);                
                fabbricatoCensimento.setDtAggiornamento(new DateType());
                fabbricatoCensimento.setNote(note);
                
                layerFabbCens.modifyFeature(fabbricatoCensimento);
                
                setAfterForward(request, true, null);
                addInformazione(request, "Aggiornati particella e foglio per il fabbricato");
                            
            } else {
                            
                addErrore(request, "Operazione non implementata");
                forward(TolomeoServlet.ERROR_PAGE_PANNELLO, request, response);
                return;
                
            }        
        
            forward(forward,request,response);
            
        } catch(Exception e){
            logger.error("Errore nella gestione del fabbricato",e);
        } finally {
            try {
                comunePO.dispose();
            } catch (SITException e){
                logger.error("Impossibile eseguire la dispose di comunePO");
            }
        }
        
	}   
	
	protected String getDefaultForward() {
        return "/jsp/servizi/censimento/gestioneFabbricato.jsp";
    }
}
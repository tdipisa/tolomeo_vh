package it.prato.comune.tolomeo.servizi.censimento;

import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.plugin.comunePO.censimento.anno2011.LayerFabbricatiCensimento;
import it.prato.comune.tolomeo.servizi.censimento.model.FabbricatiCensimentoService;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class for Servlet: GestioneFabbricatiServlet
 *
 */
 public class ResocontoFabbricatiServlet extends TolomeoServlet  {
     
   static final long serialVersionUID = 1L;
   
    /* (non-Java-doc)
	 * @see javax.servlet.http.HttpServlet#HttpServlet()
	 */
	public ResocontoFabbricatiServlet() {
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
	    
	    LogInterface logger = getLogger(request);
        SITLayersManager comunePO = getTerritorio(logger);        
        
        FabbricatiCensimentoService service = new FabbricatiCensimentoService(logger,LayerFabbricatiCensimento.getInstance(comunePO));
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE_PANNELLO, request, response);
            return;           
        }
        
        int totaleFabbricati = 0;
        int totaleFabbricatiAssociatiInAuto = 0;
        int totaleFabbricatiElaborati = 0;
        int totaleFabbricatiElaboratiNonAssegnati = 0;
                        
        try {
                
            totaleFabbricatiElaborati = service.getTotaleFabbricatiElaborati();
            
            totaleFabbricati = service.getTotaleFabbricati();
            totaleFabbricatiAssociatiInAuto = service.getTotaleFabbricatiAssociatiInAuto();
            
            totaleFabbricatiElaboratiNonAssegnati = service.getTotaleFabbricatiElaboratiNonAssegnati();           
            
        } catch(Exception e){
                        
            String errMsg = "Si è verificata una eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE_PANNELLO, request, response);
            return;           
             
        } finally {
             
            if(service != null){
                service.disconnetti();
            }
             
        }
                                        
        request.setAttribute("totaleFabbricati",totaleFabbricati);
        request.setAttribute("totaleFabbricatiAssociatiInAuto",totaleFabbricatiAssociatiInAuto); 
        request.setAttribute("totaleFabbricatiElaborati",totaleFabbricatiElaborati);
        request.setAttribute("totaleFabbricatiElaboratiAssegnati",totaleFabbricatiElaborati - totaleFabbricatiElaboratiNonAssegnati);
        request.setAttribute("totaleFabbricatiElaboratiNonAssegnati",totaleFabbricatiElaboratiNonAssegnati);
        
        forward(request, response);
        
	}   
	
	protected String getDefaultForward() {
        return "/jsp/servizi/censimento/resocontoFabbricati.jsp";
    }
}
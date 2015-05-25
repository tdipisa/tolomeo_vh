/**************************************************************
* Project:      TolomeoApplicationComposer - Compositore di layout per Tolomeo
* File:         ExportFileServlet.java
* Function:     Servlet per la validazione del contenuto di un file xml sulla base di un file xsd
* Version:      1.0.0
***************************************************************/

package it.prato.comune.tolomeo.web.composer;

import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.tolomeo.xmleditor.XmlSchemaValidator;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.naming.InvalidNameException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
// import javax.servlet.annotation.WebServlet;

/**
 * Implementazione metodi comuni a tutte le servlet di composer
 */
// @WebServlet("/XsdValidation")
public class XsdValidation extends TolomeoServlet {
    
	private static final long serialVersionUID = 1L;

    /**
     * Costruttore di defult
     */
    public XsdValidation() {
    	
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @param xmlString - stringa in formato xml
	 * @param xsdFile - url al file xsd sul quale basare la validazione
	 * @param xsdLanguage - stringa contenente il linguaggio dello schema
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	    LogInterface logger = getLogger(request);
	    
		logger.info("XsdValidation - doPost - START");
		
		PrintWriter out = response.getWriter();
    	response.setContentType("text/html");
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "GET, POST");
		
		String xmlString = request.getParameter("xmlString");
		String xsdFile = request.getParameter("xsdFile");
		String xsdLanguage = request.getParameter("xsdLanguage");
		
		logger.info("XsdValidation - doPost - xmlString: " + xmlString);
		logger.info("XsdValidation - doPost - xsdFile: " + xsdFile);
		logger.info("XsdValidation - doPost - xsdLanguage: " + xsdLanguage);
		
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();
        File presetDirectory = context.getPresetDirectory(); 
        
        try {
            xmlString = Parametri.loadIncludeEProperties(xmlString, presetDirectory);
        } catch (InvalidNameException ine){
            logger.error("Errore durante la risoluzione di include e properties",ine);
            throw new IOException("Errore durante la risoluzione di include e properties",ine);
        }
		
		XmlSchemaValidator validator = new XmlSchemaValidator();
		
		String message = validator.validate(xmlString, xsdFile,xsdLanguage);
		
		logger.info("XsdValidation - doPost - result: " + message);
		logger.info("XsdValidation - doPost - STOP");
		
		out.print(message);
		out.close();
		
		logger.info("XsdValidation - doPost - STOP");
		
	}

    @Override
    protected String getDefaultForward() {
        // TODO Auto-generated method stub
        return null;
    }
}

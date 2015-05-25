package it.prato.comune.tolomeo.web;

import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.logging.uti.LoggingUti;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.geotools.factory.Hints;

public class TolomeoContextListener implements ServletContextListener {

	private static final String CONFIG_FILE_PATH = "configFilePath";
	
	public TolomeoContextListener() {
		
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		
	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {

		ServletContext servletCtx = sce.getServletContext();
		
		String configFile = servletCtx.getInitParameter(CONFIG_FILE_PATH);
		
		if (configFile==null || configFile.trim().equals("")) {
			configFile = servletCtx.getRealPath("/WEB-INF/config") + "/tolomeo.properties" ;
		}
		
		try {					
			
			TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();       
		    context.setConfigFileName(configFile);       
		    				    
		    /*
             * Inizializza log4j
             */
            String log4jfile = context.getLog4JPropertiesFile();
            if (log4jfile != null && log4jfile.trim().length() > 0) {
                LoggingUti.configureFromFSPath(log4jfile);
            }
		      				    

			context.getAnonymousLogger().info("TolomeoContextListener - Inizializzazione contesto tolomeo effettuata");
			
			Hints.putSystemDefault(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER, Boolean.TRUE);
			
		} catch (IOException e) {
			
			TolomeoApplicationContext.getInstance()
				.getAnonymousLogger()
				.info("TolomeoContextListener - Errore IOException",e);
		} 
		
	}

}

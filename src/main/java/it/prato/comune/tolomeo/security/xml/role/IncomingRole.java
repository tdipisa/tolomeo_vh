package it.prato.comune.tolomeo.security.xml.role;

import java.util.List;


public class IncomingRole {
	
	private String name;
	
	private List<Application> applications;

	public String getName() {
		return name;
	}

	public List<Application> getApplications() {
		return applications;
	}

}

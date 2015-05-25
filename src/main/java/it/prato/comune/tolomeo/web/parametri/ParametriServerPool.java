package it.prato.comune.tolomeo.web.parametri;

import java.util.ArrayList;
import java.util.List;

public class ParametriServerPool {
	private List<ParametriServer> serverList = new ArrayList<ParametriServer>();

	public List<ParametriServer> getServerList() {
		return serverList;
	}

	public void addServer(ParametriServer a) {
		serverList.add(a);        
	}
	
	public ParametriServer getServer(String serverID) {
		
		for (ParametriServer ps: serverList) {
			if (ps.getId().equals(serverID)) return ps;
		}
		
		return null;
	}

	/**
	 * @param serverList the serverList to set
	 */
	public void setServerList(List<ParametriServer> serverList) {
		this.serverList = serverList;
	}
	
}

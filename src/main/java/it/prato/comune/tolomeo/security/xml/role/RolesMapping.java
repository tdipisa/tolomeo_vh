package it.prato.comune.tolomeo.security.xml.role;

import java.util.Iterator;
import java.util.List;

public class RolesMapping {
	
	private List<IncomingRole> incomingRoles;

	public List<IncomingRole> getIncomingRoles() {
		return incomingRoles;
	}
	
	public IncomingRole getIncomingRoleByName(String incomingRoleName) {
		Iterator<IncomingRole> incomingRolesIterator = incomingRoles.iterator();
		while (incomingRolesIterator.hasNext()) {
			IncomingRole incomingRole = incomingRolesIterator.next();
			if (incomingRole.getName().equals(incomingRoleName)) {
				return incomingRole;
			}
		}
		return null;
	}
	
}

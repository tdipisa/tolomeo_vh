package it.prato.comune.tolomeo.security.xml.role;

import java.util.List;

public class Application {
	
	private String name;
	
	private List<AssignedRole> assignedRoles;

	@Override
	public boolean equals(Object object) {
		if (!name.equals(((Application)object).getName())) {
			return false;
		} else {
			if (assignedRoles.size() != ((Application)object).getAssignedRoles().size()) {
				return false;
			} else {
				for (int assignedRoleIndex = 0 ; assignedRoleIndex < assignedRoles.size() ; assignedRoleIndex ++) {
					if (!assignedRoles.get(assignedRoleIndex).equals(((Application)object).getAssignedRoles().get(assignedRoleIndex))) {
						return false;
					}
				}
			}
		}
		return true;
	}

	public String getName() {
		return name;
	}

	public List<AssignedRole> getAssignedRoles() {
		return assignedRoles;
	}
	
}

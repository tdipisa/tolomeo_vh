package it.prato.comune.tolomeo.security.xml.role;


public class AssignedRole {
	
	private String name;

	public String getName() {
		return name;
	}
	
	public boolean equals(Object object) {
		if (!name.equals(((AssignedRole)object).getName())) {
			return false;
		}
		return true;
	}

}

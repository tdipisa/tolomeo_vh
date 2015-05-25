package it.prato.comune.tolomeo.web.parametri;

import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

public class ParametriHelpInfo {
    
    private String mainTitle = "Informazioni applicazione";
    private ArrayList<ParametriHelpInfoDetail> infoList = new ArrayList<ParametriHelpInfoDetail>();
    
    public boolean parse(HttpServletRequest request) {
        return true;
    }
    
    public String getMainTitle() {
        return mainTitle;
    }
    
    public void setMainTitle(String mainTitle) {
        this.mainTitle = mainTitle;
    }
    
    public ArrayList<ParametriHelpInfoDetail> getInfoList() {
        return infoList;
    }
    
    public void addInfo(ParametriHelpInfoDetail a) {
        infoList.add(a);        
    }
    
}

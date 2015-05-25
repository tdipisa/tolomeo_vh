package it.prato.comune.tolomeo.web.parametri;

import javax.servlet.http.HttpServletRequest;

public class ParametriHelpInfoDetail {
    
    private String title = null;
    private String url = null;
    private Boolean framed = false;
    
    public boolean parse(HttpServletRequest request) {
        return true;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getFramed() {
        return framed;
    }

    public void setFramed(Boolean framed) {
        this.framed = framed;
    }
        
        
}

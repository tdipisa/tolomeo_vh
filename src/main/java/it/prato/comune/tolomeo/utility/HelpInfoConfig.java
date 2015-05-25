package it.prato.comune.tolomeo.utility;

public class HelpInfoConfig {
    
    private int order;
    private String title;
    private String url;
    private boolean framed;
    private boolean important;
    
    public int getOrder() {
        return order;
    }
    public void setOrder(int order) {
        this.order = order;
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
    public boolean isFramed() {
        return framed;
    }
    public void setFramed(boolean framed) {
        this.framed = framed;
    }
    public boolean isImportant() {
        return important;
    }
    public void setImportant(boolean important) {
        this.important = important;
    }       

}

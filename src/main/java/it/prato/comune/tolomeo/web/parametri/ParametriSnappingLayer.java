package it.prato.comune.tolomeo.web.parametri;

public class ParametriSnappingLayer {
    
    private String name;
    private String url;
    private String role;
    private int minScale = 5000;
    private int maxScale = 200;
    private String srsName;
    private String featureType;
    private String featurePrefix;
    private String featureNS = null;
    private String geometryName;
    private String propertyNames;
    private String outputFormat = "JSON";
    private boolean edge = false;
    private int tolerance = 20;
    
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public int getMinScale() {
        return minScale;
    }
    public void setMinScale(int minScale) {
        this.minScale = minScale;
    }
    public int getMaxScale() {
        return maxScale;
    }
    public void setMaxScale(int maxScale) {
        this.maxScale = maxScale;
    }
    public String getSrsName() {
        return srsName;
    }
    public void setSrsName(String srsName) {
        this.srsName = srsName;
    }
    public String getFeatureType() {
        return featureType;
    }
    public void setFeatureType(String featureType) {
        this.featureType = featureType;
    }
    public String getFeaturePrefix() {
        return featurePrefix;
    }
    public void setFeaturePrefix(String featurePrefix) {
        this.featurePrefix = featurePrefix;
    }
    public String getFeatureNS() {
        return featureNS;
    }
    public void setFeatureNS(String featureNS) {
        this.featureNS = featureNS;
    }
    public String getGeometryName() {
        return geometryName;
    }
    public void setGeometryName(String geometryName) {
        this.geometryName = geometryName;
    }
    public String getPropertyNames() {
        return propertyNames;
    }
    public void setPropertyNames(String propertyNames) {
        this.propertyNames = propertyNames;
    }
    public String getOutputFormat() {
        return outputFormat;
    }
    public void setOutputFormat(String outputFormat) {
        this.outputFormat = outputFormat;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public boolean isEdge() {
        return edge;
    }
    public void setEdge(boolean edge) {
        this.edge = edge;
    }
    public int getTolerance() {
        return tolerance;
    }
    public void setTolerance(int tolerance) {
        this.tolerance = tolerance;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }           
}

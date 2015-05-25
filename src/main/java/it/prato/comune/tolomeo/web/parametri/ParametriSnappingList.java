package it.prato.comune.tolomeo.web.parametri;

import java.util.ArrayList;

public class ParametriSnappingList {
    
    private ArrayList<ParametriSnappingLayer> snappingLayerList = new ArrayList<ParametriSnappingLayer>();

    public ArrayList<ParametriSnappingLayer> getSnappingLayerList() {
        return snappingLayerList;
    }
    
    public void addSnappingLayer(ParametriSnappingLayer p) {
        snappingLayerList.add(p); 
    }
}

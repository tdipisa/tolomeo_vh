/*******************************************************************************
 * Tolomeo is a developing framework for visualization, editing,  
 * geoprocessing and decisional support application based on cartography.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * This file is part of Tolomeo.
 * 
 * Tolomeo is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License 
 * as published by the Free Software Foundation; either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * Tolomeo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 * if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 * 
 * Developers Information:
 * 
 * Tolomeo is developed by Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it 
 * 
 * 
 * Versione in Italiano LGPL
 * 
 * Tolomeo è un framework per lo sviluppo di applicazioni per
 * visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * Questo file fa parte di Tolomeo.
 * 
 * Tolomeo è un software libero; è possibile redistribuirlo e / o 
 * modificarlo sotto i termini della GNU Lesser General Public License, 
 * come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 *  
 * Tolomeo è distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 * IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 * si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
 *   
 * 
 * Informazioni Sviluppatori:
 * 
 * Tolomeo è sviluppato dal Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 ******************************************************************************/
package it.prato.comune.tolomeo.web.viewer;

import java.util.List;

import edu.umn.gis.mapscript.MS_LAYER_TYPE;

public class PLayer {
    
    private String layerName = null;
    private Integer layerIdx = null;
    private MS_LAYER_TYPE layerType = null;
    private Integer skipLegend = null;
    private List<String> classes=null;
    private String labelItem = null;
    
    public PLayer(String layerName) {
        this.layerName = layerName;
    }


    public String getLayerName() {
        return layerName;
    }


    public Integer getLayerIdx() {
        return layerIdx;
    }


    public void setLayerIdx(Integer layerIdx) {
        this.layerIdx = layerIdx;
    }


    public MS_LAYER_TYPE getLayerType() {
        return layerType;
    }


    public void setLayerType(MS_LAYER_TYPE layerType) {
        this.layerType = layerType;
    }


    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }


    public Integer getSkipLegend() {
        return skipLegend;
    }


    public void setSkipLegend(Integer skipLegend) {
        this.skipLegend = skipLegend;
    }


    public List<String> getClasses() {
        return classes;
    }


    public void setClasses(List<String> classes) {
        this.classes = classes;
    }


    public String getLabelItem() {
        return labelItem;
    }


    public void setLabelItem(String labelItem) {
        this.labelItem = labelItem;
    }

    /*
    class GLAYER
    {
        function GLAYER($glayerName)
        {
            $this->glayerName = $glayerName;
            $this->selFields = array();
            $this->hyperFields = array();
        }

        function setLayerIdx($glayerIdx)
        {
            $this->glayerIdx = $glayerIdx;
        }

        function setLayerType($glayerType)
        {
            $this->glayerType = $glayerType;
        }

        function setResFields($selFields)
        {
            $this->selFields = $selFields;
        }

        function setHyperFields($hyperFields)
        {
            $this->hyperFields = $hyperFields;
        }

        function setTableJoin($joinList)
        {
            $this->joinList = $joinList;
        }

        function setClasses($classes)
        {
            $this->classes = $classes;
        }
        
        function setLabelItem($labelItem)
        {
            $this->labelItem = $labelItem;
        }

        function setXYLayerAttribute()
        {
            $this->isXYLayer = 1;
        }
        
        function setXYLayerProperties($XYLayerProperties)
        {
            $this->XYLayerProperties = $XYLayerProperties;
        }
        
        function setSkipLegend($skipLegend)
        {
            $this->skipLegend = $skipLegend;
        }
        
        function setTransparency($transparency)
        {
            $this->glayerTransparency = $transparency;
        }
        
        function setLayerEncoding($encoding)
        {
            $this->layerEncoding = $encoding;
        }
        

        //*** GLOBAL RETURN FUNCTIONS ***

        function getLayerName()
        {
            return $this->glayerName;
        }

        function getLayerIdx()
        {
            return $this->glayerIdx;
        }

        function getLayerType()
        {
            return $this->glayerType;
        }

        function getResFields()
        {
            return $this->selFields;
        }

        function getHyperFields()
        {
            return $this->hyperFields;
        }

        function getTableJoin()
        {
            if (isset($this->joinList)) {
                return $this->joinList;
            } else {
                return false;   
            }
        }

        function getClasses()
        {
            return $this->classes;
        }
        
        function getLabelItem()
        {
            if (isset($this->labelItem)) {
                return $this->labelItem;
            } else {
                return false;   
            }
        }
        
        function checkForXYLayer()
        {
            return $this->isXYLayer;
        }
        
        function getXYLayerProperties()
        {
            if (isset($this->XYLayerProperties)) {
                return $this->XYLayerProperties;
            } else {
                return false;   
            }
        }
        
        function getSkipLegend()
        {
            return $this->skipLegend;
        }
        
        function getTransparency()
        {
            return $this->glayerTransparency;
        }
        
        function getLayerEncoding()
        {
            return $this->layerEncoding;
        }
    }

    */
}

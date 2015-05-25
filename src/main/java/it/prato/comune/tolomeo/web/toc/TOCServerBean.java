package it.prato.comune.tolomeo.web.toc;

import java.util.ArrayList;
import java.util.List;

public class TOCServerBean {
	
	private Integer   tileStampaLarghezza 	= null;
	private Integer   tileStampaAltezza 	= null;
	private Float     opacity               = null; 

	
	/**
	 * @return the tileStampaLarghezza
	 */
	public Integer getTileStampaLarghezza() {
		return tileStampaLarghezza;
	}
	/**
	 * @param tileStampaLarghezza the tileStampaLarghezza to set
	 */
	public void setTileStampaLarghezza(Integer tileStampaLarghezza) {
		this.tileStampaLarghezza = tileStampaLarghezza;
	}
	/**
	 * @return the tileStampaAltezza
	 */
	public Integer getTileStampaAltezza() {
		return tileStampaAltezza;
	}
	/**
	 * @param tileStampaAltezza the tileStampaAltezza to set
	 */
	public void setTileStampaAltezza(Integer tileStampaAltezza) {
		this.tileStampaAltezza = tileStampaAltezza;
	}
	
    public Float getOpacity() {
        return opacity;
    }
    
    public void setOpacity(Float opacity) {
        this.opacity = opacity;
    }

}

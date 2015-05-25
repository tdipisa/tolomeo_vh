/**
 * @class Ext.ux.CarouselPanel
 * @author Alessandro Radaelli - Comune di Prato
 * 
 */
Ext.define('Ext.ux.CarouselPanel', {
	extend: 'Ext.Panel',

	carousel: null,
	carouselItems: null,
	carouselConfig: null,
	carouselFixedLeft: null,
	carouselFixedTop: null,
	autoOffsetXAdjust:0,
	autoOffsetYAdjust:0,
	draggableObj: null,
	
	autoDraggableDetect: true,
	
	// private
	itemsToAppend: null,
	
	initComponent: function(){
		
		this.layout= 'fit';
		this.autoScroll= true;
	    this.itemsToAppend = (this.carouselItems!=null) ? this.carouselItems : [];
	    if (this.carouselFixedLeft!=null && this.carouselFixedTop!=null && this.autoDraggableDetect) this.on('added', this.addedHandler, this);
	    
	    this.addEvents('draggableObjInitialized');
	    
	    if (this.draggable && this.autoDraggableDetect) {
	    	this.draggableObj = this;
	    	this.fireEvent(draggableObjInitialized, this.draggableObj);
	    } 
	    
	    this.callParent(arguments);
	
	},
	
	addedHandler: function(thisComponent, ownerCt, index) {
		
		if (ownerCt && ownerCt.draggable) {
	    	this.setDraggableObj(ownerCt);
	    }
		
	},
	/*
	_setDDOwner: function() {

			var thisPanel=this;
    		//if (!this.draggableObj.dd) {
    			//Ext.dd.DD
    			this.draggableObj.dd = new Ext.dd.DD(this.draggableObj.getId()); //this.draggableObj
    			//this.draggableObj.dd.setDragElId(this.body.id);
    			this.draggableObj.dd.constrainTo(Ext.get(this.getEl())); //this.draggableObj.renderTo
        		this.draggableObj.dd.startDrag = this.draggableObj.dd.startDrag.createSequence(
    		    										function(){
    										    	        var w = thisPanel.draggableObj;
    										    	        var so = w.el.shadowOffset;
    										    	        this.constrainTo(w.container, {right: so, left: so, bottom: so});
    										    	    });
    		//}
    		this.draggableObj.dd.onDrag = this.draggableObj.dd.onDrag.createSequence(thisPanel.onDragHandler, thisPanel);
    		
    		this.fireEvent('draggableObjInitialized', this.draggableObj);
	}, 
	*/
	setDraggableObj: function(draggableObj) {

		if ( draggableObj.draggable) {
			this.draggableObj = draggableObj;
			if (this.draggableObj) {
				//var thisPanel=this;
		    	/*if (this.draggableObj.rendered) {
		    		if (this.rendered) {
		    			this._setDDOwner();	
		    		}
		    		else 
		    			this.on('afterrender', this._setDDOwner, thisPanel, {single:true});
		    	} else {
		    		this.draggableObj.on('afterrender', this._setDDOwner, thisPanel, {single:true});
		    	}*/
		    	
		    	this.draggableObj.on('move', this.onDragHandler, this);	    		
		    	this.draggableObj.on('expand', this.onDragHandler, this);
		
		    }
		} 
	},
	
	
	removed : function( thisComponent, ownerCt ) {
		//????
		
	}, 
	
    /**
     * Method: afterRender
     * Metodo privato invocato dopo che il pannello è stato renderizzato.
     * 
     */
    afterRender: function() {    	
    	this.callParent(arguments);
    	
		this.carousel = Ext.create('Ext.ux.Carousel', this.body.id, this.carouselConfig);
		this.on('resize', this.carousel.resize, this.carousel);
		this.on('maximize', this.carousel.resize, this.carousel);
		if (this.itemsToAppend!=null) {
			for (var i=0; i<this.itemsToAppend.length; i++) {
				this.carousel.add(this.itemsToAppend[i], false);
			}
			this.autoOffset();
			this.carousel.refresh();
		}
			
    },
	
	prevItem: function() {
		if (this.carousel) this.carousel.prev();
        return this.carousel; 
    },
    
    nextItem: function() {
    	if (this.carousel) this.carousel.next();
        return this.carousel;         
    },

    play: function() {
    	if (this.carousel) this.carousel.play();
        return this.carousel;
    },

    pause: function() {
    	if (this.carousel) this.carousel.pause();        
        return this.carousel;
    },
        
    clearItems: function() {
    	if (this.carousel) this.carousel.clear();
        return this.carousel;
    },
    
    addImgItem: function(imgid, imgurl, imgtitle, refresh) {
    	
    	var docbody = Ext.getBody();
      	var imgel = Ext.DomHelper.insertHtml('afterBegin', docbody.dom, '<img id="'+ imgid +'" title="'+ imgtitle +'" />');
    	
      	imgel.srctoload=imgurl;
      	imgel.isLoaded=function() {return this.src && this.src!=""; };
      	imgel.load=function() { this.src=this.srctoload; };
      	
      	
      	this.addItem(imgid, refresh);
    },
    
    addItem: function(el, refresh) {
    	
    	if (this.carousel) {
    		this.carousel.add(el, refresh);
    		this.autoOffset();
    	} else {
    		this.itemsToAppend.push(el);
    	}
        return this.carousel;
    },
    
    refresh: function(slide) {
    	if (this.carousel) this.carousel.refresh(slide);                
        return this.carousel;        
    },
    
    setSlide: function(index, initial) {
    	if (this.carousel) this.carousel.setSlide(index, initial);
    },
    
    setOffset: function(xOffset, yOffset) {
    	if (this.carousel) this.carousel.setOffset(xOffset, yOffset);
    },
    
    autoOffset: function() {
    	var pos = this.getPosition(false);
    	var xOffset = this.carouselFixedLeft - pos[0] + this.autoOffsetXAdjust;
    	var yOffset = this.carouselFixedTop - pos[1] + this.autoOffsetYAdjust;
    	
    	if (this.carousel) this.setOffset(xOffset, yOffset);
    	
    },

	setCarouselFixed: function(newCarouselFixedLeft, newCarouselFixedTop) {
		this.carouselFixedLeft = newCarouselFixedLeft;
		this.carouselFixedTop  = newCarouselFixedTop;
		this.autoOffset();
	},
    
    onDragHandler: function() {

    	this.autoOffset();
		return 	true;
    
    }
    
	
});
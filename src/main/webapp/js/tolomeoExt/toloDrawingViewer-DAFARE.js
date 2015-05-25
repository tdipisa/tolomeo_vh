/* 
 Tolomeo is a developing framework for visualization, editing,  
 geoprocessing and decisional support application based on cartography.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 This file is part of Tolomeo.
 
 Tolomeo is free software; you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License 
 as published by the Free Software Foundation; either version 3 of the License, 
 or (at your option) any later version.
 
 Tolomeo is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 
 You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo è un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo è un software libero; è possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo è distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo è sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
*/

Ext.namespace("TolomeoExt");

/**
 * Class: TolomeoExt.DrawingViewer
 * Un pannello che consente di visualizzare immagini di elaborati tecnici 
 * come quelli del catasto e farci misurazioni sopra. 
 *
 * Inherits from:
 *  - <Ext.Panel>
 *
 */ 
TolomeoExt.DrawingViewer = Ext.extend(Ext.Panel, {
            
    imageSrc : '',
    minZoom : 10,
    maxZoom : 200,
    scaleStepFactor : 1.25,
    originalScale : 200,
    originalFormat : 'A4',
    frame: false,
    bodyCssClass: 'x-panel-mc',
    iconBasePath: null,    
    drawingColor: 'red',
    
    initComponent: function() {
    
        this.layout = 'absolute';   
        this.zoomFactor = 1;            
        this.autoScroll = true,
        this.tbar = [];
        this.bbar = [];    
        this.bodyStyle = 'padding: 0px;  background-color: LightGrey;';

        TolomeoExt.DrawingViewer.superclass.initComponent.apply(this, arguments);       
        
        Ext.QuickTips.init();
        
        this.addEvents({
          'distancechange':true,
          'areachange':true,
          'scalechange':true,
          'formatchange':true,
          'zoomchange': true
        });       
        
        // BoxComponent per la gestione dei margini
        this.marginBox = new Ext.BoxComponent({
            x: 0,
            y: 0,                
            style: {                        
              'background-image' : "url('" + Ext.BLANK_IMAGE_URL + "')"
            }
            
        });           
                        
        this.add(this.marginBox);                   
        
        // BoxComponent contenente l'immagine
        this.imageBox = new Ext.BoxComponent({
            y: 0,       
            hidden: true,           
            autoEl: {
              tag: 'img',                  
              src: ''
            },
            listeners : {
              'afterrender' : function() {                                                                                
                this.imageBox.el.on('load',this.onImageLoad,this);                                        
                this.loadImage(this.imageSrc);                        
              },
              scope: this
            }
        });
        
        this.imageBox.updateSrc = function(src){
          this.el.dom.src = src;
        }
        
        // Aggiungo il tag immagine
        this.add(this.imageBox);       
        
        // BoxComponent il cui div viene utilizzato da Raphael per disegnare                
        this.canvasBox = new Ext.BoxComponent({
            x: 0,
            y: 0,
            style: {
                // metto un'immagine di background altrimenti explorer non rileva gli eventi                        
                'background-image' : "url('" + Ext.BLANK_IMAGE_URL + "')"
            },
            listeners : {
              'afterrender' : function() {                                                                                
                this.panStart();
              },
              scope: this
            }
        });
        
        this.add(this.canvasBox);   
        
        // Aggiungo il box per i risultati
        /*
        this.resultBox = new Ext.Panel({
            
            width : 100,
            height: 50,
            //frame: true,                    
            border: true,                    
            html : '<b>Formato : </b><br /> <b>Scala : </b>',
            style: {
              'background': "transparent url('trasparente.gif') repeat"
            }
        });
        
        this.add(this.resultBox);   
        */
        
        if (this.iconBasePath==null) this.iconBasePath =  TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'img/icone/16-default/';
        
        // Pan
        this.getTopToolbar().add({ 
          enableToggle: true,
          pressed: true,
          toggleGroup: 'op',
          tooltip: {text: 'Sposta l\'area di visualizzazione dell\'immagine', title: 'Panoramica'},
          handler: this.panStart, 
          scope: this, 
          icon: this.iconBasePath + 'hand.gif' 
        });
        
        // Zoom out
        this.zoomOutBtn = this.getTopToolbar().add({ 
          tooltip: {text: 'Diminuisce la dimensione dell\'immagine', title: 'Zoom out'},
          handler: this.zoomOut, 
          scope: this, 
          icon: this.iconBasePath + 'zoomout.gif' 
        });
        
        // slider
        this.slider =  this.getTopToolbar().add({ 
          xtype: 'slider',                  
          width: 100,
          //increment: 10,
          minValue: this.minZoom,
          maxValue: this.maxZoom,
          plugins: [new Ext.slider.Tip({
            getText: function(thumb){
              return String(thumb.value) + '%';
            }
          })],                 
          listeners: {                    
        		'changecomplete': function(f, newValue) {                		  
        			this.setZoom(newValue/100);  
        		},
        		scope: this
        	} 
        });                
        
        // Zoom in
        this.zoomInBtn = this.getTopToolbar().addButton({ 
          tooltip: {text: 'Aumenta la dimensione dell\'immagine', title: 'Zoom in'},
          handler: this.zoomIn, 
          scope: this, 
          icon: this.iconBasePath + 'zoomin.gif' 
        });
         
        // Reset zoom
        this.getTopToolbar().add({ 
          tooltip: {text: 'Ripristina la dimensione iniziale dell\'immagine', title: 'Ripristino zoom'},
          handler: this.resetZoom, 
          scope: this, 
          icon: this.iconBasePath + 'nozoom.gif' 
        });
        
        this.getTopToolbar().addSeparator();                
        
        // Misura distanza
        this.getTopToolbar().add({
          tooltip: {text: 'Funzionalit&agrave; per la misurazione di distanze', title: 'Misura distanza'},
          enableToggle: true,
          toggleGroup: 'op', 
          handler: this.drawLine, 
          scope: this, 
          icon: this.iconBasePath + 'misuralinea.gif', 
          disabled: !this.canDrawing()
        });
        
        // Misura area
        this.getTopToolbar().add({
          tooltip: {text: 'Funzionalit&agrave; per la misurazione di aree e perimetri', title: 'Misura area'},
          enableToggle: true,
          toggleGroup: 'op', 
          handler: this.drawPolygon, 
          scope: this, 
          icon: this.iconBasePath + 'misurapoligono.gif', 
          disabled: !this.canDrawing()
        });                
        
        this.getTopToolbar().addSeparator();
        
        // Stampa
        this.getTopToolbar().add({ 
          tooltip: {text: 'Funzionalit&agrave; di stampa dell\'immagine', title: 'Stampa immagine'},
          handler: function(){Ext.Msg.alert('Stampa','Funzionalit&agrave; non ancora implementata!')}, 
          scope: this, 
          icon: this.iconBasePath + 'print.gif' 
        });
             
        // Info distanza ed area                                    
        var infoTemplate = '<b>Lunghezza:</b> {0} m<br><b>Superficie:</b> {1} mq';
        this.infoItem = this.getBottomToolbar().addText(String.format(infoTemplate,'0.00','0.00'));
        this.infoItem.updateInfo = function(distance,area){
          this.update(String.format(infoTemplate,distance?distance:'0.00',area?area:'0.00'));
        }
           
        this.getBottomToolbar().addFill();            
        
        // Formato
        this.formatTemplate =  '<b>Formato:</b> {0}';
        this.formatButton = this.getBottomToolbar().addText(String.format(this.formatTemplate,this.originalFormat));                
        
        this.getBottomToolbar().addSeparator();        
        // Scala
        this.scaleTemplate =  '<b>Scala:</b> <span style="font-weight:normal;">{0}</span>';
        this.scaleButton = this.getBottomToolbar().add({
          text: String.format(this.scaleTemplate,this.originalScale),
          tooltip: {text: 'Funzionalit&agrave; che permette di reimpostare la scala se errata.', title: 'Cambia scala'}, 
          handler: this.promptScaleChange,          
          scope: this
        });
                                                                        
        this.doLayout();
    },
    
    /**
  	 * Method: afterRender
  	 * 
  	 * Metodo privato chiamato dopo che il pannello è stato renderizzato.
  	 */
    afterRender: function() {
        TolomeoExt.DrawingViewer.superclass.afterRender.apply(this, arguments);                                                                                       
        this.on('distancechange',function(distance){
          this.updateInfo({'distance':distance.toFixed(2)})
        },this);
                       
        this.on('areachange',function(area,perimeter){
          this.updateInfo({'distance':perimeter.toFixed(2),'area':area.toFixed(2)})
        },this);
        
        this.on('scalechange',function(newValue,oldValue){
          this.scaleButton.setText(String.format(this.scaleTemplate,newValue));
          if(this.canDrawing()){
            this.clearCanvas();
          }
        },this);
        
        this.on('formatchange',function(newValue,oldValue){
          this.formatButton.setText(String.format(this.formatTemplate,newValue));
          if(this.canDrawing()){
            this.clearCanvas();
          }
        },this);
        
        this.on('zoomchange',function(newZoomFactor,oldZoomFactor){
          var df = newZoomFactor/oldZoomFactor;                  
          
          if(df >= 1){
            this.marginBox.el.setWidth(this.body.getWidth() + this.imageBox.el.getWidth());
            this.marginBox.el.setHeight(this.body.getHeight() + this.imageBox.el.getHeight());
            this.body.dom.scrollLeft = Math.round(this.body.dom.scrollLeft*df); //+ ((df-1)*this.body.getWidth()/2));                                    
            this.body.dom.scrollTop  = Math.round(this.body.dom.scrollTop*df); //+ ((df-1)*this.body.getHeight()/2));  	                	                
          } else {
            this.body.dom.scrollLeft = Math.round(this.body.dom.scrollLeft*df); //+ ((df-1)*this.body.getWidth()/2));                                    
            this.body.dom.scrollTop  = Math.round(this.body.dom.scrollTop*df); //+ ((df-1)*this.body.getHeight()/2));  	              
            this.marginBox.el.setWidth(this.body.getWidth() + this.imageBox.el.getWidth());
            this.marginBox.el.setHeight(this.body.getHeight() + this.imageBox.el.getHeight());
          }                                                                                                                      
          
        },this);
        
        this.on('bodyresize',function(p,w,h){
        
          var originalWidth  = this.marginBox.el.getWidth() - this.imageBox.el.getWidth();
          var originalHeight = this.marginBox.el.getHeight() - this.imageBox.el.getHeight();
          
          this.marginBox.el.setWidth(w + this.imageBox.el.getWidth());
          this.marginBox.el.setHeight(h + this.imageBox.el.getHeight());
      
          this.imageBox.el.setLeft(w/2);
          this.imageBox.el.setTop (h/2);
      
          this.canvasBox.el.setLeft(w/2);
          this.canvasBox.el.setTop (h/2);
          
          this.body.dom.scrollLeft = this.currScrollLeft;
          this.body.dom.scrollTop  = this.currScrollTop;
                                                                                                                                                   	              
        },this);
        
        this.body.on('scroll',function(){
          this.currScrollLeft = this.body.dom.scrollLeft;
          this.currScrollTop  = this.body.dom.scrollTop;                  
        },this);
        
        this.loadMask = new Ext.LoadMask(this.id, {msg:"Caricamento immagine..."});
        
    },        
    
    // Private, mostra la finestra per il cambio di scala
    promptScaleChange: function(){
      var pw = Ext.Msg.prompt('Scala errata?','Immetti il valore corretto della scala',function(resp,value){
        if(resp == 'ok' && value && !isNaN(value) ){
          this.changeScale(value);                  
        }
      },this,false,this.originalScale).getDialog();
      pw.alignTo(this.body,'c',[-pw.getWidth()/2,-pw.getHeight()/2]);
    },
    
    // Private, cambio di scala
    changeScale: function(newScale){
      var oldScale = this.originalScale;
      this.originalScale = parseInt(newScale);
      this.fireEvent('scalechange',this.originalScale,oldScale);
    },
    
    // Private, cambio di formato
    changeFormat: function(newFormat){
      var oldFormat = this.originalFormat;
      this.originalFormat = newFormat;
      this.fireEvent('formatchange',this.originalFormat,oldFormat);
    },
    
    // Private, restituisce true se Raphael è presente
    canDrawing : function(){
      return (typeof Raphael != 'undefined');
    },
    
    // Private, restituisce true se è possibile zoomare avanti
    canZoomIn: function() {
        return this.zoomFactor < this.maxZoom/100;
    },

    // Private, restituisce true se è possibile zoomare indietro
    canZoomOut: function() {
        return this.zoomFactor > this.minZoom/100;
    },
          
    // Private, reimposta il fattore di zoom ad 1                                    
    resetZoom: function(){                             
      this.setZoom(1);
    },
    
    // Private, aumenta il fattore di zoom in base allo scaleStepFator
    zoomIn: function() {                                
        this.setZoom(this.zoomFactor * this.zoomStepFactor);
    },

    // Private, diminuisce il fattore di zoom in base allo scaleStepFator
    zoomOut: function() {
        this.setZoom(this.zoomFactor / this.zoomStepFactor);
    },
            
    // Private, impostazione del fattore di zoom (1 = 100%)                                  
    setZoom: function(zoomFactor) {
        this.clearCanvas();
        var oldZoomFactor = this.zoomFactor;
        this.zoomFactor = Math.max(Math.min(zoomFactor,this.maxZoom/100),this.minZoom/100);
        var size = this.originalSize;
        this.imageBox.el.setSize(size.width * this.zoomFactor, size.height * this.zoomFactor);
        this.canvasBox.el.setSize(size.width * this.zoomFactor, size.height * this.zoomFactor);
        this.slider.setValue(Math.round(this.zoomFactor*100));
        this.zoomOutBtn.setDisabled(!this.canZoomOut());
        this.zoomInBtn.setDisabled(!this.canZoomIn());
        
        this.fireEvent('zoomchange',this.zoomFactor,oldZoomFactor);                                                
    },
    
    // Private, inizializzazione della funzionalità di panoramica
    panStart: function(){              
    	this.canvasBox.el.removeAllListeners();
    	this.canvasBox.el.on('mousedown', this.onMouseDown, this);
    	this.canvasBox.el.setStyle('cursor', 'move');
    },
    
    // Private, gestione mousedown per il pan
    onMouseDown: function(e) {
    	e.stopEvent();
        this.mouseX = e.getPageX();
        this.mouseY = e.getPageY();
        Ext.getBody().on('mousemove', this.onMouseMove, this);
        Ext.getDoc().on('mouseup', this.onMouseUp, this);
    },
    
    // Private, gestione mousemove per il pan
    onMouseMove: function(e) {
        e.stopEvent();
        var x = e.getPageX();
        var y = e.getPageY();
        if (e.within(this.body)) {
            var xDelta = x - this.mouseX;
            var yDelta = y - this.mouseY;
            this.body.dom.scrollLeft -= xDelta;
            this.body.dom.scrollTop -= yDelta;
        }
        this.mouseX = x;
        this.mouseY = y;
    },

    // Private, gestione mouseup per il pan
    onMouseUp: function(e) {
        Ext.getBody().un('mousemove', this.onMouseMove, this);
        Ext.getDoc().un('mouseup', this.onMouseUp, this);
    },
    
    // Private, ripulisce il canvasBox
    clearCanvas: function(){  
    	if(this.paper) {
        	this.paper.clear();
    	}                 	
     	// this.canvasBox.update('');
    },
    
    // Private, costruisce un canvas di Raphael
    getCanvas: function(){
      
    	if(!this.paper) {
        	this.paper = Raphael(this.canvasBox.el.id,this.canvasBox.el.getWidth(),this.canvasBox.el.getHeight());
      	} else {
        	this.clearCanvas();
    	}
      
    	return this.paper;            	
    },
    
    // Private, disegno della linea
    drawLine: function(){
    
      	var me = this;
      	var firstPoint = false;
    	var line;
    	var mouseMove;
      	var canvasBox = this.canvasBox.el;              
    	// 7876 magic number!! Deriva dal rapporto tra pixel dell'immagine e grandezza del foglio espresso in metri (Ad esempio nell'A4 è 1654/0.21)
    	var scaleFactor;
                  	            	                          
      	var canvas = this.getCanvas();				
      	var moveTo = function(x,y){return String.format("M{0} {1}",x,y)};
      	var lineTo = function(x,y){return String.format("L{0} {1}",x,y)}; 
			      				     
      	canvasBox.setStyle('cursor', 'crosshair');                        	                      	
    	canvasBox.removeAllListeners();                  
            	            	
      	canvasBox.on('click',function(e){
      
        if(!firstPoint){
        	this.updateInfo({area: 0,distance: 0});
        	scaleFactor = (1/this.zoomFactor) / 7876.1;
            canvas.clear();		
      		start_x = e.getPageX()-canvasBox.getX();
      		start_y = e.getPageY()-canvasBox.getY();        			
  			firstPoint = true;
  			    
  			line = canvas.path(moveTo(start_x,start_y) + lineTo(start_x,start_y)); 
            line.attr({stroke: "#036","stroke-width": 2, opacity: 0.5, "stroke-linecap": "round"});
              
            mouseMove = function(e){
      			if(firstPoint){            				
      				end_x = e.getPageX() - canvasBox.getX();
      				end_y = e.getPageY() - canvasBox.getY();            

      				line.attr({path: moveTo(start_x,start_y) + lineTo(end_x,end_y)});
                      					
      				// Calcolo la distanza
      				var distance_x= Math.abs(start_x - end_x) * this.originalScale * scaleFactor;
                	var distance_y= Math.abs(start_y - end_y) * this.originalScale * scaleFactor;
                	var distance = Math.sqrt((distance_x*distance_x)+(distance_y*distance_y));
                	this.fireEvent("distancechange", distance);
      			}
      		};     			        			
  			canvasBox.on('mousemove',mouseMove,me);      
              			
  		  } else {
  			
  			canvasBox.un('mousemove',mouseMove,me);
  			
      		end_x = e.getPageX()-canvasBox.getX();
      		end_y = e.getPageY()-canvasBox.getY();
  			firstPoint = false;        			
  			   
  			line.remove();
  			line = canvas.path(moveTo(start_x,start_y) + lineTo(end_x,end_y)); 
			line.attr({stroke: this.drawingColor,"stroke-width": 5, opacity: 0.5, "stroke-linecap": "round"});
  			
      		// Calcolo la distanza              			              		 
      		var distance_x= Math.abs(start_x - end_x) * this.originalScale * scaleFactor;
           	var distance_y= Math.abs(start_y - end_y) * this.originalScale * scaleFactor;
           	var distance = Math.sqrt((distance_x*distance_x)+(distance_y*distance_y));
           	this.fireEvent("distancechange", distance);
  		  }
      }, this);      	
    },
    
    // Private, disegno del poligono
    drawPolygon: function(){
    
    	var me = this;
    	var line,lineTmp,canvas;
    	var pointList = [];
    	var drawnDistance = 0;
    	var canvasBox = this.canvasBox.el;  
    	var scaleFactor;
      
      	var moveTo = function(x,y){return String.format("M{0} {1}",x,y)};
      	var lineTo = function(x,y){return String.format("L{0} {1}",x,y)};
      
      	var calculateArea = function(){
      
        	var firstSum=0, secondSum=0;
            			
    		for(i=0;i<pointList.length-1;i++){            			
    			firstSum  += pointList[i].x * pointList[i+1].y;
    			secondSum += pointList[i+1].x * pointList[i].y;
    		}
    		
    		// Se il poligono non ancora stato chiuso devo chiuderlo virtualmente
    		if(pointList[0].x != pointList[pointList.length-1].x || pointList[0].y != pointList[pointList.length-1].y){
          		firstSum  += pointList[pointList.length-1].x * pointList[0].y;
    			secondSum += pointList[0].x * pointList[pointList.length-1].y;
        	}
    			
    		var area_px = Math.abs(firstSum - secondSum)/2;            			
    		return area_px * Math.pow(me.originalScale * scaleFactor,2); 
      	}
      
      	var mouseMove = function(e){
    			
			var current_x = e.getPageX()-canvasBox.getX();
			var current_y = e.getPageY()-canvasBox.getY();
        
        	var previous_x =  pointList[pointList.length-1].x;
        	var previous_y =  pointList[pointList.length-1].y;
            				
			lineTmp.attr({path: moveTo(previous_x,previous_y) + lineTo(current_x,current_y)});
				
			// Calcolo la distanza
			/*
				var distance_x= Math.abs(previous_x - current_x) * this.originalScale * scaleFactor;
        		var distance_y= Math.abs(previous_y - current_y) * this.originalScale * scaleFactor;
        		var distance = drawnDistance + Math.sqrt( Math.pow(distance_x,2) + Math.pow(distance_y,2) );
        		this.fireEvent("distancechange", distance);
        	*/				
		};         	
    	    	    	    	
    	canvasBox.setStyle('cursor', 'crosshair');
    	canvasBox.removeAllListeners();
      	var canvas = this.getCanvas();            	
    	canvas.clear();
    	canvasBox.on('click',function(e) {
    	            	
    		if(pointList.length == 0){
    			this.updateInfo({area: 0,distance: 0}); 
    			scaleFactor = (1/this.zoomFactor) / 7876.1;
    			drawnDistance = 0;
    			canvas.clear();           			
    			start_x = e.getPageX()-canvasBox.getX();
          		start_y = e.getPageY()-canvasBox.getY(); 
    			
    			pointList.push({x:start_x , y:start_y});
    			
    			line = canvas.path(moveTo(start_x,start_y)); 
          		line.attr({stroke: this.drawingColor,"stroke-width": 5, opacity: 0.5, "stroke-linecap": "round"});
          
          		lineTmp = canvas.path(moveTo(start_x,start_y) + lineTo(start_x,start_y)); 
          		lineTmp.attr({stroke: "#036","stroke-width": 2, opacity: 0.5, "stroke-linecap": "round"});

    			canvasBox.on('mousemove',mouseMove,me);
    			
    		} else {
    		
    			end_x = e.getPageX()-canvasBox.getX();
    			end_y = e.getPageY()-canvasBox.getY();
    			
    			pointList.push({x:end_x,y:end_y});
    			drawnDistance += Math.sqrt(Math.pow(Math.abs(pointList[pointList.length-1].x - pointList[pointList.length-2].x) * this.originalScale * scaleFactor,2)+Math.pow(Math.abs(pointList[pointList.length-1].y - pointList[pointList.length-2].y) * this.originalScale * scaleFactor,2));    	

          		line.attr("path",line.attrs.path + lineTo(end_x,end_y));
          		line.attr('fill-opacity', 0.25);
    			line.attr('fill', this.drawingColor);
    			
    			this.fireEvent("areachange", calculateArea(), drawnDistance);
          
          		lineTmp.attr({path: moveTo(end_x,end_y) + lineTo(end_x,end_y)});

    		}
    	},me);
    	    	
    	canvasBox.on('dblclick',function(e){
    	
    		if(pointList.length > 3){            		
        	
    			canvasBox.un('mousemove',mouseMove,me);
    			
    			line.attr('path',line.attrs.path + lineTo(start_x,start_y));    			
    			
    			//pointList.push({x:start_x,y:start_y});
    			pointList[pointList.length] = {x:start_x,y:start_y};
    			lineTmp.remove();
    			
    			// Calcolo il perimetro e l'area con la shoelace formula
    			var perimeter = 0;
    			var area = calculateArea();

    			var distance_x = Math.abs(pointList[pointList.length-2].x - pointList[pointList.length-1].x) * this.originalScale * scaleFactor;
          		var distance_y = Math.abs(pointList[pointList.length-2].y - pointList[pointList.length-1].y) * this.originalScale * scaleFactor;
          		var perimeter   = drawnDistance + Math.sqrt( Math.pow(distance_x,2) + Math.pow(distance_y,2) );
          
          		this.fireEvent("areachange", area, perimeter);	 
          		pointList = [];           			
    		}
    	},me);
    
    },
                
    // Private, aggiornamento informazioni sulla status bar
    updateInfo: function(valueObj){
      Ext.applyIf(valueObj,{distance : '0.00',area : '0.00'});
		      this.infoItem.updateInfo(valueObj.distance,valueObj.area);
    },
                                                       
    // Private, chiamata sull'onload dell'immagine per gestirne posizione e margini
    onImageLoad: function(){            
	    this.loadMask.hide();
	    
	    this.imageBox.setVisible(true);
	    this.originalSize = this.imageBox.el.getSize();
	    this.canvasBox.el.setSize(this.originalSize);              
	 
	    this.marginBox.el.setWidth(this.body.getWidth() + this.originalSize.width);
	    this.marginBox.el.setHeight(this.body.getHeight() + this.originalSize.height);
	    
	    this.imageBox.el.setLeft(this.body.getWidth()/2);
	    this.imageBox.el.setTop (this.body.getHeight()/2);
	    
		this.canvasBox.el.setLeft(this.body.getWidth()/2);
	    this.canvasBox.el.setTop (this.body.getHeight()/2);
	    
	    this.body.dom.scrollLeft = this.imageBox.el.getWidth()/2;
		this.body.dom.scrollTop  = this.body.getHeight()/2;  
	    
	    if(!this.canDrawing()){
	    	Ext.Msg.alert("Attenzione", "A causa del mancato caricamento delle librerie necessarie, non &egrave; possibile utilizzare gli <b>strumenti di misura</b>.");
	    } 
                
    },
    
    // Private reimopsta lo zoomFactor e le impostazioni di posizionamento dell'immagine
    reset: function(){
      	this.zoomFactor = 1; 
      	this.slider.setValue(100);
                    
      	this.zoomOutBtn.setDisabled(!this.canZoomOut());
      	this.zoomInBtn.setDisabled(!this.canZoomIn());   
      
      	this.body.dom.scrollLeft=0;
      	this.body.dom.scrollTop=0;
      	this.imageBox.setVisible(false);
      	this.imageBox.updateSrc('');
      	this.imageBox.el.dom.removeAttribute('style');    
      	this.imageBox.el.dom.removeAttribute('width');   
      	this.imageBox.el.dom.removeAttribute('height');
    },
    
    /**
  	 * Method: loadImage
  	 * Permette di caricare un'altra immagine nel visualizzatore. 
  	 * E' possibile passare il solo src dell'immagine oppure un oggetto che contiene anche scala e formato originali. 
  	 *          	 
  	 * Parameters:
  	 * conf - {String/Object}.
  	 * src: url dell'immagine
  	 * format: formato dell'immagine originale
  	 * scale: scala dell'immagine originale                                    	 
  	 */
    loadImage: function(conf){
      var src;
      if(typeof conf == 'string'){
        src = conf;
      }else{
        src = conf.src;
        if(conf.format){
          this.changeFormat(conf.format);                  
        }
        if(conf.scale){
          this.changeScale(conf.scale);
        }
      }
      this.reset();                                                             
      //this.body.mask("Caricamento immagine");  
      this.loadMask.show();
      this.imageBox.updateSrc(src);                          
    }
    
    /*
    updateResultPos: function(){
      this.resultBox.setPosition(this.body.dom.scrollLeft,this.body.dom.scrollTop);
    }
    */
});

/**
 * @class TolomeoExt.DrawingViewer
 * @xtype tx_toloScalePanel
 */
Ext.reg('tx_toloDrawingViewer', TolomeoExt.DrawingViewer); 
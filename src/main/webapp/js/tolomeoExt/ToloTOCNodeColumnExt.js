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

Ext.define('TolomeoExt.ToloTOCNodeColumnExt4', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.tolotoccolumn',

    tdCls: Ext.baseCSSPrefix + 'grid-cell-treecolumn',

    view: null,
    
    autoLock: true,
    lockable: false,
    draggable: false,
    hideable: false,

    iconCls: Ext.baseCSSPrefix + 'tree-icon',
    checkboxCls: Ext.baseCSSPrefix + 'tree-checkbox',
    elbowCls: Ext.baseCSSPrefix + 'tree-elbow',
    expanderCls: Ext.baseCSSPrefix + 'tree-expander',
    textCls: Ext.baseCSSPrefix + 'tree-node-text',
    innerCls: Ext.baseCSSPrefix + 'grid-cell-inner-treecolumn',
    isTreeColumn: true,
    bShowLevel: false,
    
	// NOTA BENE: il link sul nodo viene messo per dargli l'aspetto, ma come href viene messo # per poterlo gestire con l'evento itemClicked emesso dalla TOC
    cellTpl: [
      //  '<tpl if="hidden!=true" />',      
        '<tpl for="lines">',
            '<img src="{parent.blankUrl}" class="<tpl if="parent.isSep">legendaSeparatorRow</tpl> {parent.childCls} {parent.elbowCls}-img ',
            '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>"/>',
        '</tpl>',
        '<img src="{blankUrl}" class="<tpl if="isSep">legendaSeparatorRow</tpl> {childCls} {elbowCls}-img {elbowCls}',
            '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>"/>',
        '<tpl if="checked !== null">',
            '<input type="button" role="checkbox" <tpl if="checked">aria-checked="true" </tpl>',
                'class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"/>',
        '</tpl>',
        '<tpl if="isSep">',
        		'<span class="legendaSeparator"></span>',
        '<tpl else>',
        	'<img src="{blankUrl}" class="{childCls} {baseIconCls} ',
            	'{baseIconCls}-<tpl if="leaf">leaf<tpl else>parent</tpl> {iconCls}"',
            '<tpl if="icon">style="background-image:url({icon}) !important"</tpl>/>',
        	'<tpl if="href">',
	            '<a href="#"  class="{textCls} {childCls}">{value}</a>',
        	'<tpl else>',        	
            	'<span class="layerLabel {textCls} {childCls}">{debugLevelLabel}{value}</span>',
            '</tpl>',
        '</tpl>'
     //   '</tpl>'
    ],
//{debugLevelLabel}
//{href} target="{hrefTarget}"
    
    initComponent: function() {
        var me = this;

        me.origRenderer = me.renderer;
        me.origScope = me.scope || window;

        me.renderer = me.treeRenderer;
        
        me.scope = me;        

        
        me.callParent();
        
        me.on('afterrender', me.a);
    },        

    treeRenderer: function(value, metaData, record, rowIdx, colIdx, store, view){

    	var me = this,
            cls = record.get('cls'),
            renderer = me.origRenderer,
            data = record.data,
            parent = record.parentNode,
            rootVisible = view.rootVisible,
            lines = [],
            parentData;

        if (cls) {
            metaData.tdCls += ' ' + cls;
        }

        while (parent && (rootVisible || parent.data.depth > 0)) {
            parentData = parent.data;
            lines[rootVisible ? parentData.depth : parentData.depth - 1] =
                    parentData.isLast ? 0 : 1;
            parent = parent.parentNode;
        }

        var debugLevelLabel = (this.bShowLevel) ? data.cat + "-" + data.lay + "+" + data.classi : "";
        
        var el =  me.getTpl('cellTpl').apply({
        	debugLevelLabel: debugLevelLabel, 
        	cat: data.cat,
        	lay: data.lay,
        	classi: data.classi,
            record: record,
            hidden: data.hidden,
            baseIconCls: me.iconCls,
            iconCls: data.iconCls,
            icon: data.icon,
            checkboxCls: me.checkboxCls,
            checked: data.checked,
            elbowCls: me.elbowCls,
            expanderCls: me.expanderCls,
            textCls: me.textCls,
            leaf: data.leaf,
            expandable: record.isExpandable(),
            isLast: data.isLast,
            blankUrl: Ext.BLANK_IMAGE_URL,
            href: data.href,
            hrefTarget: data.hrefTarget,
            lines: lines,
            metaData: metaData,
            isSep: (data.itemType=='separator'),
            childCls: me.getChildCls ? me.getChildCls() + ' ' : '',
            value: renderer ? renderer.apply(me.origScope, arguments) : value
        }); 
        
        
        return el;
    },
   
    a: function(col, eOpts) {
    	var i=0;
    	
    },
    
    prova: function() {
    	var i=0;
    }
});


 
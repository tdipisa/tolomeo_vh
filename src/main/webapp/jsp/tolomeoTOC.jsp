<%--
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
--%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page isELIgnored="false" %>

<script>
	jQuery('.opacityslider').each( 
		function () {
			var sliderId = this.id;
			sliderId = sliderId.substring(7, sliderId.length);
			// layerName: sliderId, change: sliderSetLayerOpacity, max: 100, min:0,
			jQuery(this).slider({ layerName: sliderId, change: sliderSetLayerOpacity, max: 100, min:0, startValue: 100});
			//jQuery(this).slider("moveTo", 50,0);
			} 
		);
	// deve essere dopo slider altrimenti slider non sente startValue (????)
	jQuery('#treetoc').treeview({ collapsed: true});
	
	// Passo a JS tocbean
	legenda = <%= request.getAttribute("tocBeanJS") %>;
</script>

<form>
	<ul id="treetoc" class="filetree">
	<c:forEach items="${tocBean.categories}" var="cat" >	
		<li>
			<input style="display:inline" type="checkbox" checked="checked" name="catscbx" value="${cat.catId}" id="cinput_${cat.catId}" onclick="javascript:setcategories('${cat.catId}');" />
			<span class="folder" style="display:inline">
				${cat.catDescr}
			</span>
			<ul>
				<div class="catc" id="${cat.catId }" > 
				<c:forEach items="${cat.layers}" var="lay" >
					<li>
						<input style="display:inline" type="checkbox" ${lay.defaultGroup ? "checked=\"checked\"" : "" } name="groupscbx" value="${lay.name}" id="${lay.chkBoxId}" onclick="javascript:setlayers('${lay.name}',false);" />
						<span id="${lay.nameId}" class="folder, ${lay.visible ? "vis" : "unvis"}">
							${lay.descr}
						</span>
						<c:if test="${lay.withOpacitySettings}">
							<br/><div style="display:inline; width:50%; margin-left:10%" class="opacityslider" id="opacity${lay.name}">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
						</c:if>
						<ul>
						<c:if test="${((lay.type<3 && lay.skipLegend < 1) || lay.numClassesLay > 0) && lay.skipLegend != 2}">
							
							<c:forEach items="${lay.classi}" var="cl" >
								<li>
								<img alt="" src="${cl.icoUrl}" width="${cl.icoW}" height="${cl.icoH}" />

								<span id="${cl.id}">${cl.nome}</span>
								</li>
							</c:forEach>
						</c:if>
						</ul>
					</li>
				</c:forEach>
				</div>
			</ul>
		</li>
	</c:forEach>
	</ul>
</form>

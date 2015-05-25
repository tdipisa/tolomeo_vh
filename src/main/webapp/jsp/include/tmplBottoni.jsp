		<%--
		<!-- Bottoni -->
		<div class="tmpl_bottoni">
			<label><input class="cerca" name="C" value="cerca" title="cerca" type="submit"/></label>
			<label><input class="pulisci" name="P" value="pulisci" title="pulisci" type="reset"/></label>
			<label><input class="inserisci" name="I" value="inserisci" title="inserisci" type="submit"/></label>
			<label><input class="elimina" name="E" value="elimina" title="elimina" type="submit"/></label>
			<label><input class="termina" name="T" value="termina" title="termina" type="submit"/></label>
			<label><input class="statistiche" name="S" value="statistiche" title="statistiche" type="submit"/></label>
			<label><input class="conferma" name="K" value="conferma" title="conferma" type="submit"/></label>
			<label><input class="modifica" name="M" value="modifica" title="modifica" type="submit"/></label>
			<label><input class="generico" name="G" value="generico" title="generico" type="submit"/></label>
		</div>	
		<!-- Fine Bottoni -->
		--%>
		
		<%-- come ci si comporta con i bottoni dinamici?? --%>
		<c:set property="btn" var="btn" scope="page" value="${requestScope.button }"></c:set>
		<c:if test="${!empty btn}" >
			<div class="tmpl_bottoni">
	        <c:forEach items="${btn}" var="input" varStatus="inpStatus">
	        	<label>
				<input type="${input.type}" 
					<c:if test='${input.cssclass != null && input.cssclass != ""}' > class="${input.cssclass}" </c:if>
					name="${input.name}" 
					value="${input.value}" 
					<c:if test='${input.title != null && input.title != ""}' > title="${input.title}" </c:if>
					<c:if test='${input.onclick != null && input.onclick != ""}' > onclick="${input.onclick}" </c:if>
					<c:if test='${input.onkeypress != null && input.onkeypress != ""}' > onkeypress="${input.onkeypress}" </c:if>
					/>
				</label>
	        </c:forEach>
	        </div>
		</c:if>
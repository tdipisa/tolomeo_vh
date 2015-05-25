<table summary="Residenti suddivisi per fasce di età">
	<caption>Residenti suddivisi per fasce di età</caption>
	<thead>
		<tr>
			<th id="col1"><abbr title="Fascia di età">Fascia di età</abbr></th>
			<th id="col2"><abbr title="Residenti maschi">Maschi</abbr></th>
			<th id="col3"><abbr title="Residenti femmine">Femmine</abbr></th>
			<th id="col4"><abbr title="Totale residenti nella fascia">Totale fascia</abbr></th>
		</tr>
	</thead>
	<tbody>
		<c:forEach items="${statisticaCompletaFasceEta.statisticaFasceEta.fasceEta}" var="row" varStatus="rowStatus">
			<c:choose>
				<c:when test="${rowStatus.index %2 == '0'}">
					<tr class="tmpl_riga2">
				</c:when>
				<c:otherwise>
					<tr class="tmpl_riga1">
				</c:otherwise>
			</c:choose>
			
			<c:choose>
				<c:when test="${row.interSup!=999}">
					<td headers="col1"><c:out value="${row.interInf} - ${row.interSup}" /></td>
				</c:when>
				<c:otherwise>
					<td headers="col1"><c:out value="${row.interInf} - oltre" /></td>
				</c:otherwise>
			</c:choose>
			<td headers="col2"><c:out value="${row.maschi}" /></td>
			<td headers="col3"><c:out value="${row.femmine}" /></td>
			<td headers="col4" class="tmpl_col_dx"><c:out value="${row.totFascia}" /></td>
			</tr>
		</c:forEach>
		<tr class="tmpl_rigatot">
			<td headers="col1" class="tmpl_col_dx"><abbr title="Totale">Totale</abbr></td>
			<td headers="col2" class="tmpl_col_dx">${statisticaCompletaFasceEta.statisticaFasceEta.totMaschi}</td>
			<td headers="col3" class="tmpl_col_dx">${statisticaCompletaFasceEta.statisticaFasceEta.totFemmine}</td>
			<td headers="col4" class="tmpl_col_dx">${statisticaCompletaFasceEta.statisticaFasceEta.totGlobaleMaschiFemmine}</td>
		</tr>
	</tbody>
</table>
function setStyleSheet(title) {
	var LINKS = document.getElementsByTagName("link");
	var link;
	for (var link_index = 0 ; link_index < LINKS.length ; link_index ++) {
		link = LINKS[link_index];
		if ((link.getAttribute("rel").indexOf("style") != -1) && link.getAttribute("title")) {
			link.disabled = true;
			if (link.getAttribute("title") == title) {
				link.disabled = false;
			}
		}
	}
}

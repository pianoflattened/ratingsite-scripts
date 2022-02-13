window.addEventListener('DOMContentLoaded', function() {
	let t = $("div.warning").text().trim().split("\n");
	let a = t.splice(0, 1).concat(t.map(n => n+"<br>").join("\n")).filter(n => n);

	let warning_dropdown = `if ($('#warning-content').css('display') == 'none') {
		$('#warning-content').css('display', 'block');
		$('.warning').css('background-color', 'var(--gen-bg-yellow)');
	} else {
		$('#warning-content').css('display', 'none');
		$('.warning').css('background-color', 'rgba(70,60,7,0.75)'); 
	}`.split("\n").map(t => t.trim()).join("");
	
	if (a.length > 0) {
		a[0] = "<div id=\"warning-title\">"+a[0]+`<a onclick="`+warning_dropdown+`">▼</a></div>`
		a[1] = "<div id=\"warning-content\" style=\"display:none;\">"+a[1]+"</div>"
	}

	$("div.warning").css("background-color", "rgba(70,60,7,0.75)");
	$("div.warning")[0].innerHTML = a.join("");
});

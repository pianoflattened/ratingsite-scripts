// jquery
var $ = window.$;

// !! place everything under OUTSIDE here

window.addEventListener('DOMContentLoaded', setTimeout(function() {
    console.log("hey"); // bunch of aesthetic changes here that i couldnt do or would be annoying to do with css

	// forgot what this does but its def something important. leave it here
	$(':root').css('--ui-detail-neutral', '#4a4c52');
	$(':root').css('--ui-divider-line', '#4a4c52');
    
    // move the charts link bc it switched places with the genre one and i was clicking it habitually
    let chartslink = $("div.header_charts");
    let newcharts = chartslink.clone(true, true);
    chartslink.remove();
    newcharts.insertAfter("div.header_links a.header_item:nth-child(2)");
    
    if (window.location.href.includes("rateyourmusic.com/search")) {
        $('column_container_left').removeClass("large-8");
	}

    $("img[src=\"https://www.gstatic.com/images/icons/material/system/1x/warning_amber_24dp.png\"]").remove();
    
    // !! place everything under INSIDE here
}), 5000);

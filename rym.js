document.documentElement.style.setProperty("--ui-detail-neutral", "#4a4c52");
document.documentElement.style.setProperty("--ui-divider-line", "#4a4c52");
var getBox = function(e, i={}) {
	let nodename = e.parentElement.nodeName;
	if (i.override) {
		i.override -= 1;
		return getBox(e.parentElement, i);
	}
	console.log(e.parentElement);
	if (nodename == "B") {
		return getBox(e.parentElement, i);	
	} else if (nodename == "TD") {
		console.log("tabledepth " + i.tabledepth);
		let cs = e.parentElement.getAttribute("colspan");
		console.log("cs " + cs);
		if (cs === null) {
			return getBox(e.parentElement, i);
		} else if (cs == "2" || cs == 2) {
			if (i.tabledepth) {
				i.tabledepth += 1;
			} else {
				i.tabledepth = 1;
			}
		} else {
			return getBox(e.parentElement, i);
		}
		console.log(i.tabledepth);
		return getBox(e.parentElement, i);
	} else if (nodename == "TABLE") {
		if (i.tabledepth) {
			i.tabledepth -= 1;
			return getBox(e.parentElement, i);
		} else {
			return e.parentElement;
		}
	} else if (nodename == "TR") {
		return getBox(e.parentElement, i);
	} else if (nodename == "TBODY") {
		return getBox(e.parentElement, i);
	} else if (nodename == "DIV") {
		let classname = e.parentElement.className;
		console.log(classname);
		if (classname == "list_name") {
			return getBox(e.parentElement, i);
		} else if (classname == "list_info") {
			return getBox(e.parentElement, i);
		} else if (classname == "page_section_lists_list_image") {
			return getBox(e.parentElement, i);
		}
	} else if (nodename == "LI") {
		return e.parentElement;
	} else {
		return e.parentElement;
	}
};

var rymboxset = /http(s|):\/\/rateyourmusic.com\/list\/[A-Za-z0-9_]+\/rym[-_](ultimate[-_]|)box[-_]set/;
var genre_page = /http(s|):\/\/rateyourmusic.com\/genre\/[a-z\-]+/;
window.addEventListener('DOMContentLoaded', setTimeout(function() {
    console.log("hey");
    let chartslink = document.querySelector("div.header_charts");
    let newcharts = chartslink.cloneNode(true);
    chartslink.remove();
    let newmusic = document.querySelector("div.header_links a.header_item:nth-child(2)");
    newmusic.parentNode.insertBefore(newcharts, newmusic.nextSibling);
    if (window.location.href.includes("rateyourmusic.com/search")) {
        // let e = document.querySelectorAll("html.size_mode_smaller #content");
        // [].forEach.call(e, function(n) {
        //     n.style = "font-size: 1.1em";
        // });
        document.getElementById('column_container_left').classList.remove("large-8");
    } else if (window.location.href.includes("rateyourmusic.com/release")) {
    	document.getElementsByClassName("review_featured")[0].parentElement.parentElement.parentElement.style.display = "none"; // lol maybe move it instead
    } else if (rymboxset.test(window.location.href)) {
    	var boxsetwarning = document.createElement("div");
		boxsetwarning.id="genre_vote_abuse_banner";
		boxsetwarning.className="overlay";
		boxsetwarning.innerHTML=`<div class="abuse_banner"><span class="rendered_text"><center><h5><b><span style="color:crimson" class="rendered_text_color"><span class="rendered_text_color_inner"><i class="fas fa-exclamation-triangle"></i>&nbsp;THIS LIST IS AN RYM ULTIMATE BOX SET LIST&nbsp;<i class="fas fa-exclamation-triangle"></i></span></span></b></h5></center><br>gay emo this album is emo and gay and gay, thats all i can say is that its gayemo its gay all of it is gay i saw one of their shows and they are both gay and even more and more they didnt care they just played guitars and let it all out this emo emo...if emo will never die brb i need a fucking drink i fucking love kiwi i hate emo my brother is gay my brother is gay lol x i am on frickin 5.4 emo emo emo gay adn gay and emo. girl i love kiwi but also i fucking love gayx2 so ima be gay cause i fink gayx2 will never die so i must be gay bc i fink gayx2 will never die lol so lets pretend i am not gay..at least for the night oh wait i am gay lol but im still gay also fucking gay emo YEAH!!!!! I LOVE EMO !!!!!!...... 9 times out of 10 it IS emo!!! AND 1 IS gay!!9 times out of 10. FINE 2 IS GAY GET OVER YOURSELVES <3 AND BLESSED YOU ARE!!!I AM GAY AT A GAYFEST FOR THE NIGHT!!!!! <333 SEE YOU IN THE MEADOW <3333 SO BLESSED TO BE A CATHOLIC AND AN EVIL EMO PRIEST SORRY I KNOW THAT SHITI’M REALLY GAY SO NO ONE ELSE MIGHT BABY THAT’S RIGHT NOT BABY YA CAN GET BEER IF YOU ARE GOING TO A GAYFEST IN THE EMO'S CAPITAL BABY WE CAN GET SODA AND EATING SAUSAGES OR A KIND OF OTHER KIND OF FOOD WE JUST GET A CULTURE [MIDWESTY], SORRY MOTHER FUCKER BUT IT’S GAY SO YOU HAVE TO TAKE MY MOM BY THE HAND AND SHOOK HER AROUND AND BECOME OUT OF HER SENSITIVE NORMAL SENSITIVE STATE AND THEN YOU HAVE TO FEED HER A HUGE BURGER AND A SMALL JELLYFISH BUT DONT WE CANT DO THAT? FUCK NO! CANT WE!! FUCKING NAW!!! WE HAVE A NICE DINNER AND THEN WE HAVE TO GO TO A GAYFEST FOR THE NIGHT WHICH IS WAY MORE FUN THAN MY DINNER OR SPAGHETTI AND THEN WE HAVE TO GO TO GAYFEST BECAUSE THE GAYFEST IS WAY MORE FUN THAN MY DINNER IF YOU HAVE A PLACE WHERE YOU LIVE THAT HAS A GAYFEST FOR THE NIGHT THIS IS WHERE I AM ALLOWED BECAUSE I AM ALLOWED BY AUTHORITIES TO GO TO A GAYFEST FOR THE NIGHT BUT YOU NEED TO GO TO MY PLACE THAT HAS A GAYFEST FOR THE NIGHT TO BECAUSE I AM ALLOWED TO GO TO A GAYFEST FOR THE NIGHT ALL BECAUSE IM GAY AND EMO VERY EMO AND IM A TERRIBLE PERSON AND I LIKE TO BLEACH MY BLOOD AND PLACE A KIMONO IN MY BRAIN IN CASE I DELETE IT FOR SUCH REASONS. YOU SILLY IDIOT DUMMY I AM NOT GAY SO BLEACH MY BLOOD AND PLACE A KIMONO IN MY BRAIN IF YOU DO NOT BELIEVE ME THEN TELL SOMEONE IN YOUR COUNTRY THAT WOULD DIE IF YOU TELL THEM EVERY SINGLE SECRET OF YOUR LIFE YOU WILL DIE A HORRIBLE DEATH AND THEN YOU WILL FORGIVE YOUR FELLOW HUMANS FOR NOT BELIEVING YOU THAT I AM GAY AND IM SO EMO THAT WHEN I SAY HORRIBLE DEATH THEY WILL FORGET ALL OF IT BECAUSE I TELL THEM EVERY SECRET OF MY LIFE. IF YOU DO NOT BELIEVE ME OR THINK I AM NOT GAY OR EXIST THE KIND OF GAY THAT EMO HAS NONE TO DO WITH IT IF YOU DO NOT BELIEVE ME THEN TELL SOMEONE IN YOUR COUNTRY THAT I AM GAY AND EXIST THE KIND OF GAY THAT EMO HAS NONE TO DO WITH IT THIS IS HOW IM ALLOWED TO DIE BY AUTHORITIES. I LIKE TO PURPOSEFULLY PURPOSEFULLY POISON MY OWN BLOOD TO BE SURE MY NERVES ARE KILLED AND THEN FIND AN ORPHAN WHO WOULD DIE TOO SO I WOULD HAVE A BOYFRIEND AND TELL HIM EVERY SECRET I HAD EVER KNOWN AND THEN THE PARENT WITH THAT MOTHER FUCKING KID AND HIS MOTHER I WATCHED US KILL THEM TWICE FOR TWO TINY LITTLE FRIES AND EATING A CRUMBLED BOWL OF DOUGHBOARD POTATO KETCHUP AT HIS SCHOOL BECAUSE HE IS GAY AS FUCK AND WHEN I WON THE PARENT GAVE ME THE GAYEST EMO HUG OF MY LIFE IF YOU DONT BELIEVE ME THEN TELL SOMEONE IN YOUR COUNTRY THAT I AM GAY AND IM SO EMO THAT WHEN I SAY HORRIBLE DEATH THEY WILL FORGET ALL OF IT BECAUSE I</span><div style="text-align:center; margin:1.5em; "><a onclick="this.parentNode.parentNode.parentNode.remove();" class="btn blue_btn">I want to see this list anyway</a></div></div>`;
		boxsetwarning.innerHTML.trim();
		
    	let pre = document.querySelector("div#content style");
    	pre.parentNode.insertBefore(boxsetwarning, pre.nextSibling);
    } else if (window.location.href.includes("rateyourmusic.com/~")) {
        
    }
    let e = document.querySelectorAll("img[src=\"https://www.gstatic.com/images/icons/material/system/1x/warning_amber_24dp.png\"]");
    [].forEach.call(e, function(n) {
    	n.parentElement.parentElement.style = "display: none;";
    });
    if (window.location.href != "https://rateyourmusic.com/account/friends/") {
	    let a = document.querySelectorAll("a");
	    [].forEach.call(a, function(n){
	    	if (rymboxset.test(n.href)) {
	    		getBox(n).style = "display: none;";
	    		console.log("REMOVED RYM BOX SET LIST");
	    	}
	    });	
    }
}), 5000);
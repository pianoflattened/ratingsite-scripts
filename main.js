// https://github.com/DVLP/localStorageDB
!function(){var r,c,e=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;e?(c={k:"",v:""},(e=e.open("d2",1)).onsuccess=function(e){r=this.result},e.onerror=function(e){console.error("indexedDB request error"),console.log(e)},e.onupgradeneeded=function(e){r=null,e.target.result.createObjectStore("s",{keyPath:"k"}).transaction.oncomplete=function(e){r=e.target.db}},window.ldb={get:function e(t,n){r?r.transaction("s").objectStore("s").get(t).onsuccess=function(e){e=e.target.result&&e.target.result.v||null,n(e)}:setTimeout(function(){e(t,n)},100)},set:function(e,t,n){c.k=e,c.v=t;let o=r.transaction("s","readwrite");o.oncomplete=function(e){"Function"==={}.toString.call(n).slice(8,-1)&&n()},o.objectStore("s").put(c),o.commit()}}):console.error("indexDB not supported")}();

// jquery
var $ = window.$;

// !! place everything under OUTSIDE below


window.addEventListener('DOMContentLoaded', function() {
	console.log("hey");
	
	// !! place everything under INSIDE below
	
	
});

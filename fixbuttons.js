// OUTSIDE
var rymQre = /rymQ\(\s*function\(\)\s*{\s*(.*)\s*}\);/g;

// INSIDE
$("[onclick^=rymQ]").attr("onclick", function(i, value) {
	// this looks scary refer to this 
	// https://stackoverflow.com/questions/432493/how-do-you-access-the-matched-groups-in-a-javascript-regular-expression
	return [...value.matchAll(rymQre)].map(m => m[1])[0].trim();
});

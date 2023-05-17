# check for closure
closurepath=$(which closure)
if ! [[ closurepath ]]; then
	closurepath=$(which closure-compiler)
fi
if ! [[ closurepath && $($closurepath --version | grep "Closure Compiler") ]]; then
	if ! [[ $(find ./closure*.jar) ]]; then
		echo "closure doesn't seem to be installed! downloading latest in current dir for building. if you'd prefer, you can install and then delete the jar file in this directory"
		base="https://repo1.maven.org/maven2/com/google/javascript/closure-compiler/"$(curl -s https://repo1.maven.org/maven2/com/google/javascript/closure-compiler/ | grep "v[0-9]*/" | tail -1 | sed "s/>v.*/><\/a>/" | xmllint --html --format --xpath "string(.//a//@href)" 2>/dev/null -)
		wget $base$(curl -s $base | xmllint --html --format --xpath "string(//a[substring(@href, string-length(@href)-3) = '.jar' and not(contains(@href, 'javadoc')) and not(contains(@href, 'sources'))]//@href)" 2>/dev/null -)
	else
		closurepath=$(find ./closure*.jar | head -1)
	fi
fi

# concat
inside=""
outside=""

set -f # lol

for filename in $(cat build.list); do
	content=$(cat "noboxset.js")
	set +f; inside=$inside"${content%%// INSIDE*}"; set -f
	outside=$outside"${content#$inside}"
done

cp main.js all.js
sed -i "s/\/\/ \!\! place everything under OUTSIDE below/$outside" all.js
sed -i "s/\/\/ \!\! place everything under INSIDE below/$inside" all.js

set +f

# go!!!!
$closurepath all.js >> all.min.js

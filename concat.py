import json

build = {}
with open("build.json") as build_config:
    build = json.loads(build_config.read())

with open("main.js") as main:
    main_contents = main.read()

main_outside = ""
main_inside = ""

for filename in build["files"]:
    with open(filename) as file:
        contents = file.read()
        outside, inside = contents.split("// INSIDE")
        outside = outside.replace("// OUTSIDE\n", "")

        main_outside += outside
        main_inside += inside

main_contents = main_contents.replace("// !! place everything under OUTSIDE below", main_outside)
main_contents = main_contents.replace("// !! place everything under INSIDE below", main_inside)

with open("all.js", "w+") as main:
    main.write(main_contents)

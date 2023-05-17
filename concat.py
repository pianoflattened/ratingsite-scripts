build = []
with open("build.list") as build_list:
    build = build_list.read().split()

with open("main.js") as main:
    main_contents = main.read()

main_outside = ""
main_inside = ""

for filename in build:
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

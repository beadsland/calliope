
SHELL=/bin/bash -o pipefail
BUILD=priv/elixir_script/build

app/scripts/calliope-bundle.js: ${BUILD}/Elixir.Calliope.js \
                                ${BUILD}/ElixirScript.Core.js \
                                webpack.config.js nodedeps
	webpack

nodedeps:
	npm install

${BUILD}/ElixirScript.Core.js: ${BUILD}/Elixir.Calliope.js

${BUILD}/Elixir.Calliope.js: $(shell find lib -type f -name *.ex) \
                             calliope.js gitstatus
	mix compile --warnings-as-errors | cut -c -500

elixirdeps:
	mix deps.get

gitstatus:
	git status # trigger refresh of IDE Git panel

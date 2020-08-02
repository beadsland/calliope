BUILD=priv/elixir_script/build

app/scripts/calliope-bundle.js: ${BUILD}/Elixir.Calliope.js \
                                ${BUILD}/ElixirScript.Core.js \
                                webpack.config.js
	npm install
	webpack

${BUILD}/ElixirScript.Core.js: ${BUILD}/Elixir.Calliope.js

${BUILD}/Elixir.Calliope.js: $(shell find lib -type f -name *.ex) \
                                             calliope.js
	git status # trigger refresh of IDE Git panel
	mix deps.get
	mix compile --warnings-as-errors | cut -c -500

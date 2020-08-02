app/scripts/calliope-bundle.js: priv/build/Elixir.Calliope.js \
                                priv/build/ElixirScript.Core.js \
                                webpack.config.js
	npm install
	webpack

priv/build/Elixir.Calliope.js: $(shell find lib -type f -name *.ex) \
                               calliope.js
	mix deps.get
	mix compile --warnings-as-errors

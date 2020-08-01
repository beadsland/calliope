

app/scripts/calliope-bundle.js: node_modules webpack.config.js \
																						 priv/build/Elixir.Calliope.js \
	                                           priv/build/ElixirScript.Core.js
	webpack

node_modules: package.json
	npm i

priv/build/Elixir.Calliope.js: calliope.js $(shell find lib -type f -name *.ex) \
	                             deps/elixir_script
	mix compile --warnings-as-errors

deps/elixir_script: mix.exs
	mix deps.get

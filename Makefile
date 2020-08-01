

app/scripts/calliope-bundle.js: node_modules webpack.config.js \
																									_build/Elixir.Calliope.js \
	                                                _build/ElixirScript.Core.js

	webpack

node_modules: package.json
	npm i

_build/Elixir.Calliope.js: calliope.js $(shell find lib -type f -name *.ex) \
	                         deps/elixir_script
	mix

deps/elixir_script: mix.exs
	mix deps.get

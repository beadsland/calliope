app/scripts/calliope-bundle.js: webpack.config.js _build/Elixir.Calliope.js \
	                                                _build/ElixirScript.Core.js \
																									node_modules
	webpack

node_modules: package.json
	npm i

_build/Elixir.Calliope.js: calliope.js $(shell find lib -type f -name *.ex)
	mix

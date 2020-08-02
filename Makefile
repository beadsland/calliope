app/scripts/calliope-bundle.js: nodedeps webpack.config.js \
																			   priv/build/Elixir.Calliope.js \
	                                       priv/build/ElixirScript.Core.js
	webpack

nodedeps:
	npm install

priv/build/Elixir.Calliope.js: elixirdeps calliope.js \
	                             $(shell find lib -type f -name *.ex)
	mix compile --warnings-as-errors

elixirdeps:
	mix deps.get

// Foreign Function Interface (FFI) routines for calling from Elixir functions.
// File must reside on this path to be found by ElixirScript compiler
// (this is hard coded rather than an option setting).
//
// https://hexdocs.pm/elixir_script/javascriptinterop.html#elixirscript-calling-javascript

function get(key) {
  if (typeof document.calliope == "undefined") {
    return document.calliope
  } else {
    return document.calliope[key]
  }
}

function set(key, value) {
  if (typeof document.calliope == "undefined") {
    document.calliope = new Object()
  }
  document.calliope[key] = value
}

export default {
  get: get,
  set: set
}

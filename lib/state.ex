# Foreign Function Interface (FFI) routines for calling from Elixir functions.
# File must reside on this path to be found by ElixirScript compiler
# (this is hard coded rather than an option setting).
#
# https://hexdocs.pm/elixir_script/javascriptinterop.html#elixirscript-calling-javascript

defmodule State do
  @moduledoc """
  FFI placeholder for Javascript state manageent
  """

  use ElixirScript.FFI

  @spec get(key :: String.t()) :: any
  def get(_key), do: :stub

  @spec set(key :: String.t(), value:: any) :: nil
  def set(_key, _value), do: :stub

  @spec assignInner(elem :: {}, html :: String.t()) :: nil
  def assignInner(_elem, _html), do: :stub
end

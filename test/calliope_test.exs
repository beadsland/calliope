defmodule CalliopeTest do
  use ExUnit.Case
  doctest Calliope

  test "greets the world" do
    assert Calliope.hello() == :world
  end
end

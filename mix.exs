 defmodule Calliope.MixProject do
  use Mix.Project

  def project do
    [
      app: :calliope,
      version: "0.1.0",
      elixir: "~> 1.10",
      start_permanent: Mix.env() == :prod,
      deps: deps(),

      # Add elixir_script as a compiler
      compilers: Mix.compilers ++ [:elixir_script],
      # Our elixir_script configuration
      elixir_script: [
          # Entry module. Can also be a list of modules
          input: Calliope,
          # Output path. Either a path to a js file or a directory
          output: "priv/elixir_script/build"
      ]

    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
#      {:elixir_script, "~> 0.32.1"}
      {:elixir_script, path: "/home/beads/dev/elixirscript"}
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end
end

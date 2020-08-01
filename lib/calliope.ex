defmodule Calliope do
  @moduledoc """
  ElixirScript application `Calliope`: a left-swiping concierge for online
  dating sites.
  """

  def start do
    :console.log("Starting calliope...")
    :window.setInterval(fn -> heartbeat() end, 2000)
  end

  def heartbeat, do: heartbeat(:document.location.hostname)

  def heartbeat("www." <> domain), do: heartbeat(domain)
  def heartbeat("okcupid.com"), do: OkCupid.start()
  def heartbeat("bumble.com"), do: :console.log("tha-bump bumble")
  def heartbeat(_), do: :ignore
end

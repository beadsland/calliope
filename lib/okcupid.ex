defmodule OkCupid do
  @moduledoc """
  Auto-leftswipe on okcupid profiles.
  """

  def start(), do: heartbeat(:document.location.pathname)

  def heartbeat("/home"), do: doubletake()
  def heartbeat("/doubletake"), do: doubletake()
  def heartbeat("/profile"), do: profile(:mine)
  def heartbeat("/profile/" <> _user), do: profile(:page)
  def heartbeat("/"), do: :ignore
  def heartbeat(str), do: heartbeat(str.substring(0, str.length()-1), str.last)

  def heartbeat(str, "/"), do: heartbeat(str)
  def heartbeat(_str, _), do: :ignore

  def doubletake(), do: doubletake(Page.getClass("cardsummary-profile-link"))
  def doubletake([elem | _tail]), do: doubletake({:anchor, DOM.getTag(elem, "a")})
  def doubletake({:anchor, [elem | _tail]}), do: doubletake({:href, elem.href})
  def doubletake({:href, href}), do: :console.log(:profile, href)
  def doubletake(err), do: :console.log([:doubletake, :err, err])

  def profile(_), do: :ignore

end

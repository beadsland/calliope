defmodule OkCupid do
  @moduledoc """
  Auto-leftswipe on okcupid profiles.
  """

  def start(), do: start(:document.readyState)
  def start("complete"), do: heartbeat(:document.location.pathname)
  def start(_), do: :ignore

  defstruct quicktime: &Okcupid.doubletake/0

#  def heartbeat("/home"), do: %OkCupid{}.quicktime()
#  def heartbeat("/doubletake"), do: doubletake()
  def heartbeat("/profile"), do: profile(:mine)
  def heartbeat("/profile/" <> _user), do: profile(:page)
  def heartbeat("/"), do: :ignore
#  def heartbeat(str), do: heartbeat(str.substring(0, str.length()-1), str.last)

  def heartbeat(str, "/"), do: heartbeat(str)
  def heartbeat(_str, _), do: :ignore

  def doubletake(), do: :console.log({:doubletake, :quicktime})
#  def doubletake(), do: doubletake(Page.getClass("cardsummary-profile-link"))
#  def doubletake([elem | _tail]), do: doubletake({:anchor, DOM.getTag(elem, :a)})
  def doubletake([]), do: doubletake(:no_anchor)
  def doubletake(:no_anchor), do: :ignore

  def doubletake({:anchor, [elem | _tail]}), do: doubletake({:href, elem.href})
  def doubletake({:href, _href}) do

#    case State.get("page") do
#      {:doubletake, ^href} ->
#        :console.log("we've been here before")
#       _default ->
#        State.set("page", {:doubletake, href})
#        :window.scrollTo(0, 680)
#        :console.log(:profile, href)
#    end
  end
  def doubletake(err), do: :console.log([:doubletake, :err, err])

  def profile(_), do: :ignore

end

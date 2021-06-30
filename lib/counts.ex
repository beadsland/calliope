defmodule Counts do
  @moduledoc """
  Count words and inject result into current page.
  """

  @wcId "calliope-wordcounts"

  defmodule WordCounts, do: defstruct words: 1, noise: 0, div: "<b>0 : 1</b>"
  defmodule ClassMap, do: defstruct icon: "", text: "", section: ""

  def element(), do: Page.getId(@wcId)

  def inject(where, counts), do: inject(where, counts, element())
  def inject(where, counts, :undefined) do
    where.insertBefore(counts.div, where)
  end
  def inject(where, counts, div) do
    div.remove()
    inject(where, counts.words, counts.noise)
  end

  def tally(_essays), do: %WordCounts{}

  def format(words, noise), do: format(words, noise, %ClassMap{})
  def format(words, noise, class) do
    style = [fontSize: "150%", top: "1px", display: "inline-block"]
    icon = DOM.newElement(:div, [className: class.icon], style, "✒️")

    score = :Math.round(noise/words*1000)/10
    score = "#{noise} : #{words} (#{score}%)"
    style = [display: "inline-block"]
    text = DOM.newElement(:div, [className: class.text], style, score.bold())

    elem = DOM.newElement(:div, [id: @wcId, className: class.section], [], "")
    elem.appendChild(icon)
    elem.appendChild(text)

    elem
  end

end

defmodule DOM do
  @moduledoc """
  Get elements and content from current page.
  """

  def newElement(tag), do: newElement(tag, [], [], "")

  def newElement(tag, prop, style, inner) when is_atom(tag) do
    newElement(tag, prop, style, inner)
  end
  def newElement(tag, prop, style, inner) do
    elem = :document.createElement(tag)
    Enum.each prop, fn {k,v} -> elem.setAttribute(dash(k), v) end
    Enum.each style, fn {k,v} -> elem.style.setProperty(dash(k), v) end
    State.assignInner(elem, inner)
    elem
  end

  def dash(k), do: Regex.replace(~r/(?<!^)(?=[A-Z])/, k.to_string, '-')

  def getClass(elem, class) do
    collection = case elem do
      :document -> :document.getElementsByClassName(class)
      _         -> elem.getElementsByClassName(class)
    end
    :Array.from(collection)
  end

  def getId(elem, id) do
    case elem do
      :document -> :document.getElementById(id)
      _         -> elem.getElementById(id)
    end
  end

  def getTag(elem, tag) when is_atom(tag), do: getTag(elem, tag.toString)
  def getTag(elem, tag), do: tag |> elem.getElementsByTagName |> :Array.from

end

defmodule DOM do
  @moduledoc """
  Get elements and content from current page.
  """

  def getClass(elem, class) do
    collection = case elem do
      :document -> :document.getElementsByClassName(class)
      _         -> elem.getElementsByClassName(class)
    end
    :Array.from(collection)
  end

  def getTag(elem, tag), do: :Array.from(elem.getElementsByTagName(tag))

end

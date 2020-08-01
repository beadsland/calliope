defmodule Page do
  @moduledoc """
  Get elements and content from current page.
  """

  def getClass(class), do: DOM.getClass(:document, class)


end

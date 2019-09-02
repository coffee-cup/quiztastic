defmodule QuiztasticWeb.PageController do
  use QuiztasticWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end

defmodule QuiztasticWeb.PageControllerTest do
  use QuiztasticWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "Quiztastic"
  end
end

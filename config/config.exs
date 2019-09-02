# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

# Configures the endpoint
config :quiztastic, QuiztasticWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "LNM9a6+32zw3G2g5m4Q1chdqN1ftjmIT2O19D8r6xFpzw9gUi9MmuKsTBIFanUTx",
  render_errors: [view: QuiztasticWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Quiztastic.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"

require "resolv"
require "pg"
# require "redis"
# require "redis-namespace"

# $redis = Redis::Namespace.new("redis_hostnames", :redis => Redis.new)

class MappyAsyncMain





def self.get_conn
  host      = ENV['RAILS_HOST']
  dbname    = ENV['RAILS_DATABASE']
  port      = ENV['RAILS_PORT']
  user      = ENV['RAILS_USERNAME']
  password  = ENV['RAILS_PASSWORD']

  # PGconn.open seems to have quit working with Gem update 
  conn = PG::Connection.open(
    :host => host,
    :dbname => dbname,
    :port => port,
    :user => user,
    :password => password
  )

  return conn
end


def self.check_xy(lat, lng)
  conn = get_conn
  # result = conn.query()
end

end
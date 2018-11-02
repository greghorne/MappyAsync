require "resolv"
require "pg"
require 'rest-client'
# require "redis"
# require "redis-namespace"

# $redis = Redis::Namespace.new("redis_hostnames", :redis => Redis.new)

class DBConnector

  ########################################
  def pg_connect

    begin
      host      = ENV['RAILS_HOST']
      dbname    = ENV['RAILS_DATABASE']
      port      = ENV['RAILS_PORT']
      user      = ENV['RAILS_USERNAME']
      password  = ENV['RAILS_PASSWORD']

      conn = PG::Connection.open(
        :host     => host,
        :dbname   => dbname,
        :port     => port,
        :user     => user,
        :password => password
      )
      return conn
    rescue
      return false
    end

  end
  ########################################

end

class Mappyasync


end
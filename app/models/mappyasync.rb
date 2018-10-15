require "resolv"
require "pg"
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

  ########################################
  def initialize(lat, lng)
    @lat = lat
    @lng = lng
  end
  ########################################
    

  ########################################
  # check if x,y intersects U.S. States
  def check_valid  

    begin
      db   = DBConnector.new
      conn = db.pg_connect

      if conn
        response = conn.query("select z_tl_2016_us_state($1, $2)",[@lng.to_f, @lat.to_f])
        conn.close
        if response.num_tuples.to_i === 1
          return true
        end
      end
      return false

    rescue
      return false
    end

  end
  ########################################

end
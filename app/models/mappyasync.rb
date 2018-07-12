require "resolv"
# require "redis"
# require "redis-namespace"

$redis = Redis::Namespace.new("redis_hostnames", :redis => Redis.new)

class MappyAsyncMain


end
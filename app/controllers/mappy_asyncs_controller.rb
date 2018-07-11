class MappyAsyncsController < ApplicationController
    def mappyasync
        begin
            puts "testing..."
            return "hello world"
        end
    end
end

class MappyAsyncsController < ApplicationController
    def mappyasync
        begin
            puts "message from controller..."
            # return_hash = { :msg => "hello from controller" }
            # render json: return_hash
        end
    end

    def mapclick
        # puts
        # puts "===================="
        # puts "mapclick..."
        # puts params[:lat] + ", " + params[:lng]
        # puts "===================="
        # puts

        json = { :msg => "Just a popup"}
        render json: json

    end

end

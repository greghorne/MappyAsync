class MappyAsyncsController < ApplicationController
    def mappyasync
        begin
            puts "message from controller..."
            # return_hash = { :msg => "hello from controller" }
            # render json: return_hash
        end
    end

    def mapclick


        json = { :msg => "Just a popup"}
        render json: json

    end

    def check_valid_xy
        lat = params[:lat]
        lng = params[:lng]
        puts lat + " " + lng
        result = check_xy(lat, lng)
        puts result
    end

end

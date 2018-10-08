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
        puts
        # puts "check_valid_xy"
        puts lat + " " + lng
        puts
        # result = MappyAsyncMain::check_xy(lat, lng)
        # result = ApplicationModel.MappyAsyncMain.new
        @result = Mappyasync.new("greg")
        puts @result
    end

end

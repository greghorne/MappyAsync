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
        testCall = Mappyasync.new(params[:lat], params[:lng])
        puts testCall.check_valid
    end

end

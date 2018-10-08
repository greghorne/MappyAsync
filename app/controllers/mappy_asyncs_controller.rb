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

    # see if given x,y falls within U.S. boundaries
    def check_valid_xy
        valid_xy = Mappyasync.new(params[:lat], params[:lng]).check_valid
        render :json => { valid: valid_xy } 
    end

end

require 'rest-client'

class MappyAsyncsController < ApplicationController

    # def mapclick
    #     json = { :msg => "Just a popup"}
    #     render json: json
    # end

    # targomo_key = ENV['RAILS_TARGOMO']

    # check if given x,y falls within U.S. boundaries
    def check_valid_xy
        puts "check_valid_xy"
        valid_xy = Mappyasync.new(params[:lat], params[:lng]).check_valid
        render :json => { valid: valid_xy } 
    end

    def process_xy

        targomo_key = ENV['RAILS_TARGOMO']
        minutes     = params[:minutes].split("-")

        n   = 0
        max = minutes.length()

        while n < 1 do
            url = "http://zotac1.ddns.net:8001/v1/targomo-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + (minutes[n].to_i * 60).to_s + "/" + targomo_key
            puts url
            response_intersects = RestClient.get url
            puts minutes[n]
            
            puts "====="
            puts JSON.parse(response_intersects)['targomo']
            puts "====="
            n +=1
        end 
      
    end

end

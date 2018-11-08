require 'rest-client'

targomo_key = ENV['RAILS_TARGOMO']

class MappyAsyncsController < ApplicationController

    # def mapclick
    #     json = { :msg => "Just a popup"}
    #     render json: json
    # end

    # check if given x,y falls within U.S. boundaries
    # def check_valid_xy
    #     puts "check_valid_xy"
    #     valid_xy = Mappyasync.new(params[:lat], params[:lng]).check_valid
    #     render :json => { valid: valid_xy } 
    # end

    def process_xy

        url = "http://zotac1.ddns.net:8001/v1/targomo-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:minutes] + "/" + Rails.application.config.targomo_key
        response_intersects = RestClient.get url
        render :json => JSON.parse(response_intersects)['targomo'].chop() + ",\"index\": " + params['index'] + "}"
      
    end

end

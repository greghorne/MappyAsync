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

    def process_targomo
puts "process_targomo"
        response = RestClient.get "http://zotac1.ddns.net:8001/v1/targomo-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:minutes] + "/" + Rails.application.config.targomo_key
        puts response
        render :json => JSON.parse(response)['targomo'].chop() + ",\"index\": " + params['index'] + "}"
      
    end

    def process_bing
puts "process_bing ===================="
        response = RestClient.get "192.168.1.240:8002/v1/bing-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:minutes] + "/" + Rails.application.config.bing_key
        puts JSON.parse(response)['bing'].chop() + ",\"index\": " + params['index'] + "}"
        render :json => JSON.parse(response)['bing'].chop() + ",\"index\": " + params['index'] + "}"
      
    end

end

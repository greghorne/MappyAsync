require 'rest-client'

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

    def process_bing
        response = RestClient.get "http://zotac1.ddns.net:8002/v1/bing-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:minutes] + "/" + Rails.application.config.bing_key
        render :json => JSON.parse(response)['bing'].chop() + ",\"index\": " + params['index'] + "}"
    end

    def process_here
        puts "hello ================="
        puts "http://192.168.1.240:8003/v1/here-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:minutes] + "/" + Rails.application.config.here_id + "/" + Rails.application.config.here_code
        # response = RestClient.get "http://192.168.1.240:8003/v1/here-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:minutes] + "/" + Rails.application.config.here_id + "/" + Rails.application.config.here_code
        # puts response
        # render :json => JSON.parse(response)['here'].chop() + ",\"index\": " + params['index'] + "}"
        return
    end

    def process_targomo
        response = RestClient.get "http://zotac1.ddns.net:8001/v1/targomo-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:minutes] + "/" + Rails.application.config.targomo_key
        render :json => JSON.parse(response)['targomo'].chop() + ",\"index\": " + params['index'] + "}"
    end

end

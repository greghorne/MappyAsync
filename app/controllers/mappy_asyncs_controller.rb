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
        response = RestClient.get "http://zotac1.ddns.net:8003/v1/here-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:minutes] + "/" + Rails.application.config.here_id + "/" + Rails.application.config.here_code
        render :json => "{\"here\":[" + JSON.parse(response)['here'] + "],\"index\": " + params['index'] + "}"
    end

    def process_targomo
        response = RestClient.get "http://zotac1.ddns.net:8001/v1/targomo-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:minutes] + "/" + Rails.application.config.targomo_key
        render :json => JSON.parse(response)['targomo'].chop() + ",\"index\": " + params['index'] + "}"
    end

    def process_mapbox
        response = RestClient.get "http://zotac1.ddns.net:8004/v1/mapbox-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:minutes] + "/" + Rails.application.config.mapbox_token
        render :json => "{\"mapbox\":" + JSON.parse(response)['mapbox'] + ",\"index\": " + params['index'] + "}"
    end

end

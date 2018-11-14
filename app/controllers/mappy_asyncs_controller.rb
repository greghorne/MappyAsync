require 'rest-client'

class MappyAsyncsController < ApplicationController

    def process_bing
        response = RestClient.get "http://zotac1.ddns.net:8002/v1/bing-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:time] + "/" + Rails.application.config.bing_key
        render :json => "{\"bing\":" + JSON.parse(response)['bing'] + ",\"index\": " + params['index'] + "}"
    end

    def process_here
        response = RestClient.get "http://zotac1.ddns.net:8003/v1/here-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:time] + "/" + Rails.application.config.here_id + "/" + Rails.application.config.here_code
        render :json => "{\"here\":[" + JSON.parse(response)['here'] + "],\"index\": " + params['index'] + "}"
    end

    def process_targomo
        response = RestClient.get "http://zotac1.ddns.net:8001/v1/targomo-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:time] + "/" + Rails.application.config.targomo_key
        render :json => "{\"targomo\":" + JSON.parse(response)['targomo'] + ",\"index\": " + params['index'] + "}"
    end

    def process_mapbox
        response = RestClient.get "http://zotac1.ddns.net:8004/v1/mapbox-isochrone/" + params[:lng] + "/" + params[:lat] + "/" + params[:time] + "/" + Rails.application.config.mapbox_token
        render :json => "{\"mapbox\":" + JSON.parse(response)['mapbox'] + ",\"index\": " + params['index'] + "}"
    end

end

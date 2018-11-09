Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get "/"                => "mappy_asyncs#mappyasync"
  get "/mapclick"        => "mappy_asyncs#mapclick"
  get "/check_valid_xy"  => "mappy_asyncs#check_valid_xy"
  get "/process_targomo" => "mappy_asyncs#process_targomo"
  get "/process_bing"    => "mappy_asyncs#process_bing"

end

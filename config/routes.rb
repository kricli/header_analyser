Rails.application.routes.draw do
  get 'static_pages/index'

  post 'headers/create'

  root 'static_pages#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

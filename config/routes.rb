Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'
  
  get 'static_pages/parser'

  post 'headers/create'

  root 'static_pages#landing_page'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

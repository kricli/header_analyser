Rails.application.routes.draw do

  mount_devise_token_auth_for 'User', at: 'auth'

  get 'parser', to: 'static_pages#parser'

  get 'dashboard', to: 'static_pages#dashboard', as: :dashboard

  get 'analyser', to: 'static_pages#analyser'

  get 'history', to: 'static_pages#history'

  post 'headers/create'

  get 'headers/show'

  delete 'headers/destroy'

  put 'headers/update'

  root 'static_pages#landing_page'

  # get 'softwares/show'

  get 'softwares/search'

  get 'softwares/cve_search'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

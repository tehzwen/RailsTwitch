Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'recipes/index'
      post 'recipes/create'
      get 'recipes/:id', to: 'recipes#show'
      delete 'recipes/:id', to: 'recipes#destroy'
      put 'recipes/update/:id', to: 'recipes#update'
      
      get 'channels/index'
      post 'channels/create'
      get 'channels/:id', to: 'channels#show'
      delete 'channels/:id', to: 'channels#destroy'
      put 'channels/update/:id', to: 'channels#update'
    end
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end

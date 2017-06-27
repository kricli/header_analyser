class ApplicationController < ActionController::Base

  include DeviseTokenAuth::Concerns::SetUserByToken

  before_action :configure_permitted_parameters, if: :devise_controller?

  protect_from_forgery with: :null_session

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  protected
  def authenticate_current_user
    if get_current_user.nil?
      # head :unauthorized
      redirect_to root_path
      return
    end
  end

  def get_current_user
    return nil unless cookies[:authHeaders]
    auth_headers = JSON.parse(cookies[:authHeaders])

    expiration_datetime = DateTime.strptime(auth_headers["expiry"], "%s")
    current_user = User.find_by(uid: auth_headers["uid"])

    if current_user &&
       current_user.tokens.has_key?(auth_headers["client"]) &&
       expiration_datetime > DateTime.now

      @current_user = current_user
    end
    @current_user
  end

end

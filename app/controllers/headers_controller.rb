class HeadersController < ApplicationController

  before_action :authenticate_current_user

  def create
    save = post_params()[:save].to_bool
    text = post_params()[:text]
    results = `python lib/assets/extraction.py '#{text}'`

    if save
      @header = current_user.headers.new(post_params.except(:save))
      if @header.save
      else
        render json: { message: "400 Bad Request" }, status: :bad_request
      end
    end

    render :json => results
  end

  def show
    @headers = current_user.headers.all
    render :json => @headers
  end


  def post_params
    params.require(:header).permit(:text, :name, :description, :save)
  end

end

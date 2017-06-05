class HeadersController < ApplicationController
  def create
    hash = post_params()
    render plain: hash[:text]
  end


  def post_params
    params.require(:header).permit(:text)
  end
end

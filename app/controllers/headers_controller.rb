class HeadersController < ApplicationController
  def create
    @header = Header.new(post_params)
    @header.save
    # hash = post_params()
    # render plain: hash[:text]
  end


  def post_params
    params.require(:header).permit(:text)
  end
end

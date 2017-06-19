class HeadersController < ApplicationController

  # before_action :authenticate_user!

  def create
    @header = Header.new(post_params)
    @header.save

    hash = post_params()[:text]

    results = `python lib/assets/extraction.py '#{hash}'`
    render :json => results
  end


  def post_params
    params.require(:header).permit(:text)
  end

end

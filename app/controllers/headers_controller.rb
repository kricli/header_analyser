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

  def update
    @header = current_user.headers.find_by_id(params[:id])

    if @header.nil?
      render json: { message: "Cannot find header" }, status: :not_found
    else
      @header.update(post_params)
      render :json => @header
    end
  end

  def destroy
    @header = current_user.headers.find_by_id(params[:id])
    if @header.nil?
      render json: { message: "Cannot find header" }, status: :not_found
    else
      if @header.destroy
        render json: { message: "Successfully deleted" }, status: :no_content
      else
        render json: { message: "Unsuccessfully deleted" }, status: :bad_request
      end
    end
  end


  def post_params
    params.require(:header).permit(:text, :name, :description, :save)
  end

end

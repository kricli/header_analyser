class StaticPagesController < ApplicationController

  # before_action :authenticate_user!, except: [:landing_page]
  before_action :authenticate_current_user, except: [:landing_page]

  def landing_page
    if !get_current_user.nil?
      redirect_to dashboard_path
      return
    end
  end

  def dashboard
    render layout: "header"
  end

  def analyser
    render layout: "header"
  end

  def history
    render layout: "header"
  end

  def parser
  end

end

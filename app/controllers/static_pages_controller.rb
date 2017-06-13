class StaticPagesController < ApplicationController

  def landing_page
  end

  def dashboard
    render layout: "header"
  end

  def parser
  end

end

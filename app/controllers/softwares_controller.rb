class SoftwaresController < ApplicationController

  before_action :authenticate_current_user

  # def show
  #   path = File.join Rails.root, 'app', 'assets', 'data', 'ultimate.json'
  #   @softwares = File.read(path)
  #   render :json => @softwares
  # end

  def search
    term = params[:term]
    @softwares = Software.find_by_fuzzy_keywords(term, :limit => 10)
    render :json => @softwares
  end

  def cve_search
    vendor = params[:vendor]
    software = params[:software]
    # str = vendor + ' ' + software
    results = `python lib/assets/cve.py #{Shellwords.escape(vendor)} #{Shellwords.escape(software)}`
    render :json => results
  end

end

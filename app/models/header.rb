class Header < ApplicationRecord
  belongs_to :user
  attr_accessor :created_at_formatted, :updated_at_formatted
end

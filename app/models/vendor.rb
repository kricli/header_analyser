class Vendor < ApplicationRecord
  has_many :softwares, dependent: :destroy
end

class Software < ApplicationRecord
  belongs_to :vendor
  fuzzily_searchable :keywords
end

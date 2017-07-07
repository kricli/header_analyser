class AddKeywordToSoftwares < ActiveRecord::Migration[5.1]
  def change
    add_column :softwares, :vendor_name, :string
    add_column :softwares, :keywords, :string
  end
end

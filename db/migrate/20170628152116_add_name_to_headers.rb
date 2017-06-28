class AddNameToHeaders < ActiveRecord::Migration[5.1]
  def change
    add_column :headers, :name, :string
    add_column :headers, :description, :string
  end
end

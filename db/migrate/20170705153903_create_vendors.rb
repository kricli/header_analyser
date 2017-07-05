class CreateVendors < ActiveRecord::Migration[5.1]
  def change
    create_table :vendors do |t|
      t.string :name

      t.timestamps
    end
    add_reference :softwares, :vendor, foreign_key: true
  end
end

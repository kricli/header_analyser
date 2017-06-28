class AddUserRefToHeaders < ActiveRecord::Migration[5.1]
  def change
    add_reference :headers, :user, foreign_key: true
  end
end

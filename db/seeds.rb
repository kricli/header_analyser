# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
json = ActiveSupport::JSON.decode(File.read('db/software.json'))

json.each do |a|
  @vendor = Vendor.create(:name => a['vendor'])
  a['products'].each do |b|
    @software = @vendor.softwares.create(:name => b)
  end
end

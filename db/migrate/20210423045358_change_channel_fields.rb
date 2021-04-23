class ChangeChannelFields < ActiveRecord::Migration[6.1]
  def change
    remove_column :channels, :description
    
    change_table(:channels) do |t|
      t.string :game_name
    end
  end
end

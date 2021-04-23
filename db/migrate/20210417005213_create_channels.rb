class CreateChannels < ActiveRecord::Migration[6.1]
  def change
    create_table :channels do |t|
      t.string :title
      t.text :description
      t.string :game_id
      t.string :language
      t.string :display_name
      t.boolean :is_live
      t.string :thumbnail_url
      t.timestamp :started_at

      t.timestamps
    end
  end
end

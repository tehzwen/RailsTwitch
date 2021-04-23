class Channel < ApplicationRecord
    validates :display_name, presence: true
    attribute :is_live, default: false
end

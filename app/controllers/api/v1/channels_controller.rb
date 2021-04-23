class Api::V1::ChannelsController < ApplicationController

  @@twitch_client = nil

  def initialize
    initialize_client!
  end

  def index
    channel = Channel.all.order(created_at: :asc)
    render(json: channel)
  end

  def channel_find_or_create(opts = {})
    Channel.find_or_create_by!(
      title: opts.fetch(:title),
      game_id: opts.fetch(:game_id),
      language: opts.fetch(:broadcaster_language),
      display_name: opts.fetch(:display_name),
      is_live: opts.fetch(:is_live),
      thumbnail_url: opts.fetch(:thumbnail_url),
      started_at: Date.parse(opts.fetch(:started_at)),
      game_name: opts.fetch(:game_name)
    )
  end

  def create
    selected_channel = nil
    channels = @@twitch_client.get_channel(channel_name: channel_params.fetch(:display_name))
    channels.each do |value|
      if (value['display_name'].downcase == params.fetch(:display_name))
        selected_channel = value.transform_keys(&:to_sym)
        break
      end
    end

    if (!selected_channel)
      if (channels.length > 0)
        selected_channel = channels.first.transform_keys(&:to_sym)
        channel = channel_find_or_create(selected_channel)
        render(json: channel)
      else
        render(json: "No results returned!!")
      end
    else
      channel = channel_find_or_create(selected_channel)
      render(json: channel)
    end
  end

  def update!
    channel.update(channel_params)
    channel.save

    render(json: channel)
  end

  def show
    if channel
      render(json: channel)
    else
      render(json: channel.errors)
    end
  end

  def destroy
    channel&.destroy
    render(json: { message: "channel deleted!" })
  end

  private

  def initialize_client!
    return if (@@twitch_client != nil)

    credentials = Rails.application.config.twitch
    @@twitch_client ||= Twitcher::Client.new(
      client_id: credentials[:twitch_client_id],
      client_secret: credentials[:twitch_secret]
    )
    @@twitch_client.authenticate
  end

  def channel
    @channel = Channel.find(params[:id])
  end

  def channel_params
    params.permit(
      :title,
      :description,
      :thumbnail_url,
      :started_at,
      :game_id,
      :language,
      :is_live,
      :display_name
    )
  end
end

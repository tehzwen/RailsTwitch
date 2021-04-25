class Api::V1::ChannelsController < ApplicationController

  @@twitch_client = nil

  def initialize
    initialize_client!
  end

  def index
    channels = Channel.all.order(created_at: :asc)
    render(json: channels)
  end

  def refresh_channel()
    if channel
      updated_channel = @@twitch_client.get_channel(channel_name: channel[:display_name])
      channel.update(transform_channel(updated_channel))
      render(json: channel)
    else
      render(json: channel.errors)
    end
  end

  def update_all_channels
    channels = Channel.all.order(created_at: :asc)
    channels.each do |value|
      updated_channel = @@twitch_client.get_channel(channel_name: value[:display_name])
      updated_channel = transform_channel(updated_channel)
      value.update(updated_channel)
    end
  end

  def search
    results = @@twitch_client.search_channel(channel_name: @query)
    results.sort_by do |r|
      r['display_name']
    end
  end

  def create
    selected_channel = nil
    data = @@twitch_client.get_channel(channel_name: channel_params.fetch(:display_name))
    channel = Channel.find_or_create_by!(transform_channel(data))

    if channel
      render(json: channel)
    else
      render(json: errors)
    end
  end

  def update!
    Channel.update(channel_params)
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

  def transform_channel(opts = {})
    date = opts.fetch(:started_at)
    transformed_channel = {
      title: opts.fetch(:title),
      game_id: opts.fetch(:game_id),
      language: opts.fetch(:broadcaster_language) { "UNKNOWN" },
      display_name: opts.fetch(:display_name),
      is_live: opts.fetch(:is_live),
      thumbnail_url: opts.fetch(:thumbnail_url),
      game_name: opts.fetch(:game_name)
    }

    if (!date.empty?)
      transformed_channel[:started_at] = Date.parse(date)
    else
      transformed_channel[:started_at] = nil
    end
    return transformed_channel
  end

  def initialize_client!
    return if (@@twitch_client != nil)

    credentials = Rails.application.config.twitch
    @@twitch_client ||= Twitcher::Client.new(
      client_id: credentials[:twitch_client_id],
      client_secret: credentials[:twitch_secret]
    )
    @@twitch_client.authenticate
  end

  def is_numeric?(o)
    true if Integer(o) rescue false
  end

  def channel
    value = params.fetch(:id)
    action = params.fetch(:action)
    if (is_numeric?(value))
      @channel = Channel.find(value)
    elsif (action == 'show')
      @query = params.fetch(:query)
      search
    end
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

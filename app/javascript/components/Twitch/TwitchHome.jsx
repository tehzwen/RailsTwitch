import React, { useEffect, useState } from 'react';
import { Button, Grid, Icon, Image, Segment, Dropdown } from 'semantic-ui-react';
import "./twitch.css";

const TwitchHome = (props) => {

    const [channelName, setChannelName] = useState("");
    const [channels, setChannels] = useState([]);
    const [channelOptions, setChannelOptions] = useState([]);
    const [channelHovered, setChanelHovered] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadChannels()
    }, []);

    const refreshChannel = (channel) => {
        return new Promise((resolve, reject) => {
            fetch("/api/v1/channels/refresh/" + channel.id)
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    const loadChannels = () => {
        setLoading(true);
        fetch("/api/v1/channels/index")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setChannels(data);
                let updated_data = data.map(async (channel) => {
                    return await refreshChannel(channel);
                });
                Promise.all(updated_data)
                    .then((values) => {
                        setChannels(values);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const createChannel = (displayName) => {
        fetch("/api/v1/channels/create", {
            method: "POST",
            headers: {
                "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                display_name: displayName
            })
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                loadChannels();
                setChannelName("");
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const deleteChannel = (channel) => {
        fetch("/api/v1/channels/" + channel.id, {
            method: 'DELETE',
            headers: {
                "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
                console.log(res);
                return res.json();
            })
            .then((data) => {
                console.log(data);
                loadChannels();
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const searchChannels = (query) => {
        fetch("/api/v1/channels/search?query=" + query)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setChannelOptions(
                    data.map((value) => {
                        return {
                            key: value.display_name,
                            text: value.display_name,
                            value: value.display_name
                        }
                    })
                )
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const renderChannels = () => {
        let total = [];
        let count = 0;
        let temp = [];

        // We want to return rows of 10 channels each
        while (count < channels.length) {
            temp.push(channels[count]);

            if (count % 10 || count == channels.length - 1) {
                total.push(
                    <TwitchChannelGroup history={props.history} key={count} channels={temp} />
                )
                temp = [];
            }
            count++;
        }
        return total;
    }


    const TwitchChannelGroup = (props) => {
        return (
            props.channels.map((channel) => {
                return (<TwitchChannelRow className="twitch-margined" key={channel.id} {...channel} history={props.history} />)
            })
        )
    }

    const navigateToChannel = (channel) => {
        channel.history.push({ pathname: "/twitch/channel/" + channel.id, state: { channel: channel } })
    }


    const TwitchChannelRow = (props) => {
        return (
            <Segment
                onMouseEnter={() => {
                    setChanelHovered(props.display_name);
                }}
                onMouseLeave={() => {
                    setChanelHovered("");
                }}
                textAlign='center'>
                <Grid.Column>
                    <Image
                        className="clickable"
                        onClick={() => {
                            navigateToChannel(props)
                        }} src={props.thumbnail_url} size={'tiny'} />
                </Grid.Column>
                <Grid.Column>
                    <p
                        className="clickable"
                        onClick={() => {
                            navigateToChannel(props)
                        }} >{props.display_name}</p>
                </Grid.Column>
                {props.is_live ?
                    <Grid.Column>
                        <p className="clickable"
                            onClick={() => {
                                navigateToChannel(props)
                            }} style={{ color: 'red' }}
                        >LIVE</p>
                    </Grid.Column>
                    : ""}
                {channelHovered == props.display_name ?
                    <Grid.Column>
                        <Button
                            size="tiny"
                            negative
                            onClick={() => {
                                deleteChannel(props)
                            }}
                        >Delete</Button>
                    </Grid.Column>
                    : ""}
            </Segment>
        )
    }

    const handleDropDownChange = (e, result) => {
        setChannelName(result.value)
    };

    return (
        <Grid>
            <Grid.Row className="twitch-margined-top twitch-margined">
                <Grid.Column>
                    Hello from Twitch Utils!
                </Grid.Column>
            </Grid.Row>
            <Grid.Row
                className="twitch-margined"
                columns={'equal'}>
                <Grid.Column>
                    <Dropdown
                        placeholder="Channel Name"
                        label="Channel Search"
                        onSearchChange={(e, { searchQuery }) => {
                            searchChannels(searchQuery);
                        }}
                        fluid
                        selection
                        search
                        onChange={handleDropDownChange}
                        options={channelOptions}
                        value={channelName}
                        clearable
                    />
                </Grid.Column>
                <Grid.Column>
                    <Button.Group>
                        <Button
                            color={"olive"}
                            disabled={channelName ? false : true}
                            onClick={() => {
                                createChannel(channelName);
                            }}
                            type="submit"
                        >Create</Button>
                        <Button
                            icon
                            onClick={() => {
                                loadChannels();
                            }}
                        >
                            <Icon loading={loading} name="refresh" />
                        </Button>
                    </Button.Group>
                </Grid.Column>
            </Grid.Row>
            {
                channels ? renderChannels() : ""
            }
        </Grid>
    )
}


export default TwitchHome;
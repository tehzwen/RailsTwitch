import React, { useEffect, useState } from 'react';
import { Button, Grid, Input , Image, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import "./twitch.css";

const TwitchHome = (props) => {

    const [channelName, setChannelName] = useState("");
    const [channels, setChannels] = useState([]);

    useEffect(() => {
        loadChannels()
    }, []);

    const loadChannels = () => {
        fetch("/api/v1/channels/index")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setChannels(data);
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
                console.log(data);
            })
            .catch((err) => {
                console.error(err);
            })
    }

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
                    <Input
                        onChange={(e) => setChannelName(e.target.value)}
                        placeholder='Channel name...' />
                </Grid.Column>
                <Grid.Column>
                    <Button
                        color={"olive"}
                        onClick={() => {
                            createChannel(channelName);
                        }}
                    >Create</Button>
                </Grid.Column>
            </Grid.Row>
            {channels.map((channel) => {
                return (<TwitchChannelRow key={channel.id} {...channel} />)
            })}
        </Grid>
    )
}


const TwitchChannelRow = (props) => {
    return (
        <Grid.Row inverted as={Segment} className="twitch-margined">
            <Grid.Column>
                <Image src={props.thumbnail_url} />
            </Grid.Column>
            <Grid.Column>
                <Link to={{ pathname: "/twitch/channel/" + props.id, state: { channel: props } }}>{props.display_name}</Link>
            </Grid.Column>
        </Grid.Row>
    )
}

export default TwitchHome;
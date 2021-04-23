import React, { useEffect, useState } from 'react';
import { Button, Grid, Input } from 'semantic-ui-react';
import "./twitch.css";


const TwitchChannel = (props) => {
    const [channel, setChannel] = useState(null);

    const fetchChannel = (id) => {
        fetch("/api/v1/channels/" + id)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setChannel(data);
                console.log(data)
            })
            .catch((err) => {
                console.error(err);
            })
    }

    useEffect(() => {
        // check for the channel state
        if (props.location && props.location.state && props.location.state.channel) {
            setChannel(props.location.state.channel);
        } else if (props.match && props.match.params && props.match.params.id) {
            fetchChannel(props.match.params.id);
        } else {
            props.history.push("/twitch")
        }
    }, []);

    return (
        <Grid>
            <Grid.Row className="twitch-margined-top twitch-margined">
                <Grid.Column>
                    <h2>{channel ? channel.display_name : ""}</h2>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="twitch-margined">
                <Grid.Column>
                    <p><b>Title: </b>{channel ? channel.title : ""}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="twitch-margined">
                <Grid.Column>
                    <p><b>Game: </b>{channel ? channel.game_name : ""}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="twitch-margined">
                <Grid.Column>
                    <p><b>Live: </b>{channel && channel.is_live ? "Online" : "Offline"}</p>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export {
    TwitchChannel
}
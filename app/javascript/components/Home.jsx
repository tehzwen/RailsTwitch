import React, { useEffect, useState } from 'react';
import { Form, Button, Grid } from 'semantic-ui-react';
import './home.css';

const Home = (props) => {
    return (
        <Grid>
            <Grid.Row className="home-margined-top home-margined">
                <Grid.Column>
                    Hello!
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="home-margined">
                <Grid.Column>
                    <Button
                        onClick={() => props.history.push("/recipes")}
                        color='green'>Recipes</Button>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="home-margined">
                <Grid.Column>
                    <Button
                        onClick={() => props.history.push("/twitch")}
                        color='purple'>Twitch</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default Home;
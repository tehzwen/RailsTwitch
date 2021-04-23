import React, { useState } from 'react';
import { Grid, Segment, Image } from 'semantic-ui-react';
import "./recipe.css";

const RecipeRow = (props) => {

    return (
        <Grid stretched>
            <Grid.Row
                columns={2}
                className={"recipe-row"}
                onClick={() => {
                    props.history.push("/recipe/" + props.id)
                }}
                style={{ marginBottom: "15px" }}
                as={Segment}
                stretched
                raised>
                <Grid.Column >
                    <h3>{props.name}</h3>
                </Grid.Column>
                {props.image != null ? (
                    <Grid.Column>
                        <Image src={props.image} size="tiny" />
                    </Grid.Column>
                ) : (
                    <></>
                )}
            </Grid.Row>
        </Grid>
    )
}

export {
    RecipeRow
}
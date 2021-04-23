import React, { Component, useEffect, useState } from 'react';
import { RecipeRow } from './RecipeRow';
import { Grid, Button } from 'semantic-ui-react';

const Recipes = (props) => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        loadRecipes()
    }, []);

    const loadRecipes = async () => {
        try {
            let data = await (() => {
                return new Promise((resolve, reject) => {
                    fetch("/api/v1/recipes/index")
                        .then((res) => {
                            return res.json()
                        })
                        .then((responseData) => {
                            resolve(responseData)
                        })
                        .catch((err) => {
                            reject(err);
                        })
                })
            })();
            // this.setState({ recipes: data });
            setRecipes(data);
        } catch (err) {
            console.error(err);
        }
    }

    const displayRecipes = () => {
        return recipes.map((recipe) => {
            return <RecipeRow loadFunction={loadRecipes} key={recipe.name} {...recipe} history={props.history} />
        })
    }

    return (
        <Grid>
            <Grid.Row className="recipe-margined recipe-margined-top">
                <Grid.Column>
                    <h1>Recipes!</h1>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="recipe-margined">
                <Grid.Column>
                    <Button
                        floated={'right'}
                        primary
                        onClick={() => props.history.push("/recipe/create")} >New</Button>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="recipe-margined">
                <Grid.Column>
                    {displayRecipes()}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default Recipes;
import React, { useEffect, useState } from 'react';
import { Grid, Button, Image } from 'semantic-ui-react';


const RecipeView = (props) => {
    const [id, setID] = useState(null);
    const [recipe, setRecipe] = useState({});

    useEffect(() => {
        if (id) {
            fetchRecipe();
        }
    }, [id])

    useEffect(() => {
        setID(props.match.params.id);
    }, []);

    const fetchRecipe = async () => {
        try {
            const data = await (() => {
                return new Promise((resolve, reject) => {
                    fetch("/api/v1/recipes/" + id)
                        .then((res) => {
                            return res.json();
                        })
                        .then((resData) => {
                            resolve(resData);
                        })
                        .catch((err) => {
                            reject(err);
                        })
                })
            })();

            setRecipe(data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleDelete = () => {
        let confirmDelete = confirm("Are you sure you want to delete this?")

        if (confirmDelete) {
            fetch("api/v1/recipes/" + recipe.id, {
                method: "DELETE",
                headers: {
                    "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
                    "Content-Type": "application/json"
                }
            })
                .then((res) => {
                    props.history.push("/");
                })
                .catch((err) => {
                    console.error(err);
                })
        }
    }

    return (
        <Grid>
            <Grid.Row className="recipe-margined recipe-margined-top">
                <Grid.Column>
                    <h3>{recipe.name}</h3>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="recipe-margined">
                <Grid.Column>
                    <label><b>Ingredients:</b></label>
                    <p>{recipe.ingredients}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="recipe-margined">
                <Grid.Column>
                    <label><b>Instructions:</b></label>
                    <p>{recipe.instruction}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="recipe-margined">
                <Grid.Column>
                    <label><b>Image:</b></label>
                    <p>{recipe.image}</p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="recipe-margined">
                <Grid.Column>
                    <Image src={recipe.image} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="recipe-margined" columns={2}>
                <div style={{ marginLeft: "15px" }}>
                    <Button positive onClick={() => {
                        props.history.push("/recipe/edit/" + recipe.id)
                    }}>Edit</Button>
                    <Button negative onClick={handleDelete}>Delete</Button>
                </div>
            </Grid.Row>
            <Grid.Row className="recipe-margined">
                <div style={{ marginLeft: "15px" }}>
                    <Button onClick={() => {
                        props.history.push("/")
                    }}>Back</Button>
                </div>
            </Grid.Row>
        </Grid>
    );
};

export default RecipeView;
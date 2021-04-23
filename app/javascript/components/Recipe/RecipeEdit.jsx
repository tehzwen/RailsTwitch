import React, { useEffect, useState } from 'react';
import { Form, Button, Grid } from 'semantic-ui-react';

const RecipeEdit = (props) => {
    const [id, setID] = useState(null);
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        if (id) {
            fetchRecipe();
        }
    }, [id])

    useEffect(() => {
        setID(props.match.params.id);
    }, []);

    const updateRecipe = async () => {
        try {
            let updateResponse = await (() => {
                return new Promise((resolve, reject) => {
                    fetch("/api/v1/recipes/update/" + id, {
                        method: "PUT",
                        headers: {
                            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name,
                            ingredients,
                            instruction: instructions,
                            image: image ? image : null
                        })
                    })
                        .then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        })
                })
            })();

            props.history.push("/"); // return back to recipes

        } catch (err) {
            console.error(err);
        }
    }

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

            setName(data.name);
            setIngredients(data.ingredients);
            setInstructions(data.instruction);
            setImage(data.image);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Grid >
            <Grid.Row className="recipe-margined recipe-margined-top">
                <Grid.Column>
                    <Form
                        onSubmit={() => {
                            updateRecipe()
                        }} >
                        <Form.Field>
                            <label>Name:</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Ingredients:</label>
                            <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Instructions:</label>
                            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Image:</label>
                            <input value={image} onChange={(e) => setImage(e.target.value)} />
                        </Form.Field>
                        <Button
                            primary
                            type="submit"
                        >Edit</Button>

                        <Button
                            negative
                            onClick={() => {
                                props.history.push("/recipe/" + id)
                            }} >Cancel</Button>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};

export default RecipeEdit;
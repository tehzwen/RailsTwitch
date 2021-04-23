import React from "react";
import { HashRouter, Route, Switch, BrowserRouter } from "react-router-dom";
import { Recipes, RecipeEdit, RecipeCreate, RecipeView } from "../components/Recipe/index";
import { TwitchHome, TwitchChannel } from '../components/Twitch/index';
import Home from '../components/Home.jsx';

export default (
  <HashRouter basename="/">
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/recipes" component={Recipes} />
      <Route exact path="/recipe/edit/:id"  component={RecipeEdit} />
      <Route exact path="/recipe/create"  component={RecipeCreate} />
      <Route exact path="/recipe/:id"  component={RecipeView} />
      <Route exact path="/twitch"  component={TwitchHome} />
      <Route exact path="/twitch/channel/:id"  component={TwitchChannel} />
    </Switch>
  </HashRouter>
);
import Users from "./components/Users.vue";
import Game from "./components/Game.vue";
import Home from "./components/Home.vue";

export const routes = [
    {path: "/", component: Home},
    {path: "/users", component: Users},
    {path: "/game", component: Game},
];
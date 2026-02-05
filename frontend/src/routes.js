import Users from "./components/Users.vue";
import Home from "./components/Home.vue";
import Anidle from "./components/Anidle.vue";
import Opening from "./components/Opening.vue";

export const routes = [
    {path: "/", component: Home},
    {path: "/users", component: Users},
    {path: "/anidle", component: Anidle},
    {path: "/opening", component: Opening},
];
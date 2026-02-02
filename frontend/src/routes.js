import Users from "./components/Users.vue";
import Home from "./components/Home.vue";

export const routes = [
    {path: "/", component: Home},
    {path: "/users", component: Users},
];
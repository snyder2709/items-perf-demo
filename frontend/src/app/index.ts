
import dayjs from "dayjs";
import { createApp } from "vue";
import App from "../App.vue";
import router from "./providers/router";
import './styles/main.css';

dayjs.locale("ru");

export const app = createApp(App).use(router);

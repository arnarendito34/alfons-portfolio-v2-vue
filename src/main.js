import "./scss/style.scss"
import {createApp} from "vue"
import App from "/src/vue/stack/App.vue"
import {scrollParallax, scrollReveal} from "/src/directives/scrollReveal.js"

const app = createApp(App)

app.directive("scroll-reveal", scrollReveal)
app.directive("scroll-parallax", scrollParallax)

app.mount("#app")

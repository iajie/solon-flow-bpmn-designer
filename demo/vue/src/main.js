import Vue from 'vue'
import App from './App.vue'
import SolonFlowDesigner from "./components/SolonFlowDesigner.vue";

Vue.component('solon-flow-designer', SolonFlowDesigner);

new Vue({
    render: h => h(App)
}).$mount('#app')

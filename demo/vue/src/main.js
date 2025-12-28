import Vue from 'vue'
import App from './App.vue'
import { SolonFlowDesigner, SolonFlowViewer } from "./components";
import { Button, Popover, Descriptions, DescriptionsItem } from "element-ui";
import "element-ui/lib/theme-chalk/button.css";
import "element-ui/lib/theme-chalk/popper.css";
import "element-ui/lib/theme-chalk/descriptions.css";
import "element-ui/lib/theme-chalk/descriptions-item.css";
Vue.component('solon-flow-designer', SolonFlowDesigner);
Vue.component('solon-flow-viewer', SolonFlowViewer);
Vue.component('el-button', Button);
Vue.component('el-popover', Popover);
Vue.component('el-descriptions', Descriptions);
Vue.component('el-descriptions-item', DescriptionsItem);

new Vue({
    render: h => h(App)
}).$mount('#app')

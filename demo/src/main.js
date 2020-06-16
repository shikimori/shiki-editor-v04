import Vue from 'vue';
import Demo from './demo.vue';
import 'reset-css/reset.css';

Vue.config.productionTip = false;
Vue.config.devtools = false;

window.I18n = {
  t: key => `:${key}`
};

new Vue({
  render: h => h(Demo)
}).$mount('#app');

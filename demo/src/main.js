import Vue from 'vue';
import Demo from './demo.vue';

Vue.config.productionTip = false;
Vue.config.devtools = false;

window.I18n = {
  t: key => `:${key}`
};

new Vue({
  render: h => h(Demo)
}).$mount('#app');

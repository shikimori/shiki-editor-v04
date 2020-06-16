import Vue from 'vue';
import Demo from './demo.vue';

import 'node_modules/reset-css/sass/reset';

Vue.config.productionTip = false;
Vue.config.devtools = false;

window.I18n = {
  t: key => `:${key}`
};

new Vue({
  render: h => h(Demo)
}).$mount('#app');

import Vue from 'vue';
import App from './app.vue';

Vue.config.productionTip = false;

window.I18n = {
  t: key => `:${key}`
};

new Vue({
  render: h => h(App)
}).$mount('#app');

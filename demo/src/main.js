import Vue from 'vue';
import Demo from './demo.vue';

import 'reset-css/reset.css';
import '@/stylesheets/application.sass';
import '@/stylesheets/prosemirror.sass';


Vue.config.productionTip = false;
Vue.config.devtools = false;

const TRANSLATIONS = {
  'frontend.shiki_editor.bold': ' Жирный',
  'frontend.shiki_editor.italic': ' Курсив',
  'frontend.shiki_editor.underline': ' Подчёркнутый',
  'frontend.shiki_editor.strike': ' Зачёркнутый',
  'frontend.shiki_editor.undo': ' Отменить последнее изменение',
  'frontend.shiki_editor.redo': ' Повторить последнее изменение',
  'frontend.shiki_editor.prompt.image_url': ' URL картинки',
  'frontend.shiki_editor.prompt.link_url': ' URL ссылки',
  'frontend.shiki_editor.prompt.spoiler_label': 'Заголовок спойлера',
  'frontend.shiki_editor.spoiler': 'Спойлер'
};

window.I18n = {
  t: key => TRANSLATIONS[key] || `:${key}`
};

new Vue({
  render: h => h(Demo)
}).$mount('#app');

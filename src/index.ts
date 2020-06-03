import Vue from 'vue';
import App from './components/app';

import 'regenerator-runtime/runtime';

new Vue({
  render: createElement => createElement(App),
}).$mount('#app');

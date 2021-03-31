import Vue from 'vue';
import {ready} from 'dauphine-js';

import FormWrapper from './components/_FormWrapper.vue';

let idApp = "#form";

ready(() => {

    const form = new Vue({
        el: idApp,
        delimiters: ['{', '}'],
        data: {},
        components: {
            "form-multisteps": FormWrapper
        }
    });

});

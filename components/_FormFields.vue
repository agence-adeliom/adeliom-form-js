<template>
    <div class="w-fields">

        <div class="field" :class="{'field--half': !field.full}" v-for="field in step.fields">

            <form-group :validator="$v.fields[field.name]">
                <form-label :field="field"/>
                <form-field :fields="fields" :field="field"/>
            </form-group>

            <div class="message-help" v-if="field.description">
                <p>{{ field.description }}</p>
            </div>

        </div>

    </div>
</template>

<script>

    import FieldGroup from './_FieldGroup.vue';
    import FormField from './_FormField.vue';
    import FormFieldLabel from './_FormFieldLabel.vue';

    import Vue from 'vue';
    import Vuelidate from 'vuelidate';
    import vuelidateErrorExtractor from "vuelidate-error-extractor";

    Vue.use(Vuelidate);

    Vue.use(vuelidateErrorExtractor, {
        template: FieldGroup,
        messages: {
            required: "Ce champ est obligatoire",
            email: "Veuillez saisir un email valide"
        }
    });

    const {required, email} = require('vuelidate/lib/validators');

    export default {
        props: ["step", "currentAnswers"],
        components: {
            "form-group": FieldGroup,
            "form-field": FormField,
            "form-label": FormFieldLabel
        },
        data() {
            return {
                fields: {}
            }
        },
        validations() {
            return {
                fields: this.rules
            };
        },
        computed: {
            rules () {
                let conditions = {};
                const fields = this.step.fields;
                if(fields){
                    fields.forEach((field) => {
                        if(field.required){
                            conditions[field.name] = { required };
                        }
                        if(field.type === "email"){
                            conditions[field.name] = {
                                required,
                                email
                            };
                        }
                    });
                }
                return conditions;
            }
        },
        mounted: function() {

            const fields = {};

            this.step.fields.forEach((field) => {
                if(field.name){
                    fields[field.name] = field.type === "checkbox" ? [] : "";
                }
            });

            this.fields = fields;

            if(this.currentAnswers){
                this.currentAnswers.forEach((field) => {
                    if(field.name) {
                        this.fields[field.name] = field.value;
                    }
                });
            }
        }
    }
</script>

<template>
    <div class="w-form-steps">

        <div class="container-fluid">

            <div class="col-left">

                <transition name="fade">

                    <form-confirmation v-if="loading && loading.progress"
                                       :loading="loading"
                                       :confirmation="confirmation"/>

                    <div class="steps" v-else-if="step && show">

                        <form-prev-button v-if="previousStep.length > 1"
                                          :prevStep="prevStep"/>

                        <h2 class="title h5" v-html="step.question"></h2>

                        <form-answers v-if="step.answers"
                                      ref="answers"
                                      :step="step"
                                      :currentAnswers="getCurrentAnswers()"
                                      :nextStep="nextStep"/>

                        <form-fields v-if="step.fields"
                                     ref="fields"
                                     :step="step"
                                     :currentAnswers="getCurrentAnswers()"/>

                        <form-next-button v-if="(step.fields || step.multiple)"
                                     :step="step"
                                     :nextStep="nextStep"
                                     :currentAnswers="getCurrentAnswers()"
                                     :disabled="isInvalidFields"/>

                    </div>

                </transition>

            </div>

            <div class="col-right">
                <form-summary :answers="answers"
                              :currentStep="currentStep" />
            </div>

        </div>

    </div>
</template>

<script>

    /* CONFIG */
    let defaultNameJson = "step-1";
    let jsonPath = "../datas/";
    /* END CONFIG */

    import FormAnswers from './_FormAnswers.vue';
    import FormFields from './_FormFields.vue';
    import FormNextButton from './_FormNextButton.vue';
    import FormPrevButton from './_FormPrevButton.vue';
    import FormConfirmation from './_FormConfirmation.vue';
    import FormSummary from './_FormSummary.vue';

    import {getConditionalFields, getFormData} from '../partials/_utils';

    let previousStep = [defaultNameJson];
    let currentStep = 0;

    let historyState = history.state;

    export default {
        props: ["type"],
        components: {
            "form-answers": FormAnswers,
            "form-fields": FormFields,
            "form-next-button": FormNextButton,
            "form-prev-button": FormPrevButton,
            "form-confirmation": FormConfirmation,
            "form-summary": FormSummary,
        },
        data() {
            return {
                show: false,
                currentJson: null,
                step: null,
                previousStep: historyState ? historyState.previousStep : previousStep,
                currentStep: historyState ? historyState.currentStep : currentStep,
                answers: historyState ? historyState.answers : [],
                loading: {
                    progress: false,
                    completed: false,
                    success: false,
                    failed: false
                },
                confirmation: {
                    title: "",
                    description: ""
                }
            }
        },
        created: function () {

            if(this.type){
                jsonPath += this.type + "/";
            }
            else{
                alert('Fichiers introuvables');
            }

            let currentJson = historyState ? (jsonPath + historyState.previousStep[historyState.previousStep.length - 1]) : (jsonPath + defaultNameJson);
            this.currentJson = currentJson;
            this.step = getConditionalFields(require(currentJson + '.json'));

            window.onpopstate = (event) => {
                const lastState = event.state;
                if(lastState){
                    this.currentJson = lastState.currentJson;
                    this.step = getConditionalFields(require(this.currentJson + '.json'), lastState.answers);
                    this.previousStep = lastState.previousStep;
                    this.currentStep = lastState.currentStep;
                    this.answers = lastState.answers;
                }
                else{
                    this.currentJson = jsonPath + defaultNameJson;
                    this.step = require(this.currentJson + '.json');
                    this.previousStep = [defaultNameJson];
                    this.currentStep = 1;
                    this.answers = [];
                }
            };

        },
        mounted: function() {
            if(this.currentStep === 0) {
                window.history.replaceState(null, "step", window.location.pathname + "#" + this.step.url);
            }
            this.show = true;
            window.addEventListener('keydown', function(e) {
                if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
                    e.preventDefault();
                    return false;
                }
            }, true);
        },
        watch: {
            currentStep: function () {
                this.show = false;
                setTimeout(() => {
                    this.show = true;
                }, 200);
            }
        },
        methods: {
            isInvalidFields: function() {
                return this.$refs.fields.$v.fields.$invalid;
            },
            nextStep: function (answer, submit=false) {
                if((answer && answer.nextStep) || this.step.nextStep || this.step.conditionalNextStep || submit){
                    try {

                        if(this.currentStep === 0){
                            this.answers = [];
                        }

                        if(this.step.fields){
                            this.$refs.fields.$v.fields.$touch();
                            if(this.isInvalidFields()){
                                return;
                            }
                            this.saveFieldsData();
                        }
                        else{
                            this.saveAnswersData(answer);
                        }

                        if(submit){
                            this.submitForm();
                            return;
                        }

                        let nextStep = (answer && answer.nextStep) ? answer.nextStep : this.step.nextStep;

                        if(this.step.conditionalNextStep){

                            this.answers.forEach((element) => {
                                const answer = JSON.parse(element);
                                if(Array.isArray(answer)){
                                    answer.forEach((field) => {
                                        if(field.name === this.step.conditionalNextStep.field && this.step.conditionalNextStep.value.indexOf(field.value) !== -1){
                                            nextStep = this.step.conditionalNextStep.nextStep;
                                        }
                                    });
                                }
                                else{
                                    if(answer.name === this.step.conditionalNextStep.field && this.step.conditionalNextStep.value.indexOf(answer.value) !== -1){
                                        nextStep = this.step.conditionalNextStep.nextStep;
                                    }
                                }
                            });

                        }

                        this.getJson(jsonPath + nextStep);

                        this.previousStep.push(nextStep);

                        this.handleState(this.currentStep + 1);


                    } catch (err) {
                        throw err;
                    }
                }
            },
            prevStep: function () {
                const previousStep = this.previousStep[this.previousStep.length - 2];
                try {

                    if(this.step.fields){
                        this.saveFieldsData();
                        this.$refs.fields.$v.fields.$reset();
                    }

                    this.getJson(jsonPath + previousStep);

                    const lastStep = this.previousStep[this.previousStep.length - 1];
                    this.previousStep = this.previousStep.filter(el => el !== lastStep);

                    this.handleState(this.currentStep - 1);

                } catch (err) {
                    throw err;
                }
            },
            submitForm() {

                this.loading.progress = true;

                const timeInit = new Date().getTime();
                const delay = 500;

                let formData = getFormData(this.answers);

                const self = this;

                $.ajax({
                    type: "POST",
                    url: URL_AJAX + "?action=steps_form&type=" + this.type,
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {

                        if(response.success) {

                            const timeEnd = new Date().getTime();
                            if ((timeEnd - timeInit < delay)) {
                                setTimeout(() => {
                                    self.loading.completed = true;
                                    setTimeout(() => {
                                        self.confirmationPage(response.confirmation);
                                    }, 400);
                                }, delay - (timeEnd - timeInit));
                            }
                            else{
                                self.loading.completed = true;
                                setTimeout(() => {
                                    self.confirmationPage(response.confirmation);
                                }, 400);
                            }

                        }
                        else{
                            self.loading.failed = true;
                        }

                    },
                    error: function (req, status, error) {
                        self.loading.failed = true;
                    }
                });

            },
            confirmationPage(confirmation) {
                this.loading.success = true;
                this.confirmation = confirmation;
                this.answers = [];
                window.history.replaceState(null, "step", window.location.pathname + "#confirmation");
            },
            handleState(step) {
                const url = this.step.url ? ("#" + this.step.url) : "";
                window.history.pushState({
                    answers: this.answers,
                    previousStep: this.previousStep,
                    currentStep: step,
                    currentJson: this.currentJson
                }, "step", url || window.location.pathname);
                this.currentStep = step;
            },
            saveFieldsData() {
                const fields = Object.keys(this.$refs.fields.fields);
                const answers = [];
                this.step.fields.forEach((field) => {
                    if(fields.length && fields.indexOf(field.name) !== -1){
                        const fieldValue = {
                            name: field.name,
                            value: this.$refs.fields.fields[field.name],
                            summary: this.step.summary ? this.step.summary : "",
                            summaryLabel: field.summaryLabel ? field.summaryLabel : null
                        };
                        answers.push(fieldValue);
                    }
                });
                this.answers[this.currentStep] = JSON.stringify(answers);
            },
            saveAnswersData(answer) {
                this.answers[this.currentStep] = JSON.stringify({
                    name: this.step.name,
                    value: this.step.multiple ? this.$refs.answers.multipleAnswers : answer.value,
                    summary: this.step.summary ? this.step.summary : "",
                    summaryLabel: this.step.summaryLabel ? this.step.summaryLabel : null
                });
            },
            getJson(jsonName) {
                this.currentJson = jsonName;
                this.step = getConditionalFields(require(jsonName+ '.json'), this.answers);
            },
            getCurrentAnswers() {
                if(this.answers.length && this.answers[this.currentStep]){
                    return JSON.parse(this.answers[this.currentStep])
                }
                return null;
            }
        }
    }

</script>

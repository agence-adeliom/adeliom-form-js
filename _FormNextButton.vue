<template>
    <div class="w-btn">
        <div class="btn btn--secondary-01"
             :class="getBtnStatus()"
             @click="step.lastStep ? nextStep(null, true) : nextStep()">
            {{ getBtnLabel() }}
        </div>
    </div>
</template>

<script>
    export default {
        props: ["step", "disabled", "currentAnswers", "nextStep"],
        data() {
            return {}
        },
        methods: {
            getBtnStatus() {
                if((this.step.multiple && !this.currentAnswers.length) || this.disabled()) {
                    return "btn--disabled";
                }
                return '';
            },
            getBtnLabel() {
                if(this.step.lastStep){
                    return "Envoyer";
                }
                return "Étape suivante";
            }
        }
    }
</script>

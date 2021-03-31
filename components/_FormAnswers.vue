<template>
    <div class="w-answers">
        <div class="answer" :class="{ active: isActive(answer) }" v-for="answer in step.answers">
            <div class="answer__inner" @click="step.multiple ? setAnswer(answer) : nextStep(answer)">
                <span class="label">{{ answer.label }}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ["step", "nextStep", "currentAnswers"],
        data() {
            return {
                multipleAnswers: []
            }
        },
        mounted: function () {
            if(this.step.multiple && this.currentAnswers){
                this.multipleAnswers = this.currentAnswers.value;
            }
        },
        methods: {
            setAnswer: function(answer) {
                const index = this.multipleAnswers.indexOf(answer.value);
                if(index !== -1){
                    this.multipleAnswers.splice(index, 1);
                }
                else{
                    this.multipleAnswers.push(answer.value);
                }
            },
            isActive(answer) {
                if(this.step.multiple && this.multipleAnswers.length){
                    return this.multipleAnswers.indexOf(answer.value) !== -1;
                }
                return this.currentAnswers && this.currentAnswers.value === answer.value;
            }
        }
    }
</script>

<template v-if="summary && summary.length">
    <div class="w-summary">
        <div v-for="item in summary" class="item-summary">
            <div class="headline">{{ item.title }}</div>
            <div class="content" v-html="getSummaryValue(item.value)"></div>
        </div>
    </div>
</template>

<script>

    import {getSummaryData} from '../partials/_utils';

    export default {
        props: ["answers", "currentStep"],
        data() {
            return {}
        },
        computed: {
            summary() {
                return getSummaryData(this.answers, this.currentStep);
            }
        },
        methods: {
            getSummaryValue(value) {
                let content = "";
                if (typeof value === "string") {
                    content = '<p>' + value + '</p>';
                } else {
                    value.forEach((val) => {
                        content += '<p>' + val + '</p>';
                    });
                }
                return content;
            }
        }
    }

</script>

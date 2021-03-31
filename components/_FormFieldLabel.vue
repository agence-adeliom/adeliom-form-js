<template v-if="field.label">

    <label :for="[[ field.name ]]" v-if="(field.type === 'radio' || field.type === 'checkbox') || field.required">
        {{ field.label }}
    </label>

    <label class="title h5" :for="[[ field.name ]]" v-else>
        {{ field.label }}
        <span class="notrequired">(facultatif)</span>
    </label>

</template>

<script>
    export default {
        props: ["field"],
        data() {
            return {}
        }
    }
</script>

<template>
    <div class="form-group" :class="{ error: hasErrors }">
        <slot/>
        <span class="error-msg" v-if="hasErrors">
            {{ firstErrorMessage }}
        </span>
    </div>
</template>

<script>
    import { singleErrorExtractorMixin } from 'vuelidate-error-extractor'
    export default {
        mixins: [singleErrorExtractorMixin]
    }
</script>

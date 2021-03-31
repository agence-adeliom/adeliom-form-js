<template>
    <div class="backto">
        <div class="p" @click="prevStep">
            Étape précédente
        </div>
    </div>
</template>

<script>
    export default {
        props: ["prevStep"],
        data() {
            return {}
        }
    }
</script>

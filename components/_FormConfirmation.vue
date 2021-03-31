<template>
    <div class="loading">

        <div class="loader" :class="{completed: loading.success || loading.failed}">
            <div class="circle-loader"
                 :class="{'load-complete': (loading.completed || loading.failed), 'load-success': (loading.completed && !loading.failure), 'load-failure': loading.failed}">
                <div class="checkmark draw" :class="{'is-visible': loading.completed}"></div>
            </div>
        </div>

        <transition name="fade">
            <div class="success" v-if="loading && loading.success">
                <div class="headline">C'est envoyé</div>
                <div class="title h5">{{ confirmation.title }}</div>
                <p>{{ confirmation.description }}</p>
                <a href="/" class="btn btn--secondary-01">Retour au site</a>
            </div>
        </transition>

        <transition name="fade">
            <div class="success" v-if="loading && loading.failed">
                <div class="headline">Erreur</div>
                <div class="title h5">Une erreur est survenue</div>
                <p>Une erreur s'est produite, votre demande n'a pas été enregistrée. Merci de bien vouloir réessayer ultérieurement."</p>
                <a href="/" class="btn btn--secondary-01">Retour au site</a>
            </div>
        </transition>

    </div>
</template>

<script>
    export default {
        props: ["loading", "confirmation"],
        data() {
            return {}
        }
    }
</script>

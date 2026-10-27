<template>
    <ScrollRevealText tag="p"
                      class="eq-h6"
                      :content="localize(item.locales, 'description')"/>
</template>

<script setup>
import {inject} from "vue"
import ScrollRevealText from "/src/vue/components/widgets/ScrollRevealText.vue"

const props = defineProps({
    item: {
        /** @type {ArticleItem} **/
        type: Object,
        required: true
    }
})

/** @type {Function} */
const localize = inject("localize")
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>
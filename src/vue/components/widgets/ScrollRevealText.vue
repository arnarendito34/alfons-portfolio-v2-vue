<template>
    <component :is="tag"
               ref="root"
               class="scroll-reveal-text"
               v-html="revealHtml"/>
</template>

<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue"
import {buildRevealHtml} from "/src/composables/htmlTextReveal.js"
import {getScrollAnimationsEngine} from "/src/composables/scrollAnimations.js"

const props = defineProps({
    content: {
        type: String,
        default: ""
    },
    tag: {
        type: String,
        default: "p"
    }
})

const root = ref(null)
const revealHtml = computed(() => buildRevealHtml(props.content))

onMounted(() => {
    if(root.value)
        getScrollAnimationsEngine().registerText(root.value)
})

onUnmounted(() => {
    if(root.value)
        getScrollAnimationsEngine().unregisterText(root.value)
})

watch(() => props.content, () => {
    nextTick(() => getScrollAnimationsEngine().requestUpdate())
})
</script>

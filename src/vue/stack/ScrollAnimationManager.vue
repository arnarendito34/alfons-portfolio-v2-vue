<template>
    <span class="scroll-animation-manager" aria-hidden="true"/>
</template>

<script setup>
import {inject, onMounted, onUnmounted, watch} from "vue"
import {getScrollAnimationsEngine} from "/src/composables/scrollAnimations.js"

/** @type {{value: Boolean}|null} */
const canScroll = inject("canScroll", null)

const engine = getScrollAnimationsEngine()

const _syncReadiness = () => {
    engine.setReady(canScroll ? Boolean(canScroll.value) : true)
}

onMounted(() => {
    engine.connect()
    _syncReadiness()
})

watch(() => canScroll?.value, _syncReadiness)

onUnmounted(() => {
    engine.setReady(false)
    engine.disconnect()
})
</script>

<style lang="scss" scoped>
span.scroll-animation-manager {
    display: none;
}
</style>

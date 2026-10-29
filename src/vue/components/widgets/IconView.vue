<template>
    <div class="icon-view">
        <ImageView v-if="showImageView"
                   :src="img"
                   :spinner-enabled="true"
                   :resolve-path="true"
                   ref="imageView"
                   alt="ico"/>

        <div v-else
             class="fa-icon-view"
             :style="`background-color:${backgroundColor || fallbackIconBackgroundColor}`">
            <i :class="faIcon || fallbackIcon"
               :style="`color:${fillColor || fallbackIconFillColor}`"/>
        </div>
    </div>
</template>

<script setup>
import ImageView from "/src/vue/components/widgets/ImageView.vue"
import {computed, ref} from "vue"

const props = defineProps({
    img: String,
    faIcon: String,
    backgroundColor: String,
    fillColor: String,
    prioritizeImage: Boolean,
    transparency: Boolean
})

const imageView = ref(null)

const showImageView = computed(() => {
    return props.img && props.prioritizeImage
})

const fallbackIcon = computed(() => {
    if(props.transparency)
        return null

    return `fa-solid fa-image`
})

const fallbackIconBackgroundColor = computed(() => {
    if(props.backgroundColor)
        return props.backgroundColor
    if(props.transparency)
        return `transparent`
    return `var(--bs-primary)`
})

const fallbackIconFillColor = computed(() => {
    if(props.fillColor)
        return props.fillColor
    if(props.transparency)
        return `var(--bs-primary)`

    return `var(--bs-light)`
})

defineExpose({
    imageView
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.icon-view {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
}

div.image-view, div.fa-icon-view {
    width: 100%;
    height: 100%;
}

div.fa-icon-view {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
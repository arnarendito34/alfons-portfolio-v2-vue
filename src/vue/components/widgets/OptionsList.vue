<template>
    <div class="row options-list-row gy-3 gy-lg-4">
        <div v-for="(item, index) in props.items"
             :key="`${item.value}-${index}`"
             v-scroll-reveal="{delay: Math.min(index * 60, 240)}"
             class="col-12 col-md-6 col-lg-12 col-xl-6">
            <div class="options-list-item">
                <IconView class="options-list-icon-view"
                          :fa-icon="item.faIcon"/>

                <div class="option-list-info">
                    <ScrollRevealText tag="h5"
                                      class="mb-0 lead"
                                      :content="item.label"/>

                    <ScrollRevealText v-if="item.href"
                                      tag="a"
                                      :href="item.href"
                                      target="_blank"
                                      class="m-0 text-3 link-masked"
                                      :content="item.value"/>

                    <ScrollRevealText v-else
                                      tag="a"
                                      class="m-0 text-3 text-light-7"
                                      :content="item.value"/>

                    <CopyButton v-if="item.copy"
                                class="ms-1"
                                :text="item.value"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import IconView from "/src/vue/components/widgets/IconView.vue"
import CopyButton from "/src/vue/components/widgets/CopyButton.vue"
import ScrollRevealText from "/src/vue/components/widgets/ScrollRevealText.vue"

const props = defineProps({
    items:Array
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.options-list-item {
    --icon-size: 62px;
    @include media-breakpoint-down(xxl) {--icon-size: 58px;}
    @include media-breakpoint-down(xl) {--icon-size: 52px;}
    @include media-breakpoint-down(md) {--icon-size: 48px;}
    @include media-breakpoint-down(sm) {--icon-size: 46px;}
    display: flex;
    align-items: center;

    div.options-list-icon-view {
        width: var(--icon-size);
        height: var(--icon-size);
        font-size: calc(var(--icon-size)/2);
        border-radius: 30%;
        overflow: hidden;
    }

    div.option-list-info {
        margin-left: calc(var(--icon-size)/3);
    }

    h5 {
        text-transform: capitalize;
        font-weight: bold;
        margin-top: 2px;
    }
}
</style>
<template>
    <nav class="nav-mobile-header"
         id="nav-mobile-header">
        <NavProfileCard :avatar="profile.profilePictureUrl"
                        :name="localize(profile.locales, 'name', true) || profile.name"
                        :role="localize(profile.locales, 'role')"
                        :shrink="false"
                        :include-toggle-button="false"
                        @toggle="null"/>

        <ThemePicker :shrink="true"
                     :align-end="utils.isChromeOS()"
                     :class="utils.isChromeOS() ? `theme-picker-right` : `theme-picker-left`"/>

        <LanguagePicker :shrink="true"
                        :class="utils.isChromeOS() ? `language-picker-left` : `language-picker-right`"/>
    </nav>
</template>

<script setup>
import {inject} from "vue"
import NavProfileCard from "/src/vue/components/navigation/layout/NavProfileCard.vue"
import LanguagePicker from "/src/vue/components/widgets/LanguagePicker.vue"
import ThemePicker from "/src/vue/components/widgets/ThemePicker.vue"
import {useUtils} from "/src/composables/utils.js"

const utils = useUtils()

/** @type {{value: Profile}} */
const profile = inject("profile")

/** @type {Function} */
const localize = inject("localize")
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

nav.nav-mobile-header {
    background-color: $nav-background;
    @include media-breakpoint-up($navigation-sidebar-breakpoint) {
        display: none;
    }

    position: relative;
}

div.language-picker, div.theme-picker {
    position: absolute;
    top: 5px;
    right: 5px;
}

div.language-picker-left, div.theme-picker-left {
    left: 5px;
    right: auto;
}

div.theme-picker-right {
    right: 5px;
    left: auto;
}
</style>
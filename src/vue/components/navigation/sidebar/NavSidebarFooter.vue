<template>
    <div class="nav-sidebar-footer">
        <div class="nav-sidebar-footer-controls">
            <ThemePicker :shrink="shrink"/>
            <LanguagePicker :shrink="shrink"/>
        </div>
        <div v-if="!shrink"
             class="nav-sidebar-footer-credits">
            <span v-html="credits"/>
        </div>
    </div>
</template>

<script setup>
import LanguagePicker from "/src/vue/components/widgets/LanguagePicker.vue"
import ThemePicker from "/src/vue/components/widgets/ThemePicker.vue"

const props = defineProps({
    credits: String,
    shrink: Boolean
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.nav-sidebar-footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 10px 20px;
    min-height: $nav-sidebar-footer-height;

    @media (max-height: $nav-sidebar-footer-compress-screen-height) {
        min-height: $nav-sidebar-footer-height-compressed;
        padding: 5px 5px;
    }
}

div.nav-sidebar-footer-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    width: 100%;
    max-width: 100%;
    padding-bottom: 5px;
    @media (max-height: 650px) {
        padding-bottom: 0;
    }
}

:deep(.theme-picker-shrink button.dropdown-toggle),
:deep(.language-picker-shrink button.dropdown-toggle) {
    padding-left: 9px;
    padding-right: 9px;
}

:deep(.theme-picker-shrink button.dropdown-toggle > i.fa-caret-down),
:deep(.language-picker-shrink button.dropdown-toggle > i.fa-caret-down) {
    display: none;
}

div.nav-sidebar-footer-credits {
    width: 100%;
    text-align: center;
    color: $light-5;
    font-size: 0.9rem;

    @media (max-height: 650px) {
        font-size: 0.85rem;
    }

    @media (max-height: $nav-sidebar-footer-compress-screen-height) {
        display: none;
    }
}
</style>
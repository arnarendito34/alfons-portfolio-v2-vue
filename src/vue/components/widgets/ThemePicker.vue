<template>
    <div class="theme-picker" :class="{ 'theme-picker-shrink': shouldCompress }">
        <div class="dropdown">
            <button class="dropdown-toggle theme-picker-toggle"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                    :aria-label="localizeFromStrings('appearance')"
                    :title="localizeFromStrings('appearance')">
                <span class="theme-picker-swatch"
                      :style="_getSwatchStyle(selectedTheme)"/>

                <span v-if="!shouldCompress"
                      class="theme-picker-label"
                      v-html="localizeFromStrings('appearance')"/>

                <i class="fa-solid fa-caret-down ms-1"/>
            </button>

            <ul class="dropdown-menu theme-picker-menu"
                :class="{ 'dropdown-menu-end': alignEnd }">
                <li>
                    <div class="theme-picker-heading"
                         v-html="localizeFromStrings('color_mode')"/>

                    <div class="theme-picker-mode-switch">
                        <button v-for="mode in availableThemeModes"
                                :key="mode.id"
                                class="theme-picker-mode-option"
                                :class="{ 'theme-picker-mode-option-active': selectedMode === mode.id }"
                                :aria-pressed="selectedMode === mode.id"
                                @click="_onModeSelected(mode)">
                            <i :class="mode.faIcon"/>
                            <span v-html="localizeFromStrings(mode.labelKey)"/>
                        </button>
                    </div>
                </li>

                <li><hr class="theme-picker-divider"/></li>

                <li>
                    <div class="theme-picker-heading"
                         v-html="localizeFromStrings('color_theme')"/>

                    <div class="theme-picker-themes">
                        <button v-for="theme in availableColorThemes"
                                :key="theme.id"
                                class="theme-picker-theme-option"
                                :class="{ 'theme-picker-theme-option-active': selectedTheme.id === theme.id }"
                                :aria-pressed="selectedTheme.id === theme.id"
                                :title="theme.name"
                                @click="_onThemeSelected(theme)">
                            <span class="theme-picker-theme-dot"
                                  :style="_getSwatchStyle(theme)"/>
                            <span class="theme-picker-theme-name"
                                  v-html="theme.name"/>
                            <i v-if="selectedTheme.id === theme.id"
                               class="fa-solid fa-check theme-picker-theme-check"/>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import {computed, inject} from "vue"

const props = defineProps({
    shrink: Boolean,
    alignEnd: Boolean
})

/** @type {{value:Boolean}} */
const isMobileLayout = inject("isMobileLayout")

/** @type {{value:String}} */
const selectedMode = inject("selectedMode")

/** @type {{value:Object}} */
const selectedTheme = inject("selectedTheme")

/** @type {Object[]} */
const availableThemeModes = inject("availableThemeModes")

/** @type {Object[]} */
const availableColorThemes = inject("availableColorThemes")

/** @type {Function} */
const setThemeModeWithId = inject("setThemeModeWithId")

/** @type {Function} */
const setColorThemeWithId = inject("setColorThemeWithId")

/** @type {Function} */
const localizeFromStrings = inject("localizeFromStrings")

const shouldCompress = computed(() => {
    return props.shrink || isMobileLayout.value
})

const _getSwatchStyle = (theme) => {
    return {
        "--theme-swatch-a": theme.swatch[0],
        "--theme-swatch-b": theme.swatch[1]
    }
}

const _onModeSelected = (mode) => {
    setThemeModeWithId(mode.id)
}

const _onThemeSelected = (theme) => {
    setColorThemeWithId(theme.id)
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.theme-picker {
    display: flex;
    align-items: center;
    justify-content: center;
}

button.theme-picker-toggle {
    display: flex;
    align-items: center;
    justify-content: center;

    border-width: 0;
    background-color: transparent;
    padding: 10px 12px;
    border-radius: $default-border-radius;
    color: $nav-contrast;
    opacity: 0.9;
    outline: none;

    &:hover,
    &:focus-visible {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.06);
    }

    &:after {
        display: none;
    }
}

span.theme-picker-swatch {
    width: 24px;
    height: 24px;
    min-width: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--theme-swatch-a), var(--theme-swatch-b));
    border: 2px solid rgba(255, 255, 255, 0.35);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.06);
}

span.theme-picker-label {
    margin-left: 9px;
    margin-right: 4px;
    font-size: 0.9rem;
    white-space: nowrap;
}

ul.theme-picker-menu {
    min-width: 248px;
    padding: 12px;
    background-color: var(--theme-sidebar-raised);
    border: 1px solid var(--theme-sidebar-border);
    border-radius: $default-border-radius;
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
}

div.theme-picker-heading {
    margin: 1px 2px 8px;
    color: var(--theme-sidebar-muted);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
}

div.theme-picker-mode-switch {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
}

button.theme-picker-mode-option {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;

    padding: 8px 10px;
    border: 1px solid var(--theme-sidebar-border);
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.035);
    color: var(--theme-sidebar-muted);
    font-size: 0.84rem;
    transition: 0.18s ease;

    &:hover {
        color: var(--theme-sidebar-contrast);
        border-color: var(--theme-sidebar-border-strong);
        background-color: rgba(255, 255, 255, 0.07);
    }
}

button.theme-picker-mode-option-active {
    color: #ffffff;
    border-color: var(--theme-primary);
    background-color: var(--theme-primary);

    &:hover {
        color: #ffffff;
        border-color: var(--theme-primary-hover);
        background-color: var(--theme-primary-hover);
    }
}

hr.theme-picker-divider {
    margin: 11px 0;
    border-color: var(--theme-sidebar-border);
    opacity: 1;
}

div.theme-picker-themes {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

button.theme-picker-theme-option {
    display: flex;
    align-items: center;
    gap: 9px;

    width: 100%;
    padding: 7px 8px;
    border: 1px solid transparent;
    border-radius: 8px;
    background-color: transparent;
    color: var(--theme-sidebar-muted);
    font-size: 0.88rem;
    text-align: left;
    transition: 0.18s ease;

    &:hover {
        color: var(--theme-sidebar-contrast);
        background-color: rgba(255, 255, 255, 0.06);
    }
}

button.theme-picker-theme-option-active {
    color: var(--theme-sidebar-contrast);
    border-color: var(--theme-sidebar-border-strong);
    background-color: rgba(255, 255, 255, 0.075);
}

span.theme-picker-theme-dot {
    width: 18px;
    height: 18px;
    min-width: 18px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--theme-swatch-a), var(--theme-swatch-b));
    border: 2px solid rgba(255, 255, 255, 0.2);
}

span.theme-picker-theme-name {
    flex-grow: 1;
}

i.theme-picker-theme-check {
    color: var(--theme-primary-highlight);
    font-size: 0.78rem;
}

div.theme-picker-shrink {
    button.theme-picker-toggle {
        padding: 10px;
    }
}
</style>

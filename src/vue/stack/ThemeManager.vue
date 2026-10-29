<template>
    <slot v-if="selectedMode && selectedTheme"/>
</template>

<script setup>
import {provide, readonly, ref, watch} from "vue"

const modeStorageId = "theme-manager-mode"
const themeStorageId = "theme-manager-theme"

const availableThemeModes = [
    { id: "light", labelKey: "light_mode", faIcon: "fa-solid fa-sun" },
    { id: "dark", labelKey: "dark_mode", faIcon: "fa-solid fa-moon" }
]

const availableColorThemes = [
    {
        id: "violet",
        name: "Violet",
        swatch: ["#7e45dc", "#ddb8ff"]
    },
    {
        id: "ocean",
        name: "Ocean",
        swatch: ["#0f7f91", "#8ce7f2"]
    },
    {
        id: "forest",
        name: "Forest",
        swatch: ["#2f8f62", "#a7f3d0"]
    },
    {
        id: "sunset",
        name: "Sunset",
        swatch: ["#d1583f", "#ffd27a"]
    }
]

const _isSupportedMode = (id) => {
    return availableThemeModes.some(mode => mode.id === id)
}

const _isSupportedTheme = (id) => {
    return availableColorThemes.some(theme => theme.id === id)
}

const _getSavedValue = (storageId) => {
    try {
        return window.localStorage.getItem(storageId)
    } catch {
        return null
    }
}

const _getSystemMode = () => {
    if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
        return "dark"
    return "light"
}

const _getInitialMode = () => {
    const preloadedMode = document.documentElement.dataset.mode
    if(_isSupportedMode(preloadedMode))
        return preloadedMode

    const savedMode = _getSavedValue(modeStorageId)
    if(_isSupportedMode(savedMode))
        return savedMode

    return _getSystemMode()
}

const _getInitialTheme = () => {
    const preloadedTheme = document.documentElement.dataset.theme
    if(_isSupportedTheme(preloadedTheme))
        return preloadedTheme

    const savedTheme = _getSavedValue(themeStorageId)
    if(_isSupportedTheme(savedTheme))
        return savedTheme

    return availableColorThemes[0].id
}

const selectedMode = ref(_getInitialMode())
const selectedTheme = ref(
    availableColorThemes.find(theme => theme.id === _getInitialTheme())
)

const setThemeModeWithId = (modeId) => {
    const targetMode = availableThemeModes.find(mode => mode.id === modeId)
    if(targetMode)
        selectedMode.value = targetMode.id
}

const setColorThemeWithId = (themeId) => {
    const targetTheme = availableColorThemes.find(theme => theme.id === themeId)
    if(targetTheme)
        selectedTheme.value = targetTheme
}

const setSelectedMode = (mode) => setThemeModeWithId(mode?.id)
const setSelectedTheme = (theme) => setColorThemeWithId(theme?.id)

const toggleSelectedMode = () => {
    setThemeModeWithId(selectedMode.value === "dark" ? "light" : "dark")
}

const _applyTheme = () => {
    const root = document.documentElement
    root.dataset.mode = selectedMode.value
    root.dataset.theme = selectedTheme.value.id
    root.style.colorScheme = selectedMode.value

    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if(themeColorMeta) {
        themeColorMeta.setAttribute(
            "content",
            selectedMode.value === "dark" ? "#0b0814" : "#f4f0f7"
        )
    }

    try {
        window.localStorage.setItem(modeStorageId, selectedMode.value)
        window.localStorage.setItem(themeStorageId, selectedTheme.value.id)
    } catch {
        return
    }
}

watch([selectedMode, selectedTheme], _applyTheme, {immediate: true})

window.requestAnimationFrame(() => {
    document.documentElement.classList.add("theme-transitions-ready")
})

provide("selectedMode", readonly(selectedMode))
provide("selectedTheme", readonly(selectedTheme))
provide("availableThemeModes", availableThemeModes)
provide("availableColorThemes", availableColorThemes)
provide("setThemeModeWithId", setThemeModeWithId)
provide("setColorThemeWithId", setColorThemeWithId)
provide("setSelectedMode", setSelectedMode)
provide("setSelectedTheme", setSelectedTheme)
provide("toggleSelectedMode", toggleSelectedMode)
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";
</style>

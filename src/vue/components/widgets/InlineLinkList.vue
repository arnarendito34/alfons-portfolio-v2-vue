<template>
    <ul class="inline-list eq-h6">
        <li v-for="item in items" class="inline-list-item">
            <a :class="item.href ? `link-darkened` : `link-disabled`" :href="item.href">
                <i v-if="item.faIcon" :class="item.faIcon"/>
                <span v-html="item.getValue(localize, true)"/>
            </a>
        </li>
    </ul>
</template>

<script setup>
import {inject} from "vue"

const props = defineProps({
    items: Array,
})

/** @type {Function} */
const localize = inject("localize")
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

ul.inline-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    @include media-breakpoint-down(xl) {
        flex-direction: column;
        align-items: flex-start;
    }
}

li.inline-list-item {
    a {
        display: inline-flex;
        align-items: center;
        gap: 9px;

        padding: 6px 13px;
        border: 1px solid var(--theme-border);
        border-radius: 999px;
        background-color: var(--theme-surface-muted);
        text-decoration: none;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;

        &:hover {
            border-color: var(--theme-primary);
            background-color: var(--theme-surface-solid);
            box-shadow: var(--theme-shadow-soft);
            transform: translateY(-1px);
        }
    }

    i {
        margin-right: 0;
        color: var(--theme-accent-text);
    }

    &:not(:last-child)::after {
        display: none;
    }

    @include media-breakpoint-down(xl) {
        i {
            min-width: 20px;
            text-align: center;
        }
    }
}
</style>
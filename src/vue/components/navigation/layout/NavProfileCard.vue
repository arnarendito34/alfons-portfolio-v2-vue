<template>
    <div class="nav-profile-card" :class="{'nav-profile-card-shrink': shrink}">
        <div class="nav-profile-card-avatar">
            <ImageView :src="avatar"
                       :alt="name"
                       :resolve-path="true"
                       class="nav-profile-card-image-view"
                       image-class="rounded-circle"/>
        </div>

        <h4 class="nav-profile-card-title"
            v-html="name"/>

        <h6 class="nav-profile-card-role"
            v-html="role"/>

        <NavToggleButton v-if="includeToggleButton"
                         :toggled="shrink"
                         @click="_onToggleButton"/>
    </div>
</template>

<script setup>
import ImageView from "/src/vue/components/widgets/ImageView.vue"
import NavToggleButton from "/src/vue/components/navigation/layout/NavToggleButton.vue"

const props = defineProps({
    shrink: Boolean,
    avatar: String,
    name: String,
    role: String,
    includeToggleButton: Boolean
})

const emit = defineEmits(['toggle'])

const _onToggleButton = () => {
    emit('toggle')
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

div.nav-profile-card {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    color: $nav-contrast;
    position: relative;

    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        padding: 30px;
    }
}

div.nav-profile-card-avatar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 50%;
    isolation: isolate;

    &::before {
        content: "";
        position: absolute;
        inset: -8px;
        z-index: -1;
        border-radius: 50%;
        background: conic-gradient(
            from var(--nav-avatar-rgb-angle),
            #ff004c, #ff8a00, #ffe600, #00ff66, #00c8ff, #4c00ff, #ff004c
        );
        filter: blur(14px);
        opacity: 0.65;
        animation:
            nav-avatar-rgb-spin 4s linear infinite,
            nav-avatar-rgb-pulse 3s ease-in-out infinite;

        @include media-breakpoint-down(sm) {
            inset: -5px;
            filter: blur(9px);
        }

        @media (prefers-reduced-motion: reduce) {
            animation: none;
        }
    }
}

div.nav-profile-card-image-view {
    --max-height:clamp(130px, 22.5vh, 160px);
    --border-width:3px;

    @include media-breakpoint-down(lg) {
        --max-height:140px;
    }

    @include media-breakpoint-down(sm) {
        --border-width: 2px;
        --max-height: clamp(80px, 19.5vh, 110px);
    }

    min-width: calc(var(--max-height)/2);
    min-height: calc(var(--max-height)/2);
    width: var(--max-height);
    height: var(--max-height);
    border: var(--border-width) solid transparent;
    padding: 4px;
    border-radius: 50%;
    background:
        linear-gradient($nav-background, $nav-background) padding-box,
        conic-gradient(
            from var(--nav-avatar-rgb-angle),
            #ff004c, #ff8a00, #ffe600, #00ff66, #00c8ff, #4c00ff, #ff004c
        ) border-box;
    animation: nav-avatar-rgb-spin 4s linear infinite;

    overflow: hidden;
    user-select: none;
    pointer-events: none;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
}

@property --nav-avatar-rgb-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
}

@keyframes nav-avatar-rgb-spin {
    to {
        --nav-avatar-rgb-angle: 360deg;
    }
}

@keyframes nav-avatar-rgb-pulse {
    0%, 100% {
        opacity: 0.55;
        transform: scale(0.97);
    }

    50% {
        opacity: 0.9;
        transform: scale(1.05);
    }
}

h4.nav-profile-card-title {
    margin-top: 17px;
    text-transform: uppercase;
    opacity: 0.95;
    letter-spacing: 0.15rem;
    font-size: 1.25rem;
    text-align: center;
    
    @media (max-height: 660px) {
        margin-top: 15px;
        font-size: 1.175rem;
        margin-bottom: 5px;
    }

    @media (max-height: 580px) {
        margin-top: 12px;
        font-size: 1.1rem;
    }

    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        margin-top: 15px;
        font-size: 1.1rem;
    }

    @include media-breakpoint-down(sm) {
        font-size: 1.05rem;
    }
}

h6.nav-profile-card-role {
    font-size: 1rem;
    color: $nav-highlight;
    opacity: 0.9;
    margin-bottom: 0;

    @media (max-height: 660px) {
        font-size: 0.95rem;
    }

    @media (max-height: 580px) {
        font-size: 0.9rem;
    }

    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        font-size: 0.95rem;
    }

    @include media-breakpoint-down(sm) {
        font-size: 0.9rem;
    }
}

button.nav-toggle-button {
    position: absolute;
    top: clamp(110px, 20vh, 140px);
    left: 90px;
    @include media-breakpoint-down(xl) {
        left: 75px;
    }
}

div.nav-profile-card-shrink {
    h4.nav-profile-card-title, h6.nav-profile-card-role {
        display: none;
    }

    div.nav-profile-card-image-view {
        width: calc($nav-sidebar-width-shrink - 30px);
        height: calc($nav-sidebar-width-shrink - 30px);
        border-width: 2px;
        padding: 3px;
    }

    button.nav-toggle-button {
        position: absolute;
        top: 80px;
        left: 80px;
    }
}
</style>
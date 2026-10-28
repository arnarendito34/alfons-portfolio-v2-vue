import {getScrollAnimationsEngine} from "/src/composables/scrollAnimations.js"

const REVEAL_DIRECTIONS = ["up", "down", "left", "right", "scale"]

/**
 * @param {*} binding
 * @return {{delay: Number, direction: String, disabled: Boolean}}
 */
const parseRevealBinding = (binding) => {
    const value = binding.value
    const objectValue = value && typeof value === "object" ? value : {}

    let direction = objectValue.direction
    if(!direction) {
        direction = REVEAL_DIRECTIONS.find(item => binding.modifiers[item])
    }

    return {
        delay: Number(objectValue.delay || (typeof value === "number" ? value : 0)) || 0,
        direction: REVEAL_DIRECTIONS.includes(direction) ? direction : "up",
        disabled: Boolean(objectValue.disabled)
    }
}

/**
 * @param {HTMLElement} element
 * @param {String} direction
 */
const applyRevealStyles = (element, direction) => {
    for(const item of REVEAL_DIRECTIONS) {
        element.classList.remove(`scroll-reveal-from-${item}`)
    }

    element.classList.add("scroll-reveal", `scroll-reveal-from-${direction}`)
}

/**
 * @param {HTMLElement} element
 * @param {Number} delay
 */
const applyRevealDelay = (element, delay) => {
    if(delay > 0)
        element.style.setProperty("--reveal-delay", `${delay}ms`)
    else
        element.style.removeProperty("--reveal-delay")
}

const clearRevealStyles = (element) => {
    for(const item of REVEAL_DIRECTIONS) {
        element.classList.remove(`scroll-reveal-from-${item}`)
    }

    element.classList.remove("scroll-reveal")
    element.style.removeProperty("--reveal-delay")
    element._scrollRevealDirection = null
}

export const scrollReveal = {
    mounted(element, binding) {
        const settings = parseRevealBinding(binding)
        element._scrollRevealDisabled = settings.disabled
        if(settings.disabled)
            return

        applyRevealStyles(element, settings.direction)
        applyRevealDelay(element, settings.delay)
        element._scrollRevealDirection = settings.direction
        getScrollAnimationsEngine().registerReveal(element)
    },

    updated(element, binding) {
        const settings = parseRevealBinding(binding)

        if(settings.disabled) {
            if(!element._scrollRevealDisabled)
                getScrollAnimationsEngine().unregisterReveal(element)

            element._scrollRevealDisabled = true
            clearRevealStyles(element)
            return
        }

        if(element._scrollRevealDisabled) {
            element._scrollRevealDisabled = false
            applyRevealStyles(element, settings.direction)
            applyRevealDelay(element, settings.delay)
            element._scrollRevealDirection = settings.direction
            getScrollAnimationsEngine().registerReveal(element)
            return
        }

        if(element._scrollRevealDirection !== settings.direction) {
            applyRevealStyles(element, settings.direction)
            element._scrollRevealDirection = settings.direction
        }
        applyRevealDelay(element, settings.delay)
    },

    unmounted(element) {
        getScrollAnimationsEngine().unregisterReveal(element)
    }
}

export const scrollParallax = {
    mounted(element, binding) {
        const amplitude = Number(binding.value)
        if(amplitude > 0)
            element.dataset.parallaxAmplitude = String(amplitude)
        element.classList.add("scroll-parallax")
        getScrollAnimationsEngine().registerParallax(element)
    },

    updated(element, binding) {
        const amplitude = Number(binding.value)
        if(amplitude > 0)
            element.dataset.parallaxAmplitude = String(amplitude)
        else
            delete element.dataset.parallaxAmplitude
    },

    unmounted(element) {
        element.classList.remove("scroll-parallax")
        getScrollAnimationsEngine().unregisterParallax(element)
    }
}

const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max)
}

class ScrollAnimationsEngine {
    constructor() {
        this._connected = false
        this._ready = false
        this._rafId = null
        this._textElements = new Set()
        this._revealElements = new Set()
        this._parallaxElements = new Set()
        this._visibleTextElements = new Set()
        this._visibleRevealElements = new Set()
        this._visibleParallaxElements = new Set()
        this._textObserver = null
        this._revealObserver = null
        this._parallaxObserver = null
        this._resizeObserver = null

        this._onScroll = () => this.requestUpdate()
        this._onResize = () => this.requestUpdate()
        this._onTextIntersection = (entries) => this._handleIntersection(entries, this._visibleTextElements, false)
        this._onParallaxIntersection = (entries) => this._handleIntersection(entries, this._visibleParallaxElements, false)
        this._onRevealIntersection = (entries) => {
            for(const entry of entries) {
                if(entry.isIntersecting) {
                    this._visibleRevealElements.add(entry.target)
                    if(this._ready)
                        this._revealElement(entry.target)
                }
                else {
                    this._visibleRevealElements.delete(entry.target)
                }
            }
        }
    }

    connect() {
        if(this._connected)
            return

        this._connected = true
        this._createObservers()

        window.addEventListener("scroll", this._onScroll, {passive: true})
        window.addEventListener("resize", this._onResize)
        window.addEventListener("load", this._onResize)
        window.addEventListener("hashchange", this._onResize)

        if(typeof ResizeObserver === "function") {
            this._resizeObserver = new ResizeObserver(() => this.requestUpdate())
            const resume = document.getElementById("resume")
            if(resume)
                this._resizeObserver.observe(resume)
        }

        this._textElements.forEach(element => this._observeElement(element, this._textObserver, this._visibleTextElements))
        this._parallaxElements.forEach(element => this._observeElement(element, this._parallaxObserver, this._visibleParallaxElements))
        this._revealElements.forEach(element => this._observeElement(element, this._revealObserver, this._visibleRevealElements))

        if(document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => this.requestUpdate())
        }

        this.requestUpdate()
    }

    disconnect() {
        if(!this._connected)
            return

        this._connected = false

        window.removeEventListener("scroll", this._onScroll)
        window.removeEventListener("resize", this._onResize)
        window.removeEventListener("load", this._onResize)
        window.removeEventListener("hashchange", this._onResize)

        if(this._rafId !== null) {
            cancelAnimationFrame(this._rafId)
            this._rafId = null
        }

        this._textObserver?.disconnect()
        this._revealObserver?.disconnect()
        this._parallaxObserver?.disconnect()
        this._resizeObserver?.disconnect()

        this._textObserver = null
        this._revealObserver = null
        this._parallaxObserver = null
        this._resizeObserver = null

        this._visibleTextElements.clear()
        this._visibleRevealElements.clear()
        this._visibleParallaxElements.clear()
    }

    /**
     * @param {Boolean} ready
     */
    setReady(ready) {
        const nextReady = Boolean(ready)
        if(this._ready === nextReady && document.body.classList.contains("scroll-animations-ready") === nextReady)
            return

        this._ready = nextReady
        document.body.classList.toggle("scroll-animations-ready", nextReady)

        if(nextReady) {
            requestAnimationFrame(() => {
                this._visibleRevealElements.forEach(element => this._revealElement(element))
                this.requestUpdate()
            })
        }
    }

    /**
     * @param {HTMLElement} element
     */
    registerText(element) {
        if(!element || this._textElements.has(element))
            return

        element.style.setProperty("--scroll-reveal-progress", "0")
        this._textElements.add(element)
        this._observeElement(element, this._textObserver, this._visibleTextElements)
        this.requestUpdate()
    }

    /**
     * @param {HTMLElement} element
     */
    unregisterText(element) {
        if(!element)
            return

        this._textElements.delete(element)
        this._visibleTextElements.delete(element)
        this._textObserver?.unobserve(element)
    }

    /**
     * @param {HTMLElement} element
     */
    registerReveal(element) {
        if(!element || this._revealElements.has(element))
            return

        this._revealElements.add(element)
        this._observeElement(element, this._revealObserver, this._visibleRevealElements)
    }

    /**
     * @param {HTMLElement} element
     */
    unregisterReveal(element) {
        if(!element)
            return

        this._revealElements.delete(element)
        this._visibleRevealElements.delete(element)
        this._revealObserver?.unobserve(element)
    }

    /**
     * @param {HTMLElement} element
     */
    registerParallax(element) {
        if(!element || this._parallaxElements.has(element))
            return

        this._parallaxElements.add(element)
        this._observeElement(element, this._parallaxObserver, this._visibleParallaxElements)
        this.requestUpdate()
    }

    /**
     * @param {HTMLElement} element
     */
    unregisterParallax(element) {
        if(!element)
            return

        this._parallaxElements.delete(element)
        this._visibleParallaxElements.delete(element)
        this._parallaxObserver?.unobserve(element)
    }

    requestUpdate() {
        if(!this._connected || this._rafId !== null)
            return

        this._rafId = requestAnimationFrame(() => {
            this._rafId = null
            this._update()
        })
    }

    _createObservers() {
        if(typeof IntersectionObserver !== "function")
            return

        this._textObserver = new IntersectionObserver(this._onTextIntersection, {
            rootMargin: "30% 0px 30% 0px"
        })

        this._parallaxObserver = new IntersectionObserver(this._onParallaxIntersection, {
            rootMargin: "25% 0px 25% 0px"
        })

        this._revealObserver = new IntersectionObserver(this._onRevealIntersection, {
            rootMargin: "0px 0px -8% 0px",
            threshold: 0.12
        })
    }

    /**
     * @param {HTMLElement} element
     * @param {IntersectionObserver|null} observer
     * @param {Set<HTMLElement>} visibleSet
     */
    _observeElement(element, observer, visibleSet) {
        if(!this._connected)
            return

        if(observer) {
            observer.observe(element)
        }
        else {
            visibleSet.add(element)
            if(visibleSet === this._visibleRevealElements && this._ready)
                this._revealElement(element)
            this.requestUpdate()
        }
    }

    /**
     * @param {IntersectionObserverEntry[]} entries
     * @param {Set<HTMLElement>} visibleSet
     */
    _handleIntersection(entries, visibleSet) {
        for(const entry of entries) {
            if(entry.isIntersecting)
                visibleSet.add(entry.target)
            else
                visibleSet.delete(entry.target)
        }

        this.requestUpdate()
    }

    /**
     * @param {HTMLElement} element
     */
    _revealElement(element) {
        element.classList.add("is-scroll-revealed")
        this._revealObserver?.unobserve(element)
    }

    _update() {
        if(!this._connected)
            return

        this._updateReadingProgress()

        if(!this._ready || this._prefersReducedMotion())
            return

        const viewportHeight = window.innerHeight || 1
        const textStart = viewportHeight * 0.9
        const textEnd = viewportHeight * 0.3

        this._visibleTextElements.forEach(element => {
            if(!this._isRendered(element))
                return

            const rect = element.getBoundingClientRect()
            const travel = Math.max(1, (textStart - textEnd) + rect.height)
            const progress = clamp((textStart - rect.top) / travel, 0, 1)
            element.style.setProperty("--scroll-reveal-progress", progress.toFixed(4))
        })

        this._visibleParallaxElements.forEach(element => {
            if(!this._isRendered(element))
                return

            const rect = element.getBoundingClientRect()
            const amplitude = Number(element.dataset.parallaxAmplitude) || 24
            const relativePosition = clamp(
                (rect.top + rect.height / 2 - viewportHeight / 2) / Math.max(1, viewportHeight / 2 + rect.height / 2),
                -1,
                1
            )

            element.style.setProperty("--parallax-y", `${(-relativePosition * amplitude).toFixed(2)}px`)
        })
    }

    _updateReadingProgress() {
        const root = document.documentElement
        const maximumScroll = Math.max(0, root.scrollHeight - window.innerHeight)
        const progress = maximumScroll > 0 ? clamp(window.scrollY / maximumScroll, 0, 1) : 0

        root.style.setProperty("--reading-progress", progress.toFixed(4))
        root.classList.toggle("has-reading-progress", progress > 0.002)
    }

    /**
     * @param {HTMLElement} element
     * @return {Boolean}
     */
    _isRendered(element) {
        if(!element.isConnected)
            return false

        const style = window.getComputedStyle(element)
        return style.display !== "none" && style.visibility !== "hidden"
    }

    /**
     * @return {Boolean}
     */
    _prefersReducedMotion() {
        return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }
}

let engine = null

/**
 * @return {ScrollAnimationsEngine}
 */
export const getScrollAnimationsEngine = () => {
    if(!engine)
        engine = new ScrollAnimationsEngine()

    return engine
}

<template>
    <Article class="article-gallery"
             :model="model">
        <div class="gallery-grid">
            <div v-for="(item, index) in visibleItems"
                 :key="item.id"
                 class="gallery-card"
                 @click="_openLightbox(index)">
                <img v-if="item.img"
                     :src="utils.resolvePath(item.img)"
                     :alt="localize(item.locales, 'title')"
                     class="gallery-image"/>
                <div v-else class="gallery-fallback">
                    <i :class="item.fallbackFaIcon || 'fa-solid fa-image'"/>
                </div>
                <div class="gallery-overlay">
                    <span v-if="item.dateStart" class="gallery-date" v-html="_formatDate(item.dateStart)"/>
                    <h4 class="gallery-title">{{ localize(item.locales, 'title') }}</h4>
                    <p v-if="shortDescription(item)" class="gallery-description">
                        {{ shortDescription(item) }}
                    </p>
                </div>
            </div>
        </div>

        <div v-if="_hasMoreThanMax" class="gallery-show-more-wrapper">
            <button class="gallery-show-more" @click="_toggleShowAll">
                <i :class="showAll ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"/>
                &nbsp;{{ showAll ? localizeText("show_less", "Show Less") : localizeText("show_more", "Show More") }}
            </button>
        </div>

        <Teleport to="body">
            <div v-if="lightboxItem !== null" class="lightbox" @click.self="_closeLightbox">
                <button class="lightbox-close" @click="_closeLightbox">
                    <i class="fa-solid fa-xmark"/>
                </button>

                <button v-if="_hasPrev" class="lightbox-nav lightbox-prev" @click="_prev">
                    <i class="fa-solid fa-chevron-left"/>
                </button>

                <div class="lightbox-content">
                    <img v-if="lightboxItem.img"
                         :src="utils.resolvePath(lightboxItem.img)"
                         :alt="localize(lightboxItem.locales, 'title')"
                         class="lightbox-image"/>
                    <div class="lightbox-caption">
                        <span v-if="lightboxItem.dateStart" class="lightbox-date" v-html="_formatDate(lightboxItem.dateStart)"/>
                        <h4>{{ localize(lightboxItem.locales, 'title') }}</h4>
                        <p v-if="localize(lightboxItem.locales, 'description')">
                            {{ localize(lightboxItem.locales, 'description') }}
                        </p>
                    </div>
                    <div class="lightbox-counter">
                        {{ _currentIndex + 1 }} / {{ props.model.items.length }}
                    </div>
                </div>

                <button v-if="_hasNext" class="lightbox-nav lightbox-next" @click="_next">
                    <i class="fa-solid fa-chevron-right"/>
                </button>
            </div>
        </Teleport>
    </Article>
</template>

<script setup>
import Article from "/src/vue/components/articles/base/Article.vue"
import {computed, inject, onMounted, onUnmounted, ref} from "vue"
import {useUtils} from "/src/composables/utils.js"

const utils = useUtils()

const props = defineProps({
    model: {
        type: Object,
        required: true
    }
})

/** @type {Function} */
const localize = inject("localize")

/** @type {Object} */
const selectedLanguage = inject("selectedLanguage")

const MAX_VISIBLE = 9
const showAll = ref(false)
const lightboxIndex = ref(null)

const lightboxItem = computed(() => {
    if(lightboxIndex.value === null) return null
    return props.model.items[lightboxIndex.value] || null
})

const _currentIndex = computed(() => {
    return lightboxIndex.value ?? 0
})

const _hasPrev = computed(() => lightboxIndex.value > 0)
const _hasNext = computed(() => lightboxIndex.value < props.model.items.length - 1)
const _hasMoreThanMax = computed(() => props.model.items.length > MAX_VISIBLE)

const visibleItems = computed(() => {
    if(showAll.value) return props.model.items
    return props.model.items.slice(0, MAX_VISIBLE)
})

const shortDescription = (item) => {
    const desc = localize(item.locales, 'description')
    if(!desc) return null
    return desc.length > 100 ? desc.substring(0, 100) + "..." : desc
}

const localizeText = (key, fallback) => {
    return localize(props.model.locales, key) || fallback
}

const _formatDate = (date) => {
    if(!date) return ""
    if(typeof date === "string") return date
    const lang = selectedLanguage?.id || "en"
    return date.toLocaleString(lang, { year: "numeric", month: "short", day: "numeric" })
}

const _openLightbox = (index) => {
    lightboxIndex.value = index
    document.body.style.overflow = "hidden"
}

const _closeLightbox = () => {
    lightboxIndex.value = null
    document.body.style.overflow = ""
}

const _prev = () => {
    if(_hasPrev.value) lightboxIndex.value--
}

const _next = () => {
    if(_hasNext.value) lightboxIndex.value++
}

const _toggleShowAll = () => {
    showAll.value = !showAll.value
}

const _onKeyDown = (e) => {
    if(lightboxIndex.value === null) return
    if(e.key === "Escape") _closeLightbox()
    if(e.key === "ArrowLeft") _prev()
    if(e.key === "ArrowRight") _next()
}

onMounted(() => window.addEventListener("keydown", _onKeyDown))
onUnmounted(() => {
    window.removeEventListener("keydown", _onKeyDown)
    document.body.style.overflow = ""
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 20px 0;
}

.gallery-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    background: darken($default-section-background, 3%);
    cursor: pointer;
}

.gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.gallery-card:hover .gallery-image {
    transform: scale(1.1);
}

.gallery-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: $light-2;
}

.gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.85));
    color: white;
    padding: 25px 15px 15px;
    opacity: 0;
    transition: opacity 0.3s ease;
    text-align: center;
}

.gallery-card:hover .gallery-overlay {
    opacity: 1;
}

.gallery-date {
    display: inline-block;
    font-size: 0.8rem;
    opacity: 0.85;
    margin-bottom: 4px;
}

.gallery-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 4px;
    line-height: 1.3;
}

.gallery-description {
    font-size: 0.8rem;
    margin: 0;
    opacity: 0.85;
    line-height: 1.4;
}

.gallery-show-more-wrapper {
    text-align: center;
    margin-top: 10px;
}

.gallery-show-more {
    background: $primary;
    border: none;
    color: white;
    padding: 10px 32px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background 0.2s, transform 0.15s;
}

.gallery-show-more:hover {
    background: lighten($primary, 10%);
    transform: scale(1.03);
}

.gallery-show-more:active {
    transform: scale(0.97);
}

.lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: lightbox-fade-in 0.25s ease;
}

@keyframes lightbox-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

.lightbox-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    z-index: 10;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.lightbox-close:hover {
    opacity: 1;
}

.lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 2rem;
    padding: 20px 15px;
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s;
    border-radius: 8px;
}

.lightbox-nav:hover {
    background: rgba(255, 255, 255, 0.25);
}

.lightbox-prev {
    left: 20px;
}

.lightbox-next {
    right: 20px;
}

.lightbox-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 90vw;
    max-height: 90vh;
}

.lightbox-image {
    max-width: 90vw;
    max-height: 75vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.lightbox-caption {
    margin-top: 14px;
    text-align: center;
    color: white;
}

.lightbox-date {
    display: inline-block;
    font-size: 0.85rem;
    opacity: 0.7;
    margin-bottom: 6px;
}

.lightbox-caption h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
}

.lightbox-caption p {
    font-size: 0.9rem;
    margin: 4px 0 0;
    opacity: 0.8;
    max-width: 600px;
}

.lightbox-counter {
    margin-top: 12px;
    font-size: 0.8rem;
    opacity: 0.5;
    color: white;
}
</style>

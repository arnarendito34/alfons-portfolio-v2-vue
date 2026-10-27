const CACHE_LIMIT = 300
const cache = new Map()

let segmenter = null

/**
 * @return {Intl.Segmenter|null}
 */
const getSegmenter = () => {
    if(segmenter !== null)
        return segmenter

    if(typeof Intl === "undefined" || typeof Intl.Segmenter !== "function") {
        segmenter = false
        return null
    }

    segmenter = new Intl.Segmenter(undefined, {granularity: "sentence"})
    return segmenter
}

/**
 * @param {String} text
 * @return {Number[]}
 */
const findSentenceBoundaries = (text) => {
    const boundaries = []
    const sentenceSegmenter = getSegmenter()

    if(sentenceSegmenter) {
        for(const segment of sentenceSegmenter.segment(text)) {
            const end = segment.index + segment.segment.length
            if(end > 0 && end < text.length)
                boundaries.push(end)
        }
        return boundaries
    }

    const boundaryRegex = /(?:[.!?…]+["'”’»)\]]*|\n+)(?=\s|$)/g
    let match

    while((match = boundaryRegex.exec(text)) !== null) {
        const end = match.index + match[0].length
        if(end > 0 && end < text.length)
            boundaries.push(end)
    }

    return boundaries
}

/**
 * @param {Number[]} boundaries
 * @param {Number} offset
 * @return {Number}
 */
const findSentenceIndex = (boundaries, offset) => {
    let low = 0
    let high = boundaries.length

    while(low < high) {
        const middle = Math.floor((low + high) / 2)
        if(boundaries[middle] <= offset)
            low = middle + 1
        else
            high = middle
    }

    return low
}

/**
 * @param {Number} index
 * @param {Number} count
 * @return {{scale: Number, offset: Number}}
 */
const getSentenceWindow = (index, count) => {
    const start = (index / count) * 0.85
    const windowSize = Math.min(0.35, Math.max(0.16, 1.2 / count))
    const end = Math.min(1, start + windowSize)
    const scale = 1 / Math.max(0.001, end - start)

    return {
        scale,
        offset: start * scale
    }
}

/**
 * @param {String} content
 * @return {String}
 */
export const buildRevealHtml = (content) => {
    if(typeof content !== "string" || !content.trim().length)
        return content || ""

    if(cache.has(content))
        return cache.get(content)

    const template = document.createElement("template")
    template.innerHTML = content

    const textNodes = []
    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            const parentTag = node.parentElement?.tagName
            if(parentTag === "SCRIPT" || parentTag === "STYLE")
                return NodeFilter.FILTER_REJECT
            return NodeFilter.FILTER_ACCEPT
        }
    })

    let fullText = ""
    let node

    while((node = walker.nextNode()) !== null) {
        textNodes.push({
            node,
            start: fullText.length,
            end: fullText.length + node.data.length
        })
        fullText += node.data
    }

    if(!textNodes.length || !fullText.trim().length)
        return content

    const boundaries = findSentenceBoundaries(fullText)
    const sentenceCount = boundaries.length + 1

    for(const {node, start, end} of textNodes) {
        const fragments = []
        let fragmentStart = start
        let boundaryIndex = findSentenceIndex(boundaries, start)

        while(boundaryIndex < boundaries.length && boundaries[boundaryIndex] < end) {
            const boundary = boundaries[boundaryIndex]
            fragments.push({
                start: fragmentStart,
                end: boundary,
                index: findSentenceIndex(boundaries, fragmentStart)
            })
            fragmentStart = boundary
            boundaryIndex++
        }

        fragments.push({
            start: fragmentStart,
            end,
            index: findSentenceIndex(boundaries, fragmentStart)
        })

        const parent = node.parentNode
        if(!parent)
            continue

        for(const fragment of fragments) {
            const fragmentText = node.data.slice(fragment.start - start, fragment.end - start)
            if(!fragmentText.length)
                continue

            const span = document.createElement("span")
            const sentenceWindow = getSentenceWindow(fragment.index, sentenceCount)

            span.className = "scroll-reveal-sentence"
            span.dataset.sentenceIndex = String(fragment.index)
            span.style.setProperty("--sentence-scale", sentenceWindow.scale.toFixed(4))
            span.style.setProperty("--sentence-offset", sentenceWindow.offset.toFixed(4))
            span.textContent = fragmentText
            parent.insertBefore(span, node)
        }

        parent.removeChild(node)
    }

    const result = template.innerHTML

    if(cache.size >= CACHE_LIMIT)
        cache.delete(cache.keys().next().value)
    cache.set(content, result)

    return result
}

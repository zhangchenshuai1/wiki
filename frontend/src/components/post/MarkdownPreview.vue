<template>
    <div class="markdown-body" v-html="renderedHTML" @click="onClick" />
    <div v-if="previewUrl" class="image-overlay" @click="previewUrl = null">
        <img :src="previewUrl" class="preview-image" @click.stop />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { renderMarkdown, highlightCode } from '../../composables/useMarkdown'

const props = defineProps<{ content: string }>()

const previewUrl = ref('')

const renderedHTML = computed(() => {
    const html = renderMarkdown(props.content)
    return highlightCode(html)
})

function onClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
        previewUrl.value = (target as HTMLImageElement).src
    }
}
</script>

<style scoped>
.markdown-body {
    line-height: 1.8;
    font-size: 16px;
    color: var(--el-text-color-primary);
}
.markdown-body :deep(h1) { font-size: 28px; margin: 24px 0 16px; }
.markdown-body :deep(h2) { font-size: 24px; margin: 20px 0 14px; border-bottom: 1px solid var(--el-border-color-light); padding-bottom: 8px; }
.markdown-body :deep(h3) { font-size: 20px; margin: 16px 0 12px; }
.markdown-body :deep(p) { margin: 12px 0; }
.markdown-body :deep(code) { background: var(--el-fill-color-light); padding: 2px 6px; border-radius: 3px; font-size: 14px; }
.markdown-body :deep(pre) { background: #1e1e2e; border-radius: 8px; padding: 16px; overflow-x: auto; margin: 16px 0; }
.markdown-body :deep(pre code) { background: none; padding: 0; color: #cdd6f4; }
.markdown-body :deep(blockquote) { border-left: 4px solid var(--el-color-primary); padding: 8px 16px; margin: 16px 0; background: var(--el-fill-color-light); border-radius: 0 8px 8px 0; }
.markdown-body :deep(table) { border-collapse: collapse; width: 100%; margin: 16px 0; }
.markdown-body :deep(th), .markdown-body :deep(td) { border: 1px solid var(--el-border-color); padding: 8px 12px; text-align: left; }
.markdown-body :deep(th) { background: var(--el-fill-color); }
.markdown-body :deep(img) { max-width: 100%; border-radius: 8px; cursor: pointer; }
.markdown-body :deep(ul), .markdown-body :deep(ol) { padding-left: 24px; margin: 12px 0; }
.markdown-body :deep(a) { color: var(--el-color-primary); }

.image-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.preview-image {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
}
</style>

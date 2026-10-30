import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

marked.setOptions({
    breaks: true,
    gfm: true,
})

export function renderMarkdown(raw: string): string {
    if (!raw) return ''
    const html = marked.parse(raw) as string
    return html
}

export function highlightCode(html: string): string {
    return html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (_match, lang, code) => {
        try {
            const result = hljs.highlight(code, { language: lang })
            return `<pre><code class="hljs language-${lang}">${result.value}</code></pre>`
        } catch {
            const result = hljs.highlightAuto(code)
            return `<pre><code class="hljs">${result.value}</code></pre>`
        }
    })
}

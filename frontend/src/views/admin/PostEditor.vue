<template>
    <div class="editor-page">
        <h2>{{ isEdit ? '编辑文章' : '写文章' }}</h2>
        <div class="editor-layout">
            <div class="editor-panel">
                <el-form :model="form" label-position="top">
                    <el-form-item label="标题">
                        <el-input v-model="form.title" placeholder="文章标题" />
                    </el-form-item>
                    <el-row :gutter="16">
                        <el-col :span="12">
                            <el-form-item label="分类">
                                <el-select v-model="form.category_id" placeholder="选择分类" clearable style="width:100%">
                                    <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态">
                                <el-radio-group v-model="form.status">
                                    <el-radio value="draft">草稿</el-radio>
                                    <el-radio value="published">发布</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="封面图">
                        <el-upload :auto-upload="false" :show-file-list="false" :on-change="handleUpload"
                            accept="image/*">
                            <el-button>选择图片</el-button>
                        </el-upload>
                        <img v-if="form.cover_image" :src="form.cover_image" class="cover-preview" />
                    </el-form-item>
                    <el-form-item v-if="authStore.isAdmin" label="置顶">
                        <el-switch v-model="form.is_pinned" />
                    </el-form-item>
                    <el-form-item label="Markdown 内容">
                        <el-input v-model="form.content" type="textarea" :rows="25"
                            placeholder="使用 Markdown 语法编写文章内容..." />
                    </el-form-item>
                </el-form>
            </div>
            <div class="preview-panel">
                <h3>实时预览</h3>
                <MarkdownPreview :content="form.content" />
            </div>
        </div>
        <div class="editor-actions">
            <el-button type="primary" size="large" :loading="saving" @click="save">{{ isEdit ? '保存修改' : '发布文章' }}</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createPost, updatePost, getPost, getCategories } from '../../api/post'
import { uploadImage } from '../../api/upload'
import { useAuthStore } from '../../stores/auth'
import MarkdownPreview from '../../components/post/MarkdownPreview.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isEdit = route.params.id !== undefined
const saving = ref(false)
const categories = ref<any[]>([])

const form = ref({
    title: '',
    content: '',
    summary: '',
    cover_image: '',
    category_id: null as number | null,
    is_pinned: false,
    status: 'draft' as string,
})

async function handleUpload(file: any) {
    try {
        const res: any = await uploadImage(file.raw)
        form.value.cover_image = res.url
        ElMessage.success('上传成功')
    } catch { /* 忽略 */ }
}

async function save() {
    if (!form.value.title || !form.value.content) {
        ElMessage.warning('标题和内容不能为空')
        return
    }
    saving.value = true
    try {
        const data = {
            ...form.value,
            is_pinned: form.value.is_pinned ? 1 : 0,
        }
        if (isEdit) {
            await updatePost(Number(route.params.id), data)
            ElMessage.success('保存成功')
        } else {
            await createPost(data)
            ElMessage.success('发布成功')
        }
        router.push(route.meta.layout === 'admin' ? '/admin' : '/')
    } catch { /* 忽略 */ }
    finally { saving.value = false }
}

onMounted(async () => {
    try {
        const res: any = await getCategories()
        categories.value = res.categories
    } catch { /* 忽略 */ }
    if (isEdit) {
        try {
            const res: any = await getPost(Number(route.params.id))
            const p = res.post
            form.value = {
                title: p.title,
                content: p.content,
                summary: p.summary,
                cover_image: p.cover_image || '',
                category_id: p.category_id,
                is_pinned: !!p.is_pinned,
                status: p.status,
            }
        } catch { /* 忽略 */ }
    }
})
</script>

<style scoped>
.editor-page h2 {
    font-size: 22px;
    margin-bottom: 20px;
}
.editor-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}
.editor-panel {
    min-width: 0;
}
.preview-panel {
    padding: 20px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    overflow-y: auto;
    max-height: calc(100vh - 200px);
    position: sticky;
    top: 20px;
}
.preview-panel h3 {
    margin-bottom: 16px;
    font-size: 16px;
    color: var(--el-text-color-secondary);
}
.editor-actions {
    margin-top: 24px;
    text-align: center;
}
.cover-preview {
    margin-top: 8px;
    max-width: 200px;
    border-radius: 4px;
}
@media (max-width: 768px) {
    .editor-layout {
        grid-template-columns: 1fr;
    }
    .preview-panel {
        position: static;
        max-height: none;
    }
}
</style>

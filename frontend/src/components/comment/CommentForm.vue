<template>
    <div class="comment-form">
        <el-input v-model="authorName" placeholder="你的昵称" class="input" />
        <el-input v-model="content" type="textarea" :rows="3" placeholder="写下你的评论..." class="input" />
        <el-button type="primary" @click="submit" :loading="submitting">发表评论</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createComment } from '../../api/comment'

const props = defineProps<{ postId: number }>()
const emit = defineEmits<{ submitted: [] }>()

const authorName = ref('')
const content = ref('')
const submitting = ref(false)

async function submit() {
    if (!authorName.value.trim() || !content.value.trim()) {
        ElMessage.warning('请填写昵称和评论内容')
        return
    }
    submitting.value = true
    try {
        await createComment(props.postId, {
            author_name: authorName.value.trim(),
            content: content.value.trim(),
        })
        ElMessage.success('评论成功')
        authorName.value = ''
        content.value = ''
        emit('submitted')
    } catch { /* 拦截器已提示 */ }
    finally { submitting.value = false }
}
</script>

<style scoped>
.comment-form {
    margin-bottom: 24px;
    padding: 16px;
    background: var(--el-fill-color-light);
    border-radius: 8px;
}
.input {
    margin-bottom: 12px;
}
</style>

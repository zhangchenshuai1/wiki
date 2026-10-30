<template>
    <div class="post-grid">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
</template>

<script setup lang="ts">
import PostCard from './PostCard.vue'

defineProps<{ posts: any[] }>()
</script>

<style scoped>
.post-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}
@media (max-width: 900px) {
    .post-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 600px) {
    .post-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authFetch } from '@/utils/authFetch'
import { imageUrl } from '@/utils/imageUrl'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ productId: number }>()
const auth = useAuthStore()

const reviews = ref<any[]>([])

const rating = ref(5)
const title = ref('')
const body = ref('')
const newImages = ref<File[]>([])
const newPreviews = ref<string[]>([])
const oldImages = ref<string[]>([])
const removedOldImages = ref<string[]>([])

const editingId = ref<number | null>(null)

async function load() {
  const res = await authFetch(`/api/reviews/product/${props.productId}`)
  const data = await res.json()
  reviews.value = data.map((r: any) => ({
    ...r,
    isOwner: auth?.email === r.userEmail,
  }))
}

function setRating(value: number) {
  rating.value = value
}

function onFiles(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  newImages.value = files
  newPreviews.value.forEach((url) => URL.revokeObjectURL(url))
  newPreviews.value = files.map((f) => URL.createObjectURL(f))
}

function reset() {
  rating.value = 5
  title.value = ''
  body.value = ''
  newImages.value = []
  newPreviews.value.forEach((url) => URL.revokeObjectURL(url))
  newPreviews.value = []
  oldImages.value = []
  removedOldImages.value = []
  editingId.value = null
}

function removeOldImage(url: string) {
  oldImages.value = oldImages.value.filter((i) => i !== url)
  removedOldImages.value.push(url)
}

function removeNewImage(index: number) {
  newImages.value.splice(index, 1)
  URL.revokeObjectURL(newPreviews.value[index])
  newPreviews.value.splice(index, 1)
}

async function submit() {
  if (!title.value || !body.value) return

  const form = new FormData()
  form.append('rating', rating.value.toString())
  form.append('title', title.value)
  form.append('body', body.value)

  newImages.value.forEach((i) => form.append('images', i))

  removedOldImages.value.forEach((url) => {
    const relativeUrl = url.replace(window.location.origin, '')
    form.append('RemovedImages', relativeUrl)
  })

  const url = editingId.value
    ? `/api/reviews/${editingId.value}`
    : `/api/reviews/product/${props.productId}`
  const method = editingId.value ? 'PUT' : 'POST'

  await authFetch(url, { method, body: form })
  reset()
  load()
}

function edit(review: any) {
  editingId.value = review.id
  rating.value = review.rating
  title.value = review.title
  body.value = review.body
  newImages.value = []
  newPreviews.value.forEach((url) => URL.revokeObjectURL(url))
  newPreviews.value = []
  oldImages.value = review.images?.map((img: string) => imageUrl(img)) || []
  removedOldImages.value = []
}

async function remove(id: number) {
  if (!confirm('Are you sure you want to delete this review?')) return
  await authFetch(`/api/reviews/${id}`, { method: 'DELETE' })
  load()
}

onMounted(load)
</script>

<template>
  <section class="reviews">
    <h2>Reviews</h2>

    <div v-if="auth.isAuthenticated" class="new-review">
      <div class="stars">
        <span v-for="i in 5" :key="i" @click="setRating(i)" :class="{ active: i <= rating }"
          >★</span
        >
      </div>

      <input v-model="title" placeholder="Title" />
      <textarea v-model="body" placeholder="Your review"></textarea>
      <input type="file" multiple accept="image/*" @change="onFiles" />

      <div v-if="oldImages.length" class="preview-images">
        <div v-for="(img, i) in oldImages" :key="i" class="image-wrapper">
          <img :src="img" />
          <button @click="removeOldImage(img)">×</button>
        </div>
      </div>

      <div v-if="newPreviews.length" class="preview-images">
        <div v-for="(img, i) in newPreviews" :key="i" class="image-wrapper">
          <img :src="img" />
          <button @click="removeNewImage(i)">×</button>
        </div>
      </div>

      <button @click="submit">{{ editingId ? 'Update' : 'Submit' }}</button>
      <button v-if="editingId" @click="reset">Cancel</button>
    </div>

    <div v-for="r in reviews" :key="r.id" class="review">
      <img v-if="r.userAvatar" :src="imageUrl(r.userAvatar)" class="avatar" />
      <div class="content">
        <strong>{{ r.userName }}</strong>
        <div class="rating">
          <span v-for="i in 5" :key="i" :class="{ active: i <= r.rating }">★</span>
        </div>
        <div class="created">{{ r.createdAt }}</div>
        <h4>{{ r.title }}</h4>
        <p>{{ r.body }}</p>

        <div v-if="r.images?.length" class="review-images">
          <img v-for="img in r.images" :key="img" :src="imageUrl(img)" />
        </div>

        <div v-if="r.isOwner" class="review-actions">
          <button @click="edit(r)" class="edit-btn">Edit</button>
          <button @click="remove(r.id)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stars {
  font-size: 24px;
  color: #ccc;
  margin-bottom: 8px;
}
.stars span {
  cursor: pointer;
  transition: color 0.2s;
}
.stars span.active {
  color: gold;
}
.reviews {
  margin-top: 24px;
}
.reviews h2 {
  font-size: 22px;
  margin-bottom: 20px;
}
.new-review {
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}
.new-review input,
.new-review textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: transparent;
  color: inherit;
}
.new-review button {
  width: fit-content;
  padding: 10px 18px;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  border: none;
  cursor: pointer;
  margin-top: 6px;
}
.preview-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.preview-images .image-wrapper {
  position: relative;
}
.preview-images img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
}
.preview-images .image-wrapper button {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4d;
  border: none;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  padding: 0;
}
.review {
  display: flex;
  gap: 14px;
  padding: 18px;
  border-radius: 14px;
  background: var(--card-bg);
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.review img.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.content {
  flex: 1;
  min-width: 0;
}
.rating {
  color: gold;
  font-weight: 600;
}
.rating span {
  font-size: 18px;
}
.created {
  font-size: 12px;
  color: var(--subtext);
}
.review-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.review-images img {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
}
.review-actions button {
  margin-top: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
}
.edit-btn {
  color: #00c545;
}
.delete-btn {
  color: #dc2727;
}
@media (max-width: 600px) {
  .review,
  .new-review {
    flex-direction: column;
  }
  .review-images img,
  .preview-images img {
    width: 60px;
    height: 60px;
  }
}
</style>

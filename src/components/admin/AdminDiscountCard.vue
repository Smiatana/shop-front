<script setup lang="ts">
import { ref } from 'vue'
import { authFetch } from '@/utils/authFetch'

const props = defineProps<{
  discount: {
    id: number
    productName: string
    percentage: number
    validFrom: string
    validTo: string
    active: boolean
  }
}>()

const emit = defineEmits<{
  updated: () => void
  deleted: () => void
}>()

const editing = ref(false)
const percentage = ref(props.discount.percentage)
const validFrom = ref(props.discount.validFrom.slice(0, 16)) // format for datetime-local
const validTo = ref(props.discount.validTo.slice(0, 16))
const active = ref(props.discount.active)

async function saveEdit() {
  const res = await authFetch(`/api/discounts/${props.discount.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      percentage: percentage.value,
      validFrom: validFrom.value,
      validTo: validTo.value,
      active: active.value,
    }),
  })

  if (res.ok) {
    editing.value = false
    emit('updated')
  } else {
    const text = await res.text()
    alert('Error: ' + text)
  }
}

async function deleteDiscount() {
  if (!confirm('Delete this discount?')) return

  const res = await authFetch(`/api/discounts/${props.discount.id}`, {
    method: 'DELETE',
  })

  if (res.ok) emit('deleted')
  else {
    const text = await res.text()
    alert('Error: ' + text)
  }
}
</script>

<template>
  <div class="card">
    <div v-if="!editing">
      <div><strong>Product:</strong> {{ props.discount.productName }}</div>
      <div><strong>Discount:</strong> {{ props.discount.percentage }}%</div>
      <div>
        <strong>Valid:</strong> {{ props.discount.validFrom }} → {{ props.discount.validTo }}
      </div>
      <div><strong>Status:</strong> {{ props.discount.active ? 'Active' : 'Inactive' }}</div>
      <div class="actions">
        <button @click="editing = true">Edit</button>
        <button @click="deleteDiscount">Delete</button>
      </div>
    </div>

    <div v-else class="edit-form">
      <label>Percentage (%)</label>
      <input type="number" v-model.number="percentage" />

      <label>Valid From</label>
      <input type="datetime-local" v-model="validFrom" />

      <label>Valid To</label>
      <input type="datetime-local" v-model="validTo" />

      <label>Status</label>
      <select v-model="active">
        <option :value="true">Active</option>
        <option :value="false">Inactive</option>
      </select>

      <div class="actions">
        <button @click="saveEdit">Save</button>
        <button @click="editing = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--card-bg);
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.actions {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

button {
  padding: 6px 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

button:first-child {
  background: #3b82f6;
  color: white;
}

button:last-child {
  background: #b91c1c;
  color: white;
}

.edit-form input,
.edit-form select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>

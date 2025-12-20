<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { OrderDto } from '@/types/orders'
import OrderItemCard from './OrderItemCard.vue'

const props = defineProps<{
  order: OrderDto
  admin?: boolean
}>()

const emit = defineEmits<{
  (e: 'update-status', payload: { orderId: number; status: string }): void
  (e: 'delete', orderId: number): void
}>()

const expanded = ref(false)
const selectedStatus = ref(props.order.status)

watch(
  () => props.order.status,
  (v) => (selectedStatus.value = v),
)

function toggle() {
  expanded.value = !expanded.value
}

const statusClass = computed(() => {
  switch (props.order.status.toLowerCase()) {
    case 'pending':
      return 'pending'
    case 'ready':
      return 'ready'
    case 'cancelled':
      return 'cancelled'
    default:
      return ''
  }
})

function saveStatus() {
  emit('update-status', {
    orderId: props.order.id,
    status: selectedStatus.value,
  })
}

function deleteOrder() {
  if (confirm(`Delete order #${props.order.id}?`)) {
    emit('delete', props.order.id)
  }
}
</script>

<template>
  <div class="order-card">
    <div class="header" @click="toggle">
      <div class="info">
        <div class="order-id">Order #{{ order.id }}</div>
        <div class="date">{{ order.createdAt }}</div>
      </div>

      <div class="status-total">
        <div class="status">
          Status:
          <span :class="statusClass">{{ order.status }}</span>
        </div>
        <div class="total">Total: {{ order.totalPrice }} BYN</div>
      </div>

      <div class="toggle-icon">{{ expanded ? '▲' : '▼' }}</div>
    </div>

    <transition name="fade">
      <div v-if="expanded" class="items">
        <OrderItemCard v-for="item in order.items" :key="item.id" :item="item" />

        <!-- ADMIN CONTROLS -->
        <div v-if="admin" class="admin-controls">
          <select v-model="selectedStatus">
            <option value="Pending">Pending</option>
            <option value="Ready">Ready</option>
          </select>

          <button @click="saveStatus">Update status</button>
          <button class="danger" @click="deleteOrder">Delete</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.order-card {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;
}
.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 16px;
  cursor: pointer;
  font-weight: 500;
  gap: 12px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-size: 1rem;
  font-weight: 600;
}

.date {
  font-size: 0.875rem;
  color: #666;
}

.status-total {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
}

.status span {
  font-weight: 600;
}

.status span.pending {
  color: #ffa500;
}
.status span.ready {
  color: #4caf50;
}
.status span.cancelled {
  color: #f44336;
}

.total {
  font-weight: 600;
}

.toggle-icon {
  font-size: 0.875rem;
  color: #888;
}

.items {
  padding: 16px;
  background: white;
  border-top: 1px solid #eee;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.admin-controls {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

select {
  padding: 6px;
  border-radius: 6px;
}

button {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

button.danger {
  background: #f44336;
  color: white;
}
</style>

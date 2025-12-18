<script setup lang="ts">
import { ref, computed } from 'vue'
import type { OrderDto } from '@/types/orders'
import OrderItemCard from './OrderItemCard.vue'

const props = defineProps<{ order: OrderDto }>()

const expanded = ref(false)
function toggle() {
  expanded.value = !expanded.value
}

const statusClass = computed(() => {
  switch (props.order.status.toLowerCase()) {
    case 'pending':
      return 'pending'
    case 'completed':
      return 'completed'
    case 'cancelled':
      return 'cancelled'
    default:
      return ''
  }
})
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
          Status: <span :class="statusClass">{{ order.status }}</span>
        </div>
        <div class="total">Total: {{ order.totalPrice }} BYN</div>
      </div>
      <div class="toggle-icon">{{ expanded ? '▲' : '▼' }}</div>
    </div>

    <transition name="fade">
      <div v-if="expanded" class="items">
        <OrderItemCard v-for="item in order.items" :key="item.id" :item="item" />
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
.status span.completed {
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
</style>

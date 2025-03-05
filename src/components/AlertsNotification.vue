<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElNotification } from 'element-plus'

const alerts = ref([])
const shownAlerts = ref(new Set()) // 用于跟踪已显示的通知
let interval = null

const fetchAlerts = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/alerts/')
    const data = await res.json()

    // 更新警报列表
    alerts.value = data.alerts

    // 显示新通知
    data.alerts.forEach(alert => {
      const id = alert.message // 使用信息内容作为唯一标识
      if (!shownAlerts.value.has(id)) {
        ElNotification({
          title: `${alert.type === 'stock' ? '库存警报' : '有效期警报'}`,
          message: alert.message,
          type: alert.severity,
          duration: 5000
        })
        shownAlerts.value.add(id)
      }
    })

  } catch (error) {
    console.error('获取警报失败:', error)
  }
}

onMounted(() => {
  fetchAlerts()
  interval = setInterval(fetchAlerts, 15000) // 15秒刷新一次
})

onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="alert-panel">
    <h3>实时药品监控</h3>
    <div v-if="alerts.length" class="alert-list">
      <div
        v-for="(alert, index) in alerts"
        :key="index"
        :class="`alert-item ${alert.severity}`"
      >
        <el-icon :name="alert.severity === 'error' ? 'circle-close-filled' : 'warning'"/>
        <span>{{ alert.message }}</span>
      </div>
    </div>
    <div v-else class="no-alerts">
      <el-icon name="success-filled"/>
      当前无异常警报
    </div>
  </div>
</template>

<style scoped>
.alert-panel {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  max-width: 400px;
  background: #fafafa;
}

.alert-item {
  padding: 8px 12px;
  margin: 6px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  background: white;

  &.error {
    border-left: 4px solid #f56c6c;
  }
  &.warning {
    border-left: 4px solid #e6a23c;
  }
}

.el-icon {
  margin-right: 8px;
  font-size: 18px;
}

.no-alerts {
  color: #67c23a;
  padding: 12px;
  text-align: center;
}
</style>

<template>
  <div class="root-container">
    <div class="app-container">
      <!-- 左侧导航菜单 -->
      <el-menu
        class="sidebar-menu"
        :default-openeds="['1']"
        :default-active="activeMenu"
        router
        unique-opened
      >
        <!-- 顶部标题 -->
        <div class="menu-header">
          <img src="@/assets/hospital.svg" class="logo" />
          <h1>药房管理系统</h1>
        </div>

        <!-- 菜单项分组 -->
        <el-menu-item index="/drugs">
          <el-icon>
            <Goods />
          </el-icon>
          <span>药品管理</span>
        </el-menu-item>

        <el-menu-item index="/orders">
          <el-icon>
            <Document />
          </el-icon>
          <span>采购管理</span>
        </el-menu-item>

        <el-menu-item index="/suppliers">
          <el-icon>
            <OfficeBuilding />
          </el-icon>
          <span>供应商管理</span>
        </el-menu-item>
      </el-menu>

      <!-- 主内容区 -->
      <div class="main-content">
        <router-view />
        <AlertsNotification />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Goods, Document, OfficeBuilding } from '@element-plus/icons-vue'
import AlertsNotification from '@/components/AlertsNotification.vue'

const route = useRoute()

const activeMenu = computed(() => {
  return route.path
})
</script>

<style lang="scss" scoped>
.root-container {
  width: 100%;
  min-height: 100vh;

  .app-container {
    display: flex;
    min-height: 100vh;
    position: relative;

    .sidebar-menu {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: 240px;
      height: 100vh;
      background: #fff;
      border-right: none;
      box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);

      .menu-header {
        display: flex;
        align-items: center;
        padding: 16px;
        height: 64px;
        border-bottom: 1px solid #f0f0f0;

        .logo {
          width: 32px;
          height: 32px;
          margin-right: 12px;
        }

        h1 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          white-space: nowrap;
        }
      }

      .el-menu-item {
        height: 48px;
        line-height: 48px;
        margin: 4px 0;
        border-radius: 4px;

        &:hover {
          background-color: #f5f7fa;
        }

        &.is-active {
          background-color: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }

        .el-icon {
          margin-right: 12px;
          font-size: 18px;
        }

        span {
          font-size: 14px;
        }
      }
    }

    .main-content {
      flex: 1;
      margin-left: 240px; // 为固定定位的侧边栏留出空间
      padding: 20px;
      background-color: #f5f7fa;
      min-height: 100vh;
      overflow: auto;
    }
  }
}
</style>

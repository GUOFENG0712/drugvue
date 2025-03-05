<!--<template>-->
<!--  <div class="drug-management">-->
<!--    &lt;!&ndash; 药品信息录入 &ndash;&gt;-->
<!--    <el-form :model="drugForm" label-width="120px">-->
<!--      <el-form-item label="药品名称">-->
<!--        <el-input v-model="drugForm.name"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="分类">-->
<!--        <el-select v-model="drugForm.category">-->
<!--          <el-option-->
<!--            v-for="cat in categories"-->
<!--            :key="cat.id"-->
<!--            :label="cat.name"-->
<!--            :value="cat.id"-->
<!--          ></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="药品数量">-->
<!--        <el-input v-model="drugForm.stock"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="药品规格">-->
<!--        <el-input v-model="drugForm.specification"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="产地">-->
<!--        <el-input v-model="drugForm.origin"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="价格">-->
<!--        <el-input v-model="drugForm.price"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="有效期">-->
<!--        <el-input v-model="drugForm.expiry_date"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-button type="primary" @click="submitDrug">提交</el-button>-->
<!--    </el-form>-->

<!--    &lt;!&ndash; 药品列表 &ndash;&gt;-->
<!--    <el-table :data="drugs">-->
<!--      <el-table-column prop="name" label="药品名称"></el-table-column>-->
<!--      <el-table-column prop="stock" label="库存量"></el-table-column>-->
<!--      <el-table-column prop="expiry_date" label="有效期"></el-table-column>-->
<!--    </el-table>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, onMounted } from 'vue'-->
<!--import axios from 'axios'-->

<!--const categories = ref([])-->
<!--const drugs = ref([])-->
<!--const drugForm = ref({-->
<!--  name: '',-->
<!--  category: null,-->
<!--  specification: '',-->
<!--  origin: '',-->
<!--  price: 0,-->
<!--  expiry_date: '',-->
<!--  stock: 0,-->
<!--})-->
<!--// 加载分类和药品数据-->
<!--onMounted(async () => {-->
<!--  const resCategories = await axios.get('http://localhost:8000/api/drug-categories/')-->
<!--  categories.value = resCategories.data-->
<!--  const resDrugs = await axios.get('http://localhost:8000/api/drugs/')-->
<!--  drugs.value = resDrugs.data-->
<!--})-->

<!--// 提交药品信息-->
<!--const submitDrug = async () => {-->
<!--  try {-->
<!--    // 将数据转换为明确类型（Django可能拒绝字符串形式的数字）-->
<!--    const postData = {-->
<!--      ...drugForm.value,-->
<!--      categoryId: Number(drugForm.value.category), // 确保外键ID为数值-->
<!--      stock: Number(drugForm.value.stock),-->
<!--      price: Number(drugForm.value.price),-->
<!--    }-->

<!--    const response = await axios.post(-->
<!--      'http://localhost:8000/api/drugs/',-->
<!--      postData, // 使用处理后的数据-->
<!--      {-->
<!--        headers: {-->
<!--          'Content-Type': 'application/json',-->
<!--        },-->
<!--      },-->
<!--    )-->
<!--    // 更新前端列表的逻辑（可替换为重新获取完整数据）-->
<!--    drugs.value = [...drugs.value, response.data]-->
<!--    console.log('提交成功:', response.data)-->
<!--  } catch (error) {-->
<!--    console.error('提交失败:', error.response?.data || error.message)-->
<!--  }-->
<!--}-->
<!--</script>-->
<!--<style scoped lang="scss">-->

<!--</style>-->
<template>
  <div class="drug-management">
    <!-- 模块化表单卡片 -->
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">📦 药品信息录入</span>
          <el-tag type="success">v2.1 智能表单</el-tag>
        </div>
      </template>

      <el-form
        :model="drugForm"
        label-width="120px"
        @submit.prevent="submitDrug"
      >
        <!-- 名称与分类 -->
        <el-form-item label="药品名称">
          <el-input
            v-model="drugForm.name"
            placeholder="请输入药品通用名称"
            clearable
          />
        </el-form-item>

        <el-form-item label="药品分类">
          <el-select
            v-model="drugForm.category"
            placeholder="请选择分类"
          >
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <!-- 库存与价格 -->
        <div class="inline-group">
          <el-form-item
            label="库存数量"
            class="inline-item"
          >
            <el-input-number
              v-model="drugForm.stock"
              :min="0"
              controls-position="right"
            />
          </el-form-item>

          <el-form-item
            label="销售价格"
            class="inline-item"
          >
            <el-input-number
              v-model="drugForm.price"
              :min="0"
              :precision="2"
              controls-position="right"
            />
          </el-form-item>
        </div>

        <!-- 规格与产地 -->
        <el-form-item label="药品规格">
          <el-input
            v-model="drugForm.specification"
            placeholder="如：0.25g*24片/盒"
          />
        </el-form-item>

        <el-form-item label="生产产地">
          <el-input
            v-model="drugForm.origin"
            placeholder="请输入完整生产地"
          />
        </el-form-item>

        <el-form-item label="有效期至">
          <el-date-picker
            v-model="drugForm.expiry_date"
            type="date"
            placeholder="选择有效截止日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <!-- 提交操作 -->
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="submitting"
          >
            {{ submitting ? '提交中...' : '立即添加' }}
          </el-button>
          <el-button @click="resetForm">重置表单</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据展示表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">📋 当前药品库存清单</span>
          <div class="header-actions">
            <el-button
              type="info"
              plain
              @click="refreshData"
            >
              刷新数据
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="drugs"
        stripe
        v-loading="loading"
      >
        <el-table-column
          prop="name"
          label="药品名称"
          width="180"
        />
        <el-table-column
          prop="category"
          label="所属分类"
          width="120"
        />
        <el-table-column
          prop="stock"
          label="库存量"
          width="100"
        >
          <template #default="{ row }">
            <el-tag
              :type="row.stock > 50 ? 'success' : 'danger'"
              effect="dark"
            >
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="单价"
        >
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="expiry_date"
          label="有效期"
        />
        <el-table-column
          prop="specification"
          label="规格"
        />
        <el-table-column
          prop="origin"
          label="生产地"
        />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 状态管理
const loading = ref(false)
const submitting = ref(false)
const categories = ref([])
const drugs = ref([])
const drugForm = ref({
  name: '',
  category: null,
  specification: '',
  origin: '',
  price: 0,
  expiry_date: '',
  stock: 0
})

// 数据加载
const loadData = async () => {
  try {
    loading.value = true
    const [catRes, drugRes] = await Promise.all([
      axios.get('http://localhost:8000/api/drug-categories/'),
      axios.get('http://localhost:8000/api/drugs/')
    ])
    categories.value = catRes.data
    drugs.value = drugRes.data
  } catch (error) {
    ElMessage.error('数据加载失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 提交逻辑
const submitDrug = async () => {
  submitting.value = true
  try {
    const payload = {
      ...drugForm.value,
      category: Number(drugForm.value.category),
      price: Number(drugForm.value.price),
      stock: Number(drugForm.value.stock)
    }

    const { data } = await axios.post('http://localhost:8000/api/drugs/', payload)
    drugs.value = [...drugs.value, data]
    ElMessage.success('药品添加成功!')
    resetForm()
  } catch (error) {
    ElMessage.error(`提交失败: ${error.response?.data?.message || error.message}`)
  } finally {
    submitting.value = false
  }
}

// 实用方法
const resetForm = () => {
  drugForm.value = {
    name: '',
    category: null,
    specification: '',
    origin: '',
    price: 0,
    expiry_date: '',
    stock: 0
  }
}

const refreshData = () => {
  loadData()
  ElMessage.info('数据已刷新')
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.drug-management {
  $primary: #4a9ff5;
  $success: #67c23a;
  $warning: #e6a23c;
  $danger: #f56c6c;
  $card-bg: #fff;
  $border-radius: 12px;

  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;

  // 卡片通用样式
  .el-card {
    margin-bottom: 24px;
    border-radius: $border-radius;
    box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.08);

    :deep(.el-card__header) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      background: linear-gradient(135deg, #f8fafc 0%, #fff 100%);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-title {
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
      }

      .header-actions {
        display: flex;
        gap: 8px;
      }
    }
  }

  // 表单区域
  .form-card {
    :deep(.el-form) {
      .el-form-item {
        margin-bottom: 20px;

        &__label {
          font-weight: 500;
          color: #5f6368;
        }
      }

      .inline-group {
        display: flex;
        gap: 24px;

        .inline-item {
          flex: 1;
          margin-bottom: 0;
        }
      }

      .el-input-number {
        width: 100%;
      }

      .el-button {
        padding: 10px 24px;
        border-radius: 6px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba($primary, 0.25);
        }
      }
    }
  }

  // 表格区域
  .table-card {
    :deep(.el-table) {
      th.el-table__cell {
        background-color: lighten($primary, 42%);
        font-weight: 600;
        color: #2c3e50;
      }

      .el-tag {
        font-weight: 500;
        min-width: 60px;
        text-align: center;
      }
    }
  }

  // 响应式适配
  @media (max-width: 768px) {
    padding: 12px;

    .el-card {
      margin-bottom: 16px;
    }

    .inline-group {
      flex-direction: column;
      gap: 0 !important;
    }
  }
}
</style>


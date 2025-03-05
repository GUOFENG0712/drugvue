<!--<template>-->
<!--  <div>-->
<!--    <el-form :model="orderForm" label-width="120px">-->
<!--      <el-form-item label="选择药品">-->
<!--        <el-select v-model="orderForm.drugId">-->
<!--          <el-option v-for="drug in drugs" :key="drug.id" :label="drug.name" :value="drug.id"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="采购数量">-->
<!--        <el-input-number v-model="orderForm.quantity" :min="1"></el-input-number>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="供应商">-->
<!--        <el-select v-model="orderForm.supplierId">-->
<!--          <el-option v-for="supplier in suppliers" :key="supplier.id" :label="supplier.name" :value="supplier.id"></el-option>-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-button type="primary" @click="submitOrder">生成订单</el-button>-->
<!--    </el-form>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, onMounted } from 'vue'-->
<!--import axios from 'axios'-->

<!--const drugs = ref([])-->
<!--const suppliers = ref([])-->
<!--const orderForm = ref({-->
<!--  drugId: null,-->
<!--  supplierId: null,-->
<!--  quantity: 1,-->
<!--  price: 0,-->
<!--})-->

<!--onMounted(async () => {-->
<!--  const resDrugs = await axios.get('http://localhost:8000/api/drugs/')-->
<!--  drugs.value = resDrugs.data-->
<!--  const resSuppliers = await axios.get('http://localhost:8000/api/suppliers/')-->
<!--  suppliers.value = resSuppliers.data-->
<!--})-->

<!--const submitOrder = async () => {-->
<!--  await axios.post('http://localhost:8000/api/orders/', orderForm.value)-->
<!--}-->
<!--</script>-->
<template>
  <div class="purchase-order">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">📑 药品采购订单</span>
          <el-tag type="danger">采购版本 v1.2</el-tag>
        </div>
      </template>

      <el-form :model="orderForm" label-width="140px" :rules="rules" @submit.prevent="submitOrder">
        <!-- 药品选择 -->
        <el-form-item label="采购药品" prop="drugId">
          <el-select v-model="orderForm.drugId" placeholder="请选择药品" filterable clearable>
            <el-option
              v-for="drug in drugs"
              :key="drug.id"
              :label="`${drug.name} (库存: ${drug.stock})`"
              :value="drug.id"
            />
          </el-select>
          <div v-if="selectedDrug" class="drug-info">
            <el-tag type="info">当前库存: {{ selectedDrug.stock }}</el-tag>
            <el-tag>商品规格: {{ selectedDrug.specification }}</el-tag>
            <el-tag>产地: {{ selectedDrug.origin }}</el-tag>
          </div>
        </el-form-item>

        <!-- 供应商选择 -->
        <el-form-item label="供应商" prop="supplierId">
          <el-select v-model="orderForm.supplierId" placeholder="选择供应商" filterable>
            <el-option
              v-for="supplier in suppliers"
              :key="supplier.id"
              :label="`${supplier.name} (评级: ${supplier.reputation}★)`"
              :value="supplier.id"
            />
          </el-select>
        </el-form-item>

        <!-- 采购信息 -->
        <div class="inline-group">
          <el-form-item label="采购数量" prop="quantity">
            <el-input-number
              v-model="orderForm.quantity"
              :min="1"
              :max="drugStockMax"
              :style="{ width: '200px' }"
              controls-position="right"
              class="full-width"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="预估总价">
            <el-input :value="totalPrice" readonly>
              <template #prefix>¥</template>
            </el-input>
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <el-form-item class="form-actions">
          <el-button type="primary" native-type="submit" :loading="submitting" round>
            {{ submitting ? '提交中...' : '生成采购单' }}
          </el-button>
          <el-button @click="resetForm" round>重置表单</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 响应式数据
const drugs = ref([])
const suppliers = ref([])
const submitting = ref(false)
const orderForm = ref({
  drugId: null,
  supplierId: null,
  quantity: 1,
})

// 验证规则
const rules = {
  drugId: [{ required: true, message: '必须选择采购药品', trigger: 'change' }],
  supplierId: [{ required: true, message: '必须选择供应商', trigger: 'change' }],
  quantity: [
    { required: true, message: '请输入采购数量', trigger: 'blur' },
    { type: 'number', min: 1, message: '至少采购1件', trigger: 'blur' },
  ],
}

// 计算属性
const selectedDrug = computed(() => drugs.value.find((d) => d.id === orderForm.value.drugId))

const totalPrice = computed(() => {
  const price = selectedDrug.value?.price || 0
  return (price * orderForm.value.quantity).toFixed(2)
})

const drugStockMax = computed(() => {
  // const stock = selectedDrug.value?.stock || 0
  const validMax = Math.max(9999, 1) // 至少允许采购1件
  return Math.min(validMax, 9999)
})
// 数据加载
const loadData = async () => {
  try {
    const [drugRes, supplierRes] = await Promise.all([
      axios.get('http://localhost:8000/api/drugs/'),
      axios.get('http://localhost:8000/api/suppliers/'),
    ])
    drugs.value = drugRes.data
    suppliers.value = supplierRes.data
  } catch (error) {
    ElMessage.error('数据加载失败: ' + error.message)
  }
}

// 提交逻辑
const submitOrder = async () => {
  try {
    submitting.value = true
    const payload = {
      drug: orderForm.value.drugId,
      supplier: orderForm.value.supplierId,
      quantity: orderForm.value.quantity,
      price: Number(totalPrice.value),
    }

    await axios.post('http://localhost:8000/api/orders/', payload)
    ElMessage.success({
      message: '采购单已生成',
      duration: 2000,
      showClose: true,
    })
    resetForm()
  } catch (error) {
    ElMessage.error({
      message: error.response?.data?.detail || '提交失败',
      duration: 3000,
    })
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  orderForm.value = {
    drugId: null,
    supplierId: null,
    quantity: 1,
  }
}

onMounted(loadData)
</script>


<style lang="scss" scoped>
.purchase-order {
  $primary: #4a9ff5;
  $danger: #f56c6c;
  $card-bg: #fff;
  $border-radius: 12px;

  padding: 24px;
  background: #f8fafc;

  .form-card {
    max-width: 800px;
    margin: 0 auto;
    border-radius: $border-radius;
    box-shadow: 0 6px 18px -4px rgba(0, 0, 0, 0.08);

    :deep(.el-card__header) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .header-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }

    :deep(.el-form-item) {
      margin-bottom: 24px;

      .el-form-item__label {
        font-weight: 500;
        color: #5f6368;
      }

      .el-select {
        width: 100%;
      }

      .el-input-number.full-width {
        width: 100%;
      }
    }

    .inline-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    .form-actions {
      margin-top: 32px;

      :deep(.el-form-item__content) {
        justify-content: flex-end;
        gap: 20px;

        .el-button {
          padding: 12px 32px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba($primary, 0.3);
          }
        }
      }
    }
  }
}
</style>

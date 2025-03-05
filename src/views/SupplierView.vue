<!--<script setup>-->
<!--import { ref } from 'vue'-->
<!--import axios from 'axios'-->
<!--import { ElMessage } from 'element-plus'-->

<!--const formRef = ref(null)-->
<!--const SupplierForm = ref({-->
<!--  name: '',-->
<!--  contact: '',-->
<!--  capability: '',-->
<!--  reputation: 0-->
<!--})-->
<!--const submitInfo = async () => {-->
<!--  try {-->
<!--    // 先验证表单-->
<!--    await formRef.value.validate()-->

<!--    // 发送请求-->
<!--    await axios.post('http://localhost:8000/api/suppliers/', {-->
<!--      ...SupplierForm.value,-->
<!--      reputation: Number(SupplierForm.value.reputation) // 转换数字类型-->
<!--    })-->
<!--    ElMessage.success('提交成功')-->
<!--    formRef.value.resetFields() // 清空表单-->
<!--  } catch (error) {-->
<!--    ElMessage.error(`提交失败: ${error.response?.data?.message || error.message}`)-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <div>-->
<!--    <el-form ref="formRef" :rules="{}" :model="SupplierForm" label-width="120px">-->
<!--      <el-form-item label="供应商名称">-->
<!--        <el-input v-model="SupplierForm.name"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="联系方式">-->
<!--        <el-input v-model="SupplierForm.contact"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="供货能力">-->
<!--        <el-input v-model="SupplierForm.capability"></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="信誉度">-->
<!--        <el-input v-model="SupplierForm.reputation"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-button type="primary" @click="submitInfo">提交</el-button>-->
<!--    </el-form>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped>-->

<!--</style>-->
<template>
  <div class="supplier-management">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">🏭 供应商信息管理</span>
          <el-tag type="warning">供应链版本 v1.2</el-tag>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="SupplierForm"
        label-width="140px"
        :rules="rules"
        @submit.prevent="submitInfo"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input
            v-model="SupplierForm.name"
            placeholder="请输入正式注册名称"
            clearable
          />
        </el-form-item>

        <el-form-item label="联系方式" prop="contact">
          <el-input
            v-model="SupplierForm.contact"
            placeholder="格式：姓名+电话/邮箱"
          >
            <template #prefix>
              <el-icon><user /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="供货能力" prop="capability">
          <el-input
            v-model="SupplierForm.capability"
            type="textarea"
            :rows="3"
            placeholder="描述主要供货产品和产能"
            show-word-limit
            maxlength="200"
          />
        </el-form-item>

        <el-form-item label="信誉评级" prop="reputation">
          <el-input-number
            v-model="SupplierForm.reputation"
            :min="0"
            :max="5"
            :step="0.5"
            controls-position="right"
          >
            <template #append>
              <el-rate
                v-model="SupplierForm.reputation"
                :max="5"
                allow-half
                :colors="rateColors"
              />
            </template>
          </el-input-number>
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button
            type="primary"
            native-type="submit"
            :loading="submitting"
            round
          >
            {{ submitting ? '提交中...' : '确认提交' }}
          </el-button>
          <el-button @click="resetForm" round>重置表单</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { User } from  '@element-plus/icons-vue'

// 验证规则（扩展此处可添加更多规则）
const rules = {
  name: [
    { required: true, message: '必须填写供应商名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '至少提供一种联系方式', trigger: 'blur' },
    {
      validator: (_, value, cb) => {
        const pattern = /^(?:\+\d{1,3})?\d{7,15}$|^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
        cb(pattern.test(value) ? undefined : new Error('无效的联系方式格式'))
      },
      trigger: 'blur'
    }
  ],
  reputation: [
    { type: 'number', min: 0, max: 5, message: '评级范围 0-5 分' }
  ]
}

// 响应式状态
const formRef = ref(null)
const submitting = ref(false)
const SupplierForm = ref({
  name: '',
  contact: '',
  capability: '',
  reputation: 3.0
})
const rateColors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])

// 提交逻辑
const submitInfo = async () => {
  try {
    submitting.value = true
    await formRef.value.validate()

    await axios.post('http://localhost:8000/api/suppliers/', {
      ...SupplierForm.value,
      reputation: Number(SupplierForm.value.reputation.toFixed(1))
    })

    ElMessage.success({
      message: '供应商信息已更新',
      duration: 2000,
      showClose: true
    })
    resetForm()
  } catch (error) {
    if(!error.response) return
    ElMessage.error({
      message: `提交失败: ${error.response.data?.detail || error.message}`,
      duration: 3000,
      showClose: true
    })
  } finally {
    submitting.value = false
  }
}

// 重置方法
const resetForm = () => {
  formRef.value.resetFields()
  SupplierForm.value.reputation = 3.0
}
</script>

<style lang="scss" scoped>
.supplier-management {
  $primary: #4a9ff5;
  $warning: #e6a23c;
  $card-bg: #fff;
  $border-radius: 12px;

  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;

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

    .form-actions {
      margin-top: 32px;

      :deep(.el-form-item__content) {
        justify-content: center;
        gap: 24px;
      }

      .el-button {
        padding: 12px 32px;
        font-weight: 500;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba($primary, 0.3);
        }
      }
    }

    :deep(.el-form-item) {
      margin-bottom: 22px;

    .el-form-item__label {

      .el-input {
        &__prefix {
          padding-right: 10px;
        }
      };
    }

      .el-textarea {
        :deep(.el-textarea__inner) {
          border-radius: 8px;
          background: lighten($primary, 44%);
          border-color: rgba($primary, 0.3);
          transition: border-color 0.3s;

          &:hover {
            border-color: $primary;
          }

          &::placeholder {
            color: rgba(#606266, 0.5);
          }
        }
      }

      .el-input-number {
        width: 180px;

        :deep(.el-input__inner) {
          text-align: center;
        }
      }

      .el-rate {
        margin-left: 10px;
        transform: translateY(3px);
      }
    }
  }

  @media (max-width: 768px) {
    padding: 16px;

    .form-card {
      :deep(.el-card__body) {
        padding: 16px;
      }

      :deep(.el-form-item__label) {
        text-align: left;
        margin-bottom: 8px;
      }

      :deep(.el-form-item__content) {
        flex-direction: column;
        align-items: stretch;
      }

      .form-actions {
        margin-top: 24px;

        .el-button {
          width: 100%;
          margin: 8px 0;
        }
      }
    }
  }
}
</style>

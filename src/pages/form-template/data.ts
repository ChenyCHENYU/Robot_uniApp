import { ref, reactive } from 'vue'
import { submitForm, type FormPayload } from '@/api'
import { required, mobile, email, quickValidate } from '@/utils/v_verify'

export const formRules = {
  name: [required('姓名')],
  phone: [required('手机号'), mobile('手机号')],
  email: [email('邮箱')],
  gender: [required('性别', 'change')],
  department: [required('部门', 'change')],
}

type ValidatedField = keyof typeof formRules

/** 人员信息填报与逐字段验证。 */
export function useFormTemplatePage() {
  const submitting = ref(false)
  const showDeptPicker = ref(false)
  const form = reactive({
    name: '',
    phone: '',
    email: '',
    gender: '',
    department: '',
    position: '',
    joinDate: '',
    skills: [] as string[],
    remark: '',
  })
  const errors = reactive<Partial<Record<ValidatedField, string>>>({})
  const genderOptions = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
  ]
  const deptActions = ['技术部', '产品部', '设计部', '市场部', '运营部'].map(
    name => ({ name })
  )
  const skillTags = [
    'Vue',
    'React',
    'UniApp',
    'TypeScript',
    'Node.js',
    'Python',
    'Java',
    'Go',
  ]
  const validateField = (field: ValidatedField) => {
    const result = quickValidate(form[field], formRules[field], field)
    errors[field] = result.message
    return result.valid
  }
  const toggleSkill = (tag: string) => {
    const index = form.skills.indexOf(tag)
    if (index === -1) form.skills.push(tag)
    else form.skills.splice(index, 1)
  }
  const onDeptSelect = ({ item }: { item: { name: string } }) => {
    form.department = item.name
    showDeptPicker.value = false
    validateField('department')
  }
  const selectGender = (value: string) => {
    form.gender = value
    validateField('gender')
  }
  const handleDateChange = (event: { detail: { value: string } }) => {
    form.joinDate = event.detail.value
  }
  const handleReset = () => {
    if (submitting.value) return
    Object.assign(form, {
      name: '',
      phone: '',
      email: '',
      gender: '',
      department: '',
      position: '',
      joinDate: '',
      skills: [],
      remark: '',
    })
    Object.keys(errors).forEach(key => delete errors[key as ValidatedField])
  }
  const handleSubmit = async () => {
    if (submitting.value) return
    const fields = Object.keys(formRules) as ValidatedField[]
    const valid = fields.map(validateField).every(Boolean)
    if (!valid) {
      uni.showToast({ title: '请检查标红的填写内容', icon: 'none' })
      return
    }
    const payload: FormPayload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      gender: form.gender,
      department: form.department,
      position: form.position.trim(),
      joinDate: form.joinDate,
      skills: [...form.skills],
      remark: form.remark.trim(),
    }
    submitting.value = true
    try {
      await submitForm(payload)
      submitting.value = false
      handleReset()
      uni.showToast({ title: '提交成功', icon: 'success' })
    } catch {
      /* 请求层提供业务错误，保留表单用于重试。 */
    } finally {
      submitting.value = false
    }
  }
  return {
    submitting,
    showDeptPicker,
    form,
    errors,
    genderOptions,
    deptActions,
    skillTags,
    validateField,
    toggleSkill,
    onDeptSelect,
    selectGender,
    handleDateChange,
    handleReset,
    handleSubmit,
  }
}

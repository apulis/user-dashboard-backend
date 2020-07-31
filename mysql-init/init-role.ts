import { Role } from "src/role/role.entity";


export const initialRole: Role[] = [
  {
    name: '管理员',
    isPreset: 1,
    note: 'All permissions',
    id: 1,
  },
  {
    name: '用户',
    isPreset: 1,
    note: 'Submit training job, View VC, View cluster status, View all users job',
    id: 2,
  },
  {
    name: '标注员',
    isPreset: 1,
    note: '标注图片',
    id: 3,
  }
]
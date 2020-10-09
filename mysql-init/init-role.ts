import { Role } from "src/role/role.entity";


export const initialRole: Role[] = [
  {
    name: '管理员',
    isPreset: 1,
    note: '所有权限',
    id: 1,
  },
  {
    name: '用户',
    isPreset: 1,
    note: '-',
    id: 2,
  },
  {
    name: '标注员',
    isPreset: 1,
    note: '标注图片',
    id: 3,
  }
]
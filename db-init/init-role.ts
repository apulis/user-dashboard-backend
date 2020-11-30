import { Role } from "src/role/role.entity";


export const initialRole: Role[] = [
  {
    name: 'System Admin',
    isPreset: 1,
    note: 'All permissions',
    id: 1,
  },
  {
    name: 'User',
    isPreset: 1,
    note: '-',
    id: 2,
  },
  
  {
    name: 'Annotation person',
    isPreset: 1,
    note: 'Annotation',
    id: 3,
  }
]
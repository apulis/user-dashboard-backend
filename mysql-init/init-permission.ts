import { Permission } from '../src/permission/permission.entity';

export enum ProjectTypes {
  DLWORKSPACE = 'Apulis AI Training Platform'
}

export enum EnumPermissionKeys {
  SUBMIT_TRAINING_JOB = 'SUBMIT_TRAINING_JOB',
  MANAGE_VC = 'MANAGE_VC',
  VIEW_VC = 'VIEW_VC',
  VIEW_ALL_USER_JOB = 'VIEW_ALL_USER_JOB',
  VIEW_AND_MANAGE_ALL_USERS_JOB = 'VIEW_AND_MANAGE_ALL_USERS_JOB',
  VIEW_CLUSTER_STATUS = 'VIEW_CLUSTER_STATUS',
  MANAGE_USER = 'MANAGE_USER',
}

export const initialPermissions: Permission[] = [
  {
    id: 1,
    name: 'Submit training job',
    key: EnumPermissionKeys.SUBMIT_TRAINING_JOB,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 2,
    name: 'Manage VC',
    key: EnumPermissionKeys.MANAGE_VC,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 3,
    name: 'View VC',
    key: EnumPermissionKeys.VIEW_VC,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 4,
    name: 'View all users jobs',
    key: EnumPermissionKeys.VIEW_ALL_USER_JOB,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 5,
    name: 'View and manage all users job',
    key: EnumPermissionKeys.VIEW_AND_MANAGE_ALL_USERS_JOB,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 6,
    name: 'View cluster status',
    key: EnumPermissionKeys.VIEW_CLUSTER_STATUS,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 7,
    name: 'Manage user',
    key: EnumPermissionKeys.MANAGE_USER,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
]
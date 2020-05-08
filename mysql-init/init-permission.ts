import { Permission } from '../src/permission/permission.entity';

export enum ProjectTypes {
  DLWORKSPACE = 'DLWORKSPACE'
}

export enum EnumPermissionKeys {
  SUBMIT_TRAINING_JOB = 'SUBMIT_TRAINING_JOB',
  CREATE_VC = 'CREATE_VC',
  EDIT_VC = 'EDIT_VC',
  DELETE_VC = 'DELETE_VC',
  USE_VC = 'USE_VC',
  VIEW_ALL_USER_JOB = 'VIEW_ALL_USER_JOB',
  MANAGE_ALL_USERS_JOB = 'MANAGE_ALL_USERS_JOB',
  VIEW_CLUSTER_STATUS = 'VIEW_CLUSTER_STATUS',
  MAGAGE_USER = 'MAGAGE_USER',
}

export const initialPermissions: Permission[] = [
  {
    id: 1,
    name: 'Submit traning job',
    key: EnumPermissionKeys.SUBMIT_TRAINING_JOB,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 2,
    name: 'Create VC',
    key: EnumPermissionKeys.CREATE_VC,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 3,
    name: 'Edit VC',
    key: EnumPermissionKeys.EDIT_VC,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 4,
    name: 'Delete VC',
    key: 'DELETE_VC',
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 5,
    name: 'Use VC',
    key: EnumPermissionKeys.USE_VC,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 6,
    name: 'View all user jobs',
    key: EnumPermissionKeys.VIEW_ALL_USER_JOB,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 7,
    name: 'manage all users job',
    key: EnumPermissionKeys.MANAGE_ALL_USERS_JOB,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 8,
    name: 'View cluster status',
    key: EnumPermissionKeys.VIEW_CLUSTER_STATUS,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 9,
    name: 'Manage user',
    key: EnumPermissionKeys.MAGAGE_USER,
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
]
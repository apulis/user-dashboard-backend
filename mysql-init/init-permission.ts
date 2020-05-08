import { Permission } from '../src/permission/permission.entity';

export enum ProjectTypes {
  DLWORKSPACE = 'DLWORKSPACE'
}

export const initialPermissions: Permission[] = [
  {
    id: 1,
    name: 'Submit traning job',
    key: 'SUBMIT_TRAINING_JOB',
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 2,
    name: 'Create VC',
    key: 'CREATE_VC',
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 3,
    name: 'Edit VC',
    key: 'EDIT_VC',
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
    name: 'View all user jobs',
    key: 'VIEW_ALL_USER_JOB',
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 6,
    name: 'manage all users job',
    key: 'MANAGE_ALL_USERS_JOB',
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 7,
    name: 'View cluster status',
    key: 'VIEW_CLUSTER_STATUS',
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
  {
    id: 8,
    name: 'Manage user',
    key: 'MAGAGE_USER',
    note: '',
    project: ProjectTypes.DLWORKSPACE,
  },
]
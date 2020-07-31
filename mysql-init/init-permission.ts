import { Permission } from '../src/permission/permission.entity';

export enum ProjectTypes {
  DLWORKSPACE = 'DLWORKSPACE',
  AI_ARTS = 'AI_ARTS',
  LABELING_PLATFORM = 'LABELING_PLATFORM',
}

export const enProjectTypes: {[props: string]: string} = {
  DLWORKSPACE: 'Expert Page',
  AI_ARTS: 'AI_ARTS',
  LABELING_PLATFORM: 'LABELING_PLATFORM',
}

export const cnProjectTypes: {[props: string]: string}  = {
  DLWORKSPACE: '专家系统',
  AI_ARTS: '高效能平台',
  LABELING_PLATFORM: '标注平台',
}

export enum EnumPermissionKeys {
  SUBMIT_TRAINING_JOB = 'SUBMIT_TRAINING_JOB',
  MANAGE_VC = 'MANAGE_VC',
  VIEW_VC = 'VIEW_VC',
  VIEW_ALL_USER_JOB = 'VIEW_ALL_USER_JOB',
  VIEW_AND_MANAGE_ALL_USERS_JOB = 'VIEW_AND_MANAGE_ALL_USERS_JOB',
  VIEW_CLUSTER_STATUS = 'VIEW_CLUSTER_STATUS',
  //
  MANAGE_USER = 'MANAGE_USER',
  //
  AI_ARTS_ALL = 'AI_ARTS_ALL',
  //
  LABELING_IMAGE = 'LABELING_IMAGE',
  DISPATCH_LABELING_TASK = 'DISPATCH_LABELING_TASK',
  REVIEW_LABELING_TASK = 'REVIEW_LABELING_TASK'
}

const initialPermissions: Permission[] = [
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
  {
    id: 8,
    name: 'AI Arts All',
    key: EnumPermissionKeys.AI_ARTS_ALL,
    note: '',
    project: ProjectTypes.AI_ARTS,
  },
  {
    id: 9,
    name: 'Labeling Image',
    key: EnumPermissionKeys.LABELING_IMAGE,
    note: '',
    project: ProjectTypes.LABELING_PLATFORM,
  },
  {
    id: 10,
    name: 'Dispatch Labeling Task',
    key: EnumPermissionKeys.DISPATCH_LABELING_TASK,
    note: '',
    project: ProjectTypes.LABELING_PLATFORM,
  },
  {
    id: 11,
    name: 'Review Labeling Task',
    key: EnumPermissionKeys.REVIEW_LABELING_TASK,
    note: '',
    project: ProjectTypes.LABELING_PLATFORM,
  },

]


// const atlasPermission = [
//   // {
//   //   name: 'Cloud inference',
//   //   key: EnumPermissionKeys.CLOUD_INFERENCE,
//   //   note: '',
//   //   project: ProjectTypes.DLWORKSPACE,
//   // },
//   {
//     name: 'Edge inference',
//     key: EnumPermissionKeys.EDGE_INFERENCE,
//     note: '',
//     project: ProjectTypes.DLWORKSPACE,
//   }
// ];

export const cnNames: {[props: string]: string} = {
  DLWORKSPACE: '依瞳平台',
  SUBMIT_TRAINING_JOB: '提交训练任务',
  MANAGE_VC: '管理虚拟集群',
  VIEW_VC: '查看 VC',
  VIEW_ALL_USER_JOB: '查看所有用户任务',
  VIEW_AND_MANAGE_ALL_USERS_JOB: '查看并管理所有用户任务',
  VIEW_CLUSTER_STATUS: '查看集群状态',
  MANAGE_USER: '管理用户',
  CLOUD_INFERENCE: '模型转换与推送',
  EDGE_INFERENCE: '中心侧推理',
  AI_ARTS_ALL: '高效能平台所有权限',
  LABELING_IMAGE: '标注图片',
  DISPATCH_LABELING_TASK: '派发标注任务',
  REVIEW_LABELING_TASK: '检验标注作业',
}

// atlasPermission.forEach(p => {
//   initialPermissions.push({
//     ...p,
//     id: initialPermissions.length + 1
//   })
// })


export { initialPermissions };

export const ASSIGNEE_TYPES = {
    USER: 'user',
    USERS: 'users',
    ROLE: 'role',
    DEPT: 'dept',
    POST: 'post'
} as const;

export const ASSIGNEE_TYPE_LABELS = {
    [ASSIGNEE_TYPES.USER]: '用户',
    [ASSIGNEE_TYPES.USERS]: '用户组',
    [ASSIGNEE_TYPES.ROLE]: '角色',
    [ASSIGNEE_TYPES.DEPT]: '部门',
    [ASSIGNEE_TYPES.POST]: '岗位'
} as const;

// 添加默认选项
export const DEFAULT_OPTIONS = {
    [ASSIGNEE_TYPES.USER]: [
        { label: '张三', value: 'zhangsan' },
        { label: '李四', value: 'lisi' },
        { label: '王五', value: 'wangwu' }
    ],
    [ASSIGNEE_TYPES.USERS]: [
        { label: '开发组', value: 'dev_group' },
        { label: '测试组', value: 'test_group' }
    ],
    [ASSIGNEE_TYPES.ROLE]: [
        { label: '管理员', value: '1' },
        { label: '普通用户', value: '2' }
    ],
    [ASSIGNEE_TYPES.DEPT]: [
        { label: '技术部', value: '1' },
        { label: '人事部', value: '2' }
    ],
    [ASSIGNEE_TYPES.POST]: [
        { label: '项目经理', value: '1' },
        { label: '开发工程师', value: '2' }
    ]
} as const;

export interface AssigneeOption {
    label: string;
    value: string;
}

export interface AssigneeTypeConfig {
    type: string;
    options: AssigneeOption[];
}

import React from 'react';
import { SolonFlowViewer } from "./components";
import { xmlStr } from "./default.ts";
import { Avatar, Card, Descriptions, Popover } from "antd";

const Viewer: React.FC<{ mode: boolean }> = (props) => {

    const value = React.useMemo(() => {
        if (props.mode) {
            return {
                data: xmlStr,
                stateful: [
                    { stateType: 'WAITING', activeNodeIds: ['step4_1'], activeColor: 'process' },
                    {
                        stateType: 'COMPLETED',
                        activeNodeIds: ['step1', 'step2', 'step3', 'step4'],
                        activeColor: 'success'
                    },
                    { stateType: 'TERMINATED', activeNodeIds: ['step4_2'], activeColor: 'danger' },
                ],
            }
        }
        return xmlStr;
    }, [props.mode]);

    const avatar = (user: any) => {
        return <Popover
            title={user.name}
            content={
                <Card title={false}>
                    <span>邮箱：easyflowable@yeah.net</span>
                    <br/>
                    <span>电话：00000001</span>
                    <br/>
                    <span>岗位：研发部</span>
                    <br/>
                    <span>角色：架构师</span>
                </Card>
            }
        >
            <Avatar src={user.avatar}/>
        </Popover>
    };

    return <SolonFlowViewer
        value={value}
        onSelect={async (e) => {
            return {
                ...e,
                users: [
                    { avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3', name: 'solon-flow' },
                    { avatar: 'https://solon.noear.org/img/solon/favicon256.png', name: 'solon' },
                    { avatar: 'https://gitee.com/widgets/gitee_tenth_large.png', name: 'ajie' },
                ],
                startTime: '2025年12月18日10点54分',
                endTime: '2025年12月20日10点54分',
                status: '未知',
                duration: '一坤年',
            };
        }}
        popoverRender={(content: any) => {
            return (
                <Descriptions style={{ maxWidth: '16vw' }} column={1}>
                    <Descriptions.Item label="执行人">
                        <Avatar.Group
                            size="large"
                            max={{
                                count: 2,
                                style: { color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' },
                                popover: { trigger: 'hover' },
                            }}
                        >
                            {content.users.map((item: any) => avatar(item))}
                        </Avatar.Group>
                    </Descriptions.Item>
                    <Descriptions.Item label="节点状态">{content.status}</Descriptions.Item>
                    <Descriptions.Item label="耗时">{content.duration}</Descriptions.Item>
                    <Descriptions.Item label="开始时间">{content.startTime}</Descriptions.Item>
                    <Descriptions.Item label="结束时间">{content.endTime}</Descriptions.Item>
                </Descriptions>
            );
        }}/>;
}

export default Viewer;

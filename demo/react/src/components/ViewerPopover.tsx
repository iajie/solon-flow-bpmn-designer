import React from "react";
import { Descriptions } from "antd";

const ViewerPopover: React.FC<any> = (props) => {

    return <Descriptions title={props.name || props.id} style={{ display: 'none' }}>
        <Descriptions.Item label="执行人">{props.author}</Descriptions.Item>
        <Descriptions.Item label="节点状态">{props.status}</Descriptions.Item>
        <Descriptions.Item label="任务耗时">{props.duration}</Descriptions.Item>
        <Descriptions.Item label="开始时间">{props.startTime}</Descriptions.Item>
        <Descriptions.Item label="结束时间">{props.endTime}</Descriptions.Item>
    </Descriptions>
}

export default ViewerPopover;

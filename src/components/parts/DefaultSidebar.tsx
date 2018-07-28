import React from 'react';
import { Card, Timeline } from 'antd';

function getTimeline(): Array<string> {
    return [
        'Create a services site 2015-09-01',
        'Solve initial network problems 2015-09-01',
        'Technical testing 2015-09-01',
        'Network problems being solved 2015-09-01'
    ];
}

const DefaultSidebar = () => (
    <Card title="一周最热" bordered={false} className="content-menu">
        <Timeline>
            {getTimeline().map((item, key) => {
                return <Timeline.Item key={key}>{item}</Timeline.Item>;
            })}
        </Timeline>
    </Card>
);

export default DefaultSidebar;

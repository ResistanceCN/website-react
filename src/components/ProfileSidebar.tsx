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

export default (props: {}) => (
    <Card title="账户设置" bordered={false} className="content-menu">
        // Demo
    </Card>
);

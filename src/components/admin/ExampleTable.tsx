import React from 'react';
import { Icon, Table } from 'antd';

const { Column } = Table;

interface DemoRecord {
    key: string;
    name: string;
    age: number;
    address: string;
}

const data: Array<DemoRecord> = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park'
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
    },
    {
        key: '3',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
    },
    {
        key: '4',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
    },
    {
        key: '5',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park'
    }
];

export default class ExampleTable extends React.Component {
    render() {
        return (
            <Table dataSource={data}>
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="Age" dataIndex="age" key="age" />
                <Column title="Address" dataIndex="address" key="address" />
                <Column
                    title="Action"
                    key="action"
                    render={(text, record: DemoRecord) => (
                        <div>
                            <a href="#">Action - {record.name}</a>
                            <span className="ant-divider" />
                            <a href="#">Delete</a>
                            <span className="ant-divider" />
                            <a href="#" className="ant-dropdown-link">
                            More actions <Icon type="down" />
                            </a>
                        </div>
                    )}
                />
            </Table>
        );
    }
}

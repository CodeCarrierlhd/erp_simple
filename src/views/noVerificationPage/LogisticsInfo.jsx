import React, { useEffect, useState } from "react"
import { Table, Input } from 'antd';
import $axios from '../../axios/$axios';
const { Search } = Input;


function LogisticsInfo(props) {
    const [data, setTableData] = useState([]);
    useEffect(() => {
        $axios.get('/logisticsStatisticsList').then(res => {
            console.log(res);
            if (res.code === 200) {
                setTableData(res.data)
            } else {
                console.log(res.msg);
            }
        })
    }, [])
    
    const columns = [
        {
            title: '当前时间',
            dataIndex: 'trackTime',
        },
        {
            title: '当前状态',
            dataIndex: 'trackText',
        },
        {
            title: '运输开始时间',
            dataIndex: 'startTime',
        },
        {
            title: '物流号',
            dataIndex: 'trackingNumber',
        },
        {
            title: '订单编号',
            dataIndex: 'orderNumber',
        },
        {
            title: 'sku',
            dataIndex: 'sku',
        },
    ];
    


    function onSearch(value) {
        $axios.get('/logisticsStatisticsList', { 
            params: {
                keyValue: value,
            }
         }).then(res => {
            console.log(res);
            if (res.code === 200) {

            } else {
                console.log(res.msg);
            }
        })
    }
    return (
        <div style={{ margin: '40px',fontSize:'22px' }}>
            <p style={{width:'30%'}}>
            <Search placeholder="input search text" onSearch={onSearch} enterButton />
            </p>
            <Table columns={columns} dataSource={data} size="small" />
        </div>
    )
}

export default LogisticsInfo
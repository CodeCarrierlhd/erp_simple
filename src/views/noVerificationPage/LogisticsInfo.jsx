import React, { useEffect, useState } from "react"
import { Table, Input,Select  } from 'antd';
import $axios from '../../axios/$axios';
import moment from 'moment'
const { Search } = Input;
const { Option } = Select;


function LogisticsInfo(props) {
    const [data, setTableData] = useState([]);
    const [pageOption, setPageOption] = useState({
        pageNo: 1,
        pageSize: 30
    })
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: () => `共${data.length}条`,
        total: data.length,
        pageSizeOptions:['30','50','100'],
        current: (pageOption.pageNo-1)*pageOption.pageSize,
        pageSize: pageOption.pageSize,
        onShowSizeChange: (current,pageSize) => changePageSize(current,pageSize),
        onChange: (current, size) => paginationChange(current, size)
    }
    // 当前页面切换
    
    const paginationChange = async (current, size) => {
        console.log('page', current, size)
        setPageOption({
            pageNo: current,
            pageSize: size
        })
    }
    const changePageSize = async (current, size) => {
        console.log('page', current, size)
        setPageOption({
            pageNo: current,
            pageSize: size
        })
    }

    useEffect(() => {
        // document.title='物流信息'
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
            render: (text, record) => moment(text).format("YYYY-MM-DD")
        },
        {
            title: '当前状态',
            dataIndex: 'trackText',
        },
        {
            title: '运输开始时间',
            dataIndex: 'startTime',
            render: (text, record) => moment(text).format("YYYY-MM-DD")
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
                setTableData(res.data)
            } else {
                console.log(res.msg);
            }
        })
    }

    function handleChange(value) {
        console.log(`selected ${value}`);
        onSearch(value)
      }
      function handleWarehouseChange(value) {
        console.log(`selected ${value}`);
        onSearch(value)
      }
    return (
        <div style={{ margin: '40px' }}>
            <div style={{ width: '45%',display:'flex',marginBottom:'15px' }}>
                <Search placeholder="input search text" onSearch={onSearch} enterButton />
                <span style={{width:'15%',marginLeft:'15px',textAlign:'center',lineHeight:'32px'}}>状态：</span>
                <Select defaultValue="" onChange={handleChange} style={{width:'40%',marginLeft:'15px'}}>
                    <Option value="1">全部</Option>
                    <Option value="3">异常</Option>
                </Select>
                <span style={{width:'15%',marginLeft:'15px',textAlign:'center',lineHeight:'32px'}}>仓库：</span>
                <Select defaultValue="" onChange={handleWarehouseChange} style={{width:'40%',marginLeft:'15px'}}>
                    <Option value="5">云仓</Option>
                    <Option value="6">其他</Option>
                </Select>
            </div>
            <Table columns={columns} dataSource={data}
                bordered
                pagination={paginationProps}
                rowKey={record => record.trackingNumber}
            />
        </div>
    )
}

export default LogisticsInfo
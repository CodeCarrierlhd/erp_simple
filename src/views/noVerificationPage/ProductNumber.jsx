import React, { useEffect, useState } from "react"
import { Table, Input } from 'antd';
import LazyLoad from '../../components/LazyLoad'
import $axios from '../../axios/$axios';
const { Search } = Input;


function ProducNumber(props) {
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
        current: pageOption.pageNo,
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
    const handleMianImage = (record) => {
        if (record.mainImg) {
            let mainImg = process.env.REACT_APP_URL + '/imgs/' + record.mainImg.split(',')[0]
            // return (<div>
            //     <img src={mainImg} alt="not found" style={{ width: '80px', height: '80px', marginRight: '15px' }} />
            // </div>)
            return <LazyLoad 
            state={{
                src: mainImg,
                alt: '',
                width:'50%',
                height:'2%',
                BoxClassName: 'lazyload-box', // 这是容器的类名
                ImgClassName: 'lazyload-img' // 这是img的类名
            }}
        ></LazyLoad>

        }
    }
    useEffect(() => {
        // document.title='物流信息'
        $axios.get('/productWarehouseList').then(res => {
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
            title: '图片',
            width: '30%',
            key: 'mainImg',
            render: (text, record) => handleMianImage(record)
        },
        {
            title: '产品SKU',
            width: '15%',
            dataIndex: 'mpn',
            key: 'mpn',
        },
        {
            title: '产品名称',
            width: '15%',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: '产品数量',
            dataIndex: 'productNumber',
            key: 'productNumber',
            width: '15%',
        },
        {
            title: 'Action',
            key: 'operation',
            width: '15%',
            render: (text, record) =>{               
                return (<div>
                { record.fileUpload == null ? '' : <a href={process.env.REACT_APP_URL + '/imgs/' + record.fileUpload} download="">{record.mpn}</a>}
            </div>)
            }
        },

    ]



    function onSearch(value) {
        $axios.get('/productWarehouseList', {
            params: {
                 value
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
    return (
        <div style={{ margin: '40px', fontSize: '22px',padding:'80px 100px' }}>
            <p style={{ width: '30%' }}>
                <Search placeholder="input search text" onSearch={onSearch} enterButton />
            </p>
            <Table columns={columns} dataSource={data}
                bordered
                pagination={paginationProps}
                rowKey={(record,index) => record.mpn}
            />
        </div>
    )
}

export default ProducNumber
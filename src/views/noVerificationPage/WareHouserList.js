import React, { Component } from 'react';
import { Table } from 'antd';
import moment from 'moment'
import LazyLoad from '../../components/LazyLoad'

class WareHouserList extends Component {
    state = {
        warsehouseData: []
    }
    componentDidMount() {
        this.getData()
    }
    handleMianImage = (record) => {
        if (record.mainImg) {
            let mainImg = process.env.REACT_APP_URL + '/imgs/' + record.mainImg.split(',')[0]
            // return (<div>
            //     <img src={mainImg} alt="not found" style={{ width: '80px', height: '80px', marginRight: '15px' }} />
            // </div>)
            return <LazyLoad 
            state={{
                src: mainImg,
                alt: '',
                width:'140px',
                height:'140px',
                BoxClassName: 'lazyload-box', // 这是容器的类名
                ImgClassName: 'lazyload-img' // 这是img的类名
            }}
        ></LazyLoad>

        }
    }
    getData = () => {
        this.$axios.get('/allWarehouseList').then(res => {
            if (res.code === 200) {
                res.data.forEach(item => {
                     this.getChildData(item)
                });
            } else {
                console.log(res.msg);
            }
        })
    }
    getChildData = (item) => {
        const {warsehouseData}=this.state
         this.$axios.get('/warehouse/' + item.id).then(res => {
            if (res.code === 200) {
                item.childrenData = res.data
                warsehouseData.push(item)
                this.setState({
                    warsehouseData
                })
            } else {
                console.log(res.msg);
            }
        })
    }
    render() {
        const columns = [
            {
                title: '图片',
                width: 100,
                render: (text, record) => this.handleMianImage(record)
            },
            {
                title: '产品SKU',
                width: 80,
                dataIndex: 'mpn',
                key: 'mpn',
            },
            {
                title: '产品名称',
                width: 100,
                dataIndex: 'productName',
                key: 'productName',
            },
            {
                title: '产品数量',
                dataIndex: 'productNumber',
                key: 'productNumber',
                width: 50,
            },

        ]
        const {warsehouseData}=this.state
        return (
            <div style={{ margin: '40px',fontSize:'22px' }}>
                {
                    warsehouseData.map((item, index) => {
                        return <div style={{ padding: '50px 50px' }} key={index}>
                            {/* <p key={item.id+'a'+index}>到柜时间：{ moment(item.arrivalTime).format("YYYY-MM-DD") }-------- {item.inWarehouse === 1 ?  <span style={{color:'yellow'}}>已入仓</span> : <span style={{color:'red'}}>未入仓</span>}</p> */}
                            <p>到柜时间：{ moment(item.arrivalTime).format("YYYY-MM-DD") }--------<span>未入仓</span></p>
                            <Table columns={columns} dataSource={item.childrenData} size="middle" rowKey={(record, index) => `complete${record.id}${index}`} pagination={false}/>
                        </div>
                    })
                }
            </div>
        );
    }
}

export default WareHouserList;
import React, { Component } from 'react'
import moment from 'moment'
import { PermissionModel } from '../../../components/PermissionModel';
import AddWareHouse from './AddWareHouse'
import { Table, Modal, Button, Select, Input } from 'antd';
const { Option } = Select;
const { Search } = Input;
//未入仓


const role_type = JSON.parse(localStorage.getItem('userInfo')) === null ? '' : JSON.parse(localStorage.getItem('userInfo')).type
export default class NotPlaced extends Component {
    state = {
        warehouseData: [],
        subData: [],
        showWareHouse: false,
        selectedRows: [],
        showWareHouseEdit: false,
        defaultWarehouse: 'all'

    }
    componentDidMount() {
        this.props.onRef(this)
        this.getWareHouseList()
    }
    handleWarehouseChange = (value) => {
        console.log(`selected ${value}`);
        this.setState({
            defaultWarehouse: value
        })
        this.$axios.get('/findWarehouseByType', {
            params: {
                warehouseType: value,
                inWarehouse: this.props.inWarehouse
            }
        }).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    warehouseData: res.data
                })
            } else {
                console.log(res.msg);
            }
        })

    }
    showInfo = (e, record) => {
        e.preventDefault()
        console.log(record);
        this.getProductListById(record)
        this.setState({
            showWareHouse: true
        })
    }
    delWarehouse = (e, record) => {
        e.preventDefault()
        if (role_type !== 1) {
            return PermissionModel('删除')
        }

        let ids = []
        ids.push(record.id)
        this.delWareHouseByIds(ids)
    }
    editWarehouse = (e, record) => {
        e.preventDefault()
        if (role_type !== 1) {
            return PermissionModel('编辑')
        }
        this.setState({
            showWareHouseEdit: true,
            childData: record
        })
    }
    getWareHouseList = () => {
        let that = this
        that.$axios.get('/warehouseList/' + this.props.inWarehouse).then(res => {
            if (res.code === 200) {
                that.setState({
                    warehouseData: res.data
                })

            } else {
                console.log(res.msg);
            }
        })
    }
    getProductListById = (record) => {
        this.$axios.get('/warehouse/' + record.id).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    subData: res.data
                })
            } else {
                console.log(res.msg);
            }
        })
    }
    handleMianImage = (record) => {
        if (record.mainImg) {
            let mainIng = process.env.REACT_APP_URL + '/imgs/' + record.mainImg.split(',')[0]
            return (<div>
                <img src={mainIng} alt="not found" style={{ width: '80px', height: '80px', marginRight: '15px' }} />
            </div>)
        }

    }

    handleOk = () => {
        this.setState({
            showWareHouse: false,
            showWareHouseEdit: false
        })
        if (this.state.childData) {
            this.formChild.handleSubmit()
        }

    };

    handleCancel = () => {
        this.setState({
            showWareHouse: false,
            showWareHouseEdit: false
        })
    };
    selecteWarehouse = (arr) => {
        this.setState({
            selectedRows: arr
        })
    }
    delAllWareHouse = () => {
        let ids = []
        const { selectedRows } = this.state
        selectedRows.map(item => {
            return ids.push(item.id)
        })
        this.delWareHouseByIds(ids)
    }
    delWareHouseByIds = (ids) => {
        this.$axios.delete('/delWarehouse', {
            params: {
                ids
            }
        }).then(res => {
            console.log(res);
            if (res.data.code === 200) {
                this.getWareHouseList()
            } else {
                console.log(res.msg);
            }
        })
    }
    onSearch = (value) => {
        console.log(value)
        let url=''
        if(value){
            url='/findWarehouseBySku/' + value
        }else{
            url='/warehouseList/' + this.props.inWarehouse
        }
        this.$axios.get(url).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    warehouseData: res.data
                })
            } else {
                console.log(res.msg);
            }
        })
    }
    getFormValue = (ref) => {
        this.formChild = ref
    }
    handleTime = (time) => {
        if(time){
            let new_date = new Date(); //新建一个日期对象，默认现在的时间
            let old_date = new Date(time); //设置过去的一个时间点，"yyyy-MM-dd HH:mm:ss"格式化日期
            let difftime = (new_date - old_date) / 1000; //计算时间差,并把毫秒转换成秒
            let days = parseInt(Math.abs(difftime) / 86400); // 天  24*60*60*1000 
            return (
                <span style={{ color: days <= 14 ? 'red' : '', fontSize: '18px' }}>
                    {moment(time).format("YYYY-MM-DD")}
                </span>
            )
        }else{
            return (
                <span style={{  fontSize: '18px' }}>
                   未到港
                </span>
            )
        }

    }
    handleShowName = (keyNumber) => {
        let text = ''
        switch (keyNumber) {
            case '1':
                text = '陈总仓';
                break;
            case '2':
                text = '谢总仓';
                break;
            case '3':
                text = '至美通';
                break;
            case '4':
                text = '易仓';
                break;
            case '5':
                text = '云仓';
                break;
            default:
                text = '';
        }
        return text


    }
    render() {
        const columns = [
            {
                title: '订舱号',
                width: 200,
                dataIndex: 'cabinNumber',
                key: 'cabinNumber',
            },
            {
                title: '集装箱号',
                dataIndex: 'containerNumber',
                key: 'containerNumber',
            },
            {
                title: '柜型',
                dataIndex: 'wareHouseModel',
                key: 'wareHouseModel',
            },
            {
                title: '封条',
                dataIndex: 'sealPart',
                key: 'sealPart',
            },
            {
                title: '发柜日期',
                dataIndex: 'deliveryDate',
                key: 'deliveryDate',
                render: (text, record) => moment(text).format("YYYY-MM-DD")
            },
            {
                title: '预计到港时间',
                dataIndex: 'arrivalTime',
                key: 'arrivalTime',
                render: (text, record) => this.handleTime(text)
            },
            {
                title: '实际到港时间',
                dataIndex: 'relArrivedTime',
                key: 'relArrivedTime',
                render: (text, record) => this.handleTime(text)
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: 200,
            },

            {
                title: '产品',
                key: 'productList',
                render: (text, record) => <a href="" onClick={e => this.showInfo(e, record)} >查看</a>
            },
            {
                title: '附件',
                key: 'fileUpload',
                render: (text, record) =>
                    record.fileUpload == null ? '' : <a href={process.env.REACT_APP_URL + '/imgs/' + record.fileUpload} download="">下载发货清单</a>

            },
            {
                title: '所属仓库',
                dataIndex: 'warehouseType',
                key: 'warehouseType',
                render: (text, record) => this.handleShowName(text)
            },
            {
                title: 'Action',
                key: 'operation',


                render: (text, record) =>
                    <div style={{ width: '100px', display: 'flex', justifyContent: 'space-around' }}>
                        <a href="" onClick={e => this.delWarehouse(e, record)} >删除</a>
                        <a href="" onClick={e => this.editWarehouse(e, record)} >编辑</a>
                    </div>

            },
        ];

        const columnsSub = [
            {
                title: 'SKU',
                width: 100,
                dataIndex: 'mpn',
                key: 'mpn',
            },
            {
                title: '名称',
                width: 100,
                dataIndex: 'productName',
                key: 'productName',
            },
            {
                title: '数量',
                dataIndex: 'productNumber',
                key: 'productNumber',
                width: 150,
            },
            {
                title: '图片',
                width: 150,
                render: (text, record) => this.handleMianImage(record)
            }
        ];

        const { warehouseData, showWareHouse, subData, selectedRows, showWareHouseEdit, childData, defaultWarehouse } = this.state
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.selecteWarehouse(selectedRows)
            },
        };
        const warehouseGroup = [
            { value: '1', name: '陈总仓' },
            { value: '2', name: '谢总仓' },
            { value: '3', name: '至美通' },
            { value: '4', name: '易仓' },
            { value: '5', name: '云仓' },
        ]
        return (
            <div>
                <div style={{ marginBottom: '20px', display: 'flex' }}>
                    <div>
                        <span style={{ marginRight: '10px' }}>
                            仓库
                        </span>
                        <Select defaultValue={defaultWarehouse} style={{ width: 120 }} onChange={this.handleWarehouseChange}>
                            {/* <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="Yiminghe">yiminghe</Option> */}
                            <Option value='all' >全部</Option>
                            {warehouseGroup.map(item => {
                                return <Option value={item.value} key={item.value}>{item.name}</Option>
                            })}
                        </Select>
                    </div>
                    <div style={{ marginLeft: '30px', }}>
                        <span style={{ marginRight: '10px' }}>
                            根据产品SKU查询仓库
                        </span>
                        <Search placeholder="根据产品SKU查询对应仓库" allowClear onSearch={this.onSearch} style={{ width: 200 }} />
                    </div>
                    <Button type="primary" disabled={selectedRows.length === 0} onClick={this.delAllWareHouse} style={{ float: 'right', marginBottom: '10px' }}>
                        全部删除
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={warehouseData}
                    scroll={{ x: 1800, y: 700 }}
                    rowKey={record => record.id}
                    rowSelection={{
                        ...rowSelection,
                    }}
                />
                <Modal title="Product Modal" visible={showWareHouse} onOk={this.handleOk} onCancel={this.handleCancel} width='900px'>
                    <Table columns={columnsSub} dataSource={subData} scroll={{ x: 600, y: 300 }} rowKey={record => record.productId} />
                </Modal>
                <Modal title="Edit Warehouse" visible={showWareHouseEdit} onOk={this.handleOk} onCancel={this.handleCancel} width='900px'>
                    <AddWareHouse childData={childData} onRef={this.getFormValue} getWareHouseList={this.getWareHouseList} />
                </Modal>
            </div>
        )
    }
}

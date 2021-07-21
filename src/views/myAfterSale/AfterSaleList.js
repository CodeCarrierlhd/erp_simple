import React, { Component } from 'react'
import moment from 'moment';
import Carousel from 'react-images'
import AccessoriesForm from './AccessoriesForm';
import { Table, Modal, Input } from 'antd';
const { Search } = Input;

export default class AfterSaleList extends Component {
    state = {
        showSaleHistory: false,
        afterSaleData: [],
        lightboxIsOpen: false,
        afterSaleId: '',
        pageOption:{
            pageNo: 0,
            pageSize: 50
        },
        total:0
    }
    componentDidMount() {
        const {pageOption}=this.state
        this.getAfterSaleList(pageOption)
    }
    getAfterSaleList = (pageOption) => {
        this.$axios.get('/afterSaleList',{
            params:{pageOption}
        }).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    afterSaleData: res.data.rows,
                    total:res.data.total
                })
            } else {
                console.log(res.msg);
            }
        })
    }
    handleOk = () => {
        this.setState({
            showSaleHistory: false
        })
    };

    handleCancel = () => {
        this.setState({
            showSaleHistory: false
        })
    };
    handleShowName = (keyNumber, type) => {
        let text = ''
        if (type === 1) {
            switch (keyNumber) {
                case 1:
                    text = '亚马逊大号';
                    break;
                case 2:
                    text = '亚马逊小号';
                    break;
                case 3:
                    text = 'varfier大号';
                    break;
                case 4:
                    text = 'varfier小号';
                    break;
                default:
                    text = '';
            }
            return text
        } else {
            switch (keyNumber) {
                case 1:
                    text = '陈总仓';
                    break;
                case 2:
                    text = '谢总仓';
                    break;
                case 3:
                    text = '至美通';
                    break;
                case 4:
                    text = '易仓';
                    break;
                case 5:
                    text = '云仓';
                    break;
                default:
                    text = '';
            }
            return text
        }

    }
    accessoriesInfo = (e, record) => {
        e.preventDefault()
        this.setState({
            showSaleHistory: true,
            afterSaleId: record.id
        })
    }
    handleMianImage = (record) => {
        if (record.productImage) {
            let fileList = record.productImage.split(',')
            let myImages = []
            fileList.forEach(item => {
                let url = process.env.REACT_APP_URL + '/imgs/' + item
                myImages.push({ source: url })
            });
            // let mainIng = process.env.REACT_APP_URL + '/imgs/' + record.mainImg.split(',')[0]
            return (<div>
                <Carousel views={myImages} />
            </div>)
        }

    }
    onSearch = (value) => {
        this.$axios.get('/afterSaleList', {
            params: {
                value
            }
        }).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    afterSaleData: res.data
                })
            } else {
                console.log(res.msg);
            }
        })
    }
    paginationChange =  (current, size) => {
        const {pageOption}=this.state
        let p=Object.assign(pageOption,{ pageNo: current,pageSize: size})
        this.setState({
            pageOption:p
        })
        this.getAfterSaleList({ pageNo: current,pageSize: size})
    }
    changePageSize =  (current, size) => {
        const {pageOption}=this.state
        let p=Object.assign(pageOption,{ pageNo: 1,pageSize: size})
        this.setState({
            pageOption:p
        })
        this.getAfterSaleList({ pageNo: current,pageSize: size})
    }
    render() {
        const columns = [
            {
                title: '账号',
                dataIndex: 'account',
                key: 'account',
                render: (text, record) => this.handleShowName(record.account, 1)
            },
            {
                title: '订单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
            },
            {
                title: '产品SKU',
                dataIndex: 'sku',
                key: 'sku',
            },
            {
                title: '平台售后日期',
                dataIndex: 'saleDate',
                key: 'saleDate',
                render: (text, record) => moment(text).format("YYYY-MM-DD")
            },
            {
                title: '货物发出仓',
                dataIndex: 'sendWarehouse',
                key: 'sendWarehouse',
                render: (text, record) => this.handleShowName(record.sendWarehouse, 2)
            },
            {
                title: '货物退回仓',
                dataIndex: 'backWarehouse',
                key: 'backWarehouse',
                render: (text, record) => this.handleShowName(record.backWarehouse, 2)
            },
            {
                title: '物流单号',
                dataIndex: 'flowOrderNumber',
                key: 'flowOrderNumber',
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            },
            {
                title: '缩略图',
                render: (text, record) => this.handleMianImage(record)
            },
            {
                title: 'Action',
                key: 'operation',
                render: (text, record) => <a href="" onClick={e => this.accessoriesInfo(e, record)} >配件详情</a>
            },
        ];
        const { afterSaleData, showSaleHistory, afterSaleId,pageOption,total } = this.state
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.selecteWarehouse(selectedRows)
            },
        };
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: () => `共${total}条`,
            total: total,
            pageSizeOptions: ['50', '100', '200'],
            current: pageOption.pageNo,
            pageSize: pageOption.pageSize,
            onShowSizeChange: (current, pageSize) => this.changePageSize(current, pageSize),
            onChange: (current, size) => this.paginationChange(current, size)
        }
        return (
            <div>
                <p style={{ width: '30%' }}>
                    <Search placeholder="input search text" onSearch={this.onSearch} enterButton />
                </p>
                <Table
                    columns={columns}
                    dataSource={afterSaleData}
                    scroll={{ x: 1500, y: 700 }}
                    rowKey={record => record.id}
                    pagination={paginationProps}
                    rowSelection={{
                        ...rowSelection,
                    }}
                />
                <Modal title="Basic Modal" visible={showSaleHistory} onOk={this.handleOk} onCancel={this.handleCancel} width='600px' height='800px' destroyOnClose={true}>
                    <AccessoriesForm afterSaleId={afterSaleId} key={afterSaleId.toString()}/>
                </Modal>
            </div>
        )
    }
}

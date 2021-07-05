import React, { Component } from 'react'
import moment from 'moment';
import Carousel from 'react-images'
import AccessoriesForm from './AccessoriesForm';
import { Table, Modal } from 'antd';

export default class AfterSaleList extends Component {
    state = {
        showSaleHistory: false,
        afterSaleData: [],
        lightboxIsOpen: false,
        afterSaleId: ''
    }
    componentDidMount() {
        this.getAfterSaleList()
    }
    getAfterSaleList = () => {
        this.$axios.get('/afterSaleList').then(res => {
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
        const { afterSaleData, showSaleHistory, afterSaleId } = this.state
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.selecteWarehouse(selectedRows)
            },
        };
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={afterSaleData}
                    scroll={{ x: 1500, y: 700 }}
                    rowKey={record => record.id}
                    rowSelection={{
                        ...rowSelection,
                    }}
                />
                <Modal title="Basic Modal" visible={showSaleHistory} onOk={this.handleOk} onCancel={this.handleCancel} width='600px' height='800px'>
                    <AccessoriesForm afterSaleId={afterSaleId} />
                </Modal>
            </div>
        )
    }
}
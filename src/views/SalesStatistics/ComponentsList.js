import React, { Component } from 'react'
import moment from 'moment';
import ExclTable from '../exclTable/index'
import { PermissionModel } from '../../components/PermissionModel';
import AddComponents from './AddComponents';
import { Table, Modal, Button } from 'antd';
import { downloadFileToExcel } from '../../utils/index'
const role_type = JSON.parse(localStorage.getItem('userInfo')) === null ? '' : JSON.parse(localStorage.getItem('userInfo')).type
export default class ComponentsList extends Component {
    state = {
        showSaleHistory: false,
        afterSaleData: [],
        showTable: false,
        importCoulmus: [],
        importDate: [],
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
        this.$axios.get('/partsStatisticsList',{
            params:pageOption
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
        this.formChild.handleSubmit()
        this.setState({
            showSaleHistory: false
        })
    };
    handleInsertData = () => {
        // this.formChild.handleSubmit()
        this.setState({
            showTable: false
        })
    };

    handleCancel = () => {
        this.setState({
            showSaleHistory: false
        })
    };
    handleCancelInsert = () => {
        this.setState({
            showTable: false
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
        } else if (type === 2) {
            switch (keyNumber) {
                case '1':
                    text = '新货拆箱';
                    break;
                case '2':
                    text = '随柜配件';
                    break;
                case '3':
                    text = '退货拆箱';
                    break;
                default:
                    text = '';
            }
            return text
        } else {
            switch (keyNumber) {
                case '1':
                    text = '玻璃';
                    break;
                case '2':
                    text = '台面';
                    break;
                case '3':
                    text = '腿';
                    break;
                case '4':
                    text = '底部';
                    break;
                case '5':
                    text = '五金件';
                    break;
                default:
                    text = '';
            }
            return text
        }

    }
    accessoriesInfo = (e, record) => {
        e.preventDefault()
        if (role_type !== 1) {
            return PermissionModel('编辑')
        }
        this.setState({
            showSaleHistory: true,
            childData: record
        })
    }
    getFormValue = (ref) => {
        this.formChild = ref
    }
    getTableDate = (ref) => {
        this.tableChild = ref
    }
    showTableModle = () => {
        console.log(this.tableChild.state);
        this.setState({
            showTable: true,
            importDate: this.tableChild.state.tableData,
            importCoulmus: this.tableChild.state.tableHeader
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
                title: '订单日期',
                dataIndex: 'saleDate',
                key: 'saleDate',
                render: (text, record) => moment(text).format("YYYY-MM-DD")
            },
            {
                title: '更换方式',
                dataIndex: 'wayType',
                key: 'wayType',
                render: (text, record) => this.handleShowName(record.wayType, 2)
            },
            {
                title: '更换部位',
                dataIndex: 'wayPart',
                key: 'wayPart',
                render: (text, record) => this.handleShowName(record.wayPart, 3)
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            },
            {
                title: 'Action',
                key: 'operation',
                render: (text, record) => <a href="" onClick={e => this.accessoriesInfo(e, record)} >编辑</a>
            },
        ];
        const { afterSaleData, showSaleHistory, childData, showTable, importCoulmus, importDate,pageOption,total  } = this.state
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.selecteWarehouse(selectedRows)
            },
        };
        const tableHeader = ['账号', '订单日期', '订单号', '产品SKU', '更换方式', '更换部位', '备注']
        const tableColums = ['account', 'saleDate', 'orderNumber', 'sku', 'wayType', 'wayPart', 'remark']
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
                <ExclTable showTableModle={this.showTableModle} onRef={this.getTableDate} tableHeader={tableHeader} />
                <Button type="primary" onClick={() => downloadFileToExcel(afterSaleData, tableHeader, tableColums)} style={{ marginBottom: "15px" }}>下载</Button>
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
                <Modal title="Basic Modal" visible={showSaleHistory} onOk={this.handleOk} onCancel={this.handleCancel} width='900px' height='800px'>
                    <AddComponents childData={childData} onRef={this.getFormValue} getAfterSaleList={this.getAfterSaleList} />
                </Modal>

                <Modal title="import data" visible={showTable} onOk={this.handleInsertData} onCancel={this.handleCancelInsert} width='900px'>
                    <Table
                        columns={importCoulmus}
                        dataSource={importDate}
                        scroll={{ x: 1500, y: 700 }}
                        rowKey={(record, index) => index.toString()}
                    />
                </Modal>
            </div>
        )
    }
}

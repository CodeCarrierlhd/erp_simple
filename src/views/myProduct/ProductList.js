import React, { Component } from 'react';
import { Table, Button, Modal,Input } from 'antd';
import EditForm from './productCompontent/EditForm'
import { PermissionModel } from '../../components/PermissionModel'
const { Search } = Input;

const role_type = JSON.parse(localStorage.getItem('userInfo')) === null ? '' : JSON.parse(localStorage.getItem('userInfo')).type
class ProductList extends Component {
    state = {
        productData: [],
        selectedRows: [],
        editVisiable: false,
        childData: {}
    }

    componentDidMount() {
        this.getProductList()
    }
    getProductList = () => {
        this.$axios.get('/productList').then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    productData: res.data
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
                <img src={mainIng} alt="not found" style={{ width: '100px', height: '100px', marginRight: '15px' }} />
                <span>{record.productName}</span>
            </div>)
        }

    }

    //删除按钮
    delProduct = (e, record) => {

        e.preventDefault()
        if (role_type !== 1) {
            return PermissionModel('删除')
        } else {
            let ids = []
            ids.push(record.id)
            this.delProductByIds(ids)
        }

    }
    //删除请求接口
    delProductByIds = (ids) => {
        this.$axios.delete('/delProduct', {
            params: {
                ids
            }
        }).then(res => {
            console.log(res);
            if (res.data.code === 200) {
                this.getProductList()
            } else {
                console.log(res.msg);
            }
        })
    }
    selecteWarehouse = (arr) => {
        this.setState({
            selectedRows: arr
        })
    }
    delAllWareHouse = () => {
        if (role_type !== 1) {
            return PermissionModel('删除')
        } else {
            let ids = []
            const { selectedRows } = this.state
            selectedRows.map(item => {
                return ids.push(item.id)
            })
            this.delProductByIds(ids)
        }

    }
    editProduct = (e, record) => {
        e.preventDefault()
        console.log(record);
        if (role_type !== 1) {
            return PermissionModel('编辑')
        } else {
            this.setState({
                editVisiable: true,
                childData: record
            })
        }


    }
    handleOk = () => {
        this.formChild.handleSubmit()
        this.setState({
            editVisiable: false
        }, () => {
            let newData = Object.assign(this.state.childData, this.formChild.state.newData);
            // let newData = this.formChild.state.newData
            console.log(newData);
            this.updateProduct(newData)
        })
    };

    handleCancel = () => {
        this.setState({
            editVisiable: false
        })
    };
    getFormValue = (ref) => {
        this.formChild = ref
    }
    updateProduct = (product) => {
        this.$axios.put('/updateProduct', {
            params: {
                productId: product.id
            }, ...product
        }).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.getProductList()
            } else {
                console.log(res.msg);
            }
        })
    }
    onSearch = value => {
        console.log(value)
        let url=''
        if(value){
            url='/findProductBySku/' + value
        }else{
            url='/productList'
        }
        
        this.$axios.get(url).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    productData: res.data
                })
            } else {
                console.log(res.msg);
            }
        })
    };
    render() {
        const columns = [
            {
                title: 'MPN',
                dataIndex: 'mpn',
                key: 'mpn',
            },
            {
                title: '产品名称',
                render: (text, record) => this.handleMianImage(record)
            },
            {
                title: '组合MPN',
                key: 'soldSeparately',
                render: (text, record) => record.soldSeparately === '1' ? 'YES' : 'NO'
            },
            {
                title: '当前价格',
                dataIndex: 'nowPrice',
                key: 'nowPrice',
            },
            {
                title: '显示价格',
                key: 'showPrice',
                render: (text, record) => record.showPrice === '1' ? 'Visible' : 'Invisible'
            },
            {
                title: 'Action',
                key: 'operation',
                render: (text, record) =>{                 
                    return (<div style={{ width: '100px', display: 'flex', justifyContent: 'space-around' }}>
                    <a href="" onClick={e => this.delProduct(e, record)} >删除</a>
                    <a href="" onClick={e => this.editProduct(e, record)} >编辑</a>
                    { record.fileUpload == null ? '' : <a href={process.env.REACT_APP_URL + '/imgs/' + record.fileUpload} download="">附件</a>}
                </div>)
                }
            },
        ];
        const { productData, selectedRows, editVisiable, childData } = this.state
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.selecteWarehouse(selectedRows)
            },
        };
        return (
            <div>
                <div style={{ margin: '20px', display: 'flex' }}>
                    <Button type="primary" disabled={selectedRows.length === 0} onClick={this.delAllWareHouse}>
                        全部删除
                    </Button>
                    <Search placeholder="SKU 查询" onSearch={this.onSearch} allowClear style={{marginLeft:'15px' ,width:'400px'}} />
                </div>
                <Table
                    columns={columns}
                    dataSource={productData}
                    scroll={{ y: 700 }}
                    rowKey={record => record.id}
                    rowSelection={{
                        ...rowSelection,
                    }}
                />
                <Modal title="Basic Modal" visible={editVisiable} onOk={this.handleOk} onCancel={this.handleCancel} width='900px'>
                    <EditForm childData={childData} onRef={this.getFormValue} />
                </Modal>
            </div>
        );
    }
}

export default ProductList;
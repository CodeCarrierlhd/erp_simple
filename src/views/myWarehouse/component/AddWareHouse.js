import React, { Component } from 'react';
import { PermissionModel } from '../../../components/PermissionModel';
import UploadFile from '../../../components/UploadFile';

import moment from 'moment'
import {
    Form,
    Input,
    Button,
    DatePicker,
    Modal,
    Table, Select
} from 'antd';
const { Option } = Select;
const role_type = JSON.parse(localStorage.getItem('userInfo')) === null ? '' : JSON.parse(localStorage.getItem('userInfo')).type
class AddWareHouse extends Component {
    state = {
        isModalVisible: false,
        subData: [],
        proGroup: [],
        productNumber: 0,
        pageOption:{
            pageNo: 0,
            pageSize: 50
        },
        total:0
    }
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    handleSubmit = () => {
        console.log(role_type);
        if (role_type !== 1) {
            return PermissionModel('新增')
        }
        let that = this
        let fileList = []
        let files = this.fileChild.state.fileList
        console.log(files);
        files.map(item => {
            if (item.url) {
                fileList.push(item.url.split('/imgs/')[1])
            } else {
                fileList.push(item.response.filename)
            }
            return fileList
        })
        console.log(fileList);
        that.props.form.validateFieldsAndScroll((err, values) => {
            values.fileUpload = fileList.toString()
            if (err) return err
            for (const key in values) {
                if (key === 'deliveryDate' || key === 'arrivalTime' || key === 'relArrivedTime')  {
                    values[key] = moment(values[key]).format("YYYY-MM-DD")
                }
            }
            console.log(values);

            if (that.props.childData) {
                that.$axios.put('/updateWarehouse', {
                    params: {
                        warehouseId: that.props.childData.id
                    }, ...values
                }).then(res => {
                    console.log(res);
                    if (res.code === 200) {
                        this.props.getWareHouseList();
                        that.props.form.resetFields();
                    } else {
                        console.log(res.msg);
                    }
                })
            } else {
                that.$axios.post('/addWarehouset', { ...values }).then(res => {
                    if (res.code === 200) {
                        that.insertMiddleData(res.data.insertId)
                        that.props.form.resetFields();
                    } else {
                        console.log(res.msg);
                    }
                })
            }


        });

    };
    insertMiddleData = (warehouseId) => {
        console.log(warehouseId);
        let that = this
        let { proGroup } = this.state
        // addmiddleWareHouse
        proGroup.forEach((element) => {
            console.log(element, warehouseId);
            that.$axios.post('/addmiddleWareHouse', { warehouseId, productId: element.productId, productNumber: element.productNumber }).then(res => {
                console.log(res);

                if (res.code === 200) {

                } else {
                    console.log(res.msg);
                }
            })
        });
    }
    showModal = () => {
        const { subData,pageOption } = this.state
        if (subData.length === 0) {
            this.getProductList(pageOption)
        }
        this.setState({
            isModalVisible: true
        })
    };
    handleOk = () => {
        this.setState({
            isModalVisible: false,
            subData: []
        })
    };

    handleCancel = () => {
        this.setState({
            isModalVisible: false,
            subData: []
        })
    };
    getProductList = (pageOption) => {
        this.$axios.get('/productList',{
            params:pageOption
        }).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    subData: res.data.rows,
                    total:res.data.total
                })
            } else {
                console.log(res.msg);
            }
        })
    }
    getProductName = (value) => {
        this.setState({
            productNumber: value
        })
    }
    addToWareHouse = (record) => {
        const { proGroup, productNumber } = this.state
        let arr = []
        let product = record
        proGroup.push(product)
        product.productNumber = productNumber
        product.productId = record.id
        this.state.subData.forEach(element => {
            if (element.id !== record.id) {
                arr.push(element)
            }
        });
        this.setState({
            subData: arr,
            proGroup
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
    getFileList = (ref) => {
        this.fileChild = ref
    }
    paginationChange =  (current, size) => {
        const {pageOption}=this.state
        let p=Object.assign(pageOption,{ pageNo: current,pageSize: size})
        this.setState({
            pageOption:p
        })
        this.getProductList({ pageNo: current,pageSize: size})
    }
    changePageSize =  (current, size) => {
        const {pageOption}=this.state
        let p=Object.assign(pageOption,{ pageNo: 1,pageSize: size})
        this.setState({
            pageOption:p
        })
        this.getProductList({ pageNo: current,pageSize: size})
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: { span: 6 }
            },
            wrapperCol: {
                sm: { span: 12 }
            }
        };
        const dateFormat = 'YYYY-MM-DD';
        const { isModalVisible, subData,pageOption,total } = this.state
        const columnsSub = [
            {
                title: 'SKU',
                width: 150,
                dataIndex: 'mpn',
                key: 'mpn',
            },
            {
                title: '名称',
                width: 150,
                dataIndex: 'productName',
                key: 'productName',
            },

            {
                title: '图片',
                width: 250,
                render: (text, record) => this.handleMianImage(record)
            },
            {
                title: '产品数量',
                render: (text, record) => <div>
                    <input type="number" onChange={e => this.getProductName(e.target.value)} style={{ marginRight: '10px' }} />
                    <button onClick={() => this.addToWareHouse(record)}>确认添加</button>
                </div>
            },
        ];
        const warehouseGroup = [
            { value: '1', name: '陈总老东家仓' },
            { value: '2', name: '谢总仓' },
            { value: '3', name: '至美通' },
            { value: '4', name: '易仓' },
            { value: '5', name: '云仓' },
            { value: '6', name: '陈总自营仓' },
        ]
        const paginationProps = {
            showSizeChanger: true,
            // showQuickJumper: true,
            showTotal: () => `共${total}条`,
            total: total,
            pageSizeOptions: ['50', '100', '200'],
            current: pageOption.pageNo,
            pageSize: pageOption.pageSize,
            onShowSizeChange: (current, pageSize) => this.changePageSize(current, pageSize),
            onChange: (current, size) => this.paginationChange(current, size)
        }
        return (
            <div style={{ width: '80%', margin: '40px auto', textAlign: 'center' }
            }>
                <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{ width: '900px', margin: '40px auto' }}>
                    {this.props.childData ? '' : <Form.Item label="添加产品">
                        <Button type="default" onClick={this.showModal}>
                            选择产品
                        </Button>
                    </Form.Item>}
                    <Form.Item label="订舱号">
                        {getFieldDecorator('cabinNumber', {
                            rules: [
                                {
                                    required: true,
                                    message: '订舱号必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="集装箱号">
                        {getFieldDecorator('containerNumber', {
                            rules: [
                                {
                                    required: true,
                                    message: '集装箱号必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="柜型">
                        {getFieldDecorator('wareHouseModel', {
                            rules: [
                                {
                                    required: true,
                                    message: '柜型必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="封条">
                        {getFieldDecorator('sealPart', {
                            rules: [
                                {
                                    required: true,
                                    message: '封条必填',
                                }
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="备注">
                        {getFieldDecorator('remark', {
                            rules: [
                            ]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="发货日期">
                        {getFieldDecorator('deliveryDate', {
                            rules: [
                            ]
                        })(<DatePicker format={dateFormat} style={{ width: "60%" }} />)}
                    </Form.Item>
                    <Form.Item label="预计到达日期">
                        {getFieldDecorator('arrivalTime', {
                            rules: [
                            ]
                        })(<DatePicker format={dateFormat} style={{ width: "60%" }} />)}
                    </Form.Item>
                    <Form.Item label="实际入仓日期">
                        {getFieldDecorator('relArrivedTime', {
                            rules: [
                            ]
                        })(<DatePicker format={dateFormat} style={{ width: "60%" }} />)}
                    </Form.Item>
                    <Form.Item label="选择仓库">
                        {getFieldDecorator('warehouseType', {
                            rules: [
                            ]
                        })(<Select style={{ width: "60%" }}>
                            {warehouseGroup.map(item => {
                                return <Option value={item.value} key={item.value}>{item.name}</Option>
                            })}
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="是否入仓">
                        {getFieldDecorator('inWarehouse', { initialValue: 2 }, {
                            rules: [
                            ]
                        })(<Select style={{ width: "60%" }}>
                            <Option value={1}>已入仓</Option>
                            <Option value={2}>未入仓</Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="上传附件">
                        {getFieldDecorator('fileUpload', {
                            rules: [
                            ]
                        })(<UploadFile onRef={this.getFileList} files={this.props.childData === undefined ? '' : this.props.childData.fileUpload} />)}
                    </Form.Item>
                    {this.props.childData ? '' : <Button type="primary" htmlType="submit">
                        Submit
                    </Button>}
                </Form>
                <Modal title="Basic Modal" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel} width='900px' destroyOnClose={true}>
                    <Table
                        columns={columnsSub} dataSource={subData}
                        pagination={paginationProps}
                        scroll={{ x: 600, y: 300 }}
                        rowKey={record => record.id + 'pt'}
                    />
                </Modal>
            </div >
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        //接受回来的的props，（editData）是当前的数据
        // console.log(props)       
        //第一种方法，es6循环 拿取键与值
        // {}   [键 ， 值]
        if (!props.childData) { return null; } else {
            return Object.entries(props.childData).reduce((v0, [k, v]) => {
                if (k === 'arrivalTime' || k === 'deliveryDate' || k === 'relArrivedTime') {
                    v0[k] = Form.createFormField({
                        value: moment(v),
                    })
                } else {
                    v0[k] = Form.createFormField({
                        value: v,
                    })
                }
                return v0
            }, {})
        }



    }
})(AddWareHouse);
import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import antd, { message } from 'antd';

const Dragger = antd.upload.Dragger;

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],//表格内容
            tableHeader: [],//表格头部
        };
    }
    handleShowName = (type, keyNumber) => {
        let text = ''


        if (type === 'account') {
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
        } else if (type === 'wayType') {
            switch (keyNumber) {
                case 1:
                    text = '新货拆箱';
                    break;
                case 2:
                    text = '随柜配件';
                    break;
                case 3:
                    text = '退货拆箱';
                    break;
                default:
                    text = '';
            }
            return text
        } else if (type === 'wayPart') {
            switch (keyNumber) {
                case 1:
                    text = '玻璃';
                    break;
                case 2:
                    text = '台面';
                    break;
                case 3:
                    text = '腿';
                    break;
                case 4:
                    text = '底部';
                    break;
                case 5:
                    text = '云仓';
                    break;
                default:
                    text = '';
            }
            return text
        } else {
            return text = keyNumber
        }

    }
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    uploadFilesChange = (file) => {
        let that = this
        // 通过FileReader对象读取文件
        const fileReader = new FileReader();
        fileReader.onload = event => {
            try {
                const { result } = event.target;
                // 以二进制流方式读取得到整份excel表格对象
                const workbook = XLSX.read(result, { type: 'binary' });
                // 存储获取到的数据
                let data = {
                    // sg_input_rules: []
                };
                // 遍历每张工作表进行读取（这里默认只读取第一张表）
                let dataName = ''
                for (const sheet in workbook.Sheets) {
                    let tempData = [];
                    // esline-disable-next-line
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        // 利用 sheet_to_json 方法将 excel 转成 json 数据
                        if (sheet !== 'Sheet1') {
                            dataName = sheet
                            data[sheet] = tempData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));

                        }
                    }
                }
                let columns = [];
                let keys = Object.keys(data[dataName][0]);
                columns = keys.map((item, index) => {
                    return {
                        title: that.props.tableHeader[index],
                        dataIndex: item,
                        key: item,
                        render: (text, record) => this.handleShowName(item, record[item])
                    }
                });
                //上传成功啦,data为上传后的数据
                this.setState({
                    tableData: data[dataName],
                    tableHeader: columns,
                }, () => {
                    this.props.showTableModle()
                });
                // 最终获取到并且格式化后的 json 数据
                message.success('上传成功！')
            } catch (e) {
                // 这里可以抛出文件类型错误不正确的相关提示
                message.error('文件类型不正确！');
            }
            // columns.push({
            //     title: '操作',
            //     key: 'action',
            //     render: (text, record) => (
            //         <span>
            //             <a style={{ marginRight: 16 }}>Invite {record.name}</a>
            //             <a>Delete</a>
            //         </span>
            //     ),
            // })
            // dataSource = this.state.data.map((item, index) => {
            //     console.log(item);

            //     return {
            //         key: index.toString(),
            //         "afterSaleId": item["afterSaleId"],
            //         "newOrderNumber": item["newOrderNumber"],
            //         "changePart": item["changePart"],
            //         "changeAccount": item["changeAccount"],
            //         "changeDate": item["changeDate"],
            //     }

            // })
            // console.log(this.state.tableData)
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file.file);
    }
    render() {
        return (
            <div>
                <Dragger name="file"
                    beforeUpload={function () {
                        return false;
                    }}
                    onChange={this.uploadFilesChange.bind(this)}
                    showUploadList={false}>
                    <p className="ant-upload-text">
                        <span>点击上传文件</span>
                        或者拖拽上传
                    </p>
                </Dragger>
                {/* <Button type="primary" onClick={this.uploadFilesChange} style={{ marginBottom: "15px" }}>导入</Button> */}
                {/* <Button type="primary" onClick={this.downloadFileToExcel} style={{ marginBottom: "15px" }}>下载</Button> */}
                {/* <Table columns={this.state.tableHeader} dataSource={this.state.tableData} /> */}
            </div>
        );
    }
}

export default index;
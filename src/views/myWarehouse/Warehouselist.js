import React, { Component } from 'react'
import NotPlaced from './component/NotPlaced';
import { Tabs } from 'antd';
const { TabPane } = Tabs;



export default class warehouselist extends Component {
    state = {
        inWarehouse: '2'
    }
    changStatu = value => {
        this.setState({
            inWarehouse: value
        })
        // this.formChild.handleWarehouseChange('all')


    }
    getFormValue = (ref) => {
        this.formChild = ref
    }
    render() {
        const { inWarehouse } = this.state
        console.log(inWarehouse);

        return (
            <div style={{ padding: '30px 50px' }}>
                <Tabs defaultActiveKey="2" onChange={this.changStatu}>
                    <TabPane tab="未入仓" key="2" >
                        <NotPlaced inWarehouse={inWarehouse} onRef={this.getFormValue} key={inWarehouse} />
                    </TabPane>
                    <TabPane tab="已入仓" key="1">
                        <NotPlaced inWarehouse={inWarehouse} onRef={this.getFormValue} key={inWarehouse} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

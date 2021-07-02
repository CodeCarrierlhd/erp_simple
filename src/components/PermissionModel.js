
import { Modal } from 'antd';

export function PermissionModel(content) {
    let secondsToGo = 3;
    const modal = Modal.warning({
        title: '权限错误',
        content: `账号没有${content}权限`,
    });
    const timer = setInterval(() => {
        secondsToGo -= 1;
    }, 1000);
    setTimeout(() => {
        clearInterval(timer);
        modal.destroy();
    }, secondsToGo * 1000);
}


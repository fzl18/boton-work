import { MessageBox } from 'element-ui'
import { title } from '@/config'

if (!!window.ActiveXObject || 'ActiveXObject' in window) {
  MessageBox({
    title: '温馨提示',
    message:
      '检测到您当前浏览器使用的是IE内核，自2015年3月起，微软已宣布弃用IE，且不再对IE提供任何更新维护，请<a target="_blank" style="color:blue" href="https://www.microsoft.com/zh-cn/edge/">点击此处</a>访问微软官网更新浏览器，如果您使用的是双核浏览器,请您切换浏览器内核为极速模式',
    type: 'warning',
    showClose: true,
    showConfirmButton: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    closeOnHashChange: false,
    dangerouslyUseHTMLString: true,
  }).then(() => {})
}
if (process.env.NODE_ENV !== 'development') {
  document.writeln(
    '<script>console.log( " %c ' +
      title +
      '  %c BOTON ", "color: #fff; background: #307ec7; padding:5px 0;", "background: #e1f0ff; padding:5px 0; font-weight:bold; color: #307ec7;" );</script>'
  )
}

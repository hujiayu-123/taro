import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config = {
    pages: [
      'pages/index/index',
      'pages/search/search',
      'pages/menu/index',
      'pages/list/list',
      'pages/detail/detail',
      'pages/mine/index',
      'pages/collect/collect'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      selectedColor: '#FF8C00',
      backgroundColor: '#f0f0f0',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: "./assets/home.png",
          selectedIconPath: "./assets/home-s.png"
        },
        {
          pagePath: 'pages/menu/index',
          text: '分类',
          iconPath: "./assets/menu.png",
          selectedIconPath: "./assets/menu-s.png"
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: "./assets/mine.png",
          selectedIconPath: "./assets/mine-s.png"
        }
      ]
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

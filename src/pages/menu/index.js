import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import './index.less'
import a from '../../assets/4.jpg'

export default class Index extends Component {

  state = {
    list: []
  }


  componentDidMount () {
    //调用方法来获取列表

    
    this.getList()
    
  }

  //获取分类列表
  getList = () => {
    let _this = this
    let list = _this.state.list
    //判断list是否已经存在
    Taro.getStorageInfo({
      success: function (res) {
        //console.log(res.keys)
        if(res.keys.indexOf('type') == -1){//如果不存在就获取
          Taro.request({
            url: 'http://liangleme.store/recipe/index.php/Home/Recipe/getRecipeType',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              //console.log(res.data.data)
              let list = res.data.data
              Taro.setStorage({
                key:"type",
                data: list
              })
              _this.setState({
                list
              })
            }
          })
        }else{
          //将获取到的值存入list中
          Taro.getStorage({
            key: 'type',
            success: function (res) {
              //console.log(res.data)
              list = res.data
              _this.setState({
                list
              })
            }
          })
        }
      }
    })
  }

  //跳转到列表页
  tolist = (s) => {
    console.log(s.id)
    let id = s
    Taro.setStorage({//把id存入缓存中为列表页获取数据使用
      key:"lid",
      data: id
    })
    Taro.navigateTo({
      url: '/pages/list/list?url=index'
    })
  }

  config = {
    navigationBarTitleText: '菜谱分类'
  }

  render () {

    //console.log(this.state.list)

    let menu = this.state.list.map((item,index)=>{
        let items = item.children.map((s,num)=>{
          return (
            <View className='menu-listitem' key={num} onClick={(e)=>this.tolist(s)}>
              <Text>{s.name}</Text>
            </View>
          )
        })
        return(
          <View key={index}>
            <Text className='header-title'>{item.name}</Text>
            <View className='menu-list'>
              {items}
            </View>
          </View>
        )
      })

    return (
    <View className='content'>
      <ScrollView>
        <View className='menu-content'>

          {menu}

        </View>
      </ScrollView>
      </View>
    )
  }
}

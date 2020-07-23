import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import './index.less'


export default class Search extends Component {

  state = {
    history:[],
    hotlist: [],
    isshow: false,
    name: '',
    txt: ''
  }

  componentDidMount () {

    //挂载时判断是否有历史搜索记录
    let _this = this
    Taro.getStorageInfo({
      success: function (res) {
        //console.log(res.keys.indexOf('history'))
        if(res.keys.indexOf('history') != -1){
          Taro.getStorage({
            key: 'history',
            success: function (res) {
              //console.log(res.data)
              let history = res.data
              _this.setState({
                history,
                isshow: true,
              })
            }
          })
        }
      }
    })
    //挂载时判断是否有热门关键字
    Taro.getStorageInfo({
      success: function (res) {
        //console.log(res.keys.indexOf('hotlist'))
        if(res.keys.indexOf('hotlist') != -1){
          Taro.getStorage({
            key: 'hotlist',
            success: function (res) {
              //console.log(res.data)
              let hotlist = res.data
              _this.setState({
                hotlist
              })
            }
          })
        }else{
           _this.getList()
        }
      }
    })
  }

  //获取搜索热门关键字
  getList = () => {
    let _this = this
    let hotlist = _this.state.hotlist
    Taro.request({
      url: 'http://liangleme.store/recipe/index.php/Home/Recipe/getHotword', //仅为示例，并非真实的接口地址
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data.data)
        hotlist = res.data.data
        Taro.setStorage({
          key:"hotlist",
          data:hotlist
        })
        _this.setState({
          hotlist
        })
      }
    })
  }

  //搜索添加记录
  history = (e) => {
    let _this = this
    let history = _this.state.history
      if(e.detail.value != 0){
        for(let i=0;i<history.length;i++){
          if(history[i].word == e.detail.value){
            history.splice(i,1)
          }
        }
        let obj = {
          word: e.detail.value
        }
        let name = e.detail.value
        _this.setState({
          name
        })
        Taro.setStorage({
          key:"sname",
          data: name
        })
        history.push(obj)
        Taro.setStorage({
          key:"history",
          data: history
        })
        _this.setState({
          history,
          isshow: true,
        })
        Taro.navigateTo({
          url: '/pages/list/list?url=search'
        })
      }else{
        console.log('您还没有输入')
      }
  }
  //清空所有搜索记录
  empty = () => {
    let history = this.state.history
    history.splice(0,history.length)
    this.setState({
      history,
      isshow: false
    })
    Taro.removeStorage({
      key: 'history',
      success: function (res) {
      }
    })
  }
  //通过搜索历史或热门关键字直接进行搜索
  search_his = (item) => {
    let history = this.state.history
    for(let i=0;i<history.length;i++){
      if(history[i].word == item.word){
        history.splice(i,1)
      }
    }
    history.push(item)
    Taro.setStorage({
      key:"history",
      data: history
    })
    let txt = item.word
    this.setState({
      txt: txt
    })
    Taro.setStorage({
      key:"sname",
      data:txt
    })
    Taro.navigateTo({
      url: '/pages/list/list?url=search'
    })
  }

  //跳转到首页
  next = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }

  config = {
    navigationBarTitleText: '菜谱搜索'
  }

  render () {
    //console.log(this.state.history)
    let items = this.state.history.map((item,index)=>(
      <View className='history-txt' key={index} onClick={(e)=>this.search_his(item)}>{item.word}</View>
    ))

    //console.log(this.state.hotlist)
    let hotitems = this.state.hotlist.map((item,index)=>(
      <View className='history-txt' key={index} onClick={(e)=>this.search_his(item)}>{item.word}</View>
    ))

    return (
      <View className='content'>
        <View className='inp-txt1'>
          <Input type='text' placeholder='  今天想吃什么?' focus onConfirm={(e)=>this.history(e)} value={this.state.txt}/>
          <View className='cancel' onClick={()=>this.next()}>取消</View>
        </View>
        <View className='history'>
          <Text className={this.state.isshow? '':'hidden'}>搜索历史</Text><Text className={this.state.isshow? 'empty':'hidden'} onClick={()=>this.empty()}>清空</Text>
          <View className='clear'></View>
          <View className='history-part'>
            {items}
          </View>

        </View>
        <View className='clear'></View>
        <View className='hot'>
          <Text>搜索热门</Text>
          {hotitems}
        </View>
      </View>
    )
  }
}

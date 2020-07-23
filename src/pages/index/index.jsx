import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import './index.less'
import a from '../../assets/1.jpg'
import b from '../../assets/2.jpg'
import c from '../../assets/3.jpg'

export default class Index extends Component {

  state = {
    list: [],
    greetings: '',
    isshow: true,
    bg: {
      backgroundColor: 'gold'
    }
  }

  componentDidMount () {
    //调取首页列表
    this.getList()

    //判断当前时间段
    let num = new Date().getHours()
    let str = ''
    if(num>=6 && num<=8){
      str = '早上好'
      this.setState({
        bg: {
          backgroundColor: 'skyblue'
        }
      })
    }else if(num>=9 && num<=11){
      str = '上午好'
      this.setState({
        bg: {
          backgroundColor: 'gold'
        }
      })
    }else if(num>=12 && num<=13){
      str = '中午好'
      this.setState({
        bg: {
          backgroundColor: 'red'
        }
      })
    }else if(num>=14 && num<=18){
      str = '下午好'
      this.setState({
        bg: {
          backgroundColor: 'orange'
        }
      })
    }else if(num>=19 && num<=22){
      str = '晚上好'
      this.setState({
        bg: {
          backgroundColor: 'dodgerblue'
        }
      })
    }else{
      str = '该休息了'
      this.setState({
        bg: {
          backgroundColor: 'black'
        }
      })
    }
    this.setState({
      greetings: str
    })
    setTimeout(()=> {
      this.setState({
        isshow: false
      })
    }, 5000);
  }

  //获取首页列表
  getList = () => {
    let _this = this
    let list = _this.state.list
    Taro.request({
      url: 'http://liangleme.store/recipe/index.php/Home/Index/getRecipeList',
      data: {
        page_size: '',
        page_num: list.length + 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data)
        let newlist = res.data.data
        newlist.map((item)=>(
          list.push(item)
        ))
        //console.log(list)
        _this.setState({
          list
        })
      }
    })
  }

  //监听滚动到底加载新的数据
  onScrollToLower = () => {
    console.log("加载数据")
    this.getList()
  }

  //页面跳转到搜索
  next = () => {
    Taro.navigateTo({
      url: '/pages/search/search'
    })
  }
  //页面跳转到详情
  todetail = (item) => {
    //console.log(item.id)
    let id = item.id
    Taro.setStorage({
      key:"id",
      data: id
    })
    Taro.navigateTo({
      url: '/pages/detail/detail'
    })
  }

  config = {
    navigationBarTitleText: '首页'
  }

  render () {

    //console.log(this.state.list)
    let items = this.state.list.map((item)=>(
      <View className='listItem' key={item.id}>
        <Image mode='widthFix' src={a} onClick={(e)=>this.todetail(item)}/>
        <Text>{item.name}</Text>
      </View>
    ))

    return (
    <View className='content'>
      <ScrollView
        className='scroll'
        scrollY
        lowerThreshold='80'
        onScrollToLower={()=>this.onScrollToLower()}
      >
        <View className='title'>
          <Text className='blue'>小</Text>
          <Text className='red'>厨</Text>
          <Text className='pink'>房</Text>
          <View className={this.state.isshow? 'greeting':'hidden'} style={this.state.bg}>{this.state.greetings}</View>
        </View>
        <View className='search' onClick={()=>this.next()}>
          <Text>今天吃点啥呢?</Text>
        </View>
        <View className='slogan'>好好吃饭用心生活,比什么都幸福</View>
        <View className='list'>

          {items}

        </View>
      </ScrollView>
      </View>
    )
  }
}

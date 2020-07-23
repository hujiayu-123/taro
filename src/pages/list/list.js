import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import './index.less'
import a from '../../assets/1.jpg'
import b from '../../assets/2.jpg'
import c from '../../assets/3.jpg'

export default class List extends Component {

  state = {
    name: '',
    list: [],
    isshow1: true,
    isshow2: false,
    isshow3: false
  }

  componentDidMount(){
    //判断是从哪一页跳转来的,用相应的方法来获取数据
    if(this.$router.params.url == 'index'){
      this.getList()
    }else if(this.$router.params.url == 'search'){
      this.getSearchList()
    }
    //console.log(this.$router.params.url)
  }

  //分类页的接口方法
  getList = () => {
    let _this = this
    let list = _this.state.list
    Taro.getStorage({
      key: 'lid',
      success: function (res) {
        //console.log(res.data)
        let id = res.data.id
        let name = res.data.name
        _this.setState({
          name
        })
        Taro.request({
          url: 'http://liangleme.store/recipe/index.php/Home/Recipe/getRecipeListByTypeId', //仅为示例，并非真实的接口地址
          data: {
            type_id: id,
            page_size: '',
            page_num: list.length + 1
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data.data)
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
    })
  }
  //搜索页的接口方法
  getSearchList = () => {
    let _this = this
    let list = _this.state.list
    Taro.getStorage({
      key: 'sname',
      success: function (res) {
        //console.log(res.data)
        let name = res.data
        _this.setState({
          name
        })
        Taro.request({
          url: 'http://liangleme.store/recipe/index.php/Home/Recipe/searchRecipeByName', //仅为示例，并非真实的接口地址
          data: {
            recipe_name: name,
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
            _this.setState({
              list
            })
          }
        })
      }
    })
  }

  //到底加载新的数据
  onScrollToLower = () => {
    console.log("加载数据")
    if(this.$router.params.url == 'index'){
      this.getList()
    }else if(this.$router.params.url == 'search'){
      this.getSearchList()
    }
  }
  //跳转到搜索页
  tosearch = () => {
    Taro.navigateTo({
      url: '/pages/index/search'
    })
  }
  //跳转到详情页,并把id存入缓存中,为详情获取数据使用
  todetail = (item) => {
    let id = item.id
    Taro.setStorage({
      key:"id",
      data: id
    })
    Taro.navigateTo({
      url: '/pages/detail/detail'
    })
  }

  //选项卡效果
  sys = () => {
    this.setState({
      isshow1: true,
      isshow2: false,
      isshow3: false
    })
  }
  score = () => {
    this.setState({
      isshow1: false,
      isshow2: true,
      isshow3: false
    })
  }
  doing = () => {
    this.setState({
      isshow1: false,
      isshow2: false,
      isshow3: true
    })
  }

  render(){

    //console.log(this.state.list)
    let items = this.state.list.map((item,index)=>(
      <View className='item-menu' onClick={(e)=>this.todetail(item)} key={index}>
        <View className='left'>
          <Image src={a}/>
        </View>
        <View className='right'>
          <View className='title-menu'>{item.name}</View>
          <Text className='ing'>{item.desc}</Text>
          <Text className='ing' decode="true">7.6分 &nbsp; &nbsp;  12009人做过</Text>
          <View className='user'>xxx小厨房</View>
        </View>
      </View>
    ))

    return(
      <View className='content'>
        <ScrollView
          className='scroll'
          scrollY
          lowerThreshold='80'
          onScrollToLower={()=>this.onScrollToLower()}
        >
          <View className='inp-txt'>
            <Input type='text' onClick={()=>this.tosearch()} value={this.state.name}/>
            <View className='cancel'>搜索</View>
          </View>
          <View className='tabs'>
            <View className={this.state.isshow1? 'active':''} onClick={()=>this.sys()}>综合</View>
            <View className={this.state.isshow2? 'active center':'center'} onClick={()=>this.score()}>评分最高</View>
            <View className={this.state.isshow3? 'active right':'right'} onClick={()=>this.doing()}>做过最多</View>
          </View>

          <View className='menu'>
            <View className='list-menu'>
              {items}
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

}

import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import './index.less'
import a from '../../assets/4.jpg'
import del from '../../assets/del.png'
import edit from '../../assets/edit.png'
import TaroPop from '@components/taroPop'

export default class Collect extends Component {

  state = {
    list: [],
    name: '',
    avatar: ''
  }

  componentDidMount(){
    this.getList()
  }

  getList = () => {

    let _this = this
    let list = _this.state.list
    Taro.getStorage({
      key: 'user',
      success: function (res) {
        //console.log(res.data)
        let access_token = res.data.access_token
        let id = res.data.id
        let name = res.data.nickname
        let avatar = res.data.avatar
        _this.setState({
          avatar,
          name
        })
        Taro.request({
          url: 'http://liangleme.store/recipe/index.php/Home/Recipe/getCollectRecipeList', //仅为示例，并非真实的接口地址
          data: {
            user_id: id,
            access_token: access_token
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            //console.log(res.data.data)
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
  //跳转详情页
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

  //监听滚动到底加载新的数据
  onScrollToLower = () => {
    console.log("加载数据")
  }

  //删除菜单
  editmenu = () => {
    Taro.showModal({
      title: '删除',
      content: '您确定要删除此菜单吗？',
    })
    .then(res =>{
      //console.log(res.confirm, res.cancel)
      if(res.confirm == true){
        console.log(1111)
      }else{
        console.log(222)
      }
    })
  }
  //删除某一项
   delmenu = () => {
    Taro.showModal({
      title: '删除',
      content: '您确定要删除此项吗？',
    })
    .then(res =>{
      //console.log(res.confirm, res.cancel)
      if(res.confirm == true){
        console.log(1111)
      }else{
        console.log(222)
      }
    })
  }

  render(){

    //console.log(this.state.list)
    let items = this.state.list.map((item,index)=>(
      <View className='collect-items' key={index} onClick={(e)=>this.todetail(item)}>
        <Image src={a}/>
        <View className='edit'><Image src={del} onClick={()=>this.delmenu()}/></View>
        <View className='items-inf'>
          <View className='left'>
            <View className='p1'>{item.name}</View>
            <View className='p2'>8.4分·217人做过</View>
          </View>
          <View className='right'>
            <View><Image src={a}/></View>
            <View className='p3'>yyy厨房</View>
          </View>
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
          <View className='collect'>
            <View className='collect-title'>我的收藏</View>
            <View className='collect-user'>
              <View className='left'>
                <View className='img'><Image src={this.state.avatar}/></View>
                <Text>{this.state.name}</Text>
              </View>
              <View className='right'><Image src={edit} onClick={()=>this.editmenu()}/></View>
            </View>
            <View className='collect-list'>
              {items}
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

}

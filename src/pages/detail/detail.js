import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import './index.less'
import a from '../../assets/4.jpg'
import collect from '../../assets/collect.png'
import collect_on from '../../assets/collect-on.png'
import share from '../../assets/share.png'

export default class Detail extends Component {

  state = {
    list: [],
    newlist: [],
    user_id: '-1',
    id: '',
    access_token: '',
    iscollect: false
  }

  componentDidMount(){

    this.getId()

  }

  //获取user_id
  getId = () => {
    let _this = this
    let user_id = _this.state.user_id
    let access_token = _this.state.access_token
    Taro.getStorageInfo({
      success: function (res) {
        //console.log(res.keys.indexOf('user'))
        if(res.keys.indexOf('user') != -1){
          Taro.getStorage({
            key: 'user',
            success: function (res) {
              //console.log(res.data)
              _this.setState({
                user_id: res.data.id,
                access_token: res.data.access_token
              },()=>{
                _this.getList()
              })
            }
          })
        }else{
          _this.setState({
            user_id: -1
          },()=>{
             _this.getList()
          })
        }
      }
    })
  }
  //获取详情列表
  getList = () => {
  //通过上一页存入缓存中的id来获取数据
    let _this = this
    let list = _this.state.list
    let newlist = _this.state.newlist
    let user_id = _this.state.user_id
    //console.log(user_id)
    Taro.getStorage({//取出缓存中的id
      key: 'id',
      success: function (res) {
        //console.log(res.data)
        let id = res.data
        Taro.request({//获取数据
          url: 'http://liangleme.store/recipe/index.php/Home/Recipe/getRecipeDeatilById',
          data: {
            recipe_id: id,
            user_id: user_id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            //console.log(res.data.data[0])
            list = res.data.data   //分别放进两个数组,可以把嵌套循环单拆开来渲染
            newlist = res.data.data[0]
            _this.setState({
              list,
              newlist,
              id,
              user_id,
              iscollect: newlist.isCollect
            })
          }
        })
      }
    })
  }
  //收藏
  oncollect =  () => {
    this.setState({
      iscollect: true
    })
    let id = this.state.id
    let user_id = this.state.user_id
    let access_token = this.state.access_token
    Taro.request({
      url: 'http://liangleme.store/recipe/index.php/Home/Recipe/collectRecipe', //仅为示例，并非真实的接口地址
      header: {
        'content-type':'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        recipe_id: id,
        user_id: user_id,
        access_token: access_token
      },
      method: 'post',
      success: function (res) {
        console.log(res.data)
      }
    })
  }
  //取消收藏
  oncannel = () => {
    this.setState({
      iscollect: false
    })
    let id = this.state.id
    let user_id = this.state.user_id
    let access_token = this.state.access_token
    Taro.request({
      url: 'http://liangleme.store/recipe/index.php/Home/Recipe/cannelCollectRecipe', //仅为示例，并非真实的接口地址
      data: {
        recipe_id: id,
        user_id: user_id,
        access_token: access_token
      },
      header: {
        'content-type':'application/x-www-form-urlencoded' // 默认值
      },
      method: 'post',
      success: function (res) {
        console.log(res.data)
      }
    })
  }

  config = {
    navigationBarTitleText: this.state.newlist.name
  }

  render(){
    //console.log(this.state.list)
    //渲染第一层列表
    let items = this.state.list.map((item,index)=>{
      return(
        <View key={index}>
          <View className='detail-img'>
            <Image src={a}/>
          </View>
          <View className='content'>
            <View className='detail-title'>
              <View className='title-big'>{item.name}</View>
              <View className='title-small'>7.6综合评分 · 309人最近7天做过</View>
            </View>
            <View className='detail-user'>
              <View className='user-inf'>
                <View className='left'>
                  <View className='left-head'>
                    <Image mode='widthFix' src={a}/>
                  </View>
                  <View className='user-name'>悠妈的小厨房</View>
                </View>
                <View className='right'>关注</View>
              </View>
              <View className='user-balel'>{item.desc}</View>
            </View>
          </View>
        </View>
      )
    })
    let tip = this.state.list.map((item,index)=>(
      <View className='tip-txt' key={index}>{item.tip}</View>
    ))

    //渲染第二曾列表,配料
    let material = this.state.newlist.material.map((item,index)=>(
       <View key={index} className='ing-content'>
        <View className='left'>{item.name}</View>
        <View className='right'>{item.unit}</View>
       </View>
    ))
    //渲染第二层列表,步骤
    let step = this.state.newlist.step.map((item,index)=>(
      <View className='step' key={index}>
        <View className='content'>
          <View className='step-num'>步骤{index+1}</View>
          <View className='step-content'>{item.name}</View>
        </View>
      </View>
    ))

    return(
      <View className='detail'>
        {items}
        <View className='content'>
          <View className='ingredient'>
            <View className='ing-title'>用料</View>
            {material}
          </View>
        </View>
        <View className='jianju'>
          {step}
        </View>
        <View className='tip'>
          <View className='tip-title'>小贴士</View>
          {tip}
        </View>
        <View className='null'></View>
        <View className='footer'>
          {this.state.iscollect?
            (<View onClick={()=>this.oncannel()}>
             <Image src={collect_on}/>
              <Text>已收藏</Text>
            </View>)
            :
            (<View onClick={()=>this.oncollect()}>
             <Image src={collect}/>
              <Text>收藏</Text>
            </View>)
          }
          <View>
            <Image src={share}/>
            <Text>分享</Text>
          </View>
        </View>
      </View>
    )
  }
}

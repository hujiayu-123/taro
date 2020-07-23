import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import a from '../../assets/set.png'
import b from '../../assets/3.jpg'

export default class Index extends Component {

  state = {
    active1: true,
    active2: false,
    active3: false,
    islogin: false,
    name: '',
    avatar: '',
    time: '',
    list: []
  }

  componentDidMount () {

    let _this = this
    //判断是否登录
    Taro.getStorageInfo({
      success: function (res) {
        //console.log(res.data)
        if(res.keys.indexOf('user') == -1){
          _this.setState({
            islogin: false
          })
        }else{
          Taro.getStorage({
            key: 'user',
            success: function (res) {
              //console.log(res.data)
              let name = res.data.nickname
              let avatar = res.data.avatar
              let time = res.data.create_time.substr(0,4)
              _this.setState({
                name,
                avatar,
                time,
                islogin: true
              })
              //调取收藏列表方法
              _this.getList()
            }
          })
        }
      }
    })
    
  }
  //获取登录信息
  getUserInfo = () =>{
    let _this = this
    Taro.getUserInfo({
      success: function(res){
        //console.log(res)
        let name = res.userInfo.nickName
        let gender = res.userInfo.gender
        let avatarUrl = res.userInfo.avatarUrl
        Taro.login({
          success: function (res) {
            if (res.code) {
              //发起网络请求
              Taro.request({
                url: 'http://liangleme.store/recipe/index.php/Home/User/getAuth',
                header: {
                  'content-type':'application/x-www-form-urlencoded'
                },
                data: {
                  user_nickname: name,
                  user_avatarpath: avatarUrl,
                  user_gender: gender,
                  code: res.code
                },
                method: 'post',
                success: function(res){
                  //console.log(res.data.data)
                  Taro.setStorage({
                    key: 'user',
                    data: res.data.data
                  })
                  let name = res.data.data.nickname
                  let avatar = res.data.data.avatar
                  let time = res.data.data.create_time.substr(0,4)
                  _this.setState({
                    name,
                    avatar,
                    time,
                    islogin: true
                  })
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      },
      fail: function(res){
        //console.log(res)
      }
    })
  }
  //获取收藏列表
  getList = () => {
    let _this = this
    let list = _this.state.list
    Taro.getStorage({
      key: 'user',
      success: function (res) {
        //console.log(res.data)
        let access_token = res.data.access_token
        let id = res.data.id
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

  config = {
    navigationBarTitleText: '我的'
  }

  //选项卡切换
  collect = () => {
    this.setState({
      active1: true,
      active2: false,
      active3: false
    })
  }
  menu = () => {
    this.setState({
      active1: false,
      active2: true,
      active3: false
    })
  }
  works = () => {
    this.setState({
      active1: false,
      active2: false,
      active3: true
    })
  }
  //跳转到收藏页
  tocollect = () => {
    Taro.navigateTo({
      url: '/pages/collect/collect'
    })
  }

  render () {
    return (
      <View>
        {this.state.islogin?
        (<View>
          <View className='set'>
            <Image mode='widthFix' src={a}/>
          </View>
          <View className='data'>
          <View className='content'>
            <View className='mine-user'>
                <View className='left'>
                  <View className='left-title'>{this.state.name}</View>
                  <View className='left-date'>{this.state.time}加入</View>
                </View>
                <View className='right'>
                  <Image src={this.state.avatar}/>
                </View>
              </View>
              <View className='mine-inf'>
                <View className='left'>
                  <View className='num'>0<View>关注</View></View>
                  <View className='num'>0<View>粉丝</View></View>
                </View>
                <View className='right'>分享</View>
              </View>
            </View>
          </View>
          <View className='content'>
            <View className='data-detail'>
               <View className='tab'>
                  <View className={this.state.active1? 'active':''} onClick={()=>this.collect()}>收藏</View>
                  <View onClick={()=>this.menu()} className={this.state.active2? 'active':''}>菜谱</View>
                  <View onClick={()=>this.works()} className={this.state.active3? 'active':''}>作品</View>
               </View>
               <View className='contents'>
                  <View className={this.state.active1? 'active':''}>
                    <Text className='collect' onClick={()=>this.tocollect()}>{this.state.list.length}条收藏信息</Text>
                    <Text className='collect-txt'>我的收藏</Text>
                    <Text className='collect-txt1'>{this.state.list.length}条菜谱信息</Text>
                  </View>
                  <View className={this.state.active2? 'active':''}>还没有菜谱</View>
                  <View className={this.state.active3? 'active':''}>还没有作品</View>
               </View>
            </View>
          </View>
        </View>)
        :
        (<View className='login'>
          <View className='login-title'>
            <Text className='red'>小</Text>
            <Text className='blue'>厨</Text>
            <Text className='pink'>房</Text>
          </View>
          <View className='login-babel'>唯有美食与爱不可辜负</View>
          <View className='login-babel1'>饮食有节，莫失好味，登录查看收藏的菜谱吧。</View>
          <Button className='login-btn' openType='getUserInfo' onGetUserInfo={()=>this.getUserInfo()}>登录</Button>
        </View>)
        }
      </View>
    )
  }
}

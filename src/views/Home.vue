<template>
  <div>
    <div>
      <div style="display: flex; justify-content: left; margin-top: 20px">
        <el-button style="margin-left: 100px" type="warning" icon="el-icon-plus" @click="doSearch">添加插件</el-button>
      </div>
      <div class="admin-container">
        <el-card class="admin-card" v-for="(admin, index) in admins" :key="index">
          <div slot="header" class="clearfix">
            <span>{{ admin.qqbot_nickname }}</span>
            <span>({{ admin.qqbot_id }})</span>
            <el-button
                    style="float: right; padding: 3px 0; color: red"
                    type="text"
                    icon="el-icon-delete"
                    @click="deleteAdmin(admin)"
            ></el-button>
          </div>
          <div>
            <div class="img-content">
              <img
                      :src="admin.qqbot_avatar"
                      :alt="admin.name"
                      :title="admin.name"
                      class="botAvatar-img"
              />
            </div>
          </div>
          <div class="userInfo">
            <div>
              机器人状态:
              {{admin.qqbot_state}}
            </div>
          </div>
          <el-button style="font-size: 20px;" type="primary" icon="el-icon-s-promotion" circle @click="turnToUrl(admin.qqbot_url)"></el-button>
        </el-card>
        <el-card class="admin-card">
          <el-button
                  style="
                            width: 80px;
                            height: 80px;
                            font-size:30px;
                            margin-left: 10px;
                            margin-top: 50px;
                            margin-bottom: 50px" type="primary" icon="el-icon-plus" circle @click="addBotDia()"></el-button>
        </el-card>
      </div>
    </div>
    <!--登陆机器人账号-->
    <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="请扫描二维码完成QQ机器人的登陆">
            <el-image style="width: 100px; height: 100px"
                      :src="image_url" ></el-image>
            <!--                        <el-button type="primary" icon="el-icon-refresh" @click="">有网络问题？</el-button>-->
          </el-form-item>
          <el-form-item label="二维码状态：">
            {{image_state}}
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="destroyBox()">取 消</el-button>
            <el-button type="primary" @click="destroyBox()">确 定</el-button>
          </span>
    </el-dialog>

    <!-- 添加机器人账号 -->
    <el-dialog
            title="提示"
            :visible.sync="dialogVisibleTwo"
            width="30%"
            :before-close="handleClose">
      <div>
        <el-form :inline="true" :model="qq" class="demo-form-inline">
          <el-form-item label="">
            <el-switch
                    v-model="switchValue"
                    active-text="扫码登陆"
                    inactive-text="密码登陆">
            </el-switch>
            <!-- 设备类型选择框 -->
            <el-select style="width: 150px; margin-left: 20px" v-model="value" placeholder="请选择">
              <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="!switchValue" label="请输入机器人QQ">
            <el-input v-model="qq.qqNumber" placeholder="填写机器人QQ号"></el-input>
          </el-form-item>
          <el-form-item v-if="!switchValue" label="请输入机器人密码">
            <el-input v-model="qq.qqPassword" placeholder="填写账号密码"></el-input>
          </el-form-item>
          <el-form-item v-if="switchValue">
            <el-col :span="100">
              <div class="demo-basic--circle">
                <div class="block"><el-avatar shape="square" :size="150" :src="squareUrl"></el-avatar></div>
                <div class="block" v-for="size in sizeList" :key="size">
                  <el-avatar shape="square" :size="size" :src="squareUrl"></el-avatar>
                </div>
              </div>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="destroyBox()">取 消</el-button>
            <el-button v-if="!switchValue" type="primary" @click="addBot()">确 定</el-button>
            <el-button v-if="switchValue" type="primary" @click="getCode()">获取二维码</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from "axios";

  function sum(arr) {
    return eval(arr.join("+"));
  }
  export default {
    methods: {
      addBotDia(){
        this.dialogVisibleTwo = true;
      },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // 跳转到验证链接
      turnToUrl(url){
        window.open(url,"_blank");
      },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      addBot(){
        // 使用账号和密码添加机器人
        const jsons = {
          "uin":parseInt(this.qq.qqNumber),
          "password":this.qq.qqPassword,
          "device_seed":parseInt(this.qq.qqNumber),
          "client_protocol":this.value,
        };
        console.log(JSON.stringify(jsons));
        axios({
          method: 'post',
          url: `/qqbot/login/password/create`,
          data: JSON.stringify(jsons),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          console.log(res); // 返回结果"success"
          if(res.status === 200){
            this.destroyBox();
          }else{
            console.log("ERROR!重新添加！！！")
          }
        });
      },
//////////////////////////////////////////////👆👆👆👆👆👆👆👆👆👆👆///////////////////////////////////////////////////////
      handleClick(row) {
        console.log(row);
      },

      handleClose(done) {
        this.destroyBox();
      },

      submit(){
        this.dialogVisible = false;
        console.log(this.form);
        axios({
          method: 'post',
          url: `/qq/addPrivateDialogue`,
          params: {
            "question" : this.form.question,
            "answer" : this.form.answer,
            "tperson" : this.form.tperson,
            "type" : this.form.type,
            "owner" : this.$cookies.get("userName")}
        }).then(res => {
          // this.$router.go(0);
        })
      },

      // 定时刷新数据函数
      dataRefresh() {
        // 计时器正在进行中，退出函数
        if (this.intervalId != null) {
          return;
        }
        // 计时器为空，操作
        this.intervalId = setInterval(() => {
          this.checkQR();
        }, 5000);
      },

      // 停止定时器
      clear() {
        clearInterval(this.intervalId); //清除计时器
        this.intervalId = null; //设置为null
      },

      checkQR(){
        // IPad: 0
        // AndroidPhone: 1
        // AndroidWatch: 2
        // MacOS: 3
        // 企点: 4
        // 使用账号和密码添加机器人
        const that = this;
        const jsons = {
          "sig" : this.image_sig,
        };
        console.log(JSON.stringify(jsons));
        axios({
          method: 'post',
          url: `/qqbot/login/qrcode/query`,
          data: JSON.stringify(jsons),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
            console.log("checking QRcode ...");
            that.image_state = res.data.state;
            console.log(that.image_state);
            if(that.image_state === "confirmed"){
              that.destroyBox();
            }
        });
      },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      getCode(){
        // 获取登陆二维码
        axios({
          method: 'post',
          url:"/sohu/cityjson?ie=utf-8"
        }).then(res => {
          this.yourIPAddress = res.data.split("\"")[3];
          console.log(this.yourIPAddress);
        });
        console.log(sum(this.yourIPAddress.split("."))*1314521);
        // 添加机器人
        const jsons = {
          "device_seed":sum(this.yourIPAddress.split("."))*1314521,
          "client_protocol":this.value,
        };
        console.log(JSON.stringify(jsons));
        axios({
          method: 'post',
          url: `/qqbot/login/qrcode/create`,
          data: JSON.stringify(jsons),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          // 获得登陆二维码后不断检测状态
          this.dataRefresh();
          console.log(res); // 返回结果"success"
          if(res.status === 200){
            this.squareUrl = this.image_head + res.data.image;
            this.image_sig = res.data.sig;
            // this.destroyBox();
          }else{
            console.log("ERROR!重新添加！！！")
          }
        });
      },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // 卡片传进来机器人的qq号
      createBox(botId) {
        axios({
          method: 'post',
          url: `/qq/getAbsoluteId`,
          params: {
            "botId" : botId,
          }
        }).then(res => {
          let port = parseInt(res) + 10000;
          this.getLogin(botId, port);
          this.dialogVisible = true;
        })
      },
      destroyBox(){
        this.dialogVisible = false;
        this.dialogVisibleTwo = false;
        // 在页面销毁后，清除计时器
        this.clear();
        // this.$router.go(0);
      },

      deleteAdmin(admin) {
        this.$confirm(
                "此操作将永久删除" + admin.botId + "机器人, 是否继续?",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
        )
                .then(() => {
                  // 删除机器人功能
                  // 参数username，botId
                  // this.$cookies.get("userName")
                  // admin.botId
                  axios({
                    method: 'post',
                    url: `/qq/deleteBot`,
                    params: {
                      "username" : this.$cookies.get("userName"),
                      "botId" : "" + admin.botId,
                    }
                  }).then(res => {
                    console.log(res);
                    this.$router.go(0);
                  })
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消删除",
                  });
                });
      },
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ipToInt(ip){
      let num = 0;
      ip = ip.split(".");
      num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
      num = num >>> 0;
      this.youIPNumber = num;
      console.log("#############" + this.youIPNumber)
    },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    created(){
      const that = this;
      axios({
        method: 'get',
        url: `/qqbot/login/password/list`,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        console.log(res.data.clients); // 返回结果"success"
        if(res.status === 200){
          console.log("启动成功！！！");
          that.admins = [];
          this.results = res.data.clients;
          this.results.forEach(function(result) {
            console.log(result);
            axios({
              method: 'get',
              url: '/api/qq/' + result.uin,
            }).then(resp=>{
              let url = "";
              console.log(resp);
              if(result.resp.captcha_url!=null){
                url = result.resp.captcha_url;
              }else{
                url = result.resp.verify_url;
              }
              let json = {
                name:"test",
                qqbot_id: result.uin,
                qqbot_avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin="+ result.uin +"&spec=100",
                qqbot_state: result.resp.state,
                qqbot_nickname: resp.data.data.name,
                qqbot_url: url,
              };
              that.admins.push(json);
            });

          });
        }else{
          console.log("ERROR!重新操作！！！")
        }
      });
      axios({
        method: 'post',
        url:"/sohu/cityjson?ie=utf-8"
      }).then(res => {
        this.yourIPAddress = res.data.split("\"")[3];
        console.log(this.yourIPAddress);
      });
    },
//////////////////////////////////////////////👆👆👆👆👆👆👆👆👆👆👆///////////////////////////////////////////////////////

    data() {
      return {
        youIPNumber : 1,
        yourIPAddress : 1,
        squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        switchValue: true,
        options: [{
          value: 1,
          label: 'AndroidPhone'
        }, {
          value: 2,
          label: 'AndroidWatch'
        }, {
          value: 3,
          label: 'MacOS'
        }, {
          value: 4,
          label: 'IPad'
        }, {
          value: 5,
          label: 'QiDian'
        }],
        value: 4,
        admins: [
          {
            name:"出错啦QAQ~",
            qqbot_id: "xxxxxxxxxxx",
            qqbot_avatar:"http://59.110.229.122:5236/group1/M00/00/00/rBH4LWJj6eqAJ4-fAAV9mZu1w7g294.png",
            qqbot_state:"出错啦~",
            qqbot_nickname:"出错啦~",
            qqbot_url:"出错啦~",
            remark:"请联系相关负责人~~~",
          },
        ],
        results:[
          {
            "uin": 88888888,
            "resp":{
              "captcha_url":"www.captcha.com",
              "message":"message",
              "sms_phone":"sms_phone",
              "state":"state",
              "verify_url":"www.verify.com"
            }
          },
        ],
        keywords: "",
        allRoles: [],
        selectRoles: [],
        image_state : "无二维码",
        image_sig : '',
        image_head : "data:image/png;base64,",
        image_data : '',
        image_url : '',
        dialogVisible: false,
        dialogVisibleTwo:false,
        qq:{
          qqNumber: null,
          qqPassword: null
        },
        form: {
          question: '',
          answer: '',
          tperson: '',
          type: ''
        },
        centerDialogVisible: false,
        tableData: [{
          // id: '1',
          // question: '你从哪里来',
          // answer: '大唐',
          // tperson: '唐僧',
          // type: '字符串'
        }]
      }
    }
  }
</script>
<style>
  .admin-card {
    width: 350px;
    margin-bottom: 20px;
  }
  .admin-container {
    display: flex;
    margin-top: 20px;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .botAvatar-img {
    width: 60px;
    height: 60px;
    border-radius: 30px;
  }
  .img-content {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .userInfo {
    font-size: 16px;
    color: blueviolet;
  }
  .size-icon{
    font-size: 25px;
    margin-left: -100px;
  }
  body::before{
    content: ' ';
    position: fixed;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: lightsteelblue;
    background-size: 100% auto;
  }

</style>

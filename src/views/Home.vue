<template>
  <div>
    <div>
      <div style="display: flex; justify-content: left; margin-top: 20px">
        <el-button style="margin-left: 100px" type="warning" icon="el-icon-plus" @click="addPlugins">添加插件</el-button>
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
            <br/>
            <div>
              机器人状态:
              {{admin.qqbot_state}}
            </div>
          </div>
          </el-card>
        <el-card class="admin-card">
          <el-button
                  style="
                            width: 80px;
                            height: 80px;
                            font-size:30px;
                            margin-left: 10px;
                            margin-top: 50px;
                            margin-bottom: 50px" type="primary" icon="el-icon-plus" circle @click="addDia()"></el-button>
        </el-card>
      </div>
    </div>
    <!--登陆机器人账号-->
    <el-dialog
            title="🔮插件中心🔮"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="插件名称">
            <el-input v-model="pluginName"></el-input>
          </el-form-item>
          <el-form-item label="URL地址">
            <el-input v-model="pluginUrl"></el-input>
          </el-form-item>
          <el-button type="primary" @click="addPlugin()">确 定</el-button>
          <br/>
          <div style="font-size: large">🎮已安装的插件🎮</div>
          <!-- 插件列表 -->
          <el-table
                  :data="tableData"
                  style="width: 100%"
                  :row-class-name="tableRowClassName">
            <el-table-column
                    prop="name"
                    label="名称"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="disabled"
                    label="是否禁止"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="urls"
                    label="URL地址">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deletePlugin(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </el-dialog>

    <!-- 添加机器人账号 -->
    <el-dialog
            title="登陆选择"
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
          <el-form-item v-if="!switchValue" label="请输入机器人 QQ">
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
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // 跳转到验证链接
      turnToUrl(url){
        window.open(url,"_blank");
      },
      // 打开插件中心
      addPlugins(){
        this.dialogVisible = true;
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
            if(res.data.verify_url!=null){
              console.log(res.data.verify_url);
              this.turnToUrl(res.data.verify_url);
            }
            if(res.data.captcha_url!=null){
              console.log(res.data.captcha_url);
              this.turnToUrl(res.data.captcha_url);
            }
            //this.destroyBox();
            //this.$router.go(0);
          }else{
            console.log("ERROR!重新添加！！！")
          }
        });
      },
//////////////////////////////////////////////👆👆👆👆👆👆👆👆👆👆👆///////////////////////////////////////////////////////
      // 打开对话框
      addDia(){
        this.dialogVisibleTwo = true;
      },
      // 对话框关闭
      handleClose(done) {
        this.destroyBox();
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
        }, 3000);
      },

      // 停止定时器
      clear() {
        clearInterval(this.intervalId); //清除计时器
        this.intervalId = null; //设置为null
      },

      // IPad: 0
      // AndroidPhone: 1
      // AndroidWatch: 2
      // MacOS: 3
      // 企点: 4
      checkQR(){
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      getPlugin(){
        const that = this;
        const jsons = { };
        console.log(JSON.stringify(jsons));
        axios({
          method: 'get',
          url: `/qqbot/plugin/list`,
          data: JSON.stringify(jsons),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          let result = [];
          for (let [key, value] of Object.entries(res.data.plugins)) {
            console.log(key, value);
            const json = {
              name: key,
              urls: value.urls[0],
              disabled: ""+value.disabled,
            };
            result.push(json);
          }
          that.tableData = result;
        });
      },
      addPlugin(){
        const that = this;
        const jsons = {
          name : that.pluginName,
          plugin :
                  {
                    urls:[that.pluginUrl]
                  }
        };
        console.log(JSON.stringify(jsons));
        axios({
          method: 'post',
          url: `/qqbot/plugin/save`,
          data: JSON.stringify(jsons),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          console.log(res);
          // 刷新界面，重新获取数据
          this.$router.go(0);
        });
      },
      deletePlugin(row){
        const that = this;
        const jsons = {
          name : row.name,
        };
        console.log(JSON.stringify(jsons));
        axios({
          method: 'post',
          url: `/qqbot/plugin/delete`,
          data: JSON.stringify(jsons),
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then(res => {
          console.log(res);
          this.$router.go(0);
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
        console.log(sum(this.yourIPAddress.split("."))*123);
        // 设置获取二维码的参数
        // 设备种子默认为设备公网IP地址之和乘以123 -> 例如：127.0.0.1 => 128*123
        const jsons = {
          "device_seed":sum(this.yourIPAddress.split("."))*123,
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
      // 关掉对话框并清除定时器
      destroyBox(){
        this.dialogVisible = false;
        this.dialogVisibleTwo = false;
        // 在页面销毁后，清除计时器
        this.clear();
        // 将二维码图片改为默认图片
        this.squareUrl = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png';
        this.image_sig = '';
      },
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // 删除机器人的方法
      deleteAdmin(admin) {
        this.$confirm(
                "将删除机器人" + admin.qqbot_id + "，是否继续?",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
        )
                .then(() => {
                  // 删除机器人功能
                  const jsons = {
                    "uin":admin.qqbot_id,
                  };
                  axios({
                    method: 'post',
                    url: `/qqbot/bot/delete`,
                    data: JSON.stringify(jsons),
                    headers: {
                      'Content-Type': 'application/json;charset=UTF-8'
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
    // 页面创建时的启动函数
    created(){
      this.getPlugin();
      const that = this;
      axios({
        method: 'get',
        url: `/qqbot/bot/list`,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
        console.log(res.data.bots); // 返回结果"success"
        // 首先清空默认列表，防止干扰
        that.admins = [];
        this.results = res.data.bots;
        this.results.forEach(function(result) {
          console.log(result.nick);
          console.log(result.running);
          console.log(result.uin);
          let json = {
            qqbot_id: result.uin,
            qqbot_avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin="+ result.uin +"&spec=100",
            qqbot_state: result.running,
            qqbot_nickname: result.nick,
          };
          that.admins.push(json);
          console.log(that.admins);
        });
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
        // 添加插件的两个参数
        pluginName : '',
        pluginUrl : '',
        ////////////////////
        // 获取到的插件列表
        pluginList : [],
        ////////////////////
        youIPNumber : 1,
        yourIPAddress : 1,
        squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        switchValue: true,
        options: [{
          value: 0,
          label: 'IPad'
        },{
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
          label: 'QiDian'
        }],
        value: 0,
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
          name: 'test',
          disabled: 'false',
          urls: 'www.test.com/apis',
        },
        ]
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
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

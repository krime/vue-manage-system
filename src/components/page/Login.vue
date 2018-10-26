<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="username">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submit_form('ruleForm')">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submit_form('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function(){
      return {
        ruleForm: {
          username: 'testman',
          password: 'testing'
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submit_form(form_name) {
        this.$refs[form_name].validate((valid) => {
          if (valid) {
            this.do_login();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      do_login() {
        this.$axios.request('/admin/api/tokens', {
          method: 'post',
          data: {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }
        }).then((res) => {
          let result = res.data;
          if (result.code==200) {
            let data = result.data;
            let ms_key = data.key || '';
            let ms_user_id = data.userId;
            localStorage.setItem('user_id', ms_user_id);
            localStorage.setItem('token', ms_user_id+'_'+data.token);
            localStorage.setItem('ms_username',this.ruleForm.username);
            this.$router.push('/');
          } else {
            let desc = result.desc;
            this.$message({
              showClose: true,
              message: desc,
              center: true,
              type: 'error',
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  }
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width:100%;
    height:100%;
    background-image: url(../../assets/login-bg.jpg);
    background-size: 100%;
  }
  .ms-title {
    width:100%;
    line-height: 50px;
    text-align: center;
    font-size:20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }
  .ms-login {
    position: absolute;
    left:50%;
    top:50%;
    width:350px;
    margin:-190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255,255,255, 0.3);
    overflow: hidden;
  }
  .ms-content {
    padding: 30px 30px;
  }
  .login-btn {
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
    margin-bottom: 10px;
  }
  .login-tips {
    font-size:12px;
    line-height:30px;
    color:#fff;
  }
</style>

<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 数据</el-breadcrumb-item>
        <el-breadcrumb-item>报表上传</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="content-title">上传报表</div>
      <el-upload class="upload-demo" drag :http-request='uploadFile' action='' multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <el-alert title="只能上传xls/xlsx文件，且不超过100mb" type="warning" slot="tip" :closable="false" show-icon></el-alert>
      </el-upload>
    </div>
  </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'xlsx_upload',
        data: function(){
            return {
                defaultSrc: './static/img/img.jpg',
                fileList: [],
                imgSrc: '',
                cropImg: '',
                dialogVisible: false,
            }
        },
        components: {
            VueCropper
        },
        methods:{
            uploadFile(param) {
              let file = param.file;
              let formData = new FormData();
              formData.append("file", file, file.name);
              this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
              this.$axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
              this.$axios.post('/admin/api/product_settle_log', formData).then((res) => {
                let result = res.data;
                if (result.code==200) {
                  let desc = result.data.message;
                  this.$message({
                    showClose: true,
                    message: desc,
                    center: true,
                    type: 'success'
                  });
                } else {
                  let desc = result.desc;
                  this.$message({
                    showClose: true,
                    message: desc,
                    center: true,
                    type: 'error'
                  });
                }
              });
            },
            setImage(e){
                const file = e.target.files[0];
                console.log(JSON.stringify(file));
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            imageuploaded(res) {
                console.log(res)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '报表上传接口上传失败，可更改为自己的服务器接口'
                });
            }
        },
        created(){
            this.cropImg = this.defaultSrc;
        }
    }
</script>

<style scoped>
    .content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>

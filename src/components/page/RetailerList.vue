<template>
  <div class="table" style="width:100%;">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 销售商管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-row :gutter="20">
          <el-col :span="4">
            销售商名称：<el-input v-model="search_form.name" prefix-icon="el-icon-search" placeholder="销售商" class="handle-input"></el-input>
          </el-col>
          <el-col :span="4">
            负责人：<el-input v-model="search_form.agent" prefix-icon="el-icon-search" placeholder="负责人" class="handle-input"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
            <el-button type="primary" icon="el-icon-download" class="btn-green" @click="doExport">导出</el-button>
            <!--
            <el-button type="primary" icon="el-icon-lx-upload" class="btn-green" @click="handleUpload">导入</el-button>
            <el-button type="danger" icon="el-icon-delete" class="handle-del" @click="delAll">批量删除</el-button>
            -->
          </el-col>
        </el-row>
      </div>
      <el-table :data="data" border class="table" :cell-style="cellStyle" :header-cell-style="headerStyle" stripe size="mini" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="32" align="center"></el-table-column>
        <el-table-column prop="name" label="销售商名称">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column prop="agent" label="负责人">
        </el-table-column>
        <el-table-column prop="contracts" label="联系方式" width="200">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" class="btn-plain-red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tablePage"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="tableSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableCount">
          </el-pagination>
        </div>
      </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.agent"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.contracts"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上传操作框 -->
    <el-dialog title="上传" :visible.sync="uploadVisible" width="30%">
      <div>
        <div class="container">
          <div class="content-title">上传报表</div>
          <el-upload class="upload-demo" drag :http-request='handleUpload' action='' multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <el-alert title="只能上传xls/xlsx文件，且不超过100mb" type="warning" slot="tip" :closable="false" show-icon></el-alert>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'basetable',
    data() {
      return {
        tableData: [],
        tableCount: 1000,
        tablePage: 1,
        tableSize: Number.parseInt(localStorage.getItem('table_size')) || 10,
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        is_search: false,
        editVisible: false,
        delVisible: false,
        uploadVisible: false,
        search_form: {
          name: '',
          agent: '',
          product_name: '',
        },
        form: {
          settleTime: '',
          supplier: '',
          agent: '',
          productName: '',
        },
        idx: -1
      }
    },
    created() {
      this.getData();
    },
    computed: {
      data() {
        return this.tableData;
      }
    },
    methods: {
      // 分页导航
      handleCurrentChange(val) {
        this.tablePage = val;
        this.getData();
      },
      headerStyle({ row, rowIndex }) {
       return 'background-color:#409EFF;color:white;'
      },
      cellStyle({ row, column, rowIndex, columnIndex }) {
        if (rowIndex%2==0)
          return ''
        else
          return 'background-color:#def;'
      },
      handleSizeChange(val) {
        localStorage.setItem('table_size', val);
        this.tableSize = val;
        this.getData();
      },
      // 获取 easy-mock 的模拟数据
      getData() {
        // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
        this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
        this.$axios.post('/admin/web/retailer', {
          agent: this.search_form.agent,
          name: this.search_form.name,
          page: this.tablePage,
          size: this.tableSize
        }).then((res) => {
          let result = res.data;
          if (result.code==200) {
           let data = result.data;
           this.tableData = data.list;
           this.tablePage = data.page.page;
           this.tableSize = data.page.size;
           this.tableCount = data.page.count;
          } else {
           let desc = result.desc;
           this.$message({ showClose: true, message: desc, center: true, type: 'error' });
          }
        }).catch((err) => {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          if (err.response) {
            let res = err.response;
            console.log(res);
            let router = this.$router;
            if (res.status==401) {
              let result = res.data;
              let desc = result.desc;
              this.$message({ showClose: true, message: desc, center: true, type: 'error', });
              localStorage.removeItem('ms_username')
              localStorage.removeItem('user_id')
              localStorage.removeItem('token')
              router.push(result.path);
            }
            //XXX 服务器请求出错
            else {
              this.$message({ showClose: true, message: '服务繁忙，请稍后重试', center: true, type: 'error', });
            }
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', err.message);
            this.$message({ showClose: true, message: err.message, center: true, type: 'error' });
          }
          console.log(err.config);
        });
      },
      doSearch() {
        this.getData();
      },
      doImport() {
        this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
        let file = param.file;
        let formData = new FormData();
        formData.append("file", file, file.name);
        this.$axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        this.$axios.post('/admin/api/retailer', formData).then((res) => {
          let result = res.data;
          if (result.code==200) {
            let desc = result.data.message;
            this.$message({ showClose: true, message: desc, center: true, type: 'success' });
          } else {
            let desc = result.desc;
            this.$message({ showClose: true, message: desc, center: true, type: 'error' });
          }
          this.getData();
        });
      },
      doExport() {
        this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
        this.$axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        const config = {
          responseType: 'blob'
        };
        this.$axios.post('/admin/file/retailer/?export_model=retailer_data', config).then((res) => {
          const content = res.data;
          const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
          let file = res.headers['content-disposition'];
          file = decodeURI(file.match(/filename=(.*)$/)[1]);
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = file;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      formatterTime(row, column, value, rowIndex) {
        let time = new Date(value);
        return time.toISOString().match(/\d{4}-\d{2}-\d{2}/)[0];
      },
      formatterBool(row, column, value, rowIndex) {
        return value?'是':'否';
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      handleEdit(index, row) {
        this.idx = index;
        const item = this.tableData[index];
        this.form = {
          name: item.name,
          address: item.address,
          agent: item.agent,
          contracts: item.contracts,
        }
        this.editVisible = true;
      },
      handleDelete(index, row) {
        this.idx = index;
        const item = this.tableData[index];
        this.form = {
          name: item.name,
          agent: item.agent,
          address: item.address,
          contracts: item.contracts,
          id: item.id,
        }
        this.delVisible = true;
      },
      handleUpload() {
        this.uploadVisible = true;
      },
      delAll() {
        const length = this.multipleSelection.length;
        let str = '';
        this.del_list = this.del_list.concat(this.multipleSelection);
        for (let i = 0; i < length; i++) {
          str += this.multipleSelection[i].agent + ' ';
        }
        this.$message.error('删除了' + str);
        this.multipleSelection = [];
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 保存编辑
      saveEdit() {
        this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
        this.$axios.put('/admin/api/retailer', {
          id: this.form.id,
          name: this.form.name,
          agent: this.form.agent,
          address: this.form.address,
          contracts: this.form.contracts,
        }).then((res) => {
          let result = res.data;
          if (result.code==200) {
            //this.$set(this.tableData, this.idx, this.form);
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx+1} 行成功`);
            this.getData();
          } else {
            let desc = result.desc;
            this.$message({ showClose: true, message: desc, center: true, type: 'error' });
          }
        }).catch((err) => {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          if (err.response) {
            let res = err.response;
            console.error(res);
            let router = this.$router;
            //XXX 登陆失败置本地状态
            if (res.status==401) {
              let result = res.data;
              let desc = result.desc;
              this.$message({ showClose: true, message: desc, center: true, type: 'error', });
              localStorage.removeItem('ms_username')
              localStorage.removeItem('user_id')
              localStorage.removeItem('token')
              router.push(result.path);
            }
            //XXX 服务器请求出错
            else {
              this.$message({ showClose: true, message: '服务繁忙，请稍后重试', center: true, type: 'error', });
            }
          }
          //XXX 无返回
          else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', err.message);
            this.$message({ showClose: true, message: err.message, center: true, type: 'error' });
          }
          console.log(err.config);
        });
      },
      // 确定删除
      deleteRow() {
        const config = {
          headers: {
            token: localStorage.getItem('token'),
          },
          data: {
            id: this.form.id,
          }
        };
        this.$axios.delete('/admin/api/retailer', config).then((res) => {
          let result = res.data;
          if (result.code==200) {
            //this.$set(this.tableData, this.idx, this.form);
            //this.tableData.splice(this.idx, 1);
            this.delVisible = false;
            this.$message.success(`删除第 ${this.idx+1} 行成功`);
            this.getData();
          } else {
            let desc = result.desc;
            this.$message({ showClose: true, message: desc, center: true, type: 'error' });
          }
        }).catch((err) => {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          if (err.response) {
            let res = err.response;
            console.error(res);
            let router = this.$router;
            //XXX 登陆失败置本地状态
            if (res.status==401) {
              let result = res.data;
              let desc = result.desc;
              this.$message({ showClose: true, message: desc, center: true, type: 'error', });
              localStorage.removeItem('ms_username')
              localStorage.removeItem('user_id')
              localStorage.removeItem('token')
              router.push(result.path);
            }
            //XXX 服务器请求出错
            else {
              this.$message({ showClose: true, message: '服务繁忙，请稍后重试', center: true, type: 'error', });
            }
          }
          //XXX 无返回
          else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', err.message);
            this.$message({ showClose: true, message: err.message, center: true, type: 'error' });
          }
          console.log(err.config);
        });
      }
    }
  }

</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 120px;
    display: inline-block;
  }
  .del-dialog-cnt{
    font-size: 16px;
    text-align: center
  }
  .table{
    width: 100%;
    font-size: 12px;
  }
  table th div {
    background-color: yellow !important;
  }
  .btn-plain-red{
    color: #ff0000;
  }
  .btn-green{
    background-color: limegreen;
  }
  .hidden {
    display: none;
  }
</style>

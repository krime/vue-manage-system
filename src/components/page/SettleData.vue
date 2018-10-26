<template>
  <div class="table" style="width:100%;">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 结算报表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-row :gutter="20">
          <el-col :span="4">
            订单编号：<el-input v-model="search_form.order_no" prefix-icon="el-icon-search" placeholder="订单编号" class="handle-input"></el-input>
          </el-col>
          <el-col :span="4">
            原始单号：<el-input v-model="search_form.product_no" prefix-icon="el-icon-search" placeholder="原始单号" class="handle-input"></el-input>
          </el-col>
          <el-col :span="4">
            供应商：<el-input v-model="search_form.supplier" prefix-icon="el-icon-search" placeholder="供应商" class="handle-input"></el-input>
          </el-col>
          <el-col :span="4">
            销售商：<el-input v-model="search_form.retailer" prefix-icon="el-icon-search" placeholder="销售商" class="handle-input"></el-input>
          </el-col>
          <el-col :span="4">
            采购人：<el-input v-model="search_form.agent" prefix-icon="el-icon-search" placeholder="采购人" class="handle-input"></el-input>
          </el-col>
          <el-col :span="4">
            结算状态：<el-select v-model="search_form.settle_status" default-first-option placeholder="结算状态" class="handle-select">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            结算时间：<el-date-picker type="date" placeholder="开始时间" v-model="search_form.settle_time_start" value-format="yyyy-MM-dd" class="handle-date-picker"></el-date-picker>
            到 <el-date-picker type="date" placeholder="结束时间" v-model="search_form.settle_time_end" value-format="yyyy-MM-dd" class="handle-date-picker"></el-date-picker>
          </el-col>
          <el-col :span="8">
            发货时间：<el-date-picker type="date" placeholder="开始时间" v-model="search_form.deliver_time_start" value-format="yyyy-MM-dd" class="handle-date-picker"></el-date-picker>
            到 <el-date-picker type="date" placeholder="结束时间" v-model="search_form.deliver_time_end" value-format="yyyy-MM-dd" class="handle-date-picker"></el-date-picker>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
            <el-button type="primary" icon="el-icon-download" class="btn-green" @click="doExport">导出</el-button>
            <el-button type="primary" icon="el-icon-lx-upload" class="btn-green" @click="handleUpload">导入</el-button>
            <el-button type="danger" icon="el-icon-delete" class="handle-del" @click="delAll">批量删除</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="data" border class="table" :cell-style="cellStyle" :header-cell-style="headerStyle" stripe size="mini" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="32" align="center">
        </el-table-column>
        <el-table-column prop="settleTime" label="结算时间" sortable width="120" :formatter="formatterTime">
        </el-table-column>
        <el-table-column prop="settleStatus" label="结算状态" :formatter="formatterBool">
        </el-table-column>
        <el-table-column prop="supplier" label="供应商" width="200">
        </el-table-column>
        <el-table-column prop="productNo" label="原始单号" width="240">
        </el-table-column>
        <el-table-column prop="orderNo" label="订单编号" width="120">
        </el-table-column>
        <el-table-column prop="agent" label="采购人">
        </el-table-column>
        <el-table-column prop="productName" label="品名" width="300">
        </el-table-column>
        <el-table-column prop="specs" label="商品编码" width="100">
        </el-table-column>
        <el-table-column prop="deliverTime" label="发货时间" width="120" :formatter="formatterTime">
        </el-table-column>
        <el-table-column prop="retailer" label="店铺" width="100">
        </el-table-column>
        <el-table-column prop="orders" label="预订单数">
        </el-table-column>
        <el-table-column prop="settleOrders" label="结算单数">
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
          :page-sizes="[10, 20, 50, 100, 200, 500]"
          :page-size="tableSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableCount">
        </el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="结算时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.settle_time" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="form.supplier"></el-input>
        </el-form-item>
        <el-form-item label="销售商">
          <el-input v-model="form.retailer"></el-input>
        </el-form-item>
        <el-form-item label="采购人">
          <el-input v-model="form.agent"></el-input>
        </el-form-item>
        <el-form-item label="品名">
          <el-input v-model="form.product_name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="form.specs"></el-input>
        </el-form-item>
        <el-input v-model="form.id" class="hidden"></el-input>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <el-form ref="form" :model="form" label-width="100px" class="hidden">
        <el-input v-model="form.id" class="hidden"></el-input>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上传操作框 -->
    <el-dialog title="上传" :visible.sync="uploadVisible" width="30%">
      <div>
        <div class="container">
          <div class="content-title">上传报表</div>
          <el-upload class="upload-demo" action='' multiple drag :http-request='doImport' :show-file-list="false">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <el-alert title="只能上传xls/xlsx文件，且不超过100mb" type="warning" slot="tip" :closable="false" show-icon></el-alert>
            <el-alert v-if="upload_loading == true" title="后台正在处理数据，请稍后" type="info" slot="tip" :closable="false" show-icon>&nbsp;<i class="el-icon-loading"></i></el-alert>
            <el-alert v-if="upload_flag == true && upload_loading == false" title="正在上传数据到服务器，请稍后" type="info" slot="tip" :closable="false" show-icon>&nbsp;<i class="el-icon-loading"></i></el-alert>
          </el-upload>
          <el-progress v-if="upload_flag == true" :percentage="upload_percentage"></el-progress>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  var axios_upload_progress = e => {
    console.log(e);
    // 对原生进度事件的处理
    if (e.lengthComputable) {
      e.target.upload_flag = true;
      e.target.upload_percentage = Number.parseFloat(e.loaded / e.total * 100).toFixed(0);
    }
  };
  export default {
    name: 'basetable',
    data() {
      return {
        upload_flag: false,
        upload_percentage: 0,
        upload_loading: false,
        tableData: [],
        tableCount: 1000,
        tablePage: 1,
        tableSize: Number.parseInt(localStorage.getItem('table_size')) || 10,
        multipleSelection: [],
        del_list: [],
        editVisible: false,
        delVisible: false,
        uploadVisible: false,
        search_form: {
          settle_time_start: '',
          settle_time_end: '',
          deliver_time_start: '',
          deliver_time_end: '',
          settle_status: -1,
          supplier: '',
          retailer: '',
          order_no: '',
          product_no: '',
          agent: '',
          product_name: '',
          specs: '',
        },
        form: {
          settle_time: '',
          supplier: '',
          retailer: '',
          agent: '',
          product_name: '',
          specs: '',
        },
        options: [{
          value: -1,
          label: '未选择'
        }, {
          value: 0,
          label: '应收未结算'
        }, {
          value: 1,
          label: '应收已结算'
        }],
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
      getData() {
        this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
        this.$axios.post('/admin/web/product_settle_log', {
          agent: this.search_form.agent,
          productNo: this.search_form.product_no,
          orderNo: this.search_form.order_no,
          retailer: this.search_form.retailer,
          supplier: this.search_form.supplier,
          settleTimeStart: this.search_form.settle_time_start,
          settleTimeEnd: this.search_form.settle_time_end,
          deliverTimeStart: this.search_form.deliver_time_start,
          deliverTimeEnd: this.search_form.deliver_time_end,
          settleStatus: this.search_form.settle_status,
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
      doSearch() {
        this.getData();
      },
      doImport(param) {
        let file = param.file;
        let formData = new FormData();
        formData.append("file", file, file.name);
        //this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
        //this.$axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        let headers = { }
        headers.token = localStorage.getItem('token');
        headers.contentType = 'multipart/form-data';
        let config = {
          headers: headers,
          // `onUploadProgress` 允许为上传处理进度事件
          //onUploadProgress: axios_upload_progress,
          onUploadProgress: e => {
            // 对原生进度事件的处理
            if (e.lengthComputable) {
              this.upload_flag = true;
              this.upload_percentage = Number.parseFloat(Number.parseFloat(e.loaded / e.total * 100).toFixed(0));
              if (e.loaded<=e.total)
                this.upload_loading = true;
            }
          }
        };
        this.$axios.post('/admin/api/product_settle_log', formData, config).then((res) => {
          let result = res.data;
          if (result.code==200) {
            let desc = result.data.message;
            this.$message({ showClose: true, message: desc, center: true, type: 'success' });
          } else {
            let desc = result.desc;
            this.$message({ showClose: true, message: desc, center: true, type: 'error' });
          }
          this.getData();
          this.upload_flag = false;
          this.upload_loading = false;
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
          this.upload_flag = false;
          this.upload_loading = false;
        });
      },
      doExport() {
        this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
        this.$axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        const config = {
          responseType: 'blob'
        };
        this.$axios.post('/admin/file/product_settle_log/?export_model=settle_data', config).then((res) => {
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
        if (!value) return value;
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
          settle_time: item.settleTime,
          supplier: item.supplier,
          retailer: item.retailer,
          agent: item.agent,
          product_name: item.productName,
          specs: item.specs,
          id: item.id,
        }
        this.editVisible = true;
      },
      handleDelete(index, row) {
        this.idx = index;
        const item = this.tableData[index];
        this.form = {
          settle_time: item.settleTime,
          supplier: item.supplier,
          retailer: item.retailer,
          agent: item.agent,
          product_name: item.productName,
          specs: item.specs,
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
          console.log(this.multipleSelection)
          str += this.multipleSelection[i] + ' ';
        }
        this.$message.error('删除' + str);
        this.multipleSelection = [];
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 保存编辑
      saveEdit() {
        this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
        this.$axios.put('/admin/api/product_settle_log', {
          id: this.form.id,
          settleTime: this.form.settle_time,
          agent: this.form.agent,
          retailer: this.form.retailer,
          supplier: this.form.supplier,
          productName: this.form.product_name,
          specs: this.form.specs,
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
      deleteRow(){
        const config = {
          headers: {
            token: localStorage.getItem('token'),
          },
          data: {
            id: this.form.id,
          }
        };
        this.$axios.delete('/admin/api/product_settle_log', config).then((res) => {
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
      },
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
  .handle-date-picker {
    width: 120px !important;
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

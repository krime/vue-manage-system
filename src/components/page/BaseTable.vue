<template>
    <div class="table" style="width:100%;">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 数据报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-download" @click="doExport">导出</el-button>
            </div>
              <el-table :data="data" border class="table" :cell-style="cellStyle" :header-cell-style="headerStyle" stripe size="mini" ref="multipleTable" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55" align="center"></el-table-column>
                  <el-table-column prop="settleTime" label="结算时间" sortable width="120" :formatter="formatterTime">
                  </el-table-column>
                  <el-table-column prop="supplier" label="供应商">
                  </el-table-column>
                  <el-table-column prop="productNo" label="原始单号">
                  </el-table-column>
                  <el-table-column prop="orderNo" label="订单编号">
                  </el-table-column>
                  <el-table-column prop="agent" label="采购人">
                  </el-table-column>
                  <el-table-column prop="productName" label="品名" width="300">
                  </el-table-column>
                  <el-table-column prop="specs" label="规格" width="100">
                  </el-table-column>
                  <el-table-column prop="deliverTime" label="发货时间" width="120" :formatter="formatterTime">
                  </el-table-column>
                  <el-table-column prop="store" label="店铺" width="100">
                  </el-table-column>
                  <el-table-column prop="orders" label="预订单数">
                  </el-table-column>
                  <el-table-column prop="settleOrders" label="结算单数">
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="150" align="center">
                      <template slot-scope="scope">
                          <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                          <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
            <div class="pagination">
                <el-pagination background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="tablePage"
                  :page-sizes="[1, 2, 5, 10]"
                  :page-size="tableSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="tableCount">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="结算时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.settleTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="供应商">
                    <el-input v-model="form.supplier"></el-input>
                </el-form-item>
                <el-form-item label="采购人">
                    <el-input v-model="form.agent"></el-input>
                </el-form-item>
                <el-form-item label="品名">
                    <el-input v-model="form.productName"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
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
                url: '/admin/web/product_settle_log',
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
                return this.tableData;/*.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.supplier === this.del_list[i].supplier) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.agent.indexOf(this.select_cate) > -1 && (d.supplier.indexOf(this.select_word) > -1 || d.supplier.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
                    */
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
                if (process.env.NODE_ENV === 'development') {
                    //this.url = '/ms/table/list';
                    this.url = '/admin/web/product_settle_log';
                };
                this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
                this.$axios.post(this.url, {
                    page: this.tablePage,
                    size: this.tableSize
                }).then((res) => {
                    let result = res.data;
                    if (result.code==200) {
                      let data = result.data;
                      //this.tableData = res.data.list;
                      this.tableData = data.list;
                      this.tablePage = data.page.page;
                      this.tableSize = data.page.size;
                      this.tableCount = data.page.count;
                    } else {
                      let desc = result.desc;
                      this.$message({
                        showClose: true,
                        message: desc,
                        center: true,
                        type: 'error'
                      });
                    }
                }).catch((err) => {
                  console.error(err);
                  if (err.response) {
                    let res = err.response;
                    // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                    console.log(res.data);
                    console.log(res.status);
                    console.log(res.headers);
                    let router = this.$router;
                    if (res.status==401) {
                      let result = res.data;
                      let desc = result.desc;
                      this.$message({
                        showClose: true,
                        message: desc,
                        center: true,
                        type: 'error',
                      });
                      localStorage.removeItem('ms_username')
                      localStorage.removeItem('user_id')
                      localStorage.removeItem('token')
                      router.push(result.path);
                    }
                  } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', err.message);
                  }
                  console.log(err.config);
                });
            },
            doSearch() {
                this.is_search = true;
            },
            doExport() {
              this.$axios.defaults.headers.common['token'] = localStorage.getItem('token');
              this.$axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
              this.$axios.defaults.headers.post['Accept'] = 'application/vnd.ms-excel';
              const config = {
                responseType: 'blob'
              };
              this.$axios.post('/admin/file/product_settle_log/?export_model=settle_data', {
              }, config).then((res) => {
                //console.log(res.data);
                const content = res.data;
                //const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
                const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
                let file = res.headers['content-disposition'];
                file = file.match(/filename=(.*)$/)[1];
                file = decodeURI(file);
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
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    settleTime: item.settleTime,
                    supplier: item.supplier,
                    agent: item.agent,
                    productName: item.productName,
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
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
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx+1} 行成功`);
            },
            // 确定删除
            deleteRow(){
                this.tableData.splice(this.idx, 1);
                this.$message.success('删除成功');
                this.delVisible = false;
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
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
    .red{
        color: #ff0000;
    }
</style>

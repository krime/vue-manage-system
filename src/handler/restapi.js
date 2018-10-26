import Vue from 'vue';
import axios from 'axios';

const vms_path = {
  token: '/api/token'
}

const restapi = function() {
  var version = "1.0.0";
  return {
    test: function() {
      console.error(localStorage.getItem('ms_username'));
      //restapi.$rush.do_logout();
    },
    logout: function(url) {
      request_entity = {
        url: vms_path.token,
        method: 'delete'
      };
      handle()
      $axios.post(url, {
        username: localStorage.getItem('ms_username')
      }).then((res) => {
        restapi.$rush.do_logout();
      }).catch((err) => {
        restapi.$rush.do_logout();
      });
    },
    handle: function(request_entity, success_callback, failure_callback) {
      request_entity = request_entity || ($rush.alert('请求参数有误，请联系开发员处理') && exit);
      const token = $rush.get_local_token();
      request_entity['token'] = token;
      handle_request(request_entity, success_callback, failure_callback);
    },
    handle_request: function(request_entity, success_callback, failure_callback) {
      success_callback = success_callback || $rush.do_resp_success;
      failure_callback = failure_callback || $rush.do_resp_failure;
      this.$axios.post(request_entity).then((res) => {
        let result = res.data;
        if (result.code==200) {
          success_callback(result);
        } else {
          let desc = result.desc;
        }
      }).catch((err) => {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        if (err.response) {
          let res = err.response;
          console.error(res);
          //XXX 登陆失败置本地状态
          if (res.status==401) {
            failure_callback(res);
            $rush.do_logout(res.data.path);
          }
          //XXX 服务器请求出错
          else {
            $rush.do_req_failure();
          }
        }
        //XXX 无返回
        else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', err.message);
          $rush.do_error_message( err.message );
        }
        console.log(err.config);
      });
    }
  }
}

export default new restapi();

import Vue from 'vue';
import bus from '../components/common/bus';

const rushapi = function() {
  return {
    do_logout: function(res) {
      debugger
      bus.$router.push('/login');
      /*
      localStorage.removeItem('ms_username')
      localStorage.removeItem('user_id')
      localStorage.removeItem('token')
      */
    },
    get_local_token: function() {
      return localStorage.getItem('token');
    },
    do_resp_success: function(response) {
      console.log(response);
    },
    do_resp_failure: function(response) {
      let result = response.data;
      do_error_message(result.desc);
    },
    do_req_failure: function(err) {
      do_error_message('服务繁忙，请稍后重试');
    },
    do_error_message: function(msg) {
      $message({ showClose: true, message: msg, center: true, type: 'error', });
    },
    alert: function(msg) {
      $message({ showClose: true, message: msg, center: true, type: 'error', });
    }
  }
}

export default new rushapi();

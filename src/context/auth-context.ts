/**
 * 认证上下文，如果请求中有携带认证的话，会把响应的值设置上
 */
class AuthContext {

    username: string | null;
    password: string | null;

    /**
     * 构造函数
     * @param username {string | null} 用户名
     * @param password {string | null} 密码
     */
    constructor(username: string | null = null, password: string | null = null) {
        this.username = username;
        this.password = password;
    }

    /**
     * 判断认证上下文是否为空
     * @return {boolean} 如果用户名和密码都为空则返回true，否则返回false
     */
    isEmpty(): boolean {
        return !this.username && !this.password;
    }

}

export {
    AuthContext
}; 
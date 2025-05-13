import { Param } from './param';

/**
 * 参数上下文，用于管理一组参数
 */
export class ParamContext {
    /**
     * 参数列表
     */
    private params: Param[] = [];

    /**
     * 添加参数
     * @param param 参数对象
     */
    add(param: Param): void {
        this.params.push(param);
    }

    /**
     * 获取所有参数
     * @returns {Param[]} 参数列表
     */
    getParams(): Param[] {
        return this.params;
    }

    /**
     * 根据参数名获取参数
     * @param name 参数名
     * @returns {Param | undefined} 参数对象，如果不存在则返回undefined
     */
    getParamByName(name: string): Param | undefined {
        return this.params.find(param => param.name === name);
    }

    /**
     * 获取参数数量
     * @returns {number} 参数数量
     */
    size(): number {
        return this.params.length;
    }

    /**
     * 清空所有参数
     */
    clear(): void {
        this.params = [];
    }
} 
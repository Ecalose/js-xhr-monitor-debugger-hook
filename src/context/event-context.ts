/**
 * 事件上下文类
 * 用于管理和存储事件相关的信息
 */
class EventContext {
    // 存储事件的数组
    events: Event[];

    constructor() {
        this.events = [];
    }

    /**
     * 添加一个事件到事件上下文中
     * @param event {Event} 要添加的事件对象
     */
    addEvent(event: Event): void {
        // TODO 2025-01-11 00:18:17 同名的时候覆盖？
        this.events.push(event);
    }
}

export {
    EventContext
}; 
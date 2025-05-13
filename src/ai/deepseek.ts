// 配置你的 API 信息
const API_KEY = 'your_api_key_here'; // 替换为你的实际 API 密钥
const API_URL = 'https://api.deepseek.com/v1/chat/completions'; // 确认实际 API 端点

interface DeepSeekMessage {
    role: string;
    content: string;
}

interface DeepSeekRequestData {
    model: string;
    messages: DeepSeekMessage[];
    max_tokens: number;
}

interface DeepSeekResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

interface GMXMLHttpRequestDetails {
    method: string;
    url: string;
    headers: Record<string, string>;
    data: string;
    onload: (response: { status: number; responseText: string }) => void;
    onerror: (error: any) => void;
}

declare function GM_xmlhttpRequest(details: GMXMLHttpRequestDetails): void;

function callDeepSeekAPI(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const requestData: DeepSeekRequestData = {
            model: 'deepseek-chat', // 根据实际模型调整
            messages: [{
                role: 'user',
                content: prompt
            }],
            max_tokens: 500
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            data: JSON.stringify(requestData),
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const data: DeepSeekResponse = JSON.parse(response.responseText);
                        resolve(data.choices[0].message.content);
                    } catch (e) {
                        reject('解析响应失败');
                    }
                } else {
                    reject(`API 请求失败，状态码：${response.status}`);
                }
            },
            onerror: function (error) {
                reject(`请求错误：${error}`);
            }
        });
    });
}

export { callDeepSeekAPI }; 
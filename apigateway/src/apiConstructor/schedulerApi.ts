import HttpClient from './httpClient'

export class SchedulerApi<T> extends HttpClient {
    constructor() {
        super('http://localhost:9000')
    }

    getRequest = async (url: string, params: {} = {}) => {
        const config = {
            params: params
        }

        return await this.instance.get<T>(url, config)
    }

    postRequest = async (url: string, data: {} = {}) => {
        const config = {
            data: data
        }

        return await this.instance.post<T>(url, config)
    }
}
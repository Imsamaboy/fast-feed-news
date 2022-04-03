import {useState, useCallback} from "react"

// хук
export const useHttp = () => {
    // определяет грузится что-то с сервера или нет
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async (url, method = "Get", body = null, headers = {}) => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                headers["Content-Type"] = "application/json"
            }
            // ролик про то как работать с асинхронкой в js
            const response = await fetch(url, {method, body, headers})
            const data = await response.json()

            // при запросе что-то пошло не так
            if (!response.ok) {
                // data.message - это мы определили в бэке
                throw new Error(data.message || "При запросе что-то пошло не так")
            }

            setLoading(false)
            return data
        } catch (ex) {
            console.log("Catch: ", ex.message)
            setLoading(false)
            setError(ex.message)
            throw ex
        }
    }, [])  // deps - пока наш метод ни от чего не зависит

    const clearError = useCallback(() => setError(null), [])

    return {loading, request, error, clearError}
}
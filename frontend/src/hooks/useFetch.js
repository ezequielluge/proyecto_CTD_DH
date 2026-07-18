import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!url) return;
    
            try {
                const res = await api(url);

                if (!res || !res.ok)
                    throw new Error("Error al obtener los datos");

                const data = await res.json();
                setData(data);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [url])

    return {
        data,
        isLoading,
        error,
        setData
    }

}

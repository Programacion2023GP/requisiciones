import { useEffect, useState } from "react";
import { AxiosGet } from "../axios/axios";
interface HookProps {
    url: string;
  }
  
  export const useCatalogues = ({ url }: HookProps) => {
    const [data, setData] = useState([]);
    const [item,setItem] = useState<Record<string,any>|null>({});
    const [get,setGet] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(true);
    const getData = async () => {
        setLoading(true)
        setData([])
        setGet(!get);
    };
    const reloadData = async () => {
      try {
        const response = await AxiosGet(url);
        setData(response);
        setLoading(false)

      } catch (error) {
        setLoading(false)

      }
    };
    useEffect(() => {
    
      reloadData();
    }, [get]);
    useEffect(() => {
    }, [item]);
    return {
      data,
      getData,
      item,
      setItem,
      loading
    }
}
import { useState } from "react"

const useFetch = (cb)=>{
    const [data, setdata] = useState(undefined)
    const [loading, setloading] = useState(null)
    const [error, seterror] = useState(null)

    const fn = async(...args)=>{
        setloading(true);
        seterror(null);

        try{
            const response = await cb(...args);
            setdata(response);
            seterror(null);

            toast.error(error.message)

        }catch(error){
            seterror(error)
        }

    }
    return{data,loading,error,fn,setdata}
};
export  default useFetch;
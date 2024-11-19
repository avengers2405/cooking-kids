'use client'

import { useState, useEffect} from "react";

export default function Play(){
    const [change, setChange] = useState(0);
    var var1=10;
    var var2=7;

    useEffect(()=>{
        var2=8;
        console.log(var2);
        setChange(1);
    }, [var1])

    return (
        <div>
            {change?
                <div>
                    smth changed: {var1} and {var2}
                </div>
                :
                <div>
                    kuch nahi badla bc: {var1} and {var2}
                </div>
            }
        </div>
    )
}
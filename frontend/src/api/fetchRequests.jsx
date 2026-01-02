export function generateFormData(data){
    const form = new FormData()
        for(let e in data){
            form.append(e,data[e])
        }
    return form;
}

/** fetch API POST request
 *  header is list object 
 *  bodyData is FormData
 */
export function POST(URL,header,bodyData){
    if(bodyData == null){
        return fetch(URL,{
            method: 'POST',
            headers:header,
        })
    }else{
        return fetch(URL,{
                method: 'POST',
                headers:header,
                body: bodyData,
        })
    }
}
/** fetch API GET request
 *  bodyData is FormData
 */
export function GET(URL,header,bodyData){
    if(bodyData == null){
        return fetch(URL,{
            method: 'GET',
            headers:header,
        })
    }else{
        return fetch(URL,{
                method: 'GET',
                headers:header,
                body:bodyData,
        })
    }
}
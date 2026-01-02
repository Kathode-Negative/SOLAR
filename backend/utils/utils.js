export function generateFormData(data){
    const form = new FormData()
        for(let e in data){
            form.append(e,data[e])
        }
    return form;
}
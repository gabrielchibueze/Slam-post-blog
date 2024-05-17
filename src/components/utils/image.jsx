export const generateBase64FromImage = imagePath => {
    const reader = new FileReader()
    const promise = new Promise((resolve, reject)=>{
        reader.onload = e => (resolve(e.target.result));
        reader.onerror = err => reject(err)
    })
    reader.readAsDataURL(imagePath)
    return promise
}

// export {convertImageFileToBase64}
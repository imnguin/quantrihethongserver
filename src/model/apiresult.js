class apiresult {
    constructor(iserror = false, message = "", messagedetail = "", resultObject = null, status = 0){
        this.iserror = iserror,
        this.message = message,
        this.messagedetail = messagedetail,
        this.resultObject = resultObject,
        this.status = status
    }
}
export default apiresult;
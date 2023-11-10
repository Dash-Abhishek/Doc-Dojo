import axios  from "axios"
import config from "config"

export const healthCheck = async () => {
    try{
        let resp = await axios.get(config.get("vectorStore.host") + "/api/v1/heartbeat")
        if (resp.status != 200){
            return false
        }else{
            return true
        }
    }catch(e){
        return false
    }
    
}
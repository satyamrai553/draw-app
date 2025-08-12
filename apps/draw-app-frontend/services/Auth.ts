import { Base_URL } from "@/config";
import axios from "axios";



class AuthService{

    async  register(username: string, password: string, name: string) {
        
        try {
           const register = await axios.post(`${Base_URL}/user/register`)
           if(register){
            this.login(username, password);
           }
        } catch (error) {
            throw error;
        }
    }
    async  login(username: string, password: string){
       try {
         const login = await axios.post(`${Base_URL}/user/login`, {username, password})
         if(login){
             localStorage.setItem('jwtToken', JSON.stringify(login.data));
         }
         return login;
       } catch (error) {
        throw error;
       }
    }
    logout() {
       try {
        localStorage.removeItem('jwtToken');
       } catch (error) {
        throw error
       }
    }

    getCurrentUser(): boolean{
        const currentUser = localStorage.getItem('jwtToken');
        if(currentUser){
            return true;
        }
        return false;
    }
}

const authService = new AuthService();


export {authService};
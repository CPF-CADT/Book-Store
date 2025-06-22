import { pool } from "../utils/database";

export async function sign_up(User){
    const [name ,email,phoneNumber,password] = User;
    const [ result ] = await pool.query("insert  into Person (name,email,phoneNumber,password) values (?,?,?,?);",[name,email,phoneNumber,password]);

    return {id: result.insertId,...User};
}
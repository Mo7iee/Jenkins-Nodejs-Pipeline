import type { RegisterDTO } from "./DTOs/registerDTO.ts";
import type { LoginDTO } from "./DTOs/loginDTO.ts";
import { userModel } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const register = async ({ firstName, lastName, email, password }: RegisterDTO) => {
  const findUser = await userModel.findOne({ email });

  if (findUser) {
    return { data: "User already exists!", statusCode: 400 };
  }
  const hashedPassword = await bcrypt.hash(password,10)
  const newUser = new userModel({ firstName, lastName, email, password: hashedPassword });
  await newUser.save();

  return { data: newUser, statusCode: 200 };
};
export const login = async ({email,password}: LoginDTO) => {
    const findUser = await userModel.findOne({email})
    if(!findUser) {
        return { data:"Incorrect email or password!", statusCode: 400 };
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if(passwordMatch){
        return { data: generateJWT({email,lastName:findUser.lastName,firstName:findUser.firstName}) , statusCode: 200 };
    }
        return { data: "Incorrect email or password!", statusCode: 400 };
   

};
const generateJWT = (data: any) =>{
    return jwt.sign(data , 'mySecretKey',{expiresIn:'24h'})
}


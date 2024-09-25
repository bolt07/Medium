import { SignupInput } from "@barbarik_07/medium-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link,  useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: {type: "signup" | "signin"}) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    })

    async function sendRequest() {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = res.data.jwt;
            console.log(jwt);
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch(e) {
            alert("Error while signing up")
        }
    }

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-xl font-extrabold text-center text-3xl">
                        Create an account
                    </div>
                    <div className="text-slate-500">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>{type === "signin" ? "Sign up" : "Sign in"}</Link>
                    </div>
                </div>
                <div className="pt-4">
                    {type === "signup" ? <LabelledInput label="Name" placeholder="Hitesh Kumar..." onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }}/> : null }
                    <LabelledInput label="Username" placeholder="hitesh@gmail.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            username: e.target.value
                        })
                    }}/>
                    <LabelledInput label="Password" type={"password"} placeholder="12351" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }}/>
                    <button onClick={sendRequest} type="button" className="w-full mt-8 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 
                    font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>
            </div>
        </div>
        
    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string
}

function LabelledInput({label, placeholder, onChange, type}: LabelledInputType): JSX.Element {
    return <div>
        <label className="block mb-2 text-sm text-black font-bold pt-2">{label}</label>
        <input type={type || "text"} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 t
        ext-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}
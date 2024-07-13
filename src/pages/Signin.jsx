import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { Link } from "react-router-dom";
import supabase from "../supabase"; // Make sure to import your supabase client
import CommonAuth from "../components/CommonAuth";
import SubmitButton from "../components/ui_components/PrimaryButton";
import { useAuth } from "../context/authContext";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            alert("Error logging in: " + error.message);
        } else {
            navigate("/projects");
            // alert("Logged in");
            setAuth(true);
        }
    };

    return (
        <CommonAuth>
            <form onSubmit={handleLogin}>
                <Input
                    placeholder="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div style={{ marginBottom: "16px" }}></div>
                <Input
                    placeholder="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div style={{ marginBottom: "20px" }}></div>
                <SubmitButton andleSubmit={handleLogin} text="Next" />

                <div className="m-3"></div>
                {/* <span>
                    Don't have an account?
                    <Link to="/signup" className="font-bold ml-1">
                        Sign Up
                    </Link>
                </span> */}
            </form>
        </CommonAuth>
    );
};

export default SignInPage;

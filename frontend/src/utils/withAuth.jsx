import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const router = useNavigate();
        const [checking, setChecking] = useState(true);
        const [authorized, setAuthorized] = useState(false);

        useEffect(() => {
            const verify = async () => {
                const token = localStorage.getItem("token");

                if (!token) {
                    router("/auth");
                    setChecking(false);
                    return;
                }

                try {
                    const API_URL = import.meta.env.VITE_API_URL;

                    const response = await axios.get(
                        `${API_URL}/api/v1/users/verify`,
                        { params: { token } }
                    );

                    if (response.data.valid) {
                        setAuthorized(true);
                    } else {
                        localStorage.removeItem("token");
                        router("/auth");
                    }
                } catch (err) {
                    localStorage.removeItem("token");
                    router("/auth");
                } finally {
                    setChecking(false);
                }
            };

            verify();
        }, []);

        if (checking || !authorized) return null;

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
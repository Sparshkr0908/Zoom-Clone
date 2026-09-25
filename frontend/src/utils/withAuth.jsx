import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const router = useNavigate();
        const [checking, setChecking] = useState(true);

        useEffect(() => {
            const verify = async () => {
                const token = localStorage.getItem("token");

                if (!token) {
                    router("/auth");
                    return;
                }

                try {
                    const response = await axios.get(
                        "http://localhost:5501/api/v1/users/verify",
                        { params: { token } }
                    );

                    if (!response.data.valid) {
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

        if (checking) return null;

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
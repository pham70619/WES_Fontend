import {useRouter} from 'vue-router'

export const AuthCheck = () => {
    const router = useRouter();

    const checkAuth = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log("No token found. Redirecting to login page...!");
            router.push('/login');
        }else {
            console.log("Token exists. User authenticated.");
        }
    };

    return {
        checkAuth,
    };
}

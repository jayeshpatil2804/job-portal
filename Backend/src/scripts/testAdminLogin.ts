import axios from 'axios';

async function testAdminLogin() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/admin/login', {
            email: 'admin@losodhan.in',
            password: 'Admin@1234'
        });
        console.log('Login Test Successful:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Login Test Failed:', error.response?.status, error.response?.data);
        } else {
            console.error('Login Test Failed:', error);
        }
    }
}

testAdminLogin();

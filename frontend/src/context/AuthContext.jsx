import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const currentUserId = localStorage.getItem('skillstack_currentUser');
            if (currentUserId) {
                const users = JSON.parse(localStorage.getItem('skillstack_users') || '[]');
                const foundUser = users.find(u => u.id === currentUserId);
                if (foundUser) {
                    setUser(foundUser);
                } else {
                    localStorage.removeItem('skillstack_currentUser');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        return new Promise((resolve, reject) => {
            // Hardcoded admin login
            if (email === 'admin@skillstack.com' && password === 'admin123') {
                const adminUser = {
                    id: 'admin_id_1',
                    name: 'System Admin',
                    email: 'admin@skillstack.com',
                    isAdmin: true
                };
                localStorage.setItem('skillstack_currentUser', adminUser.id);
                // Also ensure admin exists in users list if needed, but for now just set it
                const users = JSON.parse(localStorage.getItem('skillstack_users') || '[]');
                if (!users.some(u => u.id === 'admin_id_1')) {
                    users.push(adminUser);
                    localStorage.setItem('skillstack_users', JSON.stringify(users));
                }
                setUser(adminUser);
                resolve(adminUser);
                return;
            }

            const users = JSON.parse(localStorage.getItem('skillstack_users') || '[]');
            const foundUser = users.find(u => u.email === email && u.password === password);
            if (foundUser) {
                localStorage.setItem('skillstack_currentUser', foundUser.id);
                setUser(foundUser);
                resolve(foundUser);
            } else {
                reject(new Error('Invalid login credentials'));
            }
        });
    };

    const register = async (name, email, password) => {
        return new Promise((resolve, reject) => {
            const users = JSON.parse(localStorage.getItem('skillstack_users') || '[]');
            if (users.some(u => u.email === email)) {
                reject(new Error('Email already in use'));
                return;
            }
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password // storing plaintext just for prototyping as requested
            };
            users.push(newUser);
            localStorage.setItem('skillstack_users', JSON.stringify(users));
            localStorage.setItem('skillstack_currentUser', newUser.id);
            setUser(newUser);
            resolve(newUser);
        });
    };

    const logout = () => {
        const wasAdmin = user?.isAdmin;
        localStorage.removeItem('skillstack_currentUser');
        setUser(null);
        return wasAdmin; // return role to help with redirecting
    };

    const updateUser = (updatedData) => {
        const users = JSON.parse(localStorage.getItem('skillstack_users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updatedData };
            localStorage.setItem('skillstack_users', JSON.stringify(users));
            setUser(users[userIndex]);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

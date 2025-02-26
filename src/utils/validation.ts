export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validateUsername = (username: string): boolean => {
    if (!username) return false;
    return username.length >= 3;
};

export const validatePassword = (password: string): boolean => {
    if (!password) return false;
    return password.length >= 3;
}; 
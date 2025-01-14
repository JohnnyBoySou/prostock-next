export const createToken = async (token: string) => {
  // In a real application, you'd want to securely store the token
  // For this example, we'll just store it in localStorage
  localStorage.setItem('authToken', token);
};

export const  getToken = async () => {
  return localStorage.getItem('authToken');
};

export const deleteToken = async () => {
  localStorage.removeItem('authToken');
  return true;
}
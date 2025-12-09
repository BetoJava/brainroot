const apiClient = {
    async get<T>(url: string): Promise<T> {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
  
    async post<T>(url: string, data: unknown): Promise<T> {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
  
    async patch<T>(url: string, data: unknown): Promise<T> {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
  
    async delete(url: string): Promise<void> {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    },
  };
  
  export default apiClient;
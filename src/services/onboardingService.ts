// src/services/onboardingService.ts
export const getDashboard = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:8080/onboardings/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Falha ao buscar dashboard");

  return res.json();
};

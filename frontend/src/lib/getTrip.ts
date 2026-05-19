import api from "@/lib/api";

export async function getTrip(tripId: number) {
  try {
    const res = await api.get(`/trips/${tripId}`);
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      window.location.href = "/login";
      return;
    }

    throw new Error("Erro ao buscar viagem");
  }
}
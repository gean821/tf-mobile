type StatusInfo = {
  label: string;
  bg: string;
  text: string;
  title: string;
  subtitle: string;
};

export const getStatusInfo = (status: string): StatusInfo => {
  const s = status?.toString().toLowerCase() || "";

  if (s === "concluido" || s === "finalizado") {
    return {
      label: "Concluído",
      bg: "bg-emerald-500/20",
      text: "text-emerald-50",
      title: "Viagem finalizada",
      subtitle: "Esta entrega já foi concluída.",
    };
  }
  if (s === "cancelado") {
    return {
      label: "Cancelado",
      bg: "bg-rose-500/20",
      text: "text-rose-50",
      title: "Agendamento cancelado",
      subtitle: "Este agendamento foi cancelado.",
    };
  }
  if (s === "expirado") {
    return {
      label: "Expirado",
      bg: "bg-amber-500/20",
      text: "text-amber-50",
      title: "Agendamento expirado",
      subtitle: "O prazo para esta vaga acabou.",
    };
  }
  if (s === "emandamento") {
    return {
      label: "Em andamento",
      bg: "bg-emerald-500/20",
      text: "text-emerald-50",
      title: "Em andamento",
      subtitle: "Sua descarga está acontecendo agora.",
    };
  }
  return {
    label: "Agendado",
    bg: "bg-white/20",
    text: "text-white",
    title: "Tudo certo!",
    subtitle: "Sua vaga foi reservada com sucesso.",
  };
};

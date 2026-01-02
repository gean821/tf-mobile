// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import AgendamentoService from "../services/AgendamentoService";

// export const useAgendamento = () => {
//     const queryClient = useQueryClient();

//     const {
//         data: agendamentos,
//         isLoading: isLoadingAgendamentos,
//         error: errorAgendamentos
//     } = useQuery({
//         queryKey: ['getAll'],
//         staleTime: 5*60*1000,
//         queryFn: AgendamentoService.GetAvailableAppointments(fornecedorId: string)
//     });

//     return {
//         produtos: agendamentos || [],
//         isLoadingAgendamentos
//     }

// }

import { ActionTypes } from "./actions";
import { produce } from "immer";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesStates {
  cycles: Cycle[];
  activeCycleId: string | null;
}


export function cyclesReducer (state: CyclesStates, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      // return {
      //   ...state,
      //   cycles: [...state.cycles, action.payload.newCycle],
      //   activeCycleId: action.payload.newCycle.id,
      // };
      return produce(state, draft => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id;
      })

    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      });

      if(currentCycleIndex < 0 ) {
        return state
      }

      return produce(state, draft => {
        draft.cycles[currentCycleIndex].interruptedDate = new Date()
        draft.activeCycleId = null
      })

    }
    // ...state,
    // cycles: state.cycles.map((cycle) => {
    //   if (cycle.id === state.activeCycleId) {
    //     return {
    //       ...cycle,
    //       interruptedDate: new Date(),
    //     };
    //   } else {
    //     return cycle;
    //   }
    // }),

    /* 1ª - Há uma nova tipagem chamada interruptedData, opcional.
        faz um map dentro dos ciclos e verifica se o ID do clicado é o mesmo ID que está ativo.
        Se for, retorna todos os cyclos que já existe, adicionando o novo atributo "interruptedDate"

      2ª - Com isso, vai setar a data em que foi interrompido o ciclo pomodoro.
          Se não houver o id igual, retorna todos os ciclos normalmente
      
      3ª - Reseta o estado que diz se o ciclo está ativo ou não (pelo ID) para NULL. Assim, resetando tudo, pois vai dá
      false para o ciclo Ativo, zerando todo o cronômetro.*/
    
     

    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      });

      if(currentCycleIndex < 0 ) {
        return state
      }

      return produce(state, draft => {
        draft.cycles[currentCycleIndex].finishedDate = new Date()
        draft.activeCycleId = null
      })

          // return {
      //   ...state,
      //   cycles: state.cycles.map((cycle) => {
      //     if (cycle.id === state.activeCycleId) {
      //       return {
      //         ...cycle,
      //         finishedDate: new Date(),
      //       };
      //     } else {
      //       return cycle;
      //     }
      //   }),
      //   activeCycleId: null,
      // };
  
    
    }

      
    default:
      return state;
  }
}
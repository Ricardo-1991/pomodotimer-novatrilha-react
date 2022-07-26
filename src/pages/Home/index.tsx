import { FormProvider, useForm } from "react-hook-form";
import { useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { CountDown } from "./components/CountDown";
import { NewCycleForm } from "./components/NewCycleForm";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
  // Faz o formato de validação
  task: zod.string().min(1, "Informe a tarefa a ser realizada."),
  minutesAmount: zod
    .number()
    .min(1, "O ciclo precisa ser de no mínimo 5 minutos.")
    .max(60, "O ciclo precisa ser de no máximo 60 minutos."),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>; // Infere o tipo do Schema

export function Home() {
  const {
    createNewCycle,
    interruptCurrentCycle,
    activeCycle,
    amountSecondsPassed,
  } = useContext(CyclesContext);
  const newCycleForm = useForm<NewCycleFormData>({
    // Cria o objeto de configurações pra receber o Schema
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  //register = por no Input para ter acesso a todos as propriedades do input, inclusive o seu ponteiro
  //handleSubmit = função a qual receberá a função do formulário
  //watch = controlled. Assiste as mudanças do input selecionado

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  const task = watch("task");
  const isSubmitDisable = !task;

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0; // Pega o total de segundos
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0; // Segundos atuais diminuindo

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <CountDown />
        {activeCycle && currentSeconds !== 0 && (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        )}
        {currentSeconds === 0 && (
          <StartCountdownButton disabled={isSubmitDisable} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}

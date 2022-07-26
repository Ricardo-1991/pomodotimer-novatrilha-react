import { useContext, useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";
import { CountdownContainer, Separator } from "./styles";

export function CountDown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0; // Pega o total de segundos

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate)
        );
        if (secondsDifference >= totalSeconds) {
          // Terminou o ciclo
          markCurrentCycleAsFinished();
          setSecondsPassed(totalSeconds); // Zera o ciclo (Total === Diferença entre segundos da data de criação e Data Atual)
          clearInterval(interval); // para a contagem
        } else {
          setSecondsPassed(secondsDifference); // Continua diminuindo os segundos (totalSeconds - amountSecondsPassed)
        }
      }, 1000);
    }

    return () => {
      // Serve para limpar o intervalo
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished]);

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0; // Segundos atuais diminuindo
  const minutesAmount = Math.floor(currentSeconds / 60); // Pega os minutos
  const secondsAmount = currentSeconds % 60; // pega o formato de segundos, dividindo os atuais segundos por 60

  const minutes = String(minutesAmount).padStart(2, "0"); // PadStart vai mostrar o formato dos minutos. Caso chegue em 9, ele bota o 0 na frente (09)
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}

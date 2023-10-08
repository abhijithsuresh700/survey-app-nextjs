"use client";
import React, { useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { Chart } from "chart.js/auto";
import { useRouter } from "next/navigation";

const SurveySummary = () => {
  const router = useRouter();
  const questions = useAppSelector((state) => state.survey.questions);
  const userAnswers = useAppSelector((state) => state.survey.userAnswers);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const score = questions.reduce((totalScore, question) => {
    if (userAnswers[question.id] === question.correctAnswer) {
      return totalScore + 1;
    }
    return totalScore;
  }, 0);

  const totalScore = questions.length;

  useEffect(() => {
    if (!questions || Object.keys(userAnswers).length === 0) {
      router.push("/");
    }

    if (chartInstance.current) {
      (chartInstance.current as any).destroy();
    }
    const myChartRef = (chartRef.current as any).getContext("2d");

    (chartInstance.current as any) = new Chart(myChartRef, {
      type: "pie",
      data: {
        labels: ["Correct", "Incorrect"],
        datasets: [
          {
            data: [score, totalScore - score],
            backgroundColor: ["rgb(102, 255, 102)", "rgb(255, 80, 80)"],
          },
        ],
      },
    });
    return () => {
      if (chartInstance.current) {
        (chartInstance.current as any).destroy();
      }
    };
  }, [router, questions, userAnswers]);
  return (
    <div className="bg-gray-950 text-white p-4 shadow-md w-full min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      <div className="flex-1 mt-6 sm:mt-0 sm:mr-4">
        <h1 className="text-3xl font-semibold mb-4">Result Page</h1>
        <p className="text-xl mb-2">
          Your Score: {score} / {questions.length}
        </p>
        <h2 className="text-xl mb-2">Answers:</h2>
        <ul className="list-none p-0">
          {questions.map((question) => (
            <li key={question.id} className="mb-4">
              <div>
                <h4 className="text-lg">{question.text}</h4>
                <p className="text-base">
                  Your Answer:{" "}
                  <span
                    className={
                      userAnswers[question.id] === question.correctAnswer
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {userAnswers[question.id]}
                  </span>
                </p>
                {userAnswers[question.id] !== question.correctAnswer && (
                  <p className="text-base">
                    Correct Answer:{" "}
                    <span className="text-green-500">
                      {question.correctAnswer}
                    </span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <div className="w-70 h-64">
          <h1 className="text-3xl font-semibold mb-4">Your Performance</h1>
          <canvas
            ref={chartRef}
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default SurveySummary;

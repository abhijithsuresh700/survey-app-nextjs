"use client"
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { answerQuestion, nextQuestion, submitSurvey } from '@/redux/surveySlice';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';

const SurveyQuestions = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const questions = useAppSelector((state) => state.survey.questions);
    const currentQuestionIndex = useAppSelector((state) => state.survey.currentQuestionIndex);
    const userAnswers = useAppSelector((state) => state.survey.userAnswers);
    const submitted = useAppSelector((state) => state.survey.submitted);
  
    const handleOptionSelect = (questionId: string, selectedOption: string) => {
      dispatch(answerQuestion({ questionId, selectedOption }));
    };
  
    const handleNextOrSubmitClick = () => {
      if (currentQuestionIndex === questions.length - 2 && !submitted) {
        const unansweredQuestions = questions
          .slice(currentQuestionIndex, currentQuestionIndex + 2)
          .filter((question) => !userAnswers[question.id]);
        if (unansweredQuestions.length === 0) {
          dispatch(submitSurvey());
        router.push('/results');
        } else {
          toast.error("Please answer all questions before submitting.", {
            theme: "dark",
          });
        }
      } else if (
        userAnswers[questions[currentQuestionIndex].id] &&
        userAnswers[questions[currentQuestionIndex + 1].id]
      ) {
        dispatch(nextQuestion());
      } else {
        toast.error("Please answer all questions before proceeding.", {
          theme: "dark",
        });
      }
    };
  
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
  return (
<div className="bg-gray-950 text-white p-4 shadow-md min-h-screen">
<h1 className="text-2xl font-semibold mb-4">Survey App</h1>
{questions
  .slice(currentQuestionIndex, currentQuestionIndex + 2)
  .map((question) => (
    <div key={question.id} className="bg-gray-950 p-4 mb-4 border border-gray-700 rounded-lg">
      <h3 className="text-lg mb-2">{question.text}</h3>
      <ul className="list-none p-0">
        {question.options.map((option) => (
          <li key={option} className="mb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                onChange={() => handleOptionSelect(question.id, option)}
                checked={userAnswers[question.id] === option}
                className="mr-2 cursor-pointer"
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
    </div>
  ))}
<button
  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 cursor-pointer"
  onClick={handleNextOrSubmitClick}
>
{currentQuestionIndex === questions.length - 2 ? "Submit" : "Next"}
</button>
<ToastContainer />
</div>

  )
}

export default SurveyQuestions


//   disabled={
//     !userAnswers[questions[currentQuestionIndex].id] ||
//     !userAnswers[questions[currentQuestionIndex + 1].id]
//   }

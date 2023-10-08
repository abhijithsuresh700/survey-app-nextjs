import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import questionsData from "../Questionsdata";

interface SurveyState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  submitted: boolean;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

const initialState: SurveyState = {
  questions: questionsData,
  currentQuestionIndex: 0,
  userAnswers: {},
  submitted: false,
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    answerQuestion: (state, action: PayloadAction<{ questionId: string; selectedOption: string }>) => {
      const { questionId, selectedOption } = action.payload;
      state.userAnswers[questionId] = selectedOption;
    },
    nextQuestion: (state) => {
      state.currentQuestionIndex += 2;
    },
    submitSurvey: (state) => {
      state.submitted = true;
    },
    resetSurvey: (state) => {
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
      state.submitted = false;
    },
  },
});

const surveyReducer = surveySlice.reducer;
export const { answerQuestion, nextQuestion, resetSurvey, submitSurvey } = surveySlice.actions;
export default surveyReducer;
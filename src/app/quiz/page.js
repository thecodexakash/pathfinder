"use client";

import { useEffect, useState } from "react";
import Results from "@/components/Results";
import answerStore from "@/store/answerStore";

const Page = ({ params }) => {
  const { subject } = params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const { addAnswer, resetAnswers } = answerStore();

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("/data/questions.json");
      if (response.ok) {
        const data = await response.json();
        const subjectData = data.subjects.find(
          (s) => s.name.toLowerCase() === "pathfinder_survery"
        );
        setQuestions(subjectData ? subjectData.questions : []);
      } else {
        console.error("Failed to fetch questions");
      }
    };
    fetchQuestions();
    resetAnswers();
  }, [subject, resetAnswers]);

  const handleAnswer = (option) => {
    const { addAnswer } = answerStore.getState();
    
    if (isAnswered) return;
  
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // time taken in seconds
  
    setSelectedOption(option);
    setIsAnswered(true);
    setTotalTimeSpent(totalTimeSpent + timeTaken);
  
    const currentQuestion = questions[currentQuestionIndex];
    const careerCodesForThisQuestion = currentQuestion.career_code[
      option === "Strongly Agree" ? 0 :
      option === "Agree" ? 1 :
      option === "Neutral" ? 2 :
      option === "Disagree" ? 3 : 4
    ];
  
    const responseEntry = {
      question: currentQuestion.question,
      response: option,
      careerCodes: careerCodesForThisQuestion,
      matchingCareer: currentQuestion.related_career,
      educationRequired: currentQuestion.education_required,
      timeTaken: timeTaken,
    };
  
    addAnswer(responseEntry);
  
    if (option === currentQuestion.answer) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }
  };

  const handleNext = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedOption(null);
      setIsAnswered(false);
      setStartTime(Date.now());
    } else {
      setShowResults(true);
    }
  };

  const percentage = Math.round((correctAnswers / questions.length) * 100);
  const averageTimePerQuestion = (totalTimeSpent / questions.length).toFixed(2);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {!showResults ? (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6 relative">
          <div className="absolute top-0 left-0 h-2 bg-blue-500 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
          <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          <h3 className="text-xl font-bold text-center mb-6 p-4 bg-blue-500 text-white rounded-lg">
            {questions[currentQuestionIndex]?.question}
          </h3>
          <div className="mt-6 space-y-4">
            {questions[currentQuestionIndex]?.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition duration-300 focus:outline-none ${
                  isAnswered && option === selectedOption
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 focus:bg-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {isAnswered && (
            <button
              onClick={handleNext}
              className="mt-8 w-full py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next Question"}
            </button>
          )}
        </div>
      ) : (
        <Results
          totalQuestions={questions.length}
          timeSpent={totalTimeSpent}
          averageTimePerQuestion={averageTimePerQuestion}
        />
      )}
    </div>
  );
};

export default Page;

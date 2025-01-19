"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock, FaStopwatch } from "react-icons/fa";
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import answerStore from "@/store/answerStore";
import { useRouter } from "next/navigation";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Results = ({
  totalQuestions,
  timeSpent,
  averageTimePerQuestion,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();
  const { answers, resetAnswers } = answerStore();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 7000); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("User responses:", answers);
  }, [answers]);

  const calculateTopCareers = () => {
    const careerCodeCount = {};

    answers.forEach(({ careerCodes }) => {
      if (careerCodeCount[careerCodes]) {
        careerCodeCount[careerCodes]++;
      } else {
        careerCodeCount[careerCodes] = 1;
      }
    });

    const sortedCareerCodes = Object.entries(careerCodeCount).sort((a, b) => b[1] - a[1]);
    const topThreeCareerCodes = sortedCareerCodes.slice(0, 3).map(([code]) => code);

    return topThreeCareerCodes;
  };

  const calculateResponseDistribution = () => {
    const responseCount = {
      "Strongly Agree": 0,
      "Agree": 0,
      "Neutral": 0,
      "Disagree": 0,
      "Strongly Disagree": 0,
    };

    answers.forEach(({ response }) => {
      responseCount[response]++;
    });

    return responseCount;
  };

  const topCareerCodes = calculateTopCareers();
  const responseDistribution = calculateResponseDistribution();

  const topCareers = topCareerCodes.map((code) => {
    const matchingAnswer = answers.find((answer) => answer.careerCodes === code);
    return {
      careerCode: code,
      matchingCareer: matchingAnswer ? matchingAnswer.matchingCareer : "N/A",
      educationRequired: matchingAnswer ? matchingAnswer.educationRequired : "N/A",
    };
  });

  const barChartData = {
    labels: topCareerCodes,
    datasets: [
      {
        label: 'Career Code Occurrences',
        data: topCareerCodes.map(code => answers.filter(answer => answer.careerCodes === code).length),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(responseDistribution),
    datasets: [
      {
        label: 'Response Distribution',
        data: Object.values(responseDistribution),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Career Survey Result", 20, 10);
    doc.autoTable({ html: '#careerTable' });
    doc.save("career_survey_result.pdf");
  };

  const retakeSurvey = () => {
    resetAnswers();
    router.push("/");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={700} />}

      <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">
        Career Survey Result
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="p-5 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <p className="text-xl font-semibold">Questions Answered</p>
            <p className="text-lg font-bold text-green-600">{totalQuestions}</p>
          </div>
          <FaCheckCircle className="text-green-500 text-3xl" />
        </div>
        <div className="p-5 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <p className="text-xl font-semibold">Total Time Spent</p>
            <p className="text-lg font-bold text-purple-600">{timeSpent.toFixed(2)}s</p>
          </div>
          <FaClock className="text-purple-500 text-3xl" />
        </div>
        <div className="p-5 bg-white shadow-md rounded-lg flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <p className="text-xl font-semibold">Avg Time/Question</p>
            <p className="text-lg font-bold text-indigo-600">{averageTimePerQuestion}s</p>
          </div>
          <FaStopwatch className="text-indigo-500 text-3xl" />
        </div>
        <div className="p-5 bg-white shadow-md rounded-lg flex flex-col items-center justify-between col-span-1 md:col-span-3 text-center hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-bold mb-4">Top 3 Career Matches</h3>
          <table id="careerTable" className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Career Code</th>
                <th className="py-2">Matching Career</th>
                <th className="py-2">Education Required</th>
              </tr>
            </thead>
            <tbody>
              {topCareers.map((career, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{career.careerCode}</td>
                  <td className="border px-4 py-2">{career.matchingCareer}</td>
                  <td className="border px-4 py-2">{career.educationRequired}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 bg-white shadow-md rounded-lg col-span-1 md:col-span-3 text-center hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-bold mb-4">Career Code Occurrences</h3>
          <Bar data={barChartData} />
        </div>
        <div className="p-5 bg-white shadow-md rounded-lg col-span-1 md:col-span-3 text-center hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-bold mb-4">Response Distribution</h3>
          <Pie data={pieChartData} />
        </div>
        <div className="p-5 bg-white shadow-md rounded-lg col-span-1 md:col-span-3 text-center hover:shadow-lg transition-shadow duration-300 flex justify-center space-x-4">
          <button
            onClick={downloadPDF}
            className="px-8 py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg transform transition-transform hover:scale-110"
          >
            Download PDF
          </button>
          <button
            onClick={retakeSurvey}
            className="px-8 py-4 bg-red-500 text-white font-bold rounded-full shadow-lg transform transition-transform hover:scale-110"
          >
            Retake Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;

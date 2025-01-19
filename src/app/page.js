"use client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const startAssessment = () => {
    router.push("/quiz");
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-5xl font-extrabold mb-6 text-blue-600">
        Welcome to the Pathfinder Career Survey !
      </h1>
      <p className="text-xl mb-8 text-gray-500">
        Understand yourself better through our cluster survey.
      </p>
      <img
        src="/images/career-survey-hero.webp"
        alt="career-survey"
        className="mb-8"
        width="25%"
      />
      <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-8 ">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Instructions</h2>
        <ul className="list-disc list-inside text-gray-500">
          <li className="mb-2">Click the Start Assessment button to begin.</li>
          <li className="mb-2">You will have  ample time to answer each question.</li>
          <li className="mb-2">Answer honestly to get the most accurate results.</li>
          <li className="mb-2">Your results will be displayed at the end of the assessment.</li>
          <li className="mb-2">The assessment will have 20 questions for better assessment.</li>
          <li className="mb-2">You will be able to pick only one option from 5 available options.</li>
          <li className="mb-2">Once you click an option, you cannot change the response as it will be immediately captured and saved.</li>
          <li className="mb-2">However, at the end, you can take a retest if needed.</li>
        </ul>
      </div>
      <button
        className="px-8 py-4 bg-blue-500 text-white font-bold rounded-full shadow-lg transform transition-transform hover:scale-110"
        onClick={startAssessment}
      >
        Start Assessment
      </button>
    </div>
  );
}

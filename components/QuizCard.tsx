
import React from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  isReview?: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  isReview = false
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {question.category}
        </span>
        <span className="text-slate-400 text-sm font-medium">
          Questão {currentIndex + 1} de {totalQuestions}
        </span>
      </div>

      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
          {question.text}
        </h2>
      </div>

      <div className="space-y-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = isReview && idx === question.correctAnswer;
          const isWrong = isReview && isSelected && idx !== question.correctAnswer;

          let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ";
          
          if (isReview) {
            if (isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-700 ";
            else if (isWrong) btnClass += "bg-rose-50 border-rose-500 text-rose-700 ";
            else btnClass += "bg-slate-50 border-slate-200 text-slate-500 ";
          } else {
            if (isSelected) btnClass += "bg-blue-50 border-blue-500 text-blue-700 shadow-md ";
            else btnClass += "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-slate-700 ";
          }

          return (
            <button
              key={idx}
              disabled={isReview}
              onClick={() => onSelectOption(idx)}
              className={btnClass}
            >
              <div className="flex items-center">
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-4 text-sm font-bold border-2 
                  ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 group-hover:border-blue-400 text-slate-400'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-base md:text-lg">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {isReview && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="text-blue-800 font-bold mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Explicação
          </h4>
          <p className="text-blue-700 text-sm leading-relaxed italic">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

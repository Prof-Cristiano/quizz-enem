
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppState, Question, QuizResult, QuizCategory } from './types';
import { INITIAL_QUESTIONS } from './constants';
import { QuizCard } from './components/QuizCard';
import { editImageWithIA } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [results, setResults] = useState<QuizResult | null>(null);
  
  // Image Editor State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const startQuiz = () => {
    // Shuffle and pick 50
    const shuffled = [...INITIAL_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 50));
    setUserAnswers({});
    setCurrentIdx(0);
    setStartTime(Date.now());
    setAppState(AppState.QUIZ);
  };

  const handleSelectOption = (idx: number) => {
    setUserAnswers(prev => ({ ...prev, [questions[currentIdx].id]: idx }));
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const answersData = questions.map(q => ({
      questionId: q.id,
      selected: userAnswers[q.id],
      correct: userAnswers[q.id] === q.correctAnswer
    }));
    const score = answersData.filter(a => a.correct).length;
    
    setResults({
      score,
      total: questions.length,
      timeSpent,
      answers: answersData,
      date: new Date().toISOString()
    });
    setAppState(AppState.RESULTS);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const runImageEdit = async () => {
    if (!selectedImage || !editPrompt) return;
    setIsEditing(true);
    const result = await editImageWithIA(selectedImage, editPrompt);
    if (result) setSelectedImage(result);
    setIsEditing(false);
  };

  const chartData = useMemo(() => {
    if (!results) return [];
    const categories = [QuizCategory.HUMANAS, QuizCategory.NATUREZA, QuizCategory.LINGUAGENS, QuizCategory.MATEMATICA];
    return categories.map(cat => {
      const catQuestions = questions.filter(q => q.category === cat);
      const catAnswers = results.answers.filter(a => {
        const q = questions.find(qu => qu.id === a.questionId);
        return q?.category === cat;
      });
      const correctCount = catAnswers.filter(a => a.correct).length;
      return { 
        name: cat, 
        acertos: correctCount, 
        total: catQuestions.length,
        percentage: catQuestions.length > 0 ? (correctCount / catQuestions.length) * 100 : 0
      };
    });
  }, [results, questions]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 hidden sm:block">ENEM Master</h1>
        </div>
        
        <nav className="flex gap-4">
          <button onClick={() => setAppState(AppState.HOME)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${appState === AppState.HOME ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>Início</button>
          <button onClick={() => setAppState(AppState.AI_EDITOR)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${appState === AppState.AI_EDITOR ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>Editor IA</button>
        </nav>
      </header>

      <main className="w-full max-w-4xl p-6 flex-grow">
        {appState === AppState.HOME && (
          <div className="flex flex-col items-center text-center space-y-12 py-12">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">Prepare-se para o <span className="text-blue-600">ENEM 2024</span></h2>
              <p className="text-xl text-slate-500 leading-relaxed">Simule a prova oficial com 50 questões selecionadas das edições anteriores. Pratique com cronômetro e receba feedback detalhado por IA.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </div>
                <h3 className="font-bold text-slate-800">50 Questões</h3>
                <p className="text-sm text-slate-400">Banco de dados oficial ENEM.DEV</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </div>
                <h3 className="font-bold text-slate-800">Feedback Instantâneo</h3>
                <p className="text-sm text-slate-400">Gabarito comentado</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </div>
                <h3 className="font-bold text-slate-800">IA Powered</h3>
                <p className="text-sm text-slate-400">Análise profunda de desempenho</p>
              </div>
            </div>

            <button 
              onClick={startQuiz}
              className="px-12 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-200 text-xl"
            >
              Iniciar Simulado
            </button>
          </div>
        )}

        {appState === AppState.QUIZ && questions.length > 0 && (
          <div className="space-y-6">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <QuizCard 
              question={questions[currentIdx]}
              currentIndex={currentIdx}
              totalQuestions={questions.length}
              selectedOption={userAnswers[questions[currentIdx].id] ?? null}
              onSelectOption={handleSelectOption}
            />

            <div className="flex justify-between items-center py-4">
              <button 
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
                className="px-6 py-3 text-slate-500 font-medium hover:text-slate-800 disabled:opacity-30 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                Anterior
              </button>
              
              <button 
                onClick={nextQuestion}
                disabled={userAnswers[questions[currentIdx].id] === undefined}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {currentIdx === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              </button>
            </div>
          </div>
        )}

        {appState === AppState.RESULTS && results && (
          <div className="space-y-10 py-6 animate-in fade-in duration-700">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Simulado Concluído!</h2>
              <p className="text-slate-500 mb-8">Confira seu desempenho detalhado por área de conhecimento.</p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-10">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      className="text-blue-600 transition-all duration-1000 ease-out"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * (results.score / results.total))}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-slate-800">{results.score}</span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">de {results.total}</span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold">TEMPO TOTAL</p>
                      <p className="font-bold text-slate-700">{Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-bold">PRECISÃO</p>
                      <p className="font-bold text-slate-700">{((results.score / results.total) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="percentage" radius={[8, 8, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={startQuiz} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg">Refazer Simulado</button>
              <button onClick={() => setAppState(AppState.HOME)} className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 shadow-sm">Voltar ao Início</button>
            </div>
          </div>
        )}

        {appState === AppState.AI_EDITOR && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.022l1.523 1.523a2 2 0 002.828 0l1.523-1.523a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-1.414-1.96l-2.387-.477a2 2 0 00-1.022.547l-1.523 1.523a2 2 0 000 2.828l1.523 1.523z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Nano Banana Editor</h2>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Powered by Gemini 2.5 Flash Image</p>
              </div>
            </div>

            <div className="space-y-8">
              {!selectedImage ? (
                <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50 cursor-pointer hover:bg-slate-100 hover:border-blue-400 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-16 h-16 text-slate-300 group-hover:text-blue-400 mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    <p className="text-lg font-bold text-slate-600">Upload de Imagem</p>
                    <p className="text-sm text-slate-400">Arraste fotos de diagramas, mapas ou notas de estudo</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="relative group rounded-3xl overflow-hidden bg-black flex items-center justify-center min-h-[300px]">
                  <img src={selectedImage} alt="Preview" className="max-w-full max-h-[500px] object-contain shadow-2xl" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-rose-500 shadow hover:bg-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Ex: Adicione um filtro retrô, remova o fundo, destaque o texto..."
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    className="flex-grow bg-slate-100 border-none rounded-2xl px-6 py-4 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                  <button 
                    onClick={runImageEdit}
                    disabled={!selectedImage || !editPrompt || isEditing}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all"
                  >
                    {isEditing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Editando...
                      </>
                    ) : (
                      'Aplicar IA'
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Efeito Vintage", "Preto e Branco", "Aumentar Nitidez", "Remover Background"].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setEditPrompt(tag)}
                      className="text-xs font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-12 px-6 bg-slate-900 text-slate-500 text-center space-y-4 mt-auto">
        <p className="font-bold text-white text-lg">ENEM Master Quiz</p>
        <p className="max-w-xl mx-auto text-sm opacity-60">Prepare-se com a melhor base de questões nacionais. Simulados gerados aleatoriamente para garantir a diversidade do conhecimento.</p>
        <div className="flex justify-center gap-6 pt-4 border-t border-slate-800">
          <span className="text-xs">© 2024 Powered by Gemini 3</span>
          <span className="text-xs">API: ENEM.DEV</span>
        </div>
      </footer>
    </div>
  );
};

export default App;

import { useEffect, useState } from "react";
import { TfiHelpAlt } from "react-icons/tfi";
import { IoMdClose } from "react-icons/io";
import { createPortal } from "react-dom";

type Tutorial = {
  guide: Guide[];
};

export type Guide = {
  afterOpenTutorial?: () => void;
  afterActions?: () => void;
  question: string;
  referenceStart: string;
  response: string;
  action?: () => void;
  steps?: Omit<Guide, 'question'>[];
};

const CustomTutorial = ({ guide }: Tutorial) => {
  const [open, setOpen] = useState(false);
  const [startGuide, setStartGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState<number | null>(null);
  const [highlight, setHighlight] = useState<DOMRect | null>(null);

  const stepToShow =
    currentSubStep !== null
      ? guide[currentStep].steps?.[currentSubStep]
      : guide[currentStep];

  // Scroll y resaltado
useEffect(() => {
  if (!startGuide || !stepToShow) return;

  stepToShow.afterActions?.();

  const waitForElement = (selector: string, timeout = 5000): Promise<HTMLElement | null> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const el = document.querySelector(selector) as HTMLElement | null;
        if (el) {
          clearInterval(interval);
          resolve(el);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        resolve(null);
      }, timeout);
    });
  };

  const scrollToElement = (el: HTMLElement) => {
    // Verificar si tiene contenedor con scroll
    const scrollParent = el.closest<HTMLElement>('[style*="overflow"]');
    if (scrollParent) {
      scrollParent.scrollTo({
        top: el.offsetTop - scrollParent.offsetTop - scrollParent.clientHeight / 2 + el.clientHeight / 2,
        behavior: 'smooth',
      });
    } else {
      // Scroll de la ventana
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  waitForElement(stepToShow.referenceStart).then((el) => {
    if (!startGuide || !el) return;

    // Hacer scroll primero
    scrollToElement(el);

    // Esperar que el navegador actualice el layout
    requestAnimationFrame(() => {
      setHighlight(el.getBoundingClientRect());
    });
  });
}, [startGuide, currentStep, currentSubStep, guide]);


  // Avanzar al siguiente paso
  const nextStep = async () => {
  if (!stepToShow) return;

  // Ejecutar acción si existe
  if (stepToShow.action) {
    await stepToShow.action();
  }

  const mainStep = guide[currentStep];

  let nextMainStep = currentStep;
  let nextSubStep = currentSubStep;

  // Manejo de subpasos
  if (mainStep.steps && mainStep.steps.length > 0) {
    if (currentSubStep === null) {
      nextSubStep = 0;
    } else if (currentSubStep < mainStep.steps.length - 1) {
      nextSubStep = currentSubStep + 1;
    } else {
      nextSubStep = null;
      nextMainStep = currentStep + 1;
    }
  } else {
    nextMainStep = currentStep + 1;
    nextSubStep = null;
  }

  if (nextMainStep >= guide.length) {
    // Fin del tutorial
    setStartGuide(false);
    setOpen(false);
    setCurrentStep(0);
    setCurrentSubStep(null);
    return;
  }

  // Actualizar estado una sola vez
  setCurrentStep(nextMainStep);
  setCurrentSubStep(nextSubStep);
};


  return (
    <>
      {!startGuide ? (
        <div className="fixed bottom-6 right-6 z-[9998]">
          {!open ? (
            <button
              onClick={() => setOpen(true)}
              className="flex hover:cursor-pointer items-center justify-center w-12 h-12 rounded-full bg-cyan-500 text-white shadow-lg hover:bg-cyan-600 transition-colors duration-300"
            >
              <TfiHelpAlt className="text-2xl" />
            </button>
          ) : (
            <div className="w-72 p-4 bg-white rounded-2xl shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-cyan-600">
                  Empezar tutorial
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className=" text-gray-500 hover:cursor-pointer hover:text-red-500 transition-colors"
                >
                  <IoMdClose size={22} />
                </button>
              </div>

              <ul className="space-y-2">
                {guide.map((q, i) => (
                  <li
                    onClick={() => {
                      q.afterOpenTutorial?.();
                      setStartGuide(true);
                      setCurrentStep(i);
                      setCurrentSubStep(null);
                    }}
                    key={i}
                    className="p-2 rounded-md hover:bg-cyan-50 hover:text-cyan-600 cursor-pointer text-sm transition-colors"
                  >
                    {q.question}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        createPortal(
          <>
            <div className="fixed inset-0 bg-black/60 z-[9998]" />

            {highlight && (
              <div
                className="fixed border-4 border-cyan-400 rounded-lg z-[9999] transition-all duration-300"
                style={{
                  top: highlight.top - 6,
                  left: highlight.left - 6,
                  width: highlight.width + 12,
                  height: highlight.height + 12,
                }}
              ></div>
            )}

            {highlight && stepToShow && (() => {
              const bocadilloWidth = 256;
              const bocadilloHeight = 500;
              let left = highlight.left;
              let top = highlight.bottom + 20;

              // Ajustar posición horizontal
              if (highlight.left + bocadilloWidth > window.innerWidth - 10) {
                left = highlight.right - bocadilloWidth;
              }
              if (left < 10) left = 10;

              // Verificar si el bocadillo está fuera de la vista y hacer scroll
              const bocadilloBottom = top + bocadilloHeight;
              if (bocadilloBottom > window.innerHeight) {
                window.scrollBy({
                  top: bocadilloBottom - window.innerHeight + 20,
                  behavior: 'smooth'
                });
              }

              let isLastStep = false;

              if (currentStep !== null) {
                const step = guide[currentStep];
                if (step) {
                  const hasSubSteps = (step.steps?.length ?? 0) > 0;
                  isLastStep = hasSubSteps
                    ? currentSubStep === (step.steps!.length - 1)
                    : currentStep === guide.length - 1;
                }
              }

              return (
                <div
                  className="fixed flex flex-col items-center z-[10000]"
                  style={{ top, left }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                      <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="mt-2 bg-white shadow-lg rounded-xl p-3 w-64 relative">
                      <p className="text-sm text-gray-700">{stepToShow.response}</p>
                      <div className="flex justify-between mt-2 space-x-2">
                        {!isLastStep && (
                          <button
                            onClick={nextStep}
                            className="px-3 py-1 text-sm hover:cursor-pointer bg-cyan-500 text-white rounded hover:bg-cyan-600"
                          >
                            Siguiente
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setStartGuide(false);
                            setOpen(false);
                            setCurrentStep(0);
                            setCurrentSubStep(null);
                          }}
                          className="px-3 py-1 text-sm hover:cursor-pointer bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Salir
                        </button>
                      </div>

                      <div
                        className={`absolute top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent
              ${highlight.left + bocadilloWidth > window.innerWidth - 10
                            ? "border-l-white border-r-0 -right-2"
                            : "border-r-white -left-2"
                          }`}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>,
          document.body
        )
      )}
    </>
  );
};

export default CustomTutorial;
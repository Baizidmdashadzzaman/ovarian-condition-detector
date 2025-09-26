import React, { useState, useEffect, useCallback } from 'react';
import { predictOvarianCondition } from "./api/huggingface";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);


// --- Static Data ---


// --- Custom Components ---

const Navigation = ({ navigate, toggleMobileMenu }) => {
    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About OvaQuick' },
        { id: 'conditions', label: 'Conditions Explained' },
    ];

    const handleNavigate = (id) => {
        navigate(id);
    };

    return (
        <nav className="d-none d-md-flex space-x-4 align-items-center">
            {navItems.map(item => (
                <button
                    key={item.id}
                    className="btn text-secondary hover-primary-custom transition-color"
                    onClick={() => handleNavigate(item.id)}
                >
                    {item.label}
                </button>
            ))}
            <button
                className="btn btn-primary-custom rounded-pill fw-bold shadow-lg transition-transform"
                onClick={() => handleNavigate('analysis')}
            >
                Start Analysis
            </button>
        </nav>
    );
};

const MobileMenu = ({ isOpen, navigate, toggleMobileMenu }) => {
    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About OvaQuick' },
        { id: 'conditions', label: 'Conditions Explained' },
        { id: 'analysis', label: 'Start Analysis', isPrimary: true },
    ];

    const handleNavigate = (id) => {
        navigate(id);
        toggleMobileMenu();
    };

    return (
        // Use Bootstrap collapse class for mobile menu
        <div className={`collapse d-md-none ${isOpen ? 'show' : ''}`} id="mobileMenuCollapse">
            <div className="p-2 border-top">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`btn w-100 text-start py-2 mb-1 ${
                            item.isPrimary
                                ? 'btn-primary-custom text-white shadow-sm'
                                : 'btn-light text-secondary'
                        }`}
                        onClick={() => handleNavigate(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const CustomModal = ({ modal, closeModal }) => {
    const { isOpen, title, body } = modal;

    return (
        <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content rounded-4 shadow-lg animate-modal">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fs-4 font-serif fw-bold text-primary-custom">{title}</h5>
                        <button type="button" className="btn-close" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body">
                        <p className="text-secondary">{body}</p>
                    </div>
                    <div className="modal-footer border-0 pt-0">
                        <button type="button" className="btn btn-primary-custom w-100 fw-bold" onClick={closeModal}>
                            OK, Got It
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Page Content Components ---

const HomePage = ({ navigate }) => (
    <section id="home" className="page-content">
        <div className="hero-bg text-white rounded-5 shadow-lg p-4 p-sm-5 mb-5 animate-fade-in">
            <div className="row g-4 align-items-center">


                <div className="col-md-7">
                    <h1 className="display-4 font-serif fw-bolder mb-3">
                        Clarity in <span className="text-accent-custom-alt">Ovarian Health</span>
                    </h1>
                    <p className="fs-5 opacity-90 mb-4">
                        OvaQuick uses advanced AI to instantly analyze ultrasound datasets and identify key follicular conditions: Dominant Follicle, Normal, and PCO.
                    </p>
                    <button
                        className="btn btn-light text-primary-custom fw-bold py-3 px-5 rounded-pill shadow-xl transition-transform"
                        onClick={() => navigate('analysis')}
                    >
                        Run Your Analysis Now &rarr;
                    </button>
                </div>
                {/* Image Placeholder (Stylized SVG for Tech) */}
                <div className="col-md-5 d-none d-md-flex justify-content-center align-items-center animate-float">
                      <div style={{ width: "100%", height: "600px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <model-viewer
        src="/simple_flower_loop.glb"
        alt="Simple Flower Model"
        autoplay
        animation-name="*"
        style={{ width: "600px", height: "600px" }}
      ></model-viewer>
    </div>
                    <svg className="w-100 text-white opacity-75" style={{maxWidth: '250px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9.75 19H12.75V17H9.75Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.25 4.75L11.25 10.25" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 7.75L14.25 7.75" />
                        <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        <path d="M12 9V15M9 12H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="text-accent-custom" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Features Section */}
        <div className="row g-4">
            <FeatureCard
                icon="M9 19V6l12-3v14M9 19c-1.657 0-3-1.343-3-3s1.343-3 3-3m0 6a3 3 0 100-6m-9-3h2m4 0h2"
                bgColor="bg-primary-custom"
                title="Instant AI Insight"
                description="Get immediate, data-driven feedback on ultrasound scans using our trained machine learning model."
            />
            <FeatureCard
                icon="M4 7v10M20 7v10M4 7h16M4 17h16M8 4h8M8 20h8M12 4v16"
                bgColor="bg-accent-custom"
                title="Three Key Conditions"
                description="Specialized detection for Dominant Follicle, Normal Ovarian function, and Polycystic Ovaries (PCO)."
            />
            <FeatureCard
                icon="M13 10V3L4 14h7v7l9-11h-7z"
                bgColor="bg-light-pink-custom"
                title="Informative & Educational"
                description="Access clear explanations and context for every analysis result to better understand the findings."
            />
        </div>
    </section>
);

const FeatureCard = ({ icon, bgColor, title, description }) => (
    <div className="col-md-4">
        <div className="card border-0 rounded-4 shadow-lg h-100 hover-shadow transition-transform animate-fade-in-up">
            <div className="card-body p-4">
                <div className={`icon-circle ${bgColor} mb-3`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} /></svg>
                </div>
                <h3 className="fs-4 font-serif fw-semibold text-dark mb-2">{title}</h3>
                <p className="text-secondary">{description}</p>
            </div>
        </div>
    </div>
);

const AboutPage = ({ navigate }) => (
    <section id="about" className="page-content">
        <h2 className="display-5 font-serif fw-bold text-dark mb-4 text-center animate-fade-in-up">The Science Behind OvaQuick</h2>
        <p className="fs-5 text-secondary mb-5 pb-3 text-center mx-auto" style={{maxWidth: '700px'}}>
            OvaQuick is built on a robust machine learning framework, trained on diverse ultrasound datasets to deliver accurate and rapid classification of ovarian follicular development.
        </p>

        <div className="row g-4">
            <StepCard step="1" bgColor="bg-light-pink-custom" title="Data Ingestion" description="Ultrasound images/datasets are securely uploaded and processed for feature extraction." />
            <StepCard step="2" bgColor="bg-primary-custom" title="AI Classification" description="Our deep learning model analyzes follicular size, count, and distribution patterns." />
            <StepCard step="3" bgColor="bg-accent-custom" title="Rapid Diagnosis" description="The result is classified into one of the three key ovarian conditions with a confidence score." />
        </div>

        <div className="mt-5 pt-3 text-center">
            <button className="btn btn-link text-primary-custom fs-5 fw-bold transition-color" onClick={() => navigate('conditions')}>
                Learn more about the conditions we detect &rarr;
            </button>
        </div>
    </section>
);

const StepCard = ({ step, bgColor, title, description }) => (
    <div className="col-md-4">
        <div className="text-center p-4 card border-0 rounded-4 shadow-sm h-100 animate-fade-in-up">
            <div className={`icon-circle ${bgColor} mx-auto mb-3 fs-5 fw-bold`}>{step}</div>
            <h3 className="fs-5 font-serif fw-semibold text-dark mb-2">{title}</h3>
            <p className="text-secondary">{description}</p>
        </div>
    </div>
);

const ConditionsPage = () => (
    <section id="conditions" className="page-content">
        <h2 className="display-5 font-serif fw-bold text-dark mb-4 text-center animate-fade-in-up">Key Ovarian Conditions</h2>
        <p className="fs-5 text-secondary mb-5 pb-3 text-center mx-auto" style={{maxWidth: '800px'}}>
            OvaQuick provides detailed analysis for the following three classifications critical to reproductive health monitoring.
        </p>

        <div className="d-grid gap-4">
            <ConditionCard
                emoji="🥚"
                colorClass="border-accent-custom"
                title="Dominant Follicle (DF)"
                definition="Indicates the presence of a single follicle that has grown significantly larger than the others, typically measuring over 10mm in diameter, and is expected to rupture during ovulation."
                significance={[
                    'A key sign of a healthy, ovulatory cycle.',
                    'Crucial marker for monitoring fertility treatments.',
                    'The size and growth rate are essential metrics for prediction.',
                ]}
            />
            <ConditionCard
                emoji="✅"
                colorClass="border-primary-custom"
                title="Normal Ovarian Function"
                definition="Characterized by a typical number of small to medium-sized follicles (antral follicle count, or AFC) that are healthy, but without the presence of a clear, significantly enlarged dominant follicle at the current scan stage."
                significance={[
                    'Represents typical ovarian morphology and function.',
                    'Follicle counts and sizes fall within expected physiological ranges.',
                    'A healthy baseline for assessing overall reproductive potential.',
                ]}
            />
            <ConditionCard
                emoji="🧫"
                colorClass="border-danger-custom"
                title="Polycystic Ovaries (PCO)"
                definition="The appearance of the ovary is enlarged and contains 12 or more follicles, measuring 2-9mm in diameter, typically arranged peripherally ('string of pearls' sign)."
                significance={[
                    'One of the diagnostic criteria for Polycystic Ovary Syndrome (PCOS).',
                    'Often associated with anovulation and hormonal imbalances.',
                    'Requires careful monitoring and clinical correlation.',
                ]}
            />
        </div>
    </section>
);

const ConditionCard = ({ emoji, colorClass, title, definition, significance }) => {
    // Determine the text color for the title based on the border color
    const textColor = colorClass.replace('border-', 'text-');
    // Determine the background color for the icon based on the border color
    const bgColor = colorClass.replace('border-', 'bg-');

    return (
        <div className={`card border-0 rounded-4 shadow-lg border-start border-5 ${colorClass} transition-transform-shadow hover-shadow animate-fade-in-up`}>
            <div className="card-body p-4 d-flex align-items-start">
                <span className={`icon-circle flex-shrink-0 me-3 fs-3 ${bgColor}`}>{emoji}</span>
                <div>
                    <h3 className={`fs-3 font-serif fw-bold ${textColor} mb-2`}>{title}</h3>
                    <p className="text-dark mb-3">
                        **Definition:** {definition}
                    </p>
                    <h4 className="fs-5 fw-semibold text-dark">Significance:</h4>
                    <ul className="list-unstyled text-secondary ps-3">
                        {significance.map((item, index) => (
                            <li key={index}>&bull; {item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// const AnalysisPage = ({ openModal }) => {

//     const [selectedFile, setSelectedFile] = useState(null);
//       const [predictions, setPredictions] = useState(null);
//       const [heatmap, setHeatmap] = useState(null);
//       const [loading, setLoading] = useState(false);
    
//       const handleFileChange = (e) => {
//         setSelectedFile(e.target.files[0]);
//       };
    
//     const handleSubmit = async () => {
//       if (!selectedFile) return;
//       setLoading(true);
    
//       try {
//         const result = await predictOvarianCondition(selectedFile);
    
//         console.log("API Result:", result); // 👀 Debugging
    
//         let preds = {};
    
//         // Case 1: result.predictions is a simple dict
//         if (result.predictions && typeof result.predictions === "object" && !result.predictions.label) {
//           preds = result.predictions;
//         }
//         // Case 2: Gradio Label output format
//         else if (result.predictions && result.predictions.confidences) {
//           result.predictions.confidences.forEach((c) => {
//             preds[c.label] = c.confidence;
//           });
//         }
    
//         setPredictions(preds);
//         setHeatmap(result.heatmap);
//       } catch (err) {
//         console.error(err);
//         alert("Error while predicting");
//       }
    
//       setLoading(false);
//     };



//     return (
//         <section id="analysis" className="page-content">
//             <h2 className="display-5 font-serif fw-bold text-dark mb-4 text-center animate-fade-in-up">OvaQuick AI Analysis</h2>
//             <p className="fs-5 text-secondary mb-5 pb-3 text-center mx-auto" style={{maxWidth: '700px'}}>
//                 Simulate an analysis by uploading a mock dataset or requesting a random result.
//             </p>

//             <div className="card border-0 rounded-4 shadow-lg mx-auto p-4 p-md-5" style={{maxWidth: '800px'}}>

//                 <div className="text-center mb-4">



//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h2>🩺 Ovarian Ultrasound Classifier</h2>

//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleSubmit} disabled={loading}>
//         {loading ? "Processing..." : "Upload & Predict"}
//       </button>

//       {predictions && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Predictions</h3>
//           <ul>
//             {Object.entries(predictions).map(([cls, prob]) => (
//               <li key={cls}>
//                 {cls}: {(prob * 100).toFixed(2)}%
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {heatmap && (
//   <div style={{ marginTop: "20px" }}>
//     <h3>Grad-CAM Heatmap</h3>
//     <img
//       src={heatmap}
//       alt="Grad-CAM Heatmap"
//       style={{ maxWidth: "100%", border: "1px solid #ccc" }}
//     />
//   </div>
// )}

//     </div>



//                 </div>


//             </div>
//         </section>
//     );
// };


// --- Main App Component ---


const AnalysisPage = ({ openModal }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);

    try {
      const result = await predictOvarianCondition(selectedFile);

      let preds = {};
      if (
        result.predictions &&
        typeof result.predictions === "object" &&
        !result.predictions.label
      ) {
        preds = result.predictions;
      } else if (result.predictions && result.predictions.confidences) {
        result.predictions.confidences.forEach((c) => {
          preds[c.label] = c.confidence;
        });
      }

      setPredictions(preds);
      setHeatmap(result.heatmap);
    } catch (err) {
      console.error(err);
      alert("Error while predicting");
    }

    setLoading(false);
  };

  return (
    <section id="analysis" className="page-content">
      <h2 className="display-5 font-serif fw-bold text-dark mb-4 text-center animate-fade-in-up">
        OvaQuick AI Analysis
      </h2>
      <p
        className="fs-5 text-secondary mb-5 pb-3 text-center mx-auto"
        style={{ maxWidth: "700px" }}
      >
        Upload an ultrasound image to simulate AI analysis. The system will
        generate predictions and a Grad-CAM heatmap.
      </p>

      <div className="card border-0 rounded-4 shadow-lg mx-auto p-4 p-md-5">
        {/* First row: Uploaded + Heatmap */}
        <div className="row">
          <div className="col-md-6 text-center">
            <h5>Uploaded Image</h5>
            {preview && (
              <img
                src={preview}
                alt="Uploaded Preview"
                className="img-fluid rounded shadow-sm mb-3"
                style={{ maxHeight: "300px", objectFit: "contain" }}
              />
            )}
            <input
              type="file"
              className="form-control mb-3"
              onChange={handleFileChange}
            />
            <button
              onClick={handleSubmit}
              className="btn btn-primary-custom rounded-pill fw-bold shadow-lg px-4"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Processing..." : "Upload & Predict"}
            </button>
          </div>

          <div className="col-md-6 text-center">
            <h5>Grad-CAM Heatmap</h5>
            {heatmap && (
              <img
                src={heatmap}
                alt="Grad-CAM Heatmap"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "300px", objectFit: "contain" }}
              />
            )}
          </div>
        </div>

        {/* Second row: Chart full width */}
        {predictions && (
          <div className="row mt-5">
            <div className="col-12">
              <h4 className="text-center mb-4">Prediction Accuracy (%)</h4>
              <Bar
                data={{
                  labels: Object.keys(predictions),
                  datasets: [
                    {
                      label: "Accuracy (%)",
                      data: Object.values(predictions).map((p) => p * 100),
                      backgroundColor: "#ec4899",
                      borderColor: "#ec4899",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    datalabels: {
                      color: "#000",
                      anchor: "end",
                      align: "top",
                      formatter: (val) => val.toFixed(1) + "%",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: (val) => val + "%",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


const App = () => {

    const [currentPage, setCurrentPage] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', body: '' });

    // Define modal handling functions FIRST
    const openModal = useCallback((title, body) => {
        setModal({ isOpen: true, title, body });
    }, []);

    const closeModal = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false }));
    }, []); // Use functional update if using prev state, or add modal to dependency array if needed

    const navigate = useCallback((pageId) => {
        setCurrentPage(pageId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    // Now define the pages object, which uses openModal
    const pages = {
        home: <HomePage navigate={setCurrentPage}  />,
        about: <AboutPage navigate={setCurrentPage} />,
        conditions: <ConditionsPage />,
        analysis: <AnalysisPage openModal={openModal}  />, // openModal is now defined
    };

    // --- Floating Petal Animation Logic (using useEffect for DOM manipulation) ---
    useEffect(() => {
        const createPetal = () => {
            const petal = document.createElement('div');
            petal.className = 'floating-petal';

            const size = Math.random() * 8 + 4; // 4px to 12px
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            petal.style.left = `${Math.random() * 100}vw`;

            // Apply animation properties
            petal.style.animationName = 'float-up-fade-out';
            petal.style.animationTimingFunction = 'linear';
            petal.style.animationIterationCount = 'infinite';
            petal.style.animationDuration = `${Math.random() * 8 + 7}s`; // 7s to 15s
            petal.style.animationDelay = `-${Math.random() * 10}s`; // Negative delay starts animation immediately at a random point

            document.body.appendChild(petal);

            // Clean up the petal element after a set time
            setTimeout(() => {
                if (petal.parentNode) {
                    petal.remove();
                }
            }, 15000); // Remove after 15 seconds
        };

        // Generate initial batch and set interval for continuous creation
        for (let i = 0; i < 20; i++) {
            createPetal();
        }

        const intervalId = setInterval(createPetal, 1000);

        // Cleanup function for useEffect to clear the interval
        return () => clearInterval(intervalId);
    }, []); // Run only on mount

    return (
        <>
            {/* Inject Google Font Link, Bootstrap CSS, and Custom Styles */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
                `}
            </style>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
            
            {/* This script is necessary for Bootstrap's components (like collapse/modal) to function */}
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eT6M7k5K38nQ4kX5a" crossorigin="anonymous"></script>

            <style>
                {`
                    :root {
                        --primary-custom: #ec4899; /* Soft Rose Pink */
                        --primary-light-custom: #f9a8d4; /* Light Pink */
                        --accent-custom: #e11d48; /* Deep Pink/Fuchsia */
                        --accent-custom-alt: #fff0f5; /* Lightest contrast for dark backgrounds */
                        --danger-custom: #dc3545; /* Standard red for clinical warning */
                        --background-color: #fdf2f8; /* Very Light Rose Background */
                        --font-serif: 'Playfair Display', serif;
                        --font-sans: 'Inter', sans-serif;
                    }

                    body {
                        font-family: var(--font-sans);
                        background-color: var(--background-color);
                        min-height: 100vh;
                    }

                    .font-serif {
                        font-family: var(--font-serif);
                    }

                    /* Custom Colors based on the feminine theme */
                    .text-primary-custom { color: var(--primary-custom) !important; }
                    .bg-primary-custom { background-color: var(--primary-custom) !important; }
                    .border-primary-custom { border-color: var(--primary-custom) !important; }

                    .text-accent-custom { color: var(--accent-custom) !important; }
                    .text-accent-custom-alt { color: var(--accent-custom-alt) !important; }
                    .bg-accent-custom { background-color: var(--accent-custom) !important; }
                    .border-accent-custom { border-color: var(--accent-custom) !important; }

                    .bg-light-pink-custom { background-color: var(--primary-light-custom) !important; }
                    .border-light-pink-custom { border-color: var(--primary-light-custom) !important; }
                    
                    .bg-danger-custom { background-color: var(--danger-custom) !important; }
                    .border-danger-custom { border-color: var(--danger-custom) !important; }
                    
                    /* Custom Button Styles for the aesthetic */
                    .btn-primary-custom {
                        background-color: var(--primary-custom);
                        border-color: var(--primary-custom);
                        color: white;
                    }
                    .btn-primary-custom:hover {
                        background-color: #f9a8d4; /* light pink on hover */
                        border-color: #f9a8d4;
                        color: #555;
                    }

                    .btn-accent-custom {
                        background-color: var(--accent-custom);
                        border-color: var(--accent-custom);
                        color: white;
                    }
                    .btn-accent-custom:hover {
                        background-color: #c5163b;
                        border-color: #c5163b;
                    }
                    .hover-primary-custom:hover {
                         color: var(--primary-custom) !important;
                    }


                    /* Layout & Component Styles */
                    .hero-bg {
                        background: linear-gradient(135deg, var(--primary-light-custom) 0%, var(--primary-custom) 100%);
                    }

                    .icon-circle {
                        width: 48px;
                        height: 48px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        color: white;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    }
                    
                    .analysis-output::-webkit-scrollbar {
                        width: 8px;
                    }
                    .analysis-output::-webkit-scrollbar-thumb {
                        background-color: var(--primary-light-custom);
                        border-radius: 10px;
                    }

                    /* Transitions and Animations */
                    .transition-transform { transition: transform 0.3s ease; }
                    .transition-color { transition: color 0.3s ease; }
                    .hover-shadow:hover { box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important; transform: translateY(-2px); }

                    @keyframes fade-in-up {
                        0% { opacity: 0; transform: translateY(10px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fade-in {
                         0% { opacity: 0; }
                         100% { opacity: 1; }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes float-up-fade-out {
                        0% { transform: translateY(100vh) translateX(0); opacity: 0; }
                        50% { opacity: 0.7; }
                        100% { transform: translateY(-10vh) translateX(20px); opacity: 0; }
                    }

                    .animate-fade-in-up {
                        animation: fade-in-up 0.5s ease-out forwards;
                    }
                    .animate-fade-in {
                         animation: fade-in 0.8s ease-out forwards;
                    }
                    .animate-float {
                        animation: float 4s ease-in-out infinite;
                    }
                    
                    /* Floating Petals */
                    .floating-petal {
                        position: fixed;
                        background-color: rgba(249, 168, 212, 0.5); /* primary-light */
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 1000;
                    }
                `}
            </style>

            <div className="font-sans">
                {/* Navigation Bar */}
                <header className="bg-white shadow-sm sticky-top z-3">
                    <div className="container-fluid container-lg px-4">
                        <div className="d-flex justify-content-between align-items-center" style={{height: '64px'}}>
                            {/* Logo/Brand */}
                            <button className="btn p-0 border-0" onClick={() => navigate('home')}>
                                <span className="fs-3 font-serif fw-bolder text-primary-custom">Ova<span className="text-accent-custom">Quick</span></span>
                            </button>

                            {/* Desktop Navigation */}
                            <Navigation
                                navigate={navigate}
                                toggleMobileMenu={toggleMobileMenu}
                            />

                            {/* Mobile Menu Button (using Bootstrap's toggle attribute) */}
                            <div className="d-md-none">
                                <button
                                    className="btn btn-link text-secondary"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#mobileMenuCollapse"
                                    aria-expanded={isMobileMenuOpen}
                                    aria-controls="mobileMenuCollapse"
                                    onClick={toggleMobileMenu}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Menu */}
                    <MobileMenu
                        isOpen={isMobileMenuOpen}
                        navigate={navigate}
                        toggleMobileMenu={toggleMobileMenu}
                    />
                </header>

                {/* Main Content Container */}
                <main className="container-fluid container-lg py-5 px-4">
                    {/* Conditional Rendering based on currentPage state */}
                    {pages[currentPage]}
                </main>

                {/* Footer */}
                <footer className="text-white mt-5" style={{backgroundColor:'rgb(236 72 153)'}}>
                    <div className="container-fluid container-lg py-4 px-4 text-center">
                        <p className="mb-0 small">&copy; 2025 OvaQuick. Advanced Ovarian Health Insights. Disclaimer: This system is for informational and research purposes only and does not constitute medical advice.</p>
                    </div>
                </footer>

                {/* Custom Modal for Alerts */}
                <CustomModal modal={modal} closeModal={closeModal} />
            </div>
        </>
    );
};

export default App;

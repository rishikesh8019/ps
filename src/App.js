import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [smiles, setSmiles] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [darkMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        try {
            const response = await axios.post('https://drug-design-backend-qpt3.onrender.com/predict/vit', { SMILES: smiles });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="dark-toggle"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
            >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className="main-wrapper d-flex flex-column justify-content-center align-items-center">
                <div className="glass-card">
                    <h1 className="title">Drug Design ViT Predictor</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="smilesInput" className="label-text">Enter SMILES Notation</label>
                        <input
                            type="text"
                            id="smilesInput"
                            className="input-field"
                            value={smiles}
                            onChange={(e) => setSmiles(e.target.value)}
                            placeholder="e.g., CCO"
                            required
                        />
                        <button type="submit" className="btn-custom" disabled={loading}>
                            {loading ? <div className="spinner" /> : 'Predict'}
                        </button>
                    </form>

                    {error && <div className="alert">{error}</div>}

                    {result && (
                        <div className="result-box" key={result.smiles}>
                            <h5>Prediction Result</h5>
                            <p><strong>SMILES:</strong> {result.smiles}</p>
                            <p><strong>Activity:</strong> {result.activity}</p>
                            {result.image && (
                                <img
                                    src={`data:image/png;base64,${result.image}`}
                                    alt="Molecular Structure"
                                    className="result-image"
                                    loading="lazy"
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default App;

import React, { createContext, useState, useRef, useEffect } from 'react';

const BglogContext = createContext();

export const BglogProvider = ({ children }) => {
    const [bglogLoaded, setBglogLoaded] = useState(false);
    const [bglogInitialized, setBglogInitialized] = useState(false);
    const containerRef = useRef(null); // Manage the bglogContainer

    // Function to load the bglog script
    const loadBglogScript = () => {
        return new Promise((resolve, reject) => {
            if (bglogLoaded) {
                resolve(); // Script is already loaded
            } else {
                const script = document.createElement('script');
                script.src = 'https://bglog.org/bglog-repo2/js/bglog/bglogCore-2407A.min.js';
                script.onload = () => {
                    setBglogLoaded(true);
                    resolve();
                };
                script.onerror = () => reject(new Error('Failed to load bglog script'));
                document.body.appendChild(script);
            }
        });
    };

    // Function to initialize bglog (after script is loaded)
    const initializeBglog = async (theme) => {
        if (!bglogInitialized && window.bglog) {
            window.bglog.loadTheme(theme || {});
            window.bglog.toggleEdit();
            setBglogInitialized(true);
        }
    };

    // Ensure that the container exists before anything else happens
    useEffect(() => {
        if (!containerRef.current) {
            // Create the bglogContainer div if it doesn't already exist
            const container = document.createElement('div');
            container.id = 'bglogContainer';
            container.innerHTML = 'Creating diagram, please wait...';
            container.style.display = 'none'; // Initially hidden
            document.body.appendChild(container);
            containerRef.current = container;
        }
    }, []);

    return (
        <BglogContext.Provider value={{ bglogLoaded, loadBglogScript, initializeBglog, containerRef, bglogInitialized }}>
            {children}
        </BglogContext.Provider>
    );
};

export default BglogContext;

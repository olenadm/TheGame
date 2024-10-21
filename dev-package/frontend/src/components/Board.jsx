import React, {useEffect, useRef, useContext, useState} from 'react';
import BglogContext from '../contexts/BgLogContext';

import './Board.css'
const Board = ({ xgid, theme }) => {
    const { bglogLoaded, loadBglogScript, initializeBglog, containerRef, bglogInitialized } = useContext(BglogContext);
    const [feedbackXGID, setFeedbackXGID] = useState(null)
    const boardRef = useRef(null);
    theme.showCube = false //for now force the removal of the cube regardless of theme.
    console.log("theme - theme ", theme)

    // Initial board setup and container management
    useEffect(() => {
        const initializeBoard = async () => {
            try {
                if (!bglogLoaded) {
                    await loadBglogScript();
                }

                if (!window.bglog) {
                    console.error('bglog script not loaded');
                    return;
                }

                // The container is now provided by the context, ensure it's in the DOM and visible
                if (containerRef.current && boardRef.current) {
                    boardRef.current.appendChild(containerRef.current);
                    containerRef.current.style.display = 'block'; // Show the container
                }
                // Initialize bglog only if it hasn't been done yet
                if (!bglogInitialized) {
                    initializeBglog(theme); // Initialize bglog
                }
            } catch (error) {
                console.error('Error initializing bglog:', error);
            }
        };

        initializeBoard();

        return () => {
            // Hide the container when navigating away
            if (containerRef.current) {
                containerRef.current.style.display = 'none';
            }
        };
    }, [theme, bglogLoaded, loadBglogScript, initializeBglog, containerRef, bglogInitialized]);

    // Update the board when XGID changes
    useEffect(() => {
        if (bglogLoaded && window.bglog && containerRef.current) {
            const loadXgidSafely = () => {
                if (window.bglog.loadXgId) {
                    window.bglog.loadXgId(xgid);  // Update the board with the new XGID
                } else {
                    console.error('bglog.loadXgId not available');
                }
            };
            const loadThemeSafely = () => {
                if (window.bglog.loadTheme) {
                    window.bglog.loadTheme(theme || {});  // Update the board with the new theme
                } else {
                    console.error('bglog.loadTheme not available');
                }
            }

            // If the board is already initialized, update XGID
            if (containerRef.current.children.length > 0) {
                loadThemeSafely()
                loadXgidSafely();
                setFeedbackXGID(window.xgPos)
            } else {
                // Use MutationObserver to wait until bglogContainer is ready
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            loadXgidSafely();
                            observer.disconnect();
                        }
                    });
                });

                observer.observe(containerRef.current, {
                    childList: true,
                    subtree: true,
                });
            }
        }
    }, [xgid, bglogLoaded, containerRef]);

    return (<>
        <div className="board-wrapper" ref={boardRef}></div>
        <div id="idInput"><input type="search" id="main-xgid" name="main-xgid" title="XGID" value={feedbackXGID}/></div>
    </>);
};

export default Board;

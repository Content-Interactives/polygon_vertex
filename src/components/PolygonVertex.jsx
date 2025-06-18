import React, { useState, useCallback, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';

const PolygonVertex = () => {
  const [selectedShape, setSelectedShape] = useState('triangle');
  const [selectedVertices, setSelectedVertices] = useState(new Set());
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasError, setHasError] = useState(false);
  const svgRef = useRef(null);

  const shapeInfo = {
    'triangle': { name: 'Triangle', plural: 'Triangles', vertices: 3 },
    'square': { name: 'Square', plural: 'Squares', vertices: 4 },
    'pentagon': { name: 'Pentagon', plural: 'Pentagons', vertices: 5 },
    'hexagon': { name: 'Hexagon', plural: 'Hexagons', vertices: 6 }
  };

  const shapes = {
    triangle: {
      points: [
        [200, 100],  // top
        [150, 186.6],  // bottom left (using 30-60-90 triangle ratios)
        [250, 186.6]   // bottom right
      ]
    },
    square: {
      points: [
        [150, 100],
        [250, 100],
        [250, 200],
        [150, 200]
      ]
    },
    pentagon: {
      points: [
        [200, 75],     // top (0°)
        [273, 130],    // top right (72°)
        [245, 205],    // bottom right (144°)
        [155, 205],    // bottom left (216°)
        [127, 130]     // top left (288°)
      ]
    },
    hexagon: {
      points: [
        [200, 80],     // top
        [260, 115],     // top right
        [260, 185],     // bottom right
        [200, 220],     // bottom
        [140, 185],     // bottom left
        [140, 115]      // top left
      ]
    }
  };

  const handleAnswerSubmit = () => {
    const correctAnswer = shapeInfo[selectedShape].vertices;
    if (parseInt(userAnswer) === correctAnswer) {
      setIsCorrect(true);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const resetAnswer = () => {
    setUserAnswer('');
    setIsCorrect(false);
    setHasError(false);
  };

  const handleVertexClick = useCallback((index, event) => {
    event.stopPropagation();
    setSelectedVertices(prev => {
      const newSet = new Set(prev);
      newSet.add(`${selectedShape}-${index}`);
      return newSet;
    });
  }, [selectedShape]);

  const handleShapeChange = (shape) => {
    setSelectedShape(shape);
    setSelectedVertices(new Set());
    resetAnswer();
  };

  const renderPolygon = () => {
    const shape = shapes[selectedShape];
    const points = shape.points.map(point => point.join(',')).join(' ');

    return (
      <div className="border border-gray-200 rounded-lg flex-1 min-w-[300px] min-h-[250px] w-full">
        <svg 
          ref={svgRef}
          width="400" 
          height="300" 
          viewBox="0 0 400 300"
          className="w-full h-full select-none"
          style={{ touchAction: 'none' }}
        >
          <polygon
            points={points}
            fill="#e0f2fe"
            stroke="#0ea5e9"
            strokeWidth="2"
          />
          {shape.points.map((point, index) => (
            <circle
              key={index}
              cx={point[0]}
              cy={point[1]}
              r={selectedVertices.has(`${selectedShape}-${index}`) ? "6" : "4"}
              fill={selectedVertices.has(`${selectedShape}-${index}`) ? "#22c55e" : "#0ea5e9"}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer hover:fill-green-400"
              onClick={(e) => handleVertexClick(index, e)}
            />
          ))}
          <text
            x="200"
            y="280"
            textAnchor="middle"
            className="text-sm fill-gray-600"
            style={{ fontSize: '12px' }}
          >
            Click on the vertices to highlight them
          </text>
        </svg>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: white;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto mt-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden select-none">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Practicing Polygon Vertices</h2>
            <button
              onClick={() => {
                setSelectedShape('triangle');
                setSelectedVertices(new Set());
                setUserAnswer('');
                setIsCorrect(false);
                setHasError(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <div className="flex">
                <div className="flex flex-col space-y-2 mr-4">
                  {Object.entries(shapeInfo).map(([shape, info]) => (
                    <button
                      key={shape}
                      onClick={() => handleShapeChange(shape)}
                      className={`px-4 py-3 rounded-lg transition-colors text-sm ${
                        selectedShape === shape
                          ? 'bg-[#008545] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {info.name}
                    </button>
                  ))}
                </div>
                <div className="flex-1">
                  {renderPolygon()}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3">
              {!isCorrect ? (
                <>
                  <p className="text-gray-700">How many vertices do {shapeInfo[selectedShape].plural} have?</p>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Enter answer"
                      className={`w-40 px-3 py-2 border rounded-lg ${
                        hasError ? 'border-yellow-500 focus:ring-yellow-500' : 'border-gray-200 focus:ring-[#008545]'
                      } focus:outline-none focus:ring-2`}
                    />
                    <div className="glow-button simple-glow">
                      <Button
                        onClick={handleAnswerSubmit}
                        className="bg-[#00783E] hover:bg-[#006633] text-white text-sm px-4 py-2 rounded"
                      >
                        Check
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-green-600 font-medium">
                  {shapeInfo[selectedShape].plural} have {shapeInfo[selectedShape].vertices} vertices!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PolygonVertex;
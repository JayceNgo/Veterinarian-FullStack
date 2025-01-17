import jsQR from 'jsqr';
import { useEffect, useRef } from 'react';

export function QRScanner(){
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const loadingMessageRef = useRef(null);
  const outputMessageRef = useRef(null);
  const outputDataRef = useRef(null);
  const outputContainerRef = useRef(null);

  
    useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current.getContext('2d');
    const loadingMessage = loadingMessageRef.current;
    const outputContainer = outputContainerRef.current;
    const outputMessage = outputMessageRef.current;
    const outputData = outputDataRef.current;

      function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
      }
  
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(stream) {
          video.srcObject = stream;
          video.setAttribute('playsinline', true);
          video.play();
          requestAnimationFrame(tick);
        });
  
      function tick() {
        loadingMessage.innerText = '⌛ Scanner is activated';
  
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          loadingMessage.hidden = true;
          canvasRef.current.hidden = false;
          outputContainer.hidden = false;
          
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;

          canvas.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
          const imageData = canvas.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
  
          if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF0000');
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF0000');
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF0000');
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF0000');
  
            outputMessage.hidden = true;
            outputData.parentElement.hidden = false;
            outputData.innerHTML = code.data;
          } else {
            outputMessage.hidden = false;
            outputData.parentElement.hidden = true;
          }
        }
  
        requestAnimationFrame(tick);
      }
    }, []);
  
    return (
      <main>
        <div id="test">
          <h1>QR Code Scanner</h1>
          <div id="output">
            <div id="outputMessage">
              Please expose the QR code to the camera
            </div>
            <div id="outputLayer" hidden>
              <span ref={outputDataRef}></span>
            </div>
          </div>
        </div>
        <div>&nbsp;</div>
        <div>
          <h1>Scan</h1>
          <div id="frame">
          <div ref={loadingMessageRef}>
              🎥 Cannot access to video stream<br />
              Please check your camera is active
            </div>
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
      </main>
    );
  }
  
  export default QRScanner;
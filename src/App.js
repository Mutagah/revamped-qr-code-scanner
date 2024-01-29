import "./App.css";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Html5QrcodeScanner } from "html5-qrcode";
function App() {
  let qrCodeScanner;
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scanData, setScanData] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    if (!qrCodeScanner) {
      qrCodeScanner = new Html5QrcodeScanner("scanner-box", {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10,
      });

      async function successScan(result) {
        qrCodeScanner.clear();
        setScanData(result);
      }

      function failedScan(error) {
        console.log(error);
      }
      qrCodeScanner.render(successScan, failedScan);
    }
  }, []);

  useEffect(() => {
    async function handleScanDataSubmission() {
      try {
        const dataSent = await fetch("http://localhost:3000/scanned_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scanData: scanData }),
        });
        const response = await dataSent.json();
        return response;
      } catch (e) {
        return e;
      }
    }
    // Fetch the data from backend and display in the scanner-box i.e every scanned data 

    // fetch("http://localhost:3000/scanned_data")
    //   .then((res) => res.json())
    //   .then((data) => setFetchedData(data));
  }, scanData);

  async function generateQrCode(e) {
    e.preventDefault();
    try {
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    } catch (error) {
      console.warn(error);
    }
  }
  return (
    <div className="main-scan-container">
      <h1 className="scanner-title"> Generate & Scan the Qr code</h1>
      <div className="scanner-subcontainer">
        <div className="scan-generator">
          <h5>The Generator</h5>
          <form className="generator-form" onSubmit={(e) => generateQrCode(e)}>
            <label>Enter your text here</label>
            <br></br>
            <input
              type="text"
              onChange={(event) => setText(event.target.value)}
            />
            <br></br>
            <button type="submit" className="button">
              Generate Qr Code
            </button>
          </form>
          <br></br>
          <br></br>
          {imageUrl ? (
            <div className="qr-code-container">
              <a href={imageUrl} download>
                <img src={imageUrl} alt="img" />
              </a>
            </div>
          ) : (
            <div>Please type text to generate qr code</div>
          )}
        </div>

        <div className="cam-scanner">
          <h5>Qr Code Scan by Web Cam</h5>
          <div className="scan-section">
            {scanData === "hello" ? (
              <div className="after-scan">
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>Scanned Data:</th>
                    <td style={{ fontStyle: "italic" }}>
                      {fetchedData.scanData}
                    </td>
                  </tr>
                </table>
              </div>
            ) : (
              <div id="scanner-box"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
